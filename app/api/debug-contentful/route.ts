import { NextResponse } from 'next/server';
import { createClient } from 'contentful';

export async function GET() {
  try {
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!,
    });
    
    const pages = await client.getEntries({ 
      content_type: 'page',
      include: 3
    });
    
    const debug = pages.items.map((page: any) => ({
      slug: page.fields.slug,
      title: page.fields.title,
      sectionCount: page.fields.sections?.length || 0,
      sections: page.fields.sections?.map((s: any) => ({
        type: s.fields?.type,
        htmlLength: s.fields?.htmlContent?.length || 0,
        preview: s.fields?.htmlContent?.substring(0, 150)
      }))
    }));
    
    return NextResponse.json({ totalPages: pages.items.length, pages: debug });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
