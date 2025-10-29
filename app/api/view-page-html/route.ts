import { NextResponse } from 'next/server';
import { createClient } from 'contentful';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug') || 'what-we-do';
    
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!,
    });
    
    const pages = await client.getEntries({ 
      content_type: 'page',
      'fields.slug': slug,
      include: 2 
    });
    
    if (!pages.items.length) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    
    const page = pages.items[0].fields as any;
    const sections = page.sections || [];
    const fullHtml = sections.map((s: any) => s.fields?.htmlContent || '').join('\n\n=== SECTION BREAK ===\n\n');
    
    return new Response(fullHtml, {
      headers: { 'Content-Type': 'text/plain' }
    });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
