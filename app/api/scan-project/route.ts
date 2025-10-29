import { promises as fs } from 'fs';
import path from 'path';

interface FileInfo {
  path: string;
  type: 'page' | 'component' | 'layout' | 'api';
  relativePath: string;
}

async function scanDirectory(dir: string, baseDir: string, files: FileInfo[] = []): Promise<FileInfo[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);
      
      // Skip node_modules, .next, .git
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') {
        continue;
      }
      
      if (entry.isDirectory()) {
        await scanDirectory(fullPath, baseDir, files);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        
        if (['.tsx', '.ts', '.jsx', '.js'].includes(ext)) {
          let type: FileInfo['type'] = 'component';
          
          if (relativePath.startsWith('app/') && entry.name === 'page.tsx') {
            type = 'page';
          } else if (entry.name === 'layout.tsx') {
            type = 'layout';
          } else if (relativePath.startsWith('app/api/')) {
            type = 'api';
          }
          
          files.push({
            path: fullPath,
            type,
            relativePath
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning ${dir}:`, error);
  }
  
  return files;
}

export async function GET() {
  try {
    const projectRoot = process.cwd();
    const files = await scanDirectory(projectRoot, projectRoot);
    
    const organized = {
      pages: files.filter(f => f.type === 'page'),
      layouts: files.filter(f => f.type === 'layout'),
      components: files.filter(f => f.type === 'component'),
      apis: files.filter(f => f.type === 'api'),
      total: files.length
    };
    
    return Response.json({
      success: true,
      ...organized
    });
    
  } catch (error) {
    console.error('Error scanning project:', error);
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
