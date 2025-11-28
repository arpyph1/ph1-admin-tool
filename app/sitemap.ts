import { MetadataRoute } from 'next';

// Force dynamic generation - sitemap needs fresh data from Contentful
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

const BASE_URL = 'https://ph1.ca';

async function getAllBlogPosts() {
  try {
    const token = process.env.CONTENTFUL_DELIVERY_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN;
    if (!token) {
      console.error('Error fetching blog posts for sitemap: Missing Contentful access token');
      return [];
    }
    const res = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries?content_type=trends&order=-sys.createdAt&limit=1000&access_token=${token}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    // Sanitize error to avoid exposing tokens in logs
    const safeError = error instanceof Error ? error.message.replace(/access_token=[^&\s]+/g, 'access_token=[REDACTED]') : 'Unknown error';
    console.error('Error fetching blog posts for sitemap:', safeError);
    return [];
  }
}

async function getAllCaseStudies() {
  try {
    const token = process.env.CONTENTFUL_DELIVERY_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN;
    if (!token) {
      console.error('Error fetching case studies for sitemap: Missing Contentful access token');
      return [];
    }
    const res = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries?content_type=caseStudy&order=-sys.createdAt&limit=1000&access_token=${token}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    const safeError = error instanceof Error ? error.message.replace(/access_token=[^&\s]+/g, 'access_token=[REDACTED]') : 'Unknown error';
    console.error('Error fetching case studies for sitemap:', safeError);
    return [];
  }
}

async function getAllServices() {
  try {
    const token = process.env.CONTENTFUL_DELIVERY_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN;
    if (!token) {
      console.error('Error fetching services for sitemap: Missing Contentful access token');
      return [];
    }
    const res = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries?content_type=service&limit=1000&access_token=${token}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    const safeError = error instanceof Error ? error.message.replace(/access_token=[^&\s]+/g, 'access_token=[REDACTED]') : 'Unknown error';
    console.error('Error fetching services for sitemap:', safeError);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, caseStudies, services] = await Promise.all([
    getAllBlogPosts(),
    getAllCaseStudies(),
    getAllServices(),
  ]);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  // Blog posts
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post: any) => {
    const slug = post.fields?.urlKey || post.fields?.key;
    const getField = (fieldName: string) => {
      const field = post.fields?.[fieldName];
      return field ? (field['en-US'] || field) : null;
    };
    const seoNoindex = getField('seoNoindex') === true;

    return {
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(post.sys?.updatedAt || post.sys?.createdAt),
      changeFrequency: 'monthly' as const,
      priority: seoNoindex ? 0.1 : 0.8,
    };
  }).filter((page: any) => page.url !== `${BASE_URL}/blog/undefined`);

  // Case studies
  const caseStudyPages: MetadataRoute.Sitemap = caseStudies.map((study: any) => {
    const slug = study.fields?.urlKey || study.fields?.key;
    return {
      url: `${BASE_URL}/case-study/${slug}`,
      lastModified: new Date(study.sys?.updatedAt || study.sys?.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  }).filter((page: any) => page.url !== `${BASE_URL}/case-study/undefined`);

  // Service pages
  const servicePages: MetadataRoute.Sitemap = services.map((service: any) => {
    const slug = service.fields?.key || service.fields?.urlKey;
    return {
      url: `${BASE_URL}/${slug}`,
      lastModified: new Date(service.sys?.updatedAt || service.sys?.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  }).filter((page: any) => page.url !== `${BASE_URL}/undefined`);

  return [...staticPages, ...blogPages, ...caseStudyPages, ...servicePages];
}
