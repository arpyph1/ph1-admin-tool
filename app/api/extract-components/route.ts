import { NextResponse } from 'next/server';
import { createClient } from 'contentful';

export async function GET() {
  try {
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!,
    });
    
    const pages = await client.getEntries({ content_type: 'page', include: 2 });
    const components: any[] = [];
    
    for (const page of pages.items) {
      const fields = page.fields as any;
      const sections = fields.sections || [];
      
      for (const section of sections) {
        const html = section.fields?.htmlContent || '';
        if (html.length < 100) continue;
        
        // Extract specific component types with granular patterns
        
        // 1. CAROUSELS - horizontal scroll containers
        const carouselMatches = html.match(/<div[^>]*overflow-x-auto[^>]*>[\s\S]*?<\/div>/g) || [];
        carouselMatches.forEach(carousel => {
          if (carousel.length > 200) {
            components.push({
              id: `carousel-${components.filter(c => c.id.startsWith('carousel')).length + 1}`,
              type: 'carousel',
              html: carousel,
              description: 'Horizontal scrolling carousel'
            });
          }
        });
        
        // 2. LOGO GRIDS - grid with images
        const logoGridMatches = html.match(/<div[^>]*grid[^>]*>[\s\S]*?<img[\s\S]*?<\/div>/g) || [];
        logoGridMatches.forEach(grid => {
          if (grid.includes('img') && grid.length > 150) {
            components.push({
              id: `logo-grid-${components.filter(c => c.id.startsWith('logo-grid')).length + 1}`,
              type: 'logo-grid',
              html: grid,
              description: 'Logo grid layout'
            });
          }
        });
        
        // 3. HERO SECTIONS - large text with gradient/bg
        const heroMatches = html.match(/<(?:section|div)[^>]*(?:min-h-screen|py-20)[^>]*>[\s\S]*?(?:text-6xl|text-5xl)[\s\S]*?<\/(?:section|div)>/g) || [];
        heroMatches.forEach(hero => {
          if (hero.length > 200) {
            components.push({
              id: `hero-${components.filter(c => c.id.startsWith('hero')).length + 1}`,
              type: 'hero',
              html: hero,
              description: 'Hero section with large heading'
            });
          }
        });
        
        // 4. FEATURE GRIDS - grid layouts with content cards
        const featureGridMatches = html.match(/<div[^>]*grid[^>]*grid-cols-[23][^>]*>[\s\S]*?<\/div>/g) || [];
        featureGridMatches.forEach(grid => {
          if (grid.length > 300 && !grid.includes('<img')) { // Not a logo grid
            components.push({
              id: `feature-grid-${components.filter(c => c.id.startsWith('feature-grid')).length + 1}`,
              type: 'feature-grid',
              html: grid,
              description: 'Feature grid with cards'
            });
          }
        });
        
        // 5. TEXT SECTIONS - paragraphs and headings
        const textMatches = html.match(/<div[^>]*max-w-[^>]*>[\s\S]*?<h[1-3][^>]*>[\s\S]*?<p[\s\S]*?<\/div>/g) || [];
        textMatches.forEach(text => {
          if (text.length > 150 && text.length < 1000) {
            components.push({
              id: `text-${components.filter(c => c.id.startsWith('text')).length + 1}`,
              type: 'text-section',
              html: text,
              description: 'Text content section'
            });
          }
        });
        
        // 6. CTA SECTIONS - buttons and calls to action
        const ctaMatches = html.match(/<(?:section|div)[^>]*>[\s\S]*?<a[^>]*(?:btn|button)[^>]*>[\s\S]*?<\/(?:section|div)>/g) || [];
        ctaMatches.forEach(cta => {
          if (cta.length > 100 && cta.length < 500) {
            components.push({
              id: `cta-${components.filter(c => c.id.startsWith('cta')).length + 1}`,
              type: 'cta',
              html: cta,
              description: 'Call to action section'
            });
          }
        });
      }
    }
    
    // Deduplicate similar components
    const unique = components.filter((comp, index) => {
      return !components.slice(0, index).some(other => 
        other.type === comp.type && 
        Math.abs(other.html.length - comp.html.length) < 50
      );
    });
    
    const byType = unique.reduce((acc: any, comp) => {
      acc[comp.type] = (acc[comp.type] || 0) + 1;
      return acc;
    }, {});
    
    return NextResponse.json({
      totalComponents: unique.length,
      byType,
      components: unique.map(c => ({
        id: c.id,
        type: c.type,
        description: c.description,
        htmlLength: c.html.length,
        preview: c.html.substring(0, 300)
      }))
    });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
