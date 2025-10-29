import axios from 'axios';
import * as cheerio from 'cheerio';

export interface PageContent {
  url: string;
  title: string;
  metaDescription: string;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  paragraphs: string[];
  images: {
    src: string;
    alt: string;
    title?: string;
  }[];
  links: {
    href: string;
    text: string;
    isInternal: boolean;
  }[];
  structuredData: any[];
}

export interface SiteAnalysis {
  pages: PageContent[];
  navigation: {
    text: string;
    href: string;
  }[];
  assets: {
    images: string[];
    scripts: string[];
    styles: string[];
  };
  designTokens: {
    colors: string[];
    fonts: string[];
    breakpoints: string[];
  };
}

export class PH1ContentScraper {
  private baseUrl: string;
  private visitedUrls: Set<string> = new Set();

  constructor(baseUrl: string = 'https://ph1.ca') {
    this.baseUrl = baseUrl;
  }

  async scrapePage(url: string): Promise<PageContent> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PH1-ContentScraper/1.0)'
        }
      });

      const $ = cheerio.load(response.data);
      
      // Extract basic page information
      const title = $('title').text() || $('h1').first().text() || '';
      const metaDescription = $('meta[name="description"]').attr('content') || '';

      // Extract headings
      const headings = {
        h1: $('h1').map((_, el) => $(el).text().trim()).get(),
        h2: $('h2').map((_, el) => $(el).text().trim()).get(),
        h3: $('h3').map((_, el) => $(el).text().trim()).get(),
      };

      // Extract paragraphs
      const paragraphs = $('p').map((_, el) => $(el).text().trim()).get().filter(text => text.length > 20);

      // Extract images
      const images = $('img').map((_, el) => ({
        src: $(el).attr('src') || '',
        alt: $(el).attr('alt') || '',
        title: $(el).attr('title'),
      })).get();

      // Extract links
      const links = $('a[href]').map((_, el) => {
        const href = $(el).attr('href') || '';
        const text = $(el).text().trim();
        const isInternal = href.startsWith('/') || href.includes(this.baseUrl);
        return { href, text, isInternal };
      }).get();

      // Extract structured data
      const structuredData = $('script[type="application/ld+json"]')
        .map((_, el) => {
          try {
            return JSON.parse($(el).html() || '');
          } catch {
            return null;
          }
        })
        .get()
        .filter(data => data !== null);

      return {
        url,
        title,
        metaDescription,
        headings,
        paragraphs,
        images,
        links,
        structuredData
      };

    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      throw error;
    }
  }

  async analyzeFullSite(): Promise<SiteAnalysis> {
    const homePage = await this.scrapePage(this.baseUrl);
    const pages: PageContent[] = [homePage];
    
    // Extract navigation links from homepage
    const navigation = homePage.links
      .filter(link => link.isInternal && link.text.length > 0)
      .filter(link => !link.href.includes('#'))
      .slice(0, 10); // Limit to main navigation items

    // Scrape additional pages
    for (const navItem of navigation) {
      const fullUrl = navItem.href.startsWith('/') 
        ? `${this.baseUrl}${navItem.href}` 
        : navItem.href;
      
      if (!this.visitedUrls.has(fullUrl) && fullUrl.includes(this.baseUrl)) {
        try {
          this.visitedUrls.add(fullUrl);
          const pageContent = await this.scrapePage(fullUrl);
          pages.push(pageContent);
          
          // Small delay to be respectful
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to scrape ${fullUrl}:`, error);
        }
      }
    }

    // Extract all unique assets
    const allImages = new Set<string>();
    const allScripts = new Set<string>();
    const allStyles = new Set<string>();

    pages.forEach(page => {
      page.images.forEach(img => {
        if (img.src) allImages.add(img.src);
      });
    });

    // Analyze homepage for design tokens (simplified)
    const designTokens = await this.extractDesignTokens(this.baseUrl);

    return {
      pages,
      navigation: navigation.map(item => ({
        text: item.text,
        href: item.href
      })),
      assets: {
        images: Array.from(allImages),
        scripts: Array.from(allScripts),
        styles: Array.from(allStyles)
      },
      designTokens
    };
  }

  private async extractDesignTokens(url: string): Promise<any> {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      
      // Extract CSS variables and common styles (simplified)
      const styles = $('style, link[rel="stylesheet"]').text();
      
      // Basic color extraction (this would be more sophisticated in a real implementation)
      const colorMatches = styles.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)|rgba\([^)]+\)/g) || [];
      const colors = [...new Set(colorMatches)];

      // Basic font extraction
      const fontMatches = styles.match(/font-family:\s*([^;]+)/g) || [];
      const fonts = [...new Set(fontMatches.map(match => match.replace('font-family:', '').trim()))];

      return {
        colors,
        fonts,
        breakpoints: ['768px', '1024px', '1280px'] // Common breakpoints
      };
    } catch (error) {
      return {
        colors: [],
        fonts: [],
        breakpoints: []
      };
    }
  }

  async downloadAssets(images: string[], outputDir: string = './assets'): Promise<void> {
    // Implementation for downloading assets
    // This would save images to the public folder for the new site
    console.log(`Would download ${images.length} assets to ${outputDir}`);
  }

  generateContentReport(analysis: SiteAnalysis): string {
    return `
# PH1.ca Content Analysis Report

## Site Overview
- **Total Pages Analyzed**: ${analysis.pages.length}
- **Navigation Items**: ${analysis.navigation.length}
- **Total Images**: ${analysis.assets.images.length}

## Page Inventory
${analysis.pages.map(page => `
### ${page.title}
- **URL**: ${page.url}
- **Meta Description**: ${page.metaDescription}
- **H1 Tags**: ${page.headings.h1.length}
- **H2 Tags**: ${page.headings.h2.length}
- **Paragraphs**: ${page.paragraphs.length}
- **Images**: ${page.images.length}
- **Internal Links**: ${page.links.filter(l => l.isInternal).length}
`).join('\n')}

## Design Tokens
- **Colors Found**: ${analysis.designTokens.colors.join(', ')}
- **Font Families**: ${analysis.designTokens.fonts.join(', ')}

## Recommendations
1. Prioritize homepage recreation first
2. Focus on service pages for prompt-driven generation
3. Optimize case studies for enterprise positioning
4. Implement SEO improvements across all pages
`;
  }
}

// Usage example:
export async function runPH1Analysis() {
  const scraper = new PH1ContentScraper();
  
  try {
    console.log('🔍 Starting PH1.ca content analysis...');
    const analysis = await scraper.analyzeFullSite();
    
    console.log('📊 Analysis complete!');
    console.log(`- Found ${analysis.pages.length} pages`);
    console.log(`- Extracted ${analysis.assets.images.length} images`);
    
    const report = scraper.generateContentReport(analysis);
    console.log('\n📋 Content Report Generated');
    
    return { analysis, report };
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    throw error;
  }
}
