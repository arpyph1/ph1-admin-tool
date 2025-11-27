import { getPage } from '@/lib/contentful';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

const BASE_URL = 'https://ph1.ca';
const DEFAULT_OG_IMAGE = '/images/og-default.jpg';

async function getCaseStudies() {
  try {
    const token = process.env.CONTENTFUL_DELIVERY_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN;
    const res = await fetch(`https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries?content_type=caseStudy&order=-sys.createdAt&limit=6&include=2&access_token=${token}`, { cache: 'no-store' });
    const data = await res.json();

    const assetMap: any = {};
    if (data.includes?.Asset) {
      data.includes.Asset.forEach((asset: any) => {
        assetMap[asset.sys.id] = asset.fields?.file?.url;
      });
    }

    return data.items?.map((item: any) => {
      const heroImageId = item.fields?.carouselImage?.sys?.id || item.fields?.heroImage?.sys?.id;
      return { ...item, resolvedHeroImage: heroImageId ? assetMap[heroImageId] : null };
    }) || [];
  } catch (error) {
    return [];
  }
}

async function getTrends(pageTitle: string) {
  try {
    const token = process.env.CONTENTFUL_DELIVERY_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN;
    const res = await fetch(`https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries?content_type=trends&order=-sys.createdAt&limit=20&include=2&access_token=${token}`, { cache: 'no-store' });
    const data = await res.json();

    const assetMap: any = {};
    if (data.includes?.Asset) {
      data.includes.Asset.forEach((asset: any) => {
        assetMap[asset.sys.id] = asset.fields?.file?.url;
      });
    }

    const trends = data.items?.map((item: any) => {
      const heroImageId = item.fields?.heroImage?.sys?.id || item.fields?.image?.sys?.id;
      const tags = item.fields?.tags || [];
      return {
        ...item,
        resolvedHeroImage: heroImageId ? assetMap[heroImageId] : null,
        tags: Array.isArray(tags) ? tags : []
      };
    }) || [];

    // Extract keywords from page title
    const keywords = pageTitle.toLowerCase().split(/\s+/).filter(word => word.length > 3);

    // Score each trend by tag matches
    const scoredTrends = trends.map((trend: any) => {
      const trendTags = trend.tags.map((t: string) => t.toLowerCase());
      const score = keywords.reduce((sum, keyword) => {
        return sum + (trendTags.some((tag: string) => tag.includes(keyword) || keyword.includes(tag)) ? 1 : 0);
      }, 0);
      return { ...trend, score };
    });

    // Sort by score (highest first), then by date
    scoredTrends.sort((a: any, b: any) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.sys.createdAt).getTime() - new Date(a.sys.createdAt).getTime();
    });

    return scoredTrends.slice(0, 8);
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await getPage(params.slug);

  if (!page) {
    return {
      title: 'Page Not Found',
      robots: { index: false, follow: false },
    };
  }

  const getField = (fieldName: string): any => {
    const field = (page.fields as any)?.[fieldName];
    return field ? ((field as any)['en-US'] || field) : null;
  };

  const title = getField('title') || '';
  const heroSubheadline = getField('heroSubheadline');
  const seoTitle = getField('seoTitle') || title;
  const seoDescription = getField('seoDescription') || heroSubheadline || `Learn more about ${title} at PH1 Research`;
  const seoCanonicalOverride = getField('seoCanonicalOverride');
  const seoNoindex = getField('seoNoindex') === true;
  const heroImage = getField('heroImage');

  // Get OG image URL
  let ogImageUrl = DEFAULT_OG_IMAGE;
  const seoOgImageRef = getField('seoOgImage');
  const heroImageRef = heroImage;

  if (seoOgImageRef?.sys?.id || heroImageRef?.sys?.id) {
    const assetId = seoOgImageRef?.sys?.id || heroImageRef?.sys?.id;
    try {
      const token = process.env.CONTENTFUL_DELIVERY_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN;
      const assetRes = await fetch(
        `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/assets/${assetId}?access_token=${token}`,
        { cache: 'no-store' }
      );
      const assetData = await assetRes.json();
      if (assetData.fields?.file?.url) {
        ogImageUrl = `https:${assetData.fields.file.url}`;
      }
    } catch {
      // Use default image
    }
  }

  const canonicalUrl = seoCanonicalOverride || `${BASE_URL}/${params.slug}`;

  return {
    title: seoTitle,
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
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);
  if (!page) notFound();

  const getField = (fieldName: string): any => {
    const field = (page.fields as any)?.[fieldName];
    return field ? ((field as any)['en-US'] || field) : null;
  };
  const getBooleanField = (fieldName: string): boolean => {
    const field = (page.fields as any)?.[fieldName];
    if (!field) return false;
    const value = (field as any)['en-US'] !== undefined ? (field as any)['en-US'] : field;
    return value === true;
  };

  const title = getField('title') || '';
  const heroHeadline = getField('heroHeadline');
  const heroSubheadline = getField('heroSubheadline');
  const mainContent = getField('mainContent');
  const heroImage = getField('heroImage') || 'https://ph1.ca/images/contact/hero_graphic_expanded.svg';
  const ctaText = getField('ctaText');
  const showCaseStudies = getBooleanField('showCaseStudies');
  const showTrends = getBooleanField('showTrends');
  const showContactForm = getBooleanField('showContactForm');

  const caseStudies = showCaseStudies ? await getCaseStudies() : [];
  const trends = showTrends ? await getTrends(title) : [];

  return (
    <main className="bg-white">
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

      <div className="bg-white">
        <section className="bg-white pt-12 pb-10 md:pt-20 md:pb-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
              <div>
                {heroHeadline && (
                  <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-black">
                    {heroHeadline}
                  </h1>
                )}
                {heroSubheadline && (
                  <p className="text-xl md:text-[22px] text-gray-700 mb-8 leading-relaxed font-normal">
                    {heroSubheadline}
                  </p>
                )}
                {mainContent && (
                  <div className="text-base text-gray-700 leading-relaxed space-y-5 font-normal" dangerouslySetInnerHTML={{ __html: mainContent }} />
                )}
              </div>
              <div className="hidden md:flex items-start justify-center sticky top-20">
                <img src={heroImage} alt="Hero Illustration" className="w-full max-w-lg" />
              </div>
            </div>
          </div>
        </section>

        {(showCaseStudies || showTrends) && (
          <div className="bg-[#f5f5f5] py-16 md:py-24">
            {showCaseStudies && caseStudies.length > 0 && (
              <div className={showTrends ? 'mb-20' : ''}>
                <div className="max-w-7xl mx-auto px-4">
                  <h2 className="text-5xl font-bold mb-12 text-black">Our Work</h2>
                </div>
                <div className="overflow-x-auto">
                  <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-4" style={{ width: 'max-content' }}>
                      {caseStudies.map((study: any) => {
                        const problemStatement = study.fields?.problemStatement || '';
                        const key = study.fields?.urlKey || study.sys?.id;
                        const imageUrl = study.resolvedHeroImage ? `https:${study.resolvedHeroImage}` : null;

                        return (
                          <a key={study.sys.id} href={`/case-study/${key}`} className="case-study">
                            {imageUrl && (
                              <>
                                <div className="image-filter"></div>
                                <img src={imageUrl} alt="Case study" loading="lazy" />
                              </>
                            )}
                            <div>
                              <p>{problemStatement}</p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showTrends && trends.length > 0 && (
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-5xl font-bold mb-12 text-black">Upskill Your Team</h2>
                <div className="grid grid-cols-4 gap-1">
                  {trends.map((trend: any) => {
                    const title = trend.fields?.title || 'Article';
                    const key = trend.fields?.urlKey || trend.fields?.key || trend.sys?.id;
                    const imageUrl = trend.resolvedHeroImage ? `https:${trend.resolvedHeroImage}` : null;

                    return (
                      <a key={trend.sys.id} href={`/blog/${key}`} className="resource-card">
                        {imageUrl && (
                          <>
                            <div className="image-filter"></div>
                            <img src={imageUrl} alt={title} loading="lazy" />
                          </>
                        )}
                        <div>
                          <p>STRATEGY, AI, DESIGN, PRODUCT</p>
                          <h3>{title}</h3>
                          <span>Learn More →</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {showContactForm && (
          <section className="bg-white py-20 md:py-28">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-16 text-center text-black">Tell Us About Your Project</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" placeholder="First name" className="w-full px-4 py-3.5 border border-gray-300 focus:border-black focus:outline-none font-normal text-base" />
                  <input type="text" placeholder="Last name" className="w-full px-4 py-3.5 border border-gray-300 focus:border-black focus:outline-none font-normal text-base" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" placeholder="Company" className="w-full px-4 py-3.5 border border-gray-300 focus:border-black focus:outline-none font-normal text-base" />
                  <input type="email" placeholder="Email Address" className="w-full px-4 py-3.5 border border-gray-300 focus:border-black focus:outline-none font-normal text-base" />
                </div>
                <textarea placeholder="Your Message goes here" rows={7} className="w-full px-4 py-3.5 border border-gray-300 focus:border-black focus:outline-none resize-none font-normal text-base"></textarea>
                <div className="flex justify-center pt-4">
                  <button type="submit" className="bg-[#ffc72d] text-black px-14 py-4 font-bold text-sm hover:bg-[#fab700] transition-colors uppercase tracking-wider">{ctaText || 'GO NOW'}</button>
                </div>
              </form>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
