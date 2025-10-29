const contentful = require('contentful-management');

async function checkFields() {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
  });

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
  const environment = await space.getEnvironment('master');

  try {
    const contentType = await environment.getContentType('landingPage');
    
    console.log('=== LANDING PAGE FIELDS ===');
    contentType.fields.forEach(field => {
      console.log(`- ${field.id} (${field.name}) - Type: ${field.type}`);
    });
    
    const heroImageField = contentType.fields.find(f => f.id === 'heroImage');
    if (heroImageField) {
      console.log('\n✓ heroImage field exists!');
      console.log('Type:', heroImageField.type);
      console.log('Link Type:', heroImageField.linkType);
    } else {
      console.log('\n✗ heroImage field NOT FOUND');
    }
    
    console.log('\nContent Type Published:', contentType.sys.publishedVersion ? 'YES' : 'NO');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkFields();
