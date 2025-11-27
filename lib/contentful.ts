import { createClient } from 'contentful';

// Lazy client initialization to avoid build-time errors
let client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (!client) {
    client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!,
    });
  }
  return client;
}

export async function getPage(slug: string) {
  try {
    // Try to fetch from different content types
    const contentTypes = ['trends', 'service', 'caseStudy', 'landingPage'];

    for (const contentType of contentTypes) {
      try {
        const entries = await getClient().getEntries({
          content_type: contentType,
          'fields.key': slug,
          limit: 1,
        });

        if (entries.items.length > 0) {
          return entries.items[0];
        }
      } catch (e) {
        // Continue to next content type
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}
