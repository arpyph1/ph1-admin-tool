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
      include: 1  // Reduced from 3 to prevent circular refs
    });
    
    const page = homepage.items[0].fields as any;
    
    const components = [];
    
    // 1. HERO
    components.push({
      id: 'hero-homepage',
      type: 'hero',
      template: 'h1 + subtitle + CTA button',
      variables: ['heading', 'subtitle', 'ctaText', 'ctaLink']
    });
    
    // 2. SERVICES SECTION
    if (page.servicesHtml) {
      components.push({
        id: 'services-grid',
        type: 'services-section',
        htmlPreview: page.servicesHtml.substring(0, 400),
        description: 'Grid of service cards with icons'
      });
    }
    
    // 3. CASE STUDIES CAROUSEL
    components.push({
      id: 'case-studies-carousel',
      type: 'carousel',
      itemCount: page.caseStudies?.length || 0,
      description: 'Horizontal scrolling case studies with images'
    });
    
    // 4. RESOURCES CAROUSEL
    components.push({
      id: 'resources-carousel',
      type: 'carousel',
      itemCount: page.resources?.length || 0,
      description: 'Resources/trends carousel'
    });
    
    // 5. TALENT SECTION
    if (page.talent) {
      components.push({
        id: 'talent-section',
        type: 'text-section',
        hasContent: true,
        description: 'Talent/team information section'
      });
    }
    
    // 6. SOLUTIONS GRID
    components.push({
      id: 'solutions-grid',
      type: 'grid',
      itemCount: page.solutions?.length || 0,
      description: 'Solutions offerings grid'
    });
    
    return NextResponse.json({
      totalComponents: components.length,
      byType: {
        hero: components.filter(c => c.type === 'hero').length,
        carousel: components.filter(c => c.type === 'carousel').length,
        grid: components.filter(c => c.type === 'grid').length,
        textSection: components.filter(c => c.type === 'text-section').length
      },
      components
    });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
