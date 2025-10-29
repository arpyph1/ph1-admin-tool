import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from 'contentful';
import { createClient as createManagementClient } from 'contentful-management';

async function getComponentTemplates() {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!,
  });
  
  const homepage = await client.getEntries({ 
    content_type: 'homePage',
    limit: 1,
    include: 1
  });
  
  const page = homepage.items[0].fields as any;
  
  return {
    hero: {
      html: `<section class="py-20 px-6 bg-gradient-to-br from-purple-900 to-blue-900 text-white">
  <div class="max-w-4xl mx-auto text-center">
    <h1 class="text-6xl font-bold mb-6">{{heading}}</h1>
    <p class="text-2xl mb-8">{{subtitle}}</p>
    <a href="{{ctaLink}}" class="bg-white text-purple-900 px-8 py-4 rounded-full font-bold">{{ctaText}}</a>
  </div>
</section>`
    },
    servicesGrid: {
      html: page.servicesHtml
    },
    textSection: {
      html: `<section class="py-16 px-6">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-4xl font-bold mb-6">{{heading}}</h2>
    <div class="text-lg leading-relaxed">{{content}}</div>
  </div>
</section>`
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const { action, prompt, selectedComponents, slug, title } = await request.json();
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
    
    if (action === 'select') {
      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2000,
        messages: [{
          role: "user",
          content: `Request: "${prompt}"

Available components:
- hero: Large heading + subtitle + CTA
- servicesGrid: Grid of service offerings
- textSection: Text content section

Select 2-4 components. Return JSON:
{"components": ["hero", "textSection"], "reasoning": "why these work"}

JSON only.`
        }]
      });
      
      let result = message.content[0].type === 'text' ? message.content[0].text : '';
      result = result.replace(/```json\s*/g, '').replace(/```/g, '').trim();
      return NextResponse.json(JSON.parse(result));
    }
    
    if (action === 'fill') {
      const templates = await getComponentTemplates();
      const componentsHtml = selectedComponents.map((c: string) => templates[c as keyof typeof templates]?.html || '').join('\n\n');
      
      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 3000,
        messages: [{
          role: "user",
          content: `Request: "${prompt}"

Templates to fill:
${componentsHtml}

Replace {{variables}} with content for PH1 (20+ years, Fortune 500 clients: Spotify, Microsoft, Dell, Mozilla, Bell, NFL).

Return complete HTML with all {{variables}} replaced.

Format:
---HTML---
<complete filled HTML>
---END---`
        }]
      });
      
      let result = message.content[0].type === 'text' ? message.content[0].text : '';
      const htmlMatch = result.match(/---HTML---\s*([\s\S]+?)\s*---END---/);
      
      if (!htmlMatch) {
        return NextResponse.json({ error: 'Parse error' }, { status: 500 });
      }
      
      return NextResponse.json({ html: htmlMatch[1].trim() });
    }
    
    if (action === 'publish') {
      const { html } = await request.json();
      
      const mgmtClient = createManagementClient({ accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN! });
      const space = await mgmtClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
      const env = await space.getEnvironment('master');
      
      // Create page entry (adapt to your content model)
      const entry = await env.createEntry('service', {
        fields: {
          key: { 'en-US': slug },
          title: { 'en-US': title },
          serviceDescription: { 'en-US': html }
        }
      });
      await entry.publish();
      
      return NextResponse.json({ success: true, url: `/${slug}` });
    }
    
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
