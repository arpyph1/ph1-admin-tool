import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://ph1.ca');
    const html = await res.text();
    
    // Extract major sections
    const sections = {
      header: html.match(/<header[\s\S]*?<\/header>/i)?.[0] || html.match(/<nav[\s\S]*?<\/nav>/i)?.[0],
      hero: html.match(/<section[^>]*hero[^>]*>[\s\S]*?<\/section>/i)?.[0],
      services: html.match(/<section[^>]*service[^>]*>[\s\S]*?<\/section>/i)?.[0],
      caseStudies: html.match(/<section[^>]*case[^>]*>[\s\S]*?<\/section>/i)?.[0],
      trends: html.match(/<section[^>]*trend[^>]*>[\s\S]*?<\/section>/i)?.[0],
      footer: html.match(/<footer[\s\S]*?<\/footer>/i)?.[0]
    };
    
    return NextResponse.json({
      url: 'https://ph1.ca',
      htmlLength: html.length,
      sections: Object.entries(sections).map(([name, html]) => ({
        name,
        found: !!html,
        length: html?.length || 0,
        preview: html?.substring(0, 500)
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
