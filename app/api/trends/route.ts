import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const token = process.env.CONTENTFUL_DELIVERY_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN;
    const res = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries?content_type=trends&order=-sys.createdAt&limit=3&include=2&access_token=${token}`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    console.log('Trends found:', data.items?.length || 0);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching trends:', error);
    return NextResponse.json({ items: [], error: error.message }, { status: 500 });
  }
}
