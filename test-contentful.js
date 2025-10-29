const contentful = require('contentful');

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

async function test() {
  console.log('Testing Contentful connection...\n');
  
  // Try to get case studies
  try {
    const caseStudies = await client.getEntries({ content_type: 'caseStudy', limit: 5 });
    console.log('✅ Case Studies found:', caseStudies.items.length);
    if (caseStudies.items.length > 0) {
      console.log('First case study:', caseStudies.items[0].fields.title);
    }
  } catch (e) {
    console.log('❌ Case Studies error:', e.message);
  }
  
  // Try to get blog posts
  try {
    const blogs = await client.getEntries({ content_type: 'blogPost', limit: 5 });
    console.log('✅ Blog Posts found:', blogs.items.length);
    if (blogs.items.length > 0) {
      console.log('First blog:', blogs.items[0].fields.title);
    }
  } catch (e) {
    console.log('❌ Blog Posts error:', e.message);
  }
  
  // List all content types
  try {
    const types = await client.getContentTypes();
    console.log('\n📋 All available content types:');
    types.items.forEach(t => {
      console.log(`  - ${t.sys.id} (${t.name})`);
    });
  } catch (e) {
    console.log('❌ Content types error:', e.message);
  }
}

test();
