import { createClient } from 'contentful-management';

const client = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!
});

async function migrateHomepage() {
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
  const environment = await space.getEnvironment('master');

  console.log('Creating homepage sections...');

  // Create Hero Section
  const heroSection = await environment.createEntry('section', {
    fields: {
      type: { 'en-US': 'hero' },
      content: {
        'en-US': {
          heading: 'Mapping the future of your business & product',
          subheading: 'We pinpoint what your customers and stakeholders want before mapping & testing a new vision for your products and services. Our clients include product teams prototyping improvements, as well as organizational leadership seeking to define and validate strategic futures.',
          ctaText: 'Get started',
          ctaLink: '#contact'
        }
      }
    }
  });
  await heroSection.publish();
  console.log('✅ Hero section created');

  // Create Work Section
  const workSection = await environment.createEntry('section', {
    fields: {
      type: { 'en-US': 'work' },
      content: {
        'en-US': {
          heading: 'Our Work',
          work: [
            {name: 'Spotify', desc: 'Build the next generation of Spotify for Artists creator platform & analytics', img: 'Spotify_For_Artists_carousel_image.png', logo: 'Spotify_Logo_RGB_White.png'},
            {name: 'TWN', desc: 'Leverage GenAI to disrupt the weather app category', img: 'Screenshot_2024-12-05_at_1.55.11_PM.png', logo: 'twn_logo_white_square.png'},
            {name: 'Bell', desc: 'Define future retail opportunities for telecom stores in 2030', img: 'Future_of_retail_image1.jpeg', logo: 'Bell_White_small_transparent.png'},
            {name: 'Mozilla', desc: 'Become the most trusted security product suite by households internationally', img: 'Mozilla_VPN_image.png', logo: 'moz-logo-1color-white-rgb.png'},
            {name: 'NFL', desc: 'Research and launch the most exciting NFT project in sports', img: '1354725238.0.jpg', logo: 'Frame_79__1_.svg'}
          ]
        }
      }
    }
  });
  await workSection.publish();
  console.log('✅ Work section created');

  // Create Clients Section
  const clientsSection = await environment.createEntry('section', {
    fields: {
      type: { 'en-US': 'clients' },
      content: {
        'en-US': {
          heading: 'Our clients',
          clients: [
            {name: 'Spotify', logo: 'Spotify_logo.png'},
            {name: 'Microsoft', logo: 'microsoft_grey_logo.png'},
            {name: 'Mozilla', logo: 'Mozilla_Corporation-Logo.wine.png'},
            {name: 'TWN', logo: 'TWN_logo.png'},
            {name: 'Dapper Labs', logo: 'dapperlabs.png'},
            {name: 'TELUS', logo: 'Telus-Color.png'},
            {name: 'NFL', logo: 'nfl_logo.png'},
            {name: 'Indigo', logo: 'Indigo-Color.png'},
            {name: 'Dell', logo: 'DELL_LOGO.png'},
            {name: 'BC Ferries', logo: 'BC_Ferries_logo.png'},
            {name: 'New Relic', logo: 'new_relic_logo.png'},
            {name: 'UFC', logo: 'ufc.png'},
            {name: 'Vancity', logo: 'vancity_logo.png'},
            {name: 'Canada', logo: 'GovCanada-Color.png'}
          ]
        }
      }
    }
  });
  await clientsSection.publish();
  console.log('✅ Clients section created');

  // Create Homepage
  const homepage = await environment.createEntry('page', {
    fields: {
      slug: { 'en-US': 'home' },
      title: { 'en-US': 'PH1 - Product & Strategy Consultancy' },
      sections: {
        'en-US': [
          { sys: { type: 'Link', linkType: 'Entry', id: heroSection.sys.id } },
          { sys: { type: 'Link', linkType: 'Entry', id: workSection.sys.id } },
          { sys: { type: 'Link', linkType: 'Entry', id: clientsSection.sys.id } }
        ]
      },
      seoTitle: { 'en-US': 'PH1 - Enterprise Product & Strategy Consulting' },
      seoDescription: { 'en-US': '20+ years helping Fortune 500 companies with product strategy, UX research, and digital transformation.' }
    }
  });
  await homepage.publish();
  console.log('✅ Homepage created');

  console.log('\n🎉 Homepage migrated to Contentful successfully!');
  console.log('Homepage ID:', homepage.sys.id);
}

migrateHomepage().catch(console.error);
