import { promises as fs } from 'fs';
import path from 'path';

const BACKUP_DIR = path.join(process.cwd(), '.backups');

export async function GET() {
  try {
    // Read all backup directories
    const backups = await fs.readdir(BACKUP_DIR);
    
    const changes = [];
    
    for (const backup of backups) {
      const manifestPath = path.join(BACKUP_DIR, backup, 'manifest.json');
      try {
        const manifestData = await fs.readFile(manifestPath, 'utf-8');
        const manifest = JSON.parse(manifestData);
        changes.push({
          ...manifest,
          backupId: backup
        });
      } catch (error) {
        // Skip if no manifest
      }
    }
    
    // Sort by timestamp, newest first
    changes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return Response.json({ success: true, changes });
  } catch (error) {
    console.error('Error loading changelog:', error);
    return Response.json({ success: true, changes: [] });
  }
}
