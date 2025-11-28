import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from 'contentful';
import { createClient as createMgmtClient } from 'contentful-management';

function extractText(field: any): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'object' && field.content) {
    // Rich text object - extract plain text
    return field.content
      .map((node: any) => {
        if (node.nodeType === 'text') return node.value;
        if (node.content) return extractText(node);
        return '';
      })
      .join(' ')
      .trim();
  }
  return String(field);
}

async function getAllPages() {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!,
  });
  
  const [homepage, services, caseStudies] = await Promise.all([
    client.getEntries({ content_type: 'homePage', limit: 1, include: 0 }),
    client.getEntries({ content_type: 'service', limit: 10, include: 0 }),
    client.getEntries({ content_type: 'caseStudy', limit: 10, include: 0 })
  ]);
  
  return [
    ...homepage.items.map((p: any) => ({
      id: p.sys.id,
      type: 'homePage',
      title: 'Homepage',
      h1: extractText(p.fields.h1HeroBanner),
      subtitle: extractText(p.fields.subtitleHeroBanner)
    })),
    ...services.items.map((s: any) => ({
      id: s.sys.id,
      type: 'service',
      title: extractText(s.fields.title) || 'Service',
      heroText: extractText(s.fields.heroText)
    })),
    ...caseStudies.items.map((c: any) => ({
      id: c.sys.id,
      type: 'caseStudy',
      title: extractText(c.fields.intro) || 'Case Study',
      problem: extractText(c.fields.problemStatement)
    }))
  ];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, prompt, selectedPages, selectedComponents, html, iteration = 0 } = body;
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
    
    if (action === 'get-pages') {
      const pages = await getAllPages();
      return NextResponse.json({ pages });
    }
    
    if (action === 'extract-components') {
      const pages = await getAllPages();
      const selected = pages.filter(p => selectedPages.includes(p.id));
      
      const components: any[] = [];
      
      for (const page of selected) {
        if (page.type === 'homePage') {
          if (page.h1) components.push({ 
            id: `${page.id}-hero`, 
            label: 'Homepage Hero', 
            page: page.title, 
            html: page.h1.substring(0, 200) 
          });
          if (page.subtitle) components.push({ 
            id: `${page.id}-subtitle`, 
            label: 'Homepage Subtitle', 
            page: page.title, 
            html: page.subtitle.substring(0, 200) 
          });
        } else if (page.type === 'service') {
          if (page.heroText) components.push({ 
            id: `${page.id}-hero`, 
            label: `${page.title} Hero`, 
            page: page.title, 
            html: page.heroText.substring(0, 200) 
          });
        } else if (page.type === 'caseStudy') {
          if (page.problem) components.push({ 
            id: `${page.id}-problem`, 
            label: `${page.title} Problem`, 
            page: page.title, 
            html: page.problem.substring(0, 200) 
          });
        }
      }
      
      return NextResponse.json({ components });
    }
    
    if (action === 'generate') {
      const pages = await getAllPages();
      const selected = pages.filter(p => selectedPages.includes(p.id));
      
      const context = selected.map(p => JSON.stringify(p)).join('\n');
      
      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 3000,
        messages: [{
          role: "user",
          content: `Create: "${prompt}"

Reference: ${context}

PH1: 20+ years, Fortune 500 (Spotify, Microsoft, Dell, Mozilla, Bell, NFL)

Return:
---HTML---
<section class="py-20 px-6">HTML with Tailwind</section>
---QUESTIONS---
Q: Questions?
---END---`
        }]
      });
      
      let result = message.content[0].type === 'text' ? message.content[0].text : '';
      const htmlMatch = result.match(/---HTML---\s*([\s\S]+?)\s*---QUESTIONS---/);
      const questionsMatch = result.match(/---QUESTIONS---\s*([\s\S]+?)\s*---END---/);
      
      return NextResponse.json({
        html: htmlMatch?.[1]?.trim() || '<div>Failed</div>',
        questions: questionsMatch?.[1]?.trim().split('\n').filter(q => q.trim()) || [],
        iteration: iteration + 1
      });
    }
    
    if (action === 'refine') {
      const { answers, feedback } = body;
      
      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 3000,
        messages: [{
          role: "user",
          content: `Current: ${html}
Feedback: ${feedback}
Answers: ${JSON.stringify(answers)}

Refine. Keep structure.

---HTML---
<html>
---END---`
        }]
      });
      
      let result = message.content[0].type === 'text' ? message.content[0].text : '';
      const htmlMatch = result.match(/---HTML---\s*([\s\S]+?)\s*---END---/);
      
      return NextResponse.json({
        html: htmlMatch?.[1]?.trim() || html,
        iteration: iteration + 1
      });
    }
    
    if (action === 'publish') {
      const { slug, title, finalHtml } = body;
      
      const mgmt = createMgmtClient({ accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN! });
      const space = await mgmt.getSpace(process.env.CONTENTFUL_SPACE_ID!);
      const env = await space.getEnvironment('master');
      
      const entry = await env.createEntry('service', {
        fields: {
          key: { 'en-US': slug },
          title: { 'en-US': title },
          serviceDescription: { 'en-US': finalHtml }
        }
      });
      await entry.publish();
      
      return NextResponse.json({ success: true, url: `/service/${slug}` });
    }
    
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
