import { NextResponse } from 'next/server';
import { createClient } from 'contentful';

export async function GET() {
  try {
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!,
    });
    
    const entries = await client.getEntries({ limit: 10 });
    
    const contentTypes = new Set(
      entries.items.map((e: any) => e.sys.contentType.sys.id)
    );
    
    return NextResponse.json({
      contentTypes: Array.from(contentTypes),
      sampleEntries: entries.items.map((e: any) => ({
        contentType: e.sys.contentType.sys.id,
        fields: Object.keys(e.fields)
      }))
    });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
