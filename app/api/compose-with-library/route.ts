import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildComponentLibrary } from '@/lib/component-library';

export async function POST(request: NextRequest) {
  try {
    const { action, prompt, selectedComponents, html, feedback } = await request.json();
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
    
    if (action === 'select-components') {
      const library = await buildComponentLibrary();
      
      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2000,
        messages: [{
          role: "user",
          content: `Request: "${prompt}"

COMPONENT LIBRARY (from PH1's actual site):
${library.map(c => `${c.id}: ${c.name} (${c.category}) - ${c.variables.join(', ')}`).join('\n')}

Which components should be used? Return JSON:
{
  "components": ["home-hero", "home-services-grid"],
  "reasoning": "why these fit"
}

JSON only.`
        }]
      });
      
      let result = message.content[0].type === 'text' ? message.content[0].text : '';
      result = result.replace(/```json\s*/g, '').replace(/```/g, '').trim();
      const selection = JSON.parse(result);
      
      return NextResponse.json({ selection, library });
    }
    
    if (action === 'compose') {
      const library = await buildComponentLibrary();
      const selected = library.filter(c => selectedComponents.includes(c.id));
      
      const componentsContext = selected.map(c => 
        `COMPONENT: ${c.name}\nHTML:\n${c.html}\nVARIABLES: ${c.variables.join(', ')}\n---`
      ).join('\n\n');
      
      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4000,
        messages: [{
          role: "user",
          content: `Request: "${prompt}"

ACTUAL COMPONENTS FROM PH1 SITE:
${componentsContext}

CRITICAL RULES:
1. Use the EXACT HTML structure above
2. Keep ALL Tailwind classes unchanged
3. Only replace the TEXT content to match the request
4. Do NOT generate new HTML from scratch
5. Preserve all styling, classes, and structure

PH1 Facts to use: 20+ years, Fortune 500 (Spotify, Microsoft, Dell, Mozilla, Bell, NFL)

Return complete HTML with components combined:
---HTML---
<combined components>
---END---`
        }]
      });
      
      let result = message.content[0].type === 'text' ? message.content[0].text : '';
      const htmlMatch = result.match(/---HTML---\s*([\s\S]+?)\s*---END---/);
      
      return NextResponse.json({
        html: htmlMatch?.[1]?.trim() || '<div>Failed to parse</div>'
      });
    }
    
    if (action === 'refine') {
      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 3000,
        messages: [{
          role: "user",
          content: `Current HTML:
${html}

User feedback: "${feedback}"

Apply feedback. Keep ALL structure and classes. Only modify text.

---HTML---
<refined>
---END---`
        }]
      });
      
      let result = message.content[0].type === 'text' ? message.content[0].text : '';
      const htmlMatch = result.match(/---HTML---\s*([\s\S]+?)\s*---END---/);
      
      return NextResponse.json({
        html: htmlMatch?.[1]?.trim() || html
      });
    }
    
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
