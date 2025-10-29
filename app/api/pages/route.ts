import { NextResponse } from 'next/server';
import * as contentful from 'contentful-management';

export async function GET() {
  try {
    const client = contentful.createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
    });

    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment('master');

    const [homepage, services, caseStudies, trends] = await Promise.all([
      environment.getEntries({ content_type: 'homePage', limit: 1 }),
      environment.getEntries({ content_type: 'service', limit: 100 }),
      environment.getEntries({ content_type: 'caseStudy', limit: 100 }),
      environment.getEntries({ content_type: 'trends', limit: 100 })
    ]);

    const pages = [
      ...homepage.items.map((p: any) => ({
        id: p.sys.id,
        title: p.fields.title?.['en-US'] || 'Home',
        slug: 'home',
        contentType: 'homePage'
      })),
      ...services.items.map((p: any) => ({
        id: p.sys.id,
        title: p.fields.title?.['en-US'] || 'Untitled',
        slug: p.fields.key?.['en-US'] || '',
        contentType: 'service'
      })),
      ...caseStudies.items.map((p: any) => ({
        id: p.sys.id,
        title: p.fields.title?.['en-US'] || 'Untitled',
        slug: p.fields.urlKey?.['en-US'] || '',
        contentType: 'caseStudy'
      })),
      ...trends.items.map((p: any) => ({
        id: p.sys.id,
        title: p.fields.title?.['en-US'] || 'Untitled',
        slug: p.fields.key?.['en-US'] || '',
        contentType: 'trends'
      }))
    ];

    return NextResponse.json({ pages });
  } catch (error: any) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
