const contentful = require('contentful-management');

async function addHeroImageField() {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
  });

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
  const environment = await space.getEnvironment('master');

  try {
    const contentType = await environment.getContentType('landingPage');
    
    // Check if field already exists
    const fieldExists = contentType.fields.some(f => f.id === 'heroImage');
    
    if (!fieldExists) {
      contentType.fields.push({
        id: 'heroImage',
        name: 'Hero Image URL',
        type: 'Symbol',
        required: false
      });
      
      await contentType.update();
      console.log('✓ Added heroImage field to landingPage');
      
      const updatedContentType = await environment.getContentType('landingPage');
      await updatedContentType.publish();
      console.log('✓ Published content type');
    } else {
      console.log('✓ heroImage field already exists');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

addHeroImageField();
