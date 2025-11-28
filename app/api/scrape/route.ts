import { NextRequest, NextResponse } from 'next/server';
import { PH1ContentScraper } from '../../../lib/contentScraper';

export async function POST(request: NextRequest) {
  try {
    const { url, fullSiteAnalysis } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const scraper = new PH1ContentScraper(url);

    if (fullSiteAnalysis) {
      console.log('Starting full site analysis for:', url);
      const analysis = await scraper.analyzeFullSite();
      const report = scraper.generateContentReport(analysis);

      return NextResponse.json({
        success: true,
        data: {
          analysis,
          report,
          summary: {
            totalPages: analysis.pages.length,
            totalImages: analysis.assets.images.length,
            navigationItems: analysis.navigation.length
          }
        },
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('Scraping single page:', url);
      const pageContent = await scraper.scrapePage(url);

      return NextResponse.json({
        success: true,
        data: {
          page: pageContent,
          summary: {
            headings: pageContent.headings.h1.length + pageContent.headings.h2.length + pageContent.headings.h3.length,
            paragraphs: pageContent.paragraphs.length,
            images: pageContent.images.length,
            links: pageContent.links.length
          }
        },
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Content scraping error:', error);
    
    return NextResponse.json(
      { 
        error: 'Content scraping failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'PH1 Content Scraping API is running',
    endpoints: {
      POST: '/api/scrape - Scrape content from PH1.ca or other URLs',
      parameters: {
        url: 'URL to scrape (required)',
        fullSiteAnalysis: 'Boolean - whether to analyze entire site (optional)'
      },
      examples: [
        { url: 'https://ph1.ca', fullSiteAnalysis: true },
        { url: 'https://ph1.ca/services' }
      ]
    }
  });
}
