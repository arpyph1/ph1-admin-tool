require('dotenv').config({ path: '.env.local' });
const https = require('https');

const token = process.env.CONTENTFUL_DELIVERY_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN;
const spaceId = process.env.CONTENTFUL_SPACE_ID;

https.get(`https://cdn.contentful.com/spaces/${spaceId}/environments/master/content_types?access_token=${token}`, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log('Available Content Types:');
    json.items.forEach(item => {
      console.log(`  - ${item.sys.id} (${item.name})`);
    });
  });
});
