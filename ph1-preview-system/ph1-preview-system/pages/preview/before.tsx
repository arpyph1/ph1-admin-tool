import { GetServerSideProps } from 'next';
import { PreviewContentGenerator } from '../../components/preview/PreviewContentGenerator';

interface PreviewPageProps {
  htmlContent: string;
  cssContent: string;
}

export default function BeforePreview({ htmlContent, cssContent }: PreviewPageProps) {
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

    const previewContent = await PreviewContentGenerator.generatePreview({
      baseContent: defaultContent,
      changes: [], // No changes for "before" view
      mode: 'before'
    });

    return {
      props: {
        htmlContent: previewContent.html,
        cssContent: previewContent.css
      }
    };
  } catch (error) {
    console.error('Error generating before preview:', error);
    return {
      props: {
        htmlContent: '<div style="padding: 20px; text-align: center;">Error loading preview</div>',
        cssContent: ''
      }
    };
  }
};