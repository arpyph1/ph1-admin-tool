import { NextResponse } from 'next/server';

interface ComponentSuggestion {
  id: string;
  name: string;
  category: string;
  html: string;
  source: string;
  description: string;
}

export async function GET() {
  try {
    const res = await fetch('https://ph1.ca');
    const html = await res.text();
    
    const suggestions: ComponentSuggestion[] = [];
    
    // 1. Extract Hero Section
    const heroMatch = html.match(/<section[^>]*hero[^>]*>([\s\S]*?)<\/section>/i);
    if (heroMatch) {
      const heroHtml = heroMatch[0];
      const h1 = heroHtml.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1] || '';
      
      suggestions.push({
        id: 'hero-1',
        name: 'Homepage Hero',
        category: 'hero',
        html: convertToTailwind(heroHtml),
        source: 'Homepage',
        description: `Main hero section with headline: "${h1.substring(0, 50)}..."`
      });
    }
    
    // 2. Extract Services Grid
    const servicesMatch = html.match(/<section[^>]*section-services[^>]*>([\s\S]*?)<\/section>/i);
    if (servicesMatch) {
      suggestions.push({
        id: 'services-grid-1',
        name: 'Services Grid',
        category: 'grid',
        html: convertToTailwind(servicesMatch[0]),
        source: 'Homepage',
        description: '6-card services grid with icons and hover effects'
      });
    }
    
    // 3. Extract Header
    const headerMatch = html.match(/<header[^>]*>([\s\S]*?)<\/header>/i);
    if (headerMatch) {
      suggestions.push({
        id: 'header-1',
        name: 'Main Navigation Header',
        category: 'nav',
        html: convertToTailwind(headerMatch[0]),
        source: 'Global',
        description: 'Header with logo, dropdown menu, and contact link'
      });
    }
    
    // 4. Extract Footer
    const footerMatch = html.match(/<footer[^>]*>([\s\S]*?)<\/footer>/i);
    if (footerMatch) {
      suggestions.push({
        id: 'footer-1',
        name: 'Site Footer',
        category: 'footer',
        html: convertToTailwind(footerMatch[0]),
        source: 'Global',
        description: 'Footer with company info, links, and locations'
      });
    }
    
    // 5. Extract individual service cards
    const serviceCards = html.matchAll(/<a[^>]*class="service"[^>]*>([\s\S]*?)<\/a>/g);
    let cardIndex = 0;
    for (const match of serviceCards) {
      if (cardIndex < 3) { // Only suggest first 3
        const cardHtml = match[0];
        const title = cardHtml.match(/<h4>(.*?)<\/h4>/)?.[1] || 'Service';
        
        suggestions.push({
          id: `service-card-${cardIndex}`,
          name: `Service Card - ${title}`,
          category: 'card',
          html: convertToTailwind(cardHtml),
          source: 'Homepage Services',
          description: `Individual service card for ${title}`
        });
        cardIndex++;
      }
    }
    
    return NextResponse.json({ suggestions });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function convertToTailwind(html: string): string {
  // Basic conversion mapping
  let converted = html
    .replace(/class="header"/g, 'class="fixed top-0 w-full bg-white shadow-lg z-50"')
    .replace(/class="hero"/g, 'class="py-20 px-6 bg-gradient-to-br from-blue-50 to-purple-50"')
    .replace(/class="section-services"/g, 'class="py-20 px-6 bg-gray-900"')
    .replace(/class="service"/g, 'class="group bg-gray-800 rounded-xl p-8 hover:bg-gray-700 transition-all block"')
    .replace(/class="service__icon"/g, 'class="w-16 h-16 mb-6"')
    .replace(/class="service-info"/g, 'class="flex flex-col"')
    .replace(/class="services"/g, 'class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"')
    .replace(/class="section-title--white u--center what-we-offer-title"/g, 'class="text-4xl md:text-5xl font-bold text-white text-center mb-16"')
    .replace(/class="column"/g, 'class="max-w-7xl mx-auto"')
    .replace(/class="row"/g, 'class="container mx-auto"')
    .replace(/class="footer__img"/g, 'class="h-8 mb-6 brightness-0 invert"')
    .replace(/class="footer__text"/g, 'class="text-gray-400"')
    .replace(/class="footer-links-column"/g, 'class="space-y-3"')
    .replace(/class="onload-animate-in"/g, 'class="animate-fade-in"')
    .replace(/class="btn--large"/g, 'class="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-blue-700 transition-colors"')
    .replace(/data-src="/g, 'src="')
    .replace(/class="lazy"/g, 'class="w-full h-full"');
  
  // Wrap in proper structure for hero
  if (converted.includes('hero')) {
    converted = converted.replace(
      /<h1[^>]*>(.*?)<\/h1>/,
      '<h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">$1</h1>'
    );
    converted = converted.replace(
      /<h2[^>]*>(.*?)<\/h2>/,
      '<h2 class="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">$1</h2>'
    );
  }
  
  // Add max-width containers
  if (!converted.includes('max-w-')) {
    converted = converted.replace(/<section/g, '<section><div class="max-w-7xl mx-auto"').replace(/<\/section>/g, '</div></section>');
  }
  
  return converted;
}
