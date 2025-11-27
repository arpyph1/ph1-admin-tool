export async function POST(request: Request) {
  try {
    const { key, prompt, currentData } = await request.json();

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
          content: `Update this team member profile based on the user's request. Return ONLY valid JSON, no markdown formatting, no code blocks.

CURRENT PROFILE:
${JSON.stringify(currentData, null, 2)}

USER'S UPDATE REQUEST:
${prompt}

Return updated profile as JSON with this EXACT structure (no markdown, no backticks):
{
  "name": "Full Name",
  "key": "${key}",
  "expertise": "Primary area of expertise",
  "experience": "Years/description of experience",
  "bio": "Updated bio paragraph"
}

Rules:
- Keep the key unchanged: "${key}"
- Only update fields mentioned in the user's request
- Preserve all other information from the current profile
- Maintain professional tone and quality
- Return ONLY the JSON object, absolutely no markdown code blocks or backticks

CRITICAL: Do not wrap the JSON in markdown code blocks. Return raw JSON only.`,
        }],
      }),
    });

    const aiResult = await aiResponse.json();
    let generatedText = aiResult.content[0].text;
    
    generatedText = generatedText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    const updatedData = JSON.parse(generatedText);

    return Response.json({
      success: true,
      teamMember: updatedData,
    });

  } catch (error: any) {
    console.error('Error generating preview:', error);
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
