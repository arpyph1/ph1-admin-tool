import { promises as fs } from 'fs';
import path from 'path';

const CHANGELOG_FILE = path.join(process.cwd(), '.changelog.json');

async function loadChangelog() {
  try {
    const data = await fs.readFile(CHANGELOG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { changes: [] };
  }
}

async function saveChangelog(data: any) {
  await fs.writeFile(CHANGELOG_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function POST(request: Request) {
  try {
    const change = await request.json();
    const changelog = await loadChangelog();
    
    changelog.changes.unshift({
      ...change,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    });
    
    // Keep last 100 changes
    if (changelog.changes.length > 100) {
      changelog.changes = changelog.changes.slice(0, 100);
    }
    
    await saveChangelog(changelog);
    
    return Response.json({ success: true });
  } catch (error: any) {
    console.error('Changelog error:', error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const changelog = await loadChangelog();
    return Response.json({ success: true, changes: changelog.changes });
  } catch (error: any) {
    return Response.json({ success: false, changes: [] });
  }
}
