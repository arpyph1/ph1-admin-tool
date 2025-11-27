import { promises as fs } from 'fs';
import path from 'path';

// Force dynamic to prevent build-time pre-rendering
export const dynamic = 'force-dynamic';

const REPO_PATH = process.env.REPO_PATH || path.join(process.cwd(), '../ph1-live');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');
    
    if (!filePath) {
      return Response.json(
        { success: false, error: 'No file path provided' },
        { status: 400 }
      );
    }
    
    const fullPath = path.join(REPO_PATH, filePath);
    
    // Security check
    if (!fullPath.startsWith(REPO_PATH)) {
      return Response.json(
        { success: false, error: 'Invalid path' },
        { status: 403 }
      );
    }
    
    const content = await fs.readFile(fullPath, 'utf-8');
    
    return Response.json({
      success: true,
      content,
      path: filePath
    });
  } catch (error: any) {
    console.error('Read file error:', error);
    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
