import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient as createContentfulClient } from 'contentful';
import { createClient } from 'contentful-management';

async function getActualDesignSystem() {
  try {
    const client = createContentfulClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!,
    });
    
    // Fetch ALL pages and find the one with most content
    const allPages = await client.getEntries({ 
      content_type: 'page',
      include: 2 
    });
    
    let bestPage = null;
    let maxContent = 0;
    
    for (const page of allPages.items) {
      const fields = page.fields as any;
      const sections = fields.sections || [];
      const htmlContent = sections.map((s: any) => s.fields?.htmlContent || '').join('\n');
      
      if (htmlContent.length > maxContent) {
        maxContent = htmlContent.length;
        bestPage = { slug: fields.slug, html: htmlContent };
      }
    }
    
    if (!bestPage || maxContent < 100) {
      console.error('No substantial content found in Contentful');
      return null;
    }
    
    console.log(`✅ Using page '${bestPage.slug}' with ${maxContent} chars`);
    
    // Extract Tailwind classes
    const html = bestPage.html;
    const classMatches = html.match(/class="([^"]+)"/g) || [];
    const allClasses = classMatches
      .map(m => m.replace(/class="|"/g, ''))
      .join(' ')
      .split(/\s+/);
    
    const bgClasses = allClasses.filter(c => c.startsWith('bg-'));
    const textClasses = allClasses.filter(c => c.startsWith('text-'));
    const spaceClasses = allClasses.filter(c => /^[pm][xylrtb]?-/.test(c));
    
    return {
      facts: 'PH1: 20+ years, Fortune 500 (Spotify, Microsoft, Dell, Mozilla, Bell, NFL)',
      referencePage: bestPage.slug,
      htmlSample: html.substring(0, 4000),
      patterns: {
        backgrounds: [...new Set(bgClasses)].slice(0, 15),
        text: [...new Set(textClasses)].slice(0, 15),
        spacing: [...new Set(spaceClasses)].slice(0, 20)
      }
    };
  } catch (e) {
    console.error('Contentful fetch failed:', e);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, slug, prompt, draftContent, iteration = 0, feedback } = body;
    
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
    
    if (action === 'analyze') {
      return NextResponse.json({
        clear: true,
        analysis: { pageType: 'custom', plan: 'Generate based on request' }
      });
    }
    
    if (action === 'generate') {
      const design = await getActualDesignSystem();
      
      if (!design) {
        return NextResponse.json({ 
          error: 'No content found in Contentful to reference' 
        }, { status: 500 });
      }
      
      const isRefinement = iteration > 0 && feedback;
      
      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4000,
        messages: [{
          role: "user",
          content: `${isRefinement ? 'REFINE' : 'CREATE'} page for PH1.

${isRefinement ? `EXISTING COMPLETE PAGE:
${draftContent}

USER FEEDBACK: "${feedback}"

RULE: Keep ALL content. Only apply the specific changes requested. Never remove sections.` : `REQUEST: "${prompt}"`}

PH1 DESIGN REFERENCE (from '${design.referencePage}' page):
${design.facts}

Tailwind classes to use:
Backgrounds: ${design.patterns.backgrounds.join(', ')}
Text: ${design.patterns.text.join(', ')}
Spacing: ${design.patterns.spacing.join(', ')}

HTML structure example:
${design.htmlSample}

CRITICAL:
${isRefinement ? '- Preserve ALL existing HTML' : '- Match the structure above'}
- Use ONLY the Tailwind classes listed
- Keep it minimal and clean like the reference
- Responsive with md:, lg: breakpoints

Format:
---SUMMARY---
${isRefinement ? 'Changes made' : 'Page created'}
---HTML---
<div class="...">Complete HTML</div>
---END---`
        }]
      });
      
      let result = message.content[0].type === 'text' ? message.content[0].text : '';
      
      const summaryMatch = result.match(/---SUMMARY---\s*(.+?)\s*---HTML---/s);
      const htmlMatch = result.match(/---HTML---\s*([\s\S]+?)\s*---END---/);
      
      if (!htmlMatch) {
        return NextResponse.json({ error: 'Parse error' }, { status: 500 });
      }
      
      return NextResponse.json({
        success: true,
        draft: htmlMatch[1].trim(),
        summary: summaryMatch?.[1]?.trim() || 'Done',
        iteration: iteration + 1
      });
    }
    
    if (action === 'publish') {
      const { htmlContent, title } = body;
      
      const managementClient = createClient({ accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN! });
      const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
      const environment = await space.getEnvironment('master');
      
      const section = await environment.createEntry('section', {
        fields: {
          type: { 'en-US': 'custom' },
          htmlContent: { 'en-US': htmlContent }
        }
      });
      await section.publish();
      
      const page = await environment.createEntry('page', {
        fields: {
          slug: { 'en-US': slug },
          title: { 'en-US': title },
          sections: { 'en-US': [{ sys: { type: 'Link', linkType: 'Entry', id: section.sys.id }}]},
          seoTitle: { 'en-US': title },
          seoDescription: { 'en-US': `${title} - PH1` }
        }
      });
      await page.publish();
      
      return NextResponse.json({ success: true, slug, url: `/${slug}` });
    }
    
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Draft API' });
}
