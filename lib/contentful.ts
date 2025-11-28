import { createClient } from 'contentful';

// Lazy client initialization to avoid build-time errors
let client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (!client) {
    const accessToken = process.env.CONTENTFUL_DELIVERY_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN;
    const spaceId = process.env.CONTENTFUL_SPACE_ID;

    if (!accessToken || !spaceId) {
      throw new Error('Contentful configuration missing: CONTENTFUL_SPACE_ID and CONTENTFUL_DELIVERY_TOKEN are required');
    }

    client = createClient({
      space: spaceId,
      accessToken: accessToken,
    });
  }
  return client;
}

// Helper to sanitize error messages (remove tokens from URLs)
function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message.replace(/access_token=[^&\s]+/g, 'access_token=[REDACTED]');
  }
  return String(error).replace(/access_token=[^&\s]+/g, 'access_token=[REDACTED]');
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
    console.error('Error fetching page:', sanitizeError(error));
    return null;
  }
}
