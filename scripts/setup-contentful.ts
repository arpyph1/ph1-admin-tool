import 'dotenv/config';

import { createClient } from 'contentful-management';

const client = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!
});

async function setupPageModel() {
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
  const environment = await space.getEnvironment('master');

  try {
    console.log('Creating Section content type...');
    const sectionType = await environment.createContentTypeWithId('section', {
      name: 'Section',
      fields: [
        {
          id: 'type',
          name: 'Section Type',
          type: 'Symbol',
          required: true,
          validations: [{
            in: ['hero', 'clients', 'work', 'services', 'contact', 'custom']
          }]
        },
        {
          id: 'content',
          name: 'Content (JSON)',
          type: 'Object',
        },
        {
          id: 'htmlContent',
          name: 'HTML Content',
          type: 'Text',
        }
      ]
    });
    await sectionType.publish();
    console.log('✅ Section content type created!');

    console.log('Creating Page content type...');
    const pageType = await environment.createContentTypeWithId('page', {
      name: 'Page',
      fields: [
        {
          id: 'slug',
          name: 'URL Slug',
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
          id: 'sections',
          name: 'Page Sections',
          type: 'Array',
          items: {
            type: 'Link',
            linkType: 'Entry',
            validations: [{
              linkContentType: ['section']
            }]
          }
        },
        {
          id: 'seoTitle',
          name: 'SEO Title',
          type: 'Symbol',
        },
        {
          id: 'seoDescription',
          name: 'SEO Description',
          type: 'Text',
        }
      ]
    });
    await pageType.publish();
    console.log('✅ Page content type created!');

    console.log('\n🎉 All Contentful models created successfully!');
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log('⚠️  Content types already exist. Skipping creation.');
    } else {
      console.error('❌ Error creating content types:', error);
      throw error;
    }
  }
}

setupPageModel().catch(console.error);

