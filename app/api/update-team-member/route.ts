import { clearTeamMemberCache } from '@/lib/contentful-team';

export async function POST(request: Request) {
  try {
    const { key, updatedData } = await request.json();

    const entriesResponse = await fetch(
      `https://api.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries?content_type=teamMember&fields.key=${key}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.CONTENTFUL_MANAGEMENT_TOKEN}`,
        },
      }
    );

    const entriesData = await entriesResponse.json();
    
    if (!entriesData.items || entriesData.items.length === 0) {
      throw new Error('Team member entry not found in Contentful');
    }

    const entryId = entriesData.items[0].sys.id;
    const currentVersion = entriesData.items[0].sys.version;

    const updateResponse = await fetch(
      `https://api.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries/${entryId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.CONTENTFUL_MANAGEMENT_TOKEN}`,
          'Content-Type': 'application/vnd.contentful.management.v1+json',
          'X-Contentful-Version': currentVersion.toString(),
        },
        body: JSON.stringify({
          fields: {
            key: { 'en-US': updatedData.key },
            name: { 'en-US': updatedData.name },
            expertise: { 'en-US': updatedData.expertise },
            experience: { 'en-US': updatedData.experience },
            bio: {
              'en-US': {
                nodeType: 'document',
                data: {},
                content: [{
                  nodeType: 'paragraph',
                  data: {},
                  content: [{
                    nodeType: 'text',
                    value: updatedData.bio,
                    marks: [],
                    data: {},
                  }],
                }],
              },
            },
          },
        }),
      }
    );

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      throw new Error(`Contentful error: ${JSON.stringify(error)}`);
    }

    const updatedEntry = await updateResponse.json();

    const publishResponse = await fetch(
      `https://api.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries/${entryId}/published`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.CONTENTFUL_MANAGEMENT_TOKEN}`,
          'Content-Type': 'application/vnd.contentful.management.v1+json',
          'X-Contentful-Version': updatedEntry.sys.version.toString(),
        },
      }
    );

    if (!publishResponse.ok) {
      throw new Error('Failed to publish updated entry');
    }

    clearTeamMemberCache();

    return Response.json({
      success: true,
      teamMember: updatedData,
    });

  } catch (error) {
    console.error('Error updating team member:', error);
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
