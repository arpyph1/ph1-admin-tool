import { promises as fs } from 'fs';
import path from 'path';

// Store backups in a temporary location
const BACKUP_DIR = path.join(process.cwd(), '.backups');

export async function POST(request: Request) {
  try {
    const { backupId } = await request.json();
    
    // Read the backup manifest
    const manifestPath = path.join(BACKUP_DIR, backupId, 'manifest.json');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
    
    // Restore each file from backup
    const results = [];
    for (const backup of manifest.files) {
      try {
        const backupPath = path.join(BACKUP_DIR, backupId, backup.file);
        const originalPath = path.join(process.cwd(), backup.file);
        
        const backupContent = await fs.readFile(backupPath, 'utf-8');
        await fs.writeFile(originalPath, backupContent, 'utf-8');
        
        results.push({
          file: backup.file,
          success: true,
          message: 'Restored successfully'
        });
      } catch (error) {
        results.push({
          file: backup.file,
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return Response.json({
      success: true,
      message: 'All files restored from backup',
      results
    });
    
  } catch (error) {
    console.error('Error rolling back changes:', error);
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
