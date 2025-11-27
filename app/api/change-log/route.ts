import { promises as fs } from 'fs';
import path from 'path';

const BACKUP_DIR = path.join(process.cwd(), '.backups');

export async function GET() {
  try {
    // Read all backup directories
    const backups = await fs.readdir(BACKUP_DIR);
    
    const changeLog = await Promise.all(
      backups
        .filter(name => name.startsWith('backup-'))
        .map(async (backupId) => {
          try {
            const manifestPath = path.join(BACKUP_DIR, backupId, 'manifest.json');
            const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
            
            return {
              id: backupId,
              timestamp: manifest.timestamp,
              searchText: manifest.searchText || 'N/A',
              replacementText: manifest.replacementText || 'N/A',
              filesModified: manifest.files?.filter((f: any) => f.success && f.replacements > 0).length || 0,
              totalReplacements: manifest.totalReplacements || 0,
            };
          } catch (error: any) {
            return null;
          }
        })
    );
    
    // Filter out nulls and sort by timestamp (newest first)
    const validChanges = changeLog
      .filter(c => c !== null)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return Response.json({
      success: true,
      changes: validChanges
    });
    
  } catch (error: any) {
    console.error('Error reading change log:', error);
    return Response.json({
      success: true,
      changes: []
    });
  }
}
