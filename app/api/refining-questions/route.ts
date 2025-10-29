import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { purpose, selling, proofPoints, takeaway } = await request.json();

    const prompt = `You are helping create a landing page. The user provided:

Headline: "${purpose}"
Subheadline: "${selling}"
Body: "${proofPoints || 'Not provided'}"
Closing: "${takeaway || 'Not provided'}"

Generate 3-5 short, specific questions to help create better content. Questions should ask about:
- Target audience
- Key benefits or features  
- Social proof or credibility
- Specific use cases
- What makes this unique

Return ONLY a JSON array of questions:
["Question 1?", "Question 2?", "Question 3?"]`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });
    
    const aiResponse = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = aiResponse.match(/\[[\s\S]*?\]/);
    
    if (!jsonMatch) {
      return NextResponse.json({ questions: [] });
    }
    
    const questions = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ questions });
    
  } catch (error: any) {
    console.error('Error generating questions:', error);
    return NextResponse.json({ questions: [] });
  }
}
