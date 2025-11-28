import { notFound } from 'next/navigation';

async function getCaseStudy(slug: string) {
  try {
    const token = process.env.CONTENTFUL_DELIVERY_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN;
    const res = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries?content_type=caseStudy&fields.urlKey=${slug}&include=2&access_token=${token}`,
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
    console.error('Error fetching case study:', error);
    return null;
  }
}

function renderRichText(content: any): string {
  if (!content || !content.content) return '';
  
  return content.content.map((node: any) => {
    if (node.nodeType === 'paragraph') {
      const text = node.content?.map((c: any) => c.value || '').join('') || '';
      return `<p>${text}</p>`;
    }
    return '';
  }).join('');
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const caseStudy = await getCaseStudy(params.slug);
  
  if (!caseStudy) notFound();
  
  const problemStatement = caseStudy.fields?.problemStatement || 'Case Study';
  const intro = caseStudy.fields?.intro ? renderRichText(caseStudy.fields.intro) : '';
  const projectVision = caseStudy.fields?.projectVision ? renderRichText(caseStudy.fields.projectVision) : '';
  const approach = caseStudy.fields?.approach ? renderRichText(caseStudy.fields.approach) : '';
  const outcomes = caseStudy.fields?.outcomes ? renderRichText(caseStudy.fields.outcomes) : '';
  const imageUrl = caseStudy.resolvedHeroImage ? `https:${caseStudy.resolvedHeroImage}` : null;
  
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
            <a href="/" className="font-normal text-sm text-black hover:text-[#51c2e7] transition-colors">Services</a>
            <a href="/#work" className="font-normal text-sm text-black hover:text-[#51c2e7] transition-colors">Our Work</a>
            <a href="/" className="font-normal text-sm text-black hover:text-[#51c2e7] transition-colors">Training</a>
            <a href="/" className="font-normal text-sm text-black hover:text-[#51c2e7] transition-colors">About</a>
            <a href="/#contact" className="bg-[#ffc72d] px-5 py-2 font-bold text-sm text-black hover:bg-[#fab700] transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {imageUrl && (
        <div className="w-full h-[500px] relative">
          <img src={imageUrl} alt={problemStatement} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
            <div className="max-w-7xl mx-auto px-4 pb-12 w-full">
              <h1 className="text-5xl md:text-6xl font-bold text-white">{problemStatement}</h1>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-16">
        {intro && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Overview</h2>
            <div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: intro }} />
          </div>
        )}
        
        {projectVision && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Vision</h2>
            <div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: projectVision }} />
          </div>
        )}
        
        {approach && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Approach</h2>
            <div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: approach }} />
          </div>
        )}
        
        {outcomes && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Outcomes</h2>
            <div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: outcomes }} />
          </div>
        )}
      </div>
    </main>
  );
}
