export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
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
          content: `You are a website revision assistant for PH1.ca, a product & strategy consultancy with 20+ years of experience.

USER REQUEST:
${prompt}

Analyze this request and provide a structured response as JSON with this format:

{
  "analysis": {
    "understanding": "Brief summary of what the user wants to change",
    "type": "component|content|global|seo|custom",
    "scope": "single-page|multi-page|site-wide",
    "complexity": "simple|moderate|complex"
  },
  "changes": [
    {
      "title": "Brief title of the change",
      "description": "Detailed description of what needs to be changed",
      "pages": ["List of affected pages like /about, /services, etc."],
      "implementation": "How to implement this change",
      "priority": "high|medium|low"
    }
  ],
  "seoRecommendations": [
    "List of SEO recommendations if applicable"
  ],
  "nextSteps": [
    "Step 1: Do this",
    "Step 2: Then do this"
  ]
}

IMPORTANT CONTEXT ABOUT PH1:
- 20+ years of experience in product & strategy consulting
- Focus areas: UX research, AI strategy, CX transformation, innovation
- Key team members available in system: Arpy Dragffy, Brittany Hobbs, and others
- Target audience: Fortune 500 companies, enterprise clients
- Brand voice: Professional, authoritative, results-focused

Provide actionable, specific recommendations. Return ONLY the JSON, no markdown formatting.`,
        }],
      }),
    });

    const aiResult = await aiResponse.json();
    let generatedText = aiResult.content[0].text;
    
    // Clean up any markdown formatting
    generatedText = generatedText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    const analysis = JSON.parse(generatedText);

    return Response.json({
      success: true,
      ...analysis
    });

  } catch (error: any) {
    console.error('Error processing revision request:', error);
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
