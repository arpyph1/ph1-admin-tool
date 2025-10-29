import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries?content_type=caseStudy&order=-sys.createdAt&limit=6&access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    console.log('Case studies found:', data.items?.length || 0);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching case studies:', error);
    return NextResponse.json({ items: [], error: error.message }, { status: 500 });
  }
}
