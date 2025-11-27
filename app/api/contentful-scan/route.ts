import { promises as fs } from 'fs';

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

export async function POST(request: Request) {
  try {
    const { searchText } = await request.json();
    
    if (!searchText?.trim()) {
      return Response.json({ success: false, error: 'Please provide text to search for' });
    }

    // Fetch all entries from Contentful
    const response = await fetch(
      `https://api.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master/entries?limit=1000`,
      {
        headers: {
          'Authorization': `Bearer ${CONTENTFUL_MANAGEMENT_TOKEN}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const data = await response.json();
    const matches: any[] = [];

    // Search through all entries
    data.items.forEach((entry: any) => {
      const entryMatches: any[] = [];
      const fields = entry.fields;

      Object.keys(fields).forEach(fieldKey => {
        const fieldValue = fields[fieldKey];
        
        // Check all locales
        Object.keys(fieldValue).forEach(locale => {
          const value = fieldValue[locale];
          
          if (typeof value === 'string' && value.includes(searchText)) {
            entryMatches.push({
              fieldKey,
              locale,
              originalValue: value,
              preview: value.substring(
                Math.max(0, value.indexOf(searchText) - 50),
                Math.min(value.length, value.indexOf(searchText) + searchText.length + 50)
              )
            });
          }
        });
      });

      if (entryMatches.length > 0) {
        matches.push({
          entryId: entry.sys.id,
          contentType: entry.sys.contentType.sys.id,
          entryName: fields.name?.['en-US'] || fields.title?.['en-US'] || entry.sys.id,
          matches: entryMatches,
          version: entry.sys.version
        });
      }
    });

    return Response.json({
      success: true,
      searchText,
      totalEntries: matches.length,
      totalMatches: matches.reduce((sum, e) => sum + e.matches.length, 0),
      entries: matches
    });

  } catch (error: any) {
    console.error('Error scanning Contentful:', error);
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
