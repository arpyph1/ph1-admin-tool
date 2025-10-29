import { NextApiRequest, NextApiResponse } from 'next';
import { PreviewContentGenerator } from '../../components/preview/PreviewContentGenerator';

interface PreviewRequest {
  mode: 'before' | 'after';
  changes?: any[];
  baseContent?: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { mode, changes = [], baseContent = null }: PreviewRequest = req.body;

    // Default content if none provided
    const defaultContent = {
      hero: {
        title: "Product & Strategy Consulting",
        subtitle: "We help companies build products that people love",
        cta: "Get Started"
      },
      services: [
        {
          id: "ux-research",
          title: "UX Research",
          description: "Deep user insights to guide product decisions",
          icon: "🔍"
        },
        {
          id: "product-strategy",
          title: "Product Strategy", 
          description: "Strategic roadmaps for product success",
          icon: "📋"
        },
        {
          id: "innovation",
          title: "Innovation Consulting",
          description: "Transform ideas into market-ready solutions",
          icon: "💡"
        }
      ],
      clients: [
        "Spotify", "Microsoft", "Dell", "Bell", "Telus", "Mozilla", 
        "Government of Canada", "BC Ferries", "UFC"
      ]
    };

    const content = baseContent || defaultContent;

    const previewContent = await PreviewContentGenerator.generatePreview({
      baseContent: content,
      changes: mode === 'after' ? changes : [],
      mode
    });

    res.status(200).json({
      success: true,
      content: previewContent
    });

  } catch (error) {
    console.error('Preview generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate preview',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}