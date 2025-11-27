import { promises as fs } from 'fs';
import path from 'path';

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
    const { changes } = await request.json();
    
    console.log('=== APPLYING CHANGES ===');
    console.log('Number of changes:', changes.length);
    
    await ensureBackupDir();
    
    const backupId = `backup-${Date.now()}`;
    const backupPath = path.join(BACKUP_DIR, backupId);
    await fs.mkdir(backupPath, { recursive: true });
    
    const results = [];
    const backupManifest: any = {
      timestamp: new Date().toISOString(),
      files: []
    };
    
    // Backup all files
    for (const change of changes) {
      try {
        const filePath = path.join(process.cwd(), change.file);
        console.log('Backing up:', filePath);
        const originalContent = await fs.readFile(filePath, 'utf-8');
        
        const backupFilePath = path.join(backupPath, change.file);
        await fs.mkdir(path.dirname(backupFilePath), { recursive: true });
        await fs.writeFile(backupFilePath, originalContent, 'utf-8');
        
        backupManifest.files.push({
          file: change.file,
          originalSize: originalContent.length
        });
        console.log('✓ Backed up:', change.file);
      } catch (error: any) {
        console.error(`✗ Error backing up ${change.file}:`, error);
      }
    }
    
    await fs.writeFile(
      path.join(backupPath, 'manifest.json'),
      JSON.stringify(backupManifest, null, 2),
      'utf-8'
    );
    
    // Apply changes
    for (const change of changes) {
      try {
        const filePath = path.join(process.cwd(), change.file);
        console.log('\n=== Processing change ===');
        console.log('File:', change.file);
        console.log('Type:', change.type);
        
        let content = await fs.readFile(filePath, 'utf-8');
        console.log('File size:', content.length, 'characters');
        
        if (change.type === 'modify') {
          console.log('Looking for original text:', change.original.substring(0, 100) + '...');
          
          if (content.includes(change.original)) {
            content = content.replace(change.original, change.replacement);
            await fs.writeFile(filePath, content, 'utf-8');
            console.log('✓ Successfully modified');
            results.push({
              file: change.file,
              success: true,
              message: 'Successfully modified'
            });
          } else {
            console.log('✗ Original code not found in file');
            console.log('File contains:', content.substring(0, 500));
            results.push({
              file: change.file,
              success: false,
              message: 'Original code not found in file - the AI may have misidentified the exact text'
            });
          }
        } else if (change.type === 'add') {
          const lines = content.split('\n');
          lines.splice(change.lineNumber, 0, change.replacement);
          content = lines.join('\n');
          await fs.writeFile(filePath, content, 'utf-8');
          console.log('✓ Successfully added code');
          results.push({
            file: change.file,
            success: true,
            message: 'Successfully added code'
          });
        } else if (change.type === 'remove') {
          content = content.replace(change.original, '');
          await fs.writeFile(filePath, content, 'utf-8');
          console.log('✓ Successfully removed code');
          results.push({
            file: change.file,
            success: true,
            message: 'Successfully removed code'
          });
        }
        
      } catch (error: any) {
        console.error('✗ Error processing change:', error);
        results.push({
          file: change.file,
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    console.log('\n=== SUMMARY ===');
    console.log('Total changes:', results.length);
    console.log('Successful:', results.filter(r => r.success).length);
    console.log('Failed:', results.filter(r => !r.success).length);
    
    const failed = results.filter(r => !r.success);
    
    if (failed.length > 0) {
      console.log('\nFailed changes:', failed);
      return Response.json({
        success: false,
        message: 'Some changes failed - backup preserved',
        results,
        backupId,
        failedChanges: failed
      });
    }
    
    return Response.json({
      success: true,
      message: 'All changes applied successfully',
      results,
      backupId,
      backupPath: `.backups/${backupId}`
    });

  } catch (error: any) {
    console.error('Error applying changes:', error);
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
