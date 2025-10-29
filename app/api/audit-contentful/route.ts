import { NextResponse } from 'next/server';
import { createClient } from 'contentful';

export async function GET() {
  try {
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!,
    });
    
    const allEntries = await client.getEntries({ limit: 100 });
    const pages = await client.getEntries({ content_type: 'page' });
    const sections = await client.getEntries({ content_type: 'section' });
    
    return NextResponse.json({
      totalEntries: allEntries.total,
      pages: {
        total: pages.total,
        items: pages.items.map((p: any) => ({
          id: p.sys.id,
          slug: p.fields.slug,
          title: p.fields.title,
          createdAt: p.sys.createdAt,
          updatedAt: p.sys.updatedAt,
          publishedAt: p.sys.publishedAt
        }))
      },
      sections: {
        total: sections.total
      }
    });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
