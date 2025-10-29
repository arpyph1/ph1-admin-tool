import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from 'contentful-management';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Generate content with OpenAI
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a content strategist for PH1, a 20-year consultancy serving Fortune 500 companies like Spotify, Microsoft, and Dell.

Generate professional website content in JSON format:
{
  "title": "Page Title",
  "slug": "url-friendly-slug",
  "heading": "Main Heading",
  "subheading": "Supporting text",
  "content": "Main page content in HTML",
  "seoTitle": "SEO Title",
  "seoDescription": "Meta description 150-160 chars"
}`
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const result = completion.choices[0]?.message?.content || '';
    const parsed = JSON.parse(result);

    // Save to Contentful
    const managementClient = createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!
    });

    const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment('master');

    // Create custom content section
    const customSection = await environment.createEntry('section', {
      fields: {
        type: { 'en-US': 'custom' },
        htmlContent: { 'en-US': parsed.content || parsed.heading }
      }
    });
    await customSection.publish();

    // Create page
    const page = await environment.createEntry('page', {
      fields: {
        slug: { 'en-US': parsed.slug || generateSlug(parsed.title) },
        title: { 'en-US': parsed.title },
        sections: {
          'en-US': [
            { sys: { type: 'Link', linkType: 'Entry', id: customSection.sys.id } }
          ]
        },
        seoTitle: { 'en-US': parsed.seoTitle || parsed.title },
        seoDescription: { 'en-US': parsed.seoDescription || '' }
      }
    });
    await page.publish();

    return NextResponse.json({
      success: true,
      slug: parsed.slug || generateSlug(parsed.title),
      pageId: page.sys.id,
      message: 'Page created successfully'
    });

  } catch (error: any) {
    console.error('Page generation error:', error);
    return NextResponse.json(
      { error: 'Page generation failed', message: error?.message },
      { status: 500 }
    );
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function GET() {
  return NextResponse.json({
    message: 'PH1 Page Generation API',
    example: { prompt: 'Create a service page for AI Strategy Consulting' }
  });
}