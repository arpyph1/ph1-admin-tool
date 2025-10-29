import { promises as fs } from 'fs';
import path from 'path';

interface FileMatch {
  path: string;
  relativePath: string;
  matches: {
    line: number;
    content: string;
    context: string;
  }[];
}

async function scanDirectory(dir: string, baseDir: string, searchText: string, files: FileMatch[] = []): Promise<FileMatch[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);
      
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git' || relativePath.startsWith('.backups')) {
        continue;
      }
      
      if (entry.isDirectory()) {
        await scanDirectory(fullPath, baseDir, searchText, files);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        
        if (['.tsx', '.ts', '.jsx', '.js'].includes(ext) && !relativePath.includes('app/admin/')) {
          try {
            const content = await fs.readFile(fullPath, 'utf-8');
            const lines = content.split('\n');
            const matches: FileMatch['matches'] = [];
            
            lines.forEach((line, index) => {
              if (line.includes(searchText)) {
                // Get context (3 lines before and after)
                const start = Math.max(0, index - 3);
                const end = Math.min(lines.length, index + 4);
                const context = lines.slice(start, end).join('\n');
                
                matches.push({
                  line: index + 1,
                  content: line.trim(),
                  context
                });
              }
            });
            
            if (matches.length > 0) {
              files.push({
                path: fullPath,
                relativePath,
                matches
              });
            }
          } catch (error) {
            // Skip files we can't read
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning ${dir}:`, error);
  }
  
  return files;
}

export async function POST(request: Request) {
  try {
    const { searchText } = await request.json();
    
    if (!searchText || searchText.trim().length === 0) {
      return Response.json({
        success: false,
        error: 'Please provide text to search for'
      });
    }
    
    const projectRoot = process.cwd();
    const matches = await scanDirectory(projectRoot, projectRoot, searchText);
    
    return Response.json({
      success: true,
      searchText,
      totalFiles: matches.length,
      totalMatches: matches.reduce((sum, f) => sum + f.matches.length, 0),
      files: matches
    });
    
  } catch (error) {
    console.error('Error scanning:', error);
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
