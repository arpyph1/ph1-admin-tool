import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildComponentLibrary } from '@/lib/component-library';

export async function POST(request: NextRequest) {
  try {
    const { baseComponentId, prompt } = await request.json();
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
    
    const library = await buildComponentLibrary();
    const baseComp = library.find(c => c.id === baseComponentId);
    
    if (!baseComp) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }
    
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: `Base component:
${baseComp.html}

Modification request: "${prompt}"

Create a variant. Keep the structure and Tailwind classes. Only modify based on the request.

Return HTML only between markers:
---HTML---
<modified component>
---END---`
      }]
    });
    
    let result = message.content[0].type === 'text' ? message.content[0].text : '';
    const htmlMatch = result.match(/---HTML---\s*([\s\S]+?)\s*---END---/);
    
    if (!htmlMatch) {
      return NextResponse.json({ error: 'Failed to parse' }, { status: 500 });
    }
    
    const newComponent = {
      id: `generated-${Date.now()}`,
      name: `${baseComp.name} (variant)`,
      category: baseComp.category,
      html: htmlMatch[1].trim(),
      tailwindClasses: baseComp.tailwindClasses,
      variables: baseComp.variables,
      source: `Generated from ${baseComp.source}`,
      description: prompt
    };
    
    return NextResponse.json({ component: newComponent });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
