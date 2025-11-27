import { promises as fs } from 'fs';
import path from 'path';

// Force dynamic to prevent build-time pre-rendering
export const dynamic = 'force-dynamic';

const REPO_PATH = process.env.REPO_PATH || path.join(process.cwd(), '../ph1-live');

async function getAllTemplates(dir: string, baseDir: string = dir): Promise<any[]> {
  const files: any[] = [];
  const items = await fs.readdir(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.name.startsWith('.') || item.name === 'node_modules') continue;
    
    if (item.isDirectory()) {
      files.push(...await getAllTemplates(fullPath, baseDir));
    } else if (item.name.endsWith('.sst') || item.name.endsWith('.html')) {
      files.push({
        path: path.relative(baseDir, fullPath),
        name: item.name,
        dir: path.dirname(path.relative(baseDir, fullPath))
      });
    }
  }
  return files;
}

export async function GET() {
  const files = await getAllTemplates(REPO_PATH);
  return Response.json({ success: true, files });
}
