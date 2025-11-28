import { promises as fs } from 'fs';
import path from 'path';

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const BACKUP_DIR = path.join(process.cwd(), '.backups');

async function ensureBackupDir() {
  try {
    await fs.access(BACKUP_DIR);
  } catch {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  }
}

export async function POST(request: Request) {
  try {
    const { searchText, replacementText, entries } = await request.json();
    
    await ensureBackupDir();
    
    const backupId = `contentful-backup-${Date.now()}`;
    const backupPath = path.join(BACKUP_DIR, backupId);
    await fs.mkdir(backupPath, { recursive: true });

    const results = [];
    let totalReplacements = 0;

    for (const entry of entries) {
      try {
        // Fetch full entry
        const fetchResponse = await fetch(
          `https://api.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master/entries/${entry.entryId}`,
          {
            headers: {
              'Authorization': `Bearer ${CONTENTFUL_MANAGEMENT_TOKEN}`,
              'Content-Type': 'application/json',
            }
          }
        );

        const entryData = await fetchResponse.json();
        
        // Backup original
        await fs.writeFile(
          path.join(backupPath, `${entry.entryId}.json`),
          JSON.stringify(entryData, null, 2),
          'utf-8'
        );

        // Apply replacements
        let replacements = 0;
        entry.matches.forEach((match: any) => {
          const fieldValue = entryData.fields[match.fieldKey][match.locale];
          const newValue = fieldValue.replaceAll(searchText, replacementText);
          
          if (newValue !== fieldValue) {
            entryData.fields[match.fieldKey][match.locale] = newValue;
            replacements++;
          }
        });

        // Update entry in Contentful
        const updateResponse = await fetch(
          `https://api.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master/entries/${entry.entryId}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${CONTENTFUL_MANAGEMENT_TOKEN}`,
              'Content-Type': 'application/vnd.contentful.management.v1+json',
              'X-Contentful-Version': entry.version.toString()
            },
            body: JSON.stringify(entryData)
          }
        );

        if (updateResponse.ok) {
          // Publish the updated entry
          const updatedEntry = await updateResponse.json();
          await fetch(
            `https://api.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master/entries/${entry.entryId}/published`,
            {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${CONTENTFUL_MANAGEMENT_TOKEN}`,
                'Content-Type': 'application/vnd.contentful.management.v1+json',
                'X-Contentful-Version': updatedEntry.sys.version.toString()
              }
            }
          );

          totalReplacements += replacements;
          results.push({
            entryId: entry.entryId,
            entryName: entry.entryName,
            success: true,
            replacements
          });
        } else {
          results.push({
            entryId: entry.entryId,
            entryName: entry.entryName,
            success: false,
            error: 'Failed to update'
          });
        }

      } catch (error) {
        results.push({
          entryId: entry.entryId,
          entryName: entry.entryName,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Save manifest
    const manifest = {
      timestamp: new Date().toISOString(),
      searchText,
      replacementText,
      entries: results,
      totalReplacements
    };

    await fs.writeFile(
      path.join(backupPath, 'manifest.json'),
      JSON.stringify(manifest, null, 2),
      'utf-8'
    );

    return Response.json({
      success: true,
      message: 'Changes applied successfully',
      entriesModified: results.filter(r => r.success && r.replacements > 0).length,
      totalReplacements,
      backupId,
      backupPath: `.backups/${backupId}`,
      results
    });

  } catch (error) {
    console.error('Error replacing in Contentful:', error);
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
