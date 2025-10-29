import axios from 'axios';
import * as cheerio from 'cheerio';

export async function analyzeReferenceStructure(url: string) {
  try {
    console.log('🔍 Deep analyzing:', url);
    const response = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    const $ = cheerio.load(response.data);
    $('script, style, nav, footer, header').remove();
    
    const analysis = {
      layout: detectLayoutType($),
      sections: extractSections($),
      style: analyzeStyle($),
      tone: analyzeTone($)
    };
    
    console.log('✅ Deep analysis complete:', analysis.layout);
    return analysis;
  } catch (error) {
    console.log('❌ Analysis failed');
    return null;
  }
}

function detectLayoutType($: any): string {
  const hasGrid = $('[class*="grid"]').length > 0;
  const hasFlex = $('[class*="flex"]').length > 0;
  const columns = $('[class*="col-"]').length;
  
  if (columns >= 3) return 'multi-column';
  if (hasGrid || columns > 1) return 'grid-based';
  if ($('section').length > 3) return 'stacked-sections';
  return 'single-column';
}

function extractSections($: any) {
  const sections: any[] = [];
  
  $('section, div[class*="section"], article').each((i, el) => {
    if (i > 5) return;
    const $section = $(el);
    sections.push({
      heading: $section.find('h1, h2, h3').first().text().trim(),
      paragraphs: $section.find('p').map((_, p) => $(p).text().trim()).get().slice(0, 2),
      hasImage: $section.find('img').length > 0,
      hasButton: $section.find('button, a[class*="btn"]').length > 0
    });
  });
  
  return sections.filter(s => s.heading || s.paragraphs.length > 0);
}

function analyzeStyle($: any) {
  return {
    hasLargeHeadings: $('h1').first().css('font-size') !== undefined,
    colorScheme: 'professional', // Could extract actual colors
    spacing: 'generous' // Could calculate actual spacing
  };
}

function analyzeTone($: any) {
  const text = $('p').first().text().toLowerCase();
  if (text.includes('we help') || text.includes('partner')) return 'collaborative';
  if (text.includes('leading') || text.includes('innovative')) return 'assertive';
  return 'professional';
}
