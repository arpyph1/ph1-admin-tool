import { notFound } from 'next/navigation';

async function getBlogPost(slug: string) {
  try {
    const token = process.env.CONTENTFUL_DELIVERY_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN;
    const res = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries?content_type=trends&fields.urlKey=${slug}&include=2&access_token=${token}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    
    if (!data.items || data.items.length === 0) return null;
    
    const item = data.items[0];
    const assetMap: any = {};
    if (data.includes?.Asset) {
      data.includes.Asset.forEach((asset: any) => {
        assetMap[asset.sys.id] = asset.fields?.file?.url;
      });
    }
    
    const heroImageId = item.fields?.heroImage?.sys?.id;
    return {
      ...item,
      resolvedHeroImage: heroImageId ? assetMap[heroImageId] : null
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export default async function BlogPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  
  if (!post) notFound();
  
  const title = post.fields?.title || 'Blog Post';
  const imageUrl = post.resolvedHeroImage ? `https:${post.resolvedHeroImage}` : null;
  
  return (
    <main className="bg-white min-h-screen">
      <section className="notification-bar">
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center gap-4">
          <span className="text-sm">Design of AI podcast: The podcast for product teams</span>
          <a href="https://open.spotify.com/show/3O11vQKPpKI5ZlJhdRGwnf" className="bg-[#ffc72d] text-black px-3 py-1.5 font-bold text-xs hover:bg-[#fab700]">List of episodes</a>
        </div>
      </section>

      <header className="header">
        <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
          <a href="/" className="flex items-center">
            <img src="/images/logo.svg" alt="PH1.ca" className="h-10" />
          </a>
          <nav className="flex gap-8 items-center">
            <a href="#" className="font-normal text-sm text-black hover:text-[#51c2e7] transition-colors">Services</a>
            <a href="#work" className="font-normal text-sm text-black hover:text-[#51c2e7] transition-colors">Our Work</a>
            <a href="#" className="font-normal text-sm text-black hover:text-[#51c2e7] transition-colors">Training</a>
            <a href="#" className="font-normal text-sm text-black hover:text-[#51c2e7] transition-colors">About</a>
            <a href="#contact" className="bg-[#ffc72d] px-5 py-2 font-bold text-sm text-black hover:bg-[#fab700] transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-20">
        {imageUrl && (
          <div className="mb-12">
            <img src={imageUrl} alt={title} className="w-full h-96 object-cover rounded-lg" />
          </div>
        )}
        <h1 className="text-5xl font-bold mb-8">{title}</h1>
        <p className="text-xl text-gray-600">This is a blog post page. Full content coming soon.</p>
      </div>
    </main>
  );
}
