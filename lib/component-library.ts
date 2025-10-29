import { createClient } from 'contentful';

export interface Component {
  id: string;
  name: string;
  category: 'hero' | 'card' | 'grid' | 'list' | 'cta' | 'nav' | 'text' | 'image' | 'carousel' | 'logo-grid' | 'section';
  html: string;
  tailwindClasses: string[];
  variables: string[];
  source: string;
  appearsOn: string[];
  description?: string;
}

function extractClasses(html: string): string[] {
  const matches = html.match(/class="([^"]+)"/g) || [];
  return [...new Set(matches.map(m => m.replace(/class="|"/g, '')).join(' ').split(/\s+/))];
}

function generateSmartName(html: string, category: string, source: string): string {
  const text = html.replace(/<[^>]*>/g, ' ').trim().substring(0, 50);
  
  if (html.includes('carousel') || html.includes('overflow-x')) return `${source} - Carousel`;
  if (html.includes('grid') && html.match(/<img/g)?.length && html.match(/<img/g).length > 2) return `${source} - Logo Grid`;
  if (html.includes('grid') && html.includes('gap')) return `${source} - Grid Layout`;
  if (html.match(/text-[56]xl/)) return `${source} - Large Heading`;
  if (html.includes('nav')) return `${source} - Navigation`;
  if (html.includes('footer')) return `${source} - Footer`;
  if (html.includes('bg-gradient')) return `${source} - Gradient Section`;
  
  const words = text.split(/\s+/).filter(w => w.length > 3).slice(0, 3).join(' ');
  return `${source} - ${words || category}`;
}

function extractAll(html: string, sourcePage: string, pageUrl: string): Component[] {
  if (!html) return [];
  const components: Component[] = [];
  
  // Links
  const links = html.match(/<a[^>]*>[\s\S]*?<\/a>/g) || [];
  links.forEach((link, i) => {
    if (link.length > 50 && link.length < 500) {
      components.push({
        id: `link-${sourcePage.replace(/\s/g, '-')}-${i}`,
        name: generateSmartName(link, 'link', sourcePage),
        category: link.includes('btn') || link.includes('button') ? 'cta' : 'text',
        html: link,
        tailwindClasses: extractClasses(link),
        variables: ['text', 'href'],
        source: sourcePage,
        appearsOn: [pageUrl]
      });
    }
  });
  
  // Divs
  const divs = html.match(/<div[^>]*>[\s\S]*?<\/div>/g) || [];
  divs.forEach((div, i) => {
    if (div.length > 100 && div.length < 1500) {
      let category: any = 'section';
      if (div.includes('carousel') || div.includes('overflow-x-auto') || div.includes('scroll')) category = 'carousel';
      else if (div.includes('logo') || (div.match(/<img/g)?.length || 0) > 3) category = 'logo-grid';
      else if (div.includes('grid')) category = 'grid';
      
      components.push({
        id: `div-${sourcePage.replace(/\s/g, '-')}-${i}`,
        name: generateSmartName(div, category, sourcePage),
        category,
        html: div,
        tailwindClasses: extractClasses(div),
        variables: ['content'],
        source: sourcePage,
        appearsOn: [pageUrl]
      });
    }
  });
  
  // Images
  const images = html.match(/<img[^>]*>/g) || [];
  images.forEach((img, i) => {
    components.push({
      id: `img-${sourcePage.replace(/\s/g, '-')}-${i}`,
      name: generateSmartName(img, 'image', sourcePage),
      category: 'image',
      html: `<div class="p-4">${img}</div>`,
      tailwindClasses: extractClasses(img),
      variables: ['src', 'alt'],
      source: sourcePage,
      appearsOn: [pageUrl]
    });
  });
  
  return components;
}

export async function buildComponentLibrary(): Promise<Component[]> {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!,
  });

  let all: Component[] = [];

  // Homepage - extract from ALL fields
  const homepage = await client.getEntries({ content_type: 'homePage', limit: 1, include: 2 });
  if (homepage.items[0]) {
    const h = homepage.items[0].fields as any;
    
    // Services HTML
    if (h.servicesHtml) all.push(...extractAll(h.servicesHtml, 'Homepage Services', '/'));
    
    // Embedded sections
    if (h.embeddedSection?.fields?.html) all.push(...extractAll(h.embeddedSection.fields.html, 'Homepage Embedded', '/'));
    
    // Add carousel placeholders for case studies and resources
    if (h.caseStudies?.length) {
      all.push({
        id: 'home-case-studies-carousel',
        name: 'Homepage - Case Studies Carousel',
        category: 'carousel',
        html: `<div class="carousel overflow-x-auto flex gap-6">${h.caseStudies.slice(0, 3).map((cs: any) => 
          `<div class="card min-w-[300px] p-6 border rounded-lg">${cs.fields?.intro || 'Case Study'}</div>`
        ).join('')}</div>`,
        tailwindClasses: ['overflow-x-auto', 'flex', 'gap-6'],
        variables: ['items'],
        source: 'Homepage',
        appearsOn: ['/']
      });
    }
    
    if (h.resources?.length) {
      all.push({
        id: 'home-resources-carousel',
        name: 'Homepage - Resources Carousel',
        category: 'carousel',
        html: `<div class="carousel overflow-x-auto flex gap-6">${h.resources.slice(0, 3).map((r: any) => 
          `<div class="card min-w-[300px] p-6 border rounded-lg">${r.fields?.title || 'Resource'}</div>`
        ).join('')}</div>`,
        tailwindClasses: ['overflow-x-auto', 'flex', 'gap-6'],
        variables: ['items'],
        source: 'Homepage',
        appearsOn: ['/']
      });
    }
  }

  // Global elements (header/footer/nav)
  const globals = await client.getEntries({ content_type: 'globalElements', limit: 1 });
  if (globals.items[0]) {
    const g = globals.items[0].fields as any;
    if (g.headerContent) all.push(...extractAll(g.headerContent, 'Global Header', '/'));
    if (g.footerContent) all.push(...extractAll(g.footerContent, 'Global Footer', '/'));
  }

  // Services
  const services = await client.getEntries({ content_type: 'service', limit: 10, include: 0 });
  for (const s of services.items) {
    const service = s.fields as any;
    const pageUrl = `/service/${service.key || ''}`;
    if (service.serviceDescription) all.push(...extractAll(service.serviceDescription, service.title || 'Service', pageUrl));
  }

  // Trends/Blog
  const trends = await client.getEntries({ content_type: 'trends', limit: 10, include: 0 });
  for (const t of trends.items) {
    const trend = t.fields as any;
    const pageUrl = `/blog/${trend.key || ''}`;
    if (trend.trendContentRich) {
      const html = JSON.stringify(trend.trendContentRich);
      if (html.length > 100) all.push(...extractAll(html, `Blog: ${trend.title}`, pageUrl));
    }
  }

  // Merge duplicates
  const merged = all.reduce((acc, curr) => {
    const existing = acc.find(c => c.html === curr.html);
    if (existing) {
      existing.appearsOn = [...new Set([...existing.appearsOn, ...curr.appearsOn])];
    } else {
      acc.push(curr);
    }
    return acc;
  }, [] as Component[]);

  return merged.slice(0, 50);
}
