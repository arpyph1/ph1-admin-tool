import { getCachedTeamMembers, formatTeamContextForAI } from '@/lib/contentful-team';

export async function POST(request: Request) {
  try {
    const { prompt, pageContent, pageType } = await request.json();
    
    // Fetch team members from Contentful
    const teamMembers = await getCachedTeamMembers();
    const teamContext = formatTeamContextForAI(teamMembers);
    
    // Build enriched prompt
    const enrichedPrompt = `
USER REQUEST:
${prompt}

CURRENT PAGE CONTENT:
${pageContent || 'No existing content'}

PAGE TYPE: ${pageType || 'general'}

${teamContext}

GENERATION INSTRUCTIONS:
1. Generate or modify content based on the user's request
2. If team members should be mentioned:
   - Use their exact names and correct spelling from the context above
   - Link to their ph1.ca URLs: https://ph1.ca/team/{key}
   - Only mention them when relevant
3. Maintain PH1's brand voice and style
4. Ensure all links are functional
5. Preserve any existing structure unless instructed otherwise
`;

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: enrichedPrompt,
        }],
      }),
    });

    const aiResult = await response.json();
    const generatedContent = aiResult.content[0].text;

    // Track which team members were used
    const usedTeamMembers = teamMembers.filter(member => 
      generatedContent.includes(member.name) || 
      generatedContent.includes(member.key)
    );

    return Response.json({
      success: true,
      content: generatedContent,
      metadata: {
        teamMembersUsed: usedTeamMembers.map(m => m.name),
        teamContextProvided: teamMembers.length,
      },
    });

  } catch (error: any) {
    console.error('Content generation error:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to generate content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
