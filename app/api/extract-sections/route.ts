import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://ph1.ca');
    const html = await res.text();
    
    return NextResponse.json({
      header: html.match(/<header[\s\S]*?<\/header>/i)?.[0] || '',
      hero: html.match(/<section[^>]*hero[^>]*>[\s\S]*?<\/section>/i)?.[0] || '',
      services: html.match(/<section[^>]*section-services[^>]*>[\s\S]*?<\/section>/i)?.[0] || '',
      footer: html.match(/<footer[\s\S]*?<\/footer>/i)?.[0] || ''
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
