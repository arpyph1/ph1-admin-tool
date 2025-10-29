import { GetServerSideProps } from 'next';
import { PreviewContentGenerator } from '../../components/preview/PreviewContentGenerator';

interface PreviewPageProps {
  htmlContent: string;
  cssContent: string;
}

export default function AfterPreview({ htmlContent, cssContent }: PreviewPageProps) {
  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
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

    // Get changes from query parameters or session storage in a real implementation
    const sampleChanges = [
      {
        id: 'content-enterprise-hero',
        type: 'content',
        scope: 'section',
        description: 'Update hero messaging for enterprise audience',
        before: 'Product & Strategy Consulting',
        after: 'Enterprise-Grade Solutions for Fortune 500 Companies',
        impact: { seo: 7, performance: 9, accessibility: 9, conversion: 8 },
        risks: [],
        dependencies: ['hero-section'],
        estimatedTime: 5
      }
    ];

    const previewContent = await PreviewContentGenerator.generatePreview({
      baseContent: defaultContent,
      changes: sampleChanges, // Apply changes for "after" view
      mode: 'after'
    });

    return {
      props: {
        htmlContent: previewContent.html,
        cssContent: previewContent.css
      }
    };
  } catch (error) {
    console.error('Error generating after preview:', error);
    return {
      props: {
        htmlContent: '<div style="padding: 20px; text-align: center;">Error loading preview</div>',
        cssContent: ''
      }
    };
  }
};