import { NextResponse } from 'next/server';
import { createClient } from 'contentful';

export async function GET() {
  try {
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!,
    });
    
    const homepage = await client.getEntries({ 
      content_type: 'homePage',
      limit: 1,
      include: 3
    });
    
    if (!homepage.items.length) {
      return NextResponse.json({ error: 'No homepage found' }, { status: 404 });
    }
    
    const page = homepage.items[0].fields as any;
    
    return NextResponse.json({
      fields: Object.keys(page),
      servicesHtml: page.servicesHtml?.substring(0, 500),
      embeddedSection: page.embeddedSection?.fields,
      caseStudies: page.caseStudies?.length || 0,
      solutions: page.solutions?.length || 0,
      resources: page.resources?.length || 0
    });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
