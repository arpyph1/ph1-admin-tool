import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient as createContentfulClient } from 'contentful';
import { createClient } from 'contentful-management';
import { analyzePageVisually } from '@/lib/vision-scraper';
import { generateCodePrompt } from '@/lib/visual-to-code';

async function getPH1Context() {
  try {
    const client = createContentfulClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!,
    });
    const homepage = await client.getEntries({ content_type: 'page', 'fields.slug': 'home' });
    return 'PH1: 20+ years, Fortune 500 clients (Spotify, Microsoft, Dell, Mozilla, Bell, NFL)';
  } catch {
    return 'PH1: 20-year consultancy';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, answers = {} } = await request.json();
    if (!prompt) return NextResponse.json({ error: 'Required' }, { status: 400 });

    const urlMatch = prompt.match(/https?:\/\/[^\s]+/);
    const refUrl = urlMatch?.[0] || answers.question_0;
    const hasAnswers = Object.keys(answers).length > 0;

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    
    if (refUrl && !hasAnswers) {
      console.log('📸 Analyzing visually...');
      const visualAnalysis = await analyzePageVisually(refUrl);
      
      return NextResponse.json({
        needsClarification: true,
        questions: [
          {
            question: `Analyzed ${refUrl}. Layout: ${visualAnalysis?.layout}. How closely to match?`,
            options: [
              'Exact visual replica with same layout',
              'Same structure, different styling',
              'Inspired by, not exact copy'
            ],
            type: 'multiple_choice'
          },
          {
            question: 'Content focus?',
            placeholder: 'What should this page accomplish?',
            type: 'text_area'
          }
        ],
        message: 'Visual analysis complete',
        metadata: { visualAnalysis }
      });
    }

    // GENERATION MODE
    const ph1Context = await getPH1Context();
    const visualData = refUrl ? await analyzePageVisually(refUrl) : null;
    
    const matchLevel = answers.question_0 || 'Inspired by';
    const focus = answers.question_1 || 'showcase capabilities';

    const codePrompt = visualData 
      ? generateCodePrompt(visualData, `${focus} for PH1`)
      : `Create professional page for PH1 focusing on: ${focus}`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 3000,
      messages: [{
        role: "user",
        content: `Create page for PH1 (${ph1Context}).

REQUEST: ${prompt}
MATCH LEVEL: ${matchLevel}

${codePrompt}

Return COMPLETE HTML:
{
  "title": "Page title",
  "slug": "url-slug",  
  "htmlContent": "<section class='...'>Full HTML with all Tailwind classes, proper structure, real content</section>",
  "seoTitle": "SEO title",
  "seoDescription": "Meta description"
}

Requirements:
- Use ONLY real PH1 facts (clients: Spotify, Microsoft, Dell)
- Actual HTML elements with proper Tailwind classes
- Match the visual structure described above
- No placeholder content or images

JSON only.`
      }]
    });

    let result = message.content[0].type === 'text' ? message.content[0].text : '';
    result = result.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch (e) {
      console.error('Parse failed, trying to extract HTML...');
      // Fallback: extract any HTML-like content
      const htmlMatch = result.match(/<[^>]+>[\s\S]*<\/[^>]+>/);
      parsed = {
        title: 'Generated Page',
        slug: 'generated-' + Date.now(),
        htmlContent: htmlMatch ? htmlMatch[0] : '<div class="p-8"><h1>Error parsing</h1></div>',
        seoTitle: 'Generated Page',
        seoDescription: 'Generated page'
      };
    }

    const managementClient = createClient({ accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN! });
    const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment('master');

    const customSection = await environment.createEntry('section', {
      fields: { type: { 'en-US': 'custom' }, htmlContent: { 'en-US': parsed.htmlContent } }
    });
    await customSection.publish();

    const page = await environment.createEntry('page', {
      fields: {
        slug: { 'en-US': parsed.slug },
        title: { 'en-US': parsed.title },
        sections: { 'en-US': [{ sys: { type: 'Link', linkType: 'Entry', id: customSection.sys.id }}]},
        seoTitle: { 'en-US': parsed.seoTitle },
        seoDescription: { 'en-US': parsed.seoDescription }
      }
    });
    await page.publish();

    console.log('✅ Created:', parsed.slug);
    return NextResponse.json({ success: true, slug: parsed.slug });
  } catch (error: any) {
    console.error('❌', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'PH1 Vision API' });
}
