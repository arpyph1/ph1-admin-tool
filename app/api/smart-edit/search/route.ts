import { promises as fs } from 'fs';
import path from 'path';

const REPO_PATH = process.env.REPO_PATH || path.join(process.cwd(), '../ph1-live');

async function findIncludedBy(filePath: string): Promise<string[]> {
  // Find which templates include this file
  const includers: string[] = [];
  const searchPattern = path.basename(filePath);
  
  async function searchDir(dir: string) {
    const items = await fs.readdir(dir, { withFileTypes: true });
    for (const item of items) {
      if (item.name.startsWith('.') || item.name === 'node_modules') continue;
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        await searchDir(fullPath);
      } else if (item.name.endsWith('.sst') || item.name.endsWith('.html')) {
        const content = await fs.readFile(fullPath, 'utf-8');
        if (content.includes(searchPattern)) {
          includers.push(path.relative(REPO_PATH, fullPath));
        }
      }
    }
  }
  
  await searchDir(REPO_PATH);
  return includers;
}

function getPageUrl(filePath: string): string {
  // Convert file path to likely URL
  if (filePath.includes('/homev2/')) return '/';
  if (filePath.includes('/about/')) return '/about';
  if (filePath.includes('/service/')) return '/service/*';
  if (filePath.includes('/contact/')) return '/contact';
  
  const parts = filePath.split('/');
  const folder = parts.find(p => ['service', 'about', 'contact', 'team'].includes(p));
  return folder ? `/${folder}` : '/';
}

async function analyzeTemplate(filePath: string): Promise<string> {
  // Analyze what the template does
  const content = await fs.readFile(path.join(REPO_PATH, filePath), 'utf-8');
  
  if (content.includes('section-clients')) return 'Displays client logos section';
  if (content.includes('section-hero')) return 'Hero/header section';
  if (content.includes('section-services')) return 'Services listing';
  if (content.includes('team-member')) return 'Team members display';
  if (content.includes('case-study')) return 'Case study content';
  
  return 'Template content section';
}

async function searchInFile(filePath: string, query: string): Promise<any | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    if (!content.includes(query)) return null;

    const occurrences = (content.match(new RegExp(query, 'g')) || []).length;
    const index = content.indexOf(query);
    const start = Math.max(0, index - 200);
    const end = Math.min(content.length, index + query.length + 200);
    const context = content.substring(start, end);

    const relativePath = path.relative(REPO_PATH, filePath);
    const fileName = path.basename(filePath, path.extname(filePath));
    
    // Check if this is an included template
    const includedBy = await findIncludedBy(filePath);
    const pageUrl = await getPageUrl(relativePath);
    const purpose = await analyzeTemplate(relativePath);
    
    return {
      pageId: relativePath,
      filePath: relativePath,
      pageTitle: fileName.charAt(0).toUpperCase() + fileName.slice(1).replace(/-/g, ' '),
      pageUrl: pageUrl,
      context,
      occurrences,
      fullContent: content,
      isSharedTemplate: includedBy.length > 1,
      usedBy: includedBy,
      purpose,
      impactedPages: includedBy.length > 0 ? includedBy : [relativePath]
    };
  } catch (error: any) {
    return null;
  }
}

async function searchAllFiles(dir: string, query: string): Promise<any[]> {
  const results: any[] = [];
  
  try {
    const items = await fs.readdir(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.name.startsWith('.') || item.name === 'node_modules') continue;
      
      if (item.isDirectory()) {
        const subResults = await searchAllFiles(fullPath, query);
        results.push(...subResults);
      } else if (item.name.endsWith('.sst') || item.name.endsWith('.html')) {
        const result = await searchInFile(fullPath, query);
        if (result) results.push(result);
      }
    }
  } catch (error: any) {
    console.error('Error searching files:', error);
  }
  
  return results;
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    
    if (!query?.trim()) {
      return Response.json(
        { success: false, error: 'No search query provided' },
        { status: 400 }
      );
    }

    const results = await searchAllFiles(REPO_PATH, query);
    
    return Response.json({
      success: true,
      results,
      query
    });
  } catch (error: any) {
    console.error('Search error:', error);
    return Response.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}
