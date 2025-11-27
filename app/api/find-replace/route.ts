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
    const { searchText, replacementText, files } = await request.json();
    
    console.log('=== FIND & REPLACE ===');
    console.log('Search:', searchText);
    console.log('Replace:', replacementText);
    console.log('Files:', files.length);
    
    await ensureBackupDir();
    
    const backupId = `backup-${Date.now()}`;
    const backupPath = path.join(BACKUP_DIR, backupId);
    await fs.mkdir(backupPath, { recursive: true });
    
    let totalReplacements = 0;
    const results = [];
    
    // Backup and modify each file
    for (const relativePath of files) {
      try {
        const filePath = path.join(process.cwd(), relativePath);
        console.log('\nProcessing:', relativePath);
        
        // Read original content
        const originalContent = await fs.readFile(filePath, 'utf-8');
        
        // Backup
        const backupFilePath = path.join(backupPath, relativePath);
        await fs.mkdir(path.dirname(backupFilePath), { recursive: true });
        await fs.writeFile(backupFilePath, originalContent, 'utf-8');
        console.log('✓ Backed up');
        
        // Count replacements
        const matches = (originalContent.match(new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        
        // Replace
        const newContent = originalContent.split(searchText).join(replacementText);
        
        if (newContent !== originalContent) {
          await fs.writeFile(filePath, newContent, 'utf-8');
          totalReplacements += matches;
          console.log(`✓ Replaced ${matches} instance(s)`);
          
          results.push({
            file: relativePath,
            success: true,
            replacements: matches
          });
        } else {
          console.log('⚠ No changes needed');
          results.push({
            file: relativePath,
            success: true,
            replacements: 0
          });
        }
        
      } catch (error: any) {
        console.error('✗ Error:', error);
        results.push({
          file: relativePath,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    // Save backup manifest
    const manifest = {
      timestamp: new Date().toISOString(),
      searchText,
      replacementText,
      files: results,
      totalReplacements
    };
    
    await fs.writeFile(
      path.join(backupPath, 'manifest.json'),
      JSON.stringify(manifest, null, 2),
      'utf-8'
    );
    
    console.log('\n=== SUMMARY ===');
    console.log('Total replacements:', totalReplacements);
    console.log('Files modified:', results.filter(r => r.success && (r.replacements ?? 0) > 0).length);

    return Response.json({
      success: true,
      message: 'Changes applied successfully',
      filesModified: results.filter(r => r.success && (r.replacements ?? 0) > 0).length,
      totalReplacements,
      backupId,
      backupPath: `.backups/${backupId}`,
      results
    });

  } catch (error: any) {
    console.error('Error applying find-replace:', error);
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
