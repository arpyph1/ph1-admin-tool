require('dotenv').config({ path: '.env.local' });
const contentful = require('contentful-management');

async function createLandingPageModel() {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  });

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
  const environment = await space.getEnvironment('master');

  try {
    const contentType = await environment.createContentTypeWithId('landingPage', {
      name: 'Landing Page',
      displayField: 'title',
      fields: [
        {
          id: 'key',
          name: 'URL Key',
          type: 'Symbol',
          required: true,
        },
        {
          id: 'title',
          name: 'Page Title',
          type: 'Symbol',
          required: true,
        },
        {
          id: 'heroHeadline',
          name: 'Hero Headline',
          type: 'Symbol',
          required: true,
        },
        {
          id: 'heroSubheadline',
          name: 'Hero Subheadline',
          type: 'Text',
        },
        {
          id: 'mainContent',
          name: 'Main Content (HTML)',
          type: 'Text',
        },
        {
          id: 'ctaText',
          name: 'CTA Button Text',
          type: 'Symbol',
        },
        {
          id: 'ctaLink',
          name: 'CTA Button Link',
          type: 'Symbol',
        },
        {
          id: 'showCaseStudies',
          name: 'Show Case Studies Carousel',
          type: 'Boolean',
        },
        {
          id: 'showTrends',
          name: 'Show Trends/News Carousel',
          type: 'Boolean',
        },
        {
          id: 'showContactForm',
          name: 'Show Contact Form',
          type: 'Boolean',
        },
        {
          id: 'metaDescription',
          name: 'Meta Description',
          type: 'Text',
        },
      ],
    });

    await contentType.publish();
    console.log('✅ Landing Page content type created successfully!');
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Landing Page content type already exists');
    } else {
      console.error('Error:', error.message);
    }
  }
}

createLandingPageModel();
