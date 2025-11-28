import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { createClient } from 'contentful';

const BASE_URL = 'https://ph1.ca';
const DEFAULT_OG_IMAGE = '/images/og-default.jpg';

function renderRichTextNode(node: any): string {
  if (!node) return '';

  // Handle text nodes
  if (node.nodeType === 'text') {
    let value = node.value || '';
    if (node.marks) {
      node.marks.forEach((mark: any) => {
        if (mark.type === 'bold') value = `<strong>${value}</strong>`;
        if (mark.type === 'italic') value = `<em>${value}</em>`;
        if (mark.type === 'underline') value = `<u>${value}</u>`;
        if (mark.type === 'code') value = `<code class="bg-gray-100 px-1 rounded">${value}</code>`;
      });
    }
    return value;
  }

  // Handle hyperlinks
  if (node.nodeType === 'hyperlink') {
    const url = node.data?.uri || '#';
    const text = node.content?.map((c: any) => renderRichTextNode(c)).join('') || '';
    return `<a href="${url}" class="text-blue-600 hover:underline" target="_blank" rel="noopener">${text}</a>`;
  }

  // Get inner content
  const innerContent = node.content?.map((c: any) => renderRichTextNode(c)).join('') || '';

  switch (node.nodeType) {
    case 'document':
      return innerContent;
    case 'paragraph':
      return `<p class="mb-4 leading-relaxed">${innerContent}</p>`;
    case 'heading-1':
      return `<h1 class="text-4xl font-bold mt-10 mb-6">${innerContent}</h1>`;
    case 'heading-2':
      return `<h2 class="text-3xl font-bold mt-8 mb-4">${innerContent}</h2>`;
    case 'heading-3':
      return `<h3 class="text-2xl font-bold mt-6 mb-3">${innerContent}</h3>`;
    case 'heading-4':
      return `<h4 class="text-xl font-bold mt-5 mb-2">${innerContent}</h4>`;
    case 'heading-5':
      return `<h5 class="text-lg font-bold mt-4 mb-2">${innerContent}</h5>`;
    case 'heading-6':
      return `<h6 class="text-base font-bold mt-4 mb-2">${innerContent}</h6>`;
    case 'unordered-list':
      return `<ul class="list-disc list-outside ml-6 mb-4 space-y-2">${innerContent}</ul>`;
    case 'ordered-list':
      return `<ol class="list-decimal list-outside ml-6 mb-4 space-y-2">${innerContent}</ol>`;
    case 'list-item':
      const listItemContent = node.content?.map((c: any) => {
        if (c.nodeType === 'paragraph') {
          return c.content?.map((cc: any) => renderRichTextNode(cc)).join('') || '';
        }
        return renderRichTextNode(c);
      }).join('') || '';
      return `<li>${listItemContent}</li>`;
    case 'blockquote':
      return `<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">${innerContent}</blockquote>`;
    case 'hr':
      return `<hr class="my-8 border-gray-200" />`;
    case 'embedded-entry-block':
    case 'embedded-asset-block':
      return ''; // Skip embedded entries for now
    default:
      return innerContent;
  }
}

function renderRichText(content: any): string {
  if (!content) return '';
  return renderRichTextNode(content);
}

// Lazy client initialization
let client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (!client) {
    client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN!,
    });
  }
  return client;
}

async function getBlogPost(slug: string) {
  try {
    // Query by 'key' field (the slug field for trends content type)
    const entries = await getClient().getEntries({
      content_type: 'trends',
      'fields.key': slug,
      include: 2,
      limit: 1,
    });

    if (entries.items.length === 0) return null;

    const item = entries.items[0];
    const heroImage = item.fields?.heroImage as any;

    return {
      ...item,
      resolvedHeroImage: heroImage?.fields?.file?.url || null
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

  const fields = post.fields as any;
  const title = fields?.title || 'Blog Post';
  const seoTitle = fields?.seoTitle || title;
  const seoDescription = fields?.seoDescription || fields?.excerpt || fields?.heroSubheadline || `Read ${title} on PH1 Research`;
  const seoCanonicalOverride = fields?.seoCanonicalOverride;
  const seoNoindex = fields?.seoNoindex === true;

  // Resolve OG image: seoOgImage > heroImage > default
  let ogImageUrl = DEFAULT_OG_IMAGE;
  const seoOgImage = fields?.seoOgImage as any;
  if (seoOgImage?.fields?.file?.url) {
    ogImageUrl = `https:${seoOgImage.fields.file.url}`;
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

  const fields = post.fields as any;

  // DEBUG: Check trendContentRich field
  console.log('=== BLOG DEBUG ===');
  console.log('Fields available:', Object.keys(fields || {}));
  console.log('trendContentRich exists:', !!fields?.trendContentRich);
  console.log('trendContentRich nodeType:', fields?.trendContentRich?.nodeType);
  console.log('trendContentRich content length:', fields?.trendContentRich?.content?.length);
  console.log('summaryRich exists:', !!fields?.summaryRich);
  console.log('=== END DEBUG ===');

  const title = fields?.title || 'Blog Post';
  const subtitle = fields?.subtitle || fields?.heroSubheadline || '';
  const author = fields?.author || '';
  const publishedDate = fields?.publishedDate || post.sys?.createdAt;
  const imageUrl = post.resolvedHeroImage ? `https:${post.resolvedHeroImage}` : null;

  // Get content from trendContentRich (full body) with fallback to summaryRich (preview)
  const content = fields?.trendContentRich || fields?.summaryRich || null;
  const renderedContent = content ? renderRichText(content) : '';

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
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
            <div className="max-w-4xl mx-auto px-4 pb-12 w-full">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
              {subtitle && <p className="text-xl text-white/80">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}

      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8 text-gray-600">
          {author && <span className="font-medium">{author}</span>}
          {author && formattedDate && <span>•</span>}
          {formattedDate && <time>{formattedDate}</time>}
        </div>

        {!imageUrl && <h1 className="text-5xl font-bold mb-8">{title}</h1>}

        {renderedContent ? (
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: renderedContent }} />
        ) : (
          <p className="text-xl text-gray-600">Content coming soon.</p>
        )}
      </article>
    </main>
  );
}
