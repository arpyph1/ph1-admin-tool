import { clearTeamMemberCache } from '@/lib/contentful-team';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    // Call Claude to generate team member details
    const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: `Generate a team member profile based on this description. Return ONLY valid JSON with this exact structure:

{
  "name": "Full Name",
  "key": "url-slug-version",
  "expertise": "Primary area of expertise",
  "experience": "Years/description of experience",
  "bio": "Detailed bio paragraph (150-300 words)"
}

User's description:
${prompt}

Requirements:
- key must be lowercase, hyphenated (e.g., "sarah-chen")
- expertise should be 3-5 words
- experience should be concise (e.g., "10+ years in UX research")
- bio should be professional, detailed, and highlight achievements

Return ONLY the JSON, no other text.`,
        }],
      }),
    });

    const aiResult = await aiResponse.json();
    const generatedText = aiResult.content[0].text;
    
    // Parse the JSON response
    const teamMemberData = JSON.parse(generatedText);

    // Create entry in Contentful
    const contentfulResponse = await fetch(
      `https://api.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CONTENTFUL_MANAGEMENT_TOKEN}`,
          'Content-Type': 'application/vnd.contentful.management.v1+json',
          'X-Contentful-Content-Type': 'teamMember',
        },
        body: JSON.stringify({
          fields: {
            key: { 'en-US': teamMemberData.key },
            Name: { 'en-US': teamMemberData.name },
            Expertise: { 'en-US': teamMemberData.expertise },
            Experience: { 'en-US': teamMemberData.experience },
            Bio: {
              'en-US': {
                nodeType: 'document',
                data: {},
                content: [{
                  nodeType: 'paragraph',
                  data: {},
                  content: [{
                    nodeType: 'text',
                    value: teamMemberData.bio,
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

    if (!contentfulResponse.ok) {
      const error = await contentfulResponse.json();
      throw new Error(`Contentful error: ${JSON.stringify(error)}`);
    }

    const createdEntry = await contentfulResponse.json();

    // Publish the entry
    const publishResponse = await fetch(
      `https://api.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries/${createdEntry.sys.id}/published`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.CONTENTFUL_MANAGEMENT_TOKEN}`,
          'Content-Type': 'application/vnd.contentful.management.v1+json',
          'X-Contentful-Version': createdEntry.sys.version.toString(),
        },
      }
    );

    if (!publishResponse.ok) {
      throw new Error('Failed to publish entry');
    }

    // Clear cache so new team member shows up immediately
    clearTeamMemberCache();

    return Response.json({
      success: true,
      teamMember: teamMemberData,
      contentfulId: createdEntry.sys.id,
    });

  } catch (error) {
    console.error('Error creating team member:', error);
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
