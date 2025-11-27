import { notFound } from 'next/navigation';
import { Metadata } from 'next';

const BASE_URL = 'https://ph1.ca';
const DEFAULT_OG_IMAGE = '/images/og-default.jpg';

async function getBlogPost(slug: string) {
  try {
    const token = process.env.CONTENTFUL_DELIVERY_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN;
    const res = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries?content_type=trends&fields.key=${slug}&include=2&access_token=${token}`,
      { cache: 'no-store' }
    );
    const data = await res.json();

    if (!data.items || data.items.length === 0) return null;

    const item = data.items[0];
    const assetMap: Record<string, string> = {};
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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found | PH1 Research',
      robots: { index: false, follow: false },
    };
  }

  const getField = (fieldName: string) => {
    const field = post.fields?.[fieldName];
    return field ? (field['en-US'] || field) : null;
  };

  const title = getField('title') || 'Blog Post';
  const seoTitle = getField('seoTitle') || title;
  const seoDescription = getField('seoDescription') || getField('excerpt') || getField('heroSubheadline') || `Read ${title} on PH1 Research`;
  const seoCanonicalOverride = getField('seoCanonicalOverride');
  const seoNoindex = getField('seoNoindex') === true;
  const seoOgImageId = getField('seoOgImage')?.sys?.id;

  // Resolve OG image: seoOgImage > heroImage > default
  let ogImageUrl = DEFAULT_OG_IMAGE;
  if (seoOgImageId && post.resolvedHeroImage) {
    // Check if we have the SEO OG image in assets
    const token = process.env.CONTENTFUL_DELIVERY_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN;
    try {
      const assetRes = await fetch(
        `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/assets/${seoOgImageId}?access_token=${token}`,
        { cache: 'no-store' }
      );
      const assetData = await assetRes.json();
      if (assetData.fields?.file?.url) {
        ogImageUrl = `https:${assetData.fields.file.url}`;
      }
    } catch {
      // Fall back to hero image
      if (post.resolvedHeroImage) {
        ogImageUrl = `https:${post.resolvedHeroImage}`;
      }
    }
  } else if (post.resolvedHeroImage) {
    ogImageUrl = `https:${post.resolvedHeroImage}`;
  }

  const canonicalUrl = seoCanonicalOverride || `${BASE_URL}/blog/${params.slug}`;

  return {
    title: `${seoTitle} | PH1 Research`,
    description: seoDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: seoNoindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonicalUrl,
      siteName: 'PH1 Research',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) notFound();

  const getField = (fieldName: string) => {
    const field = post.fields?.[fieldName];
    return field ? (field['en-US'] || field) : null;
  };

  const title = getField('title') || 'Blog Post';
  const publishedDate = getField('publishedDate') || post.sys?.createdAt;
  const imageUrl = post.resolvedHeroImage ? `https:${post.resolvedHeroImage}` : null;

  // Format date for display
  const formattedDate = publishedDate
    ? new Date(publishedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

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

      <article className="max-w-4xl mx-auto px-4 py-20">
        {imageUrl && (
          <div className="mb-12">
            <img src={imageUrl} alt={title} className="w-full h-96 object-cover rounded-lg" />
          </div>
        )}
        {formattedDate && (
          <time className="text-sm text-gray-500 mb-4 block">{formattedDate}</time>
        )}
        <h1 className="text-5xl font-bold mb-8">{title}</h1>
        <p className="text-xl text-gray-600">This is a blog post page. Full content coming soon.</p>
      </article>
    </main>
  );
}
