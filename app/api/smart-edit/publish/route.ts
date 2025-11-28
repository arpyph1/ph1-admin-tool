import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const REPO_PATH = process.env.REPO_PATH || path.join(process.cwd(), '../ph1-live');

export async function POST(request: Request) {
  try {
    const { previews } = await request.json();

    // Write all changes
    for (const preview of previews) {
      const filePath = path.join(REPO_PATH, preview.filePath);
      await fs.writeFile(filePath, preview.fullAfter, 'utf-8');
    }

    // Git commit and push
    const fileList = previews.map((p: any) => path.basename(p.filePath)).join(', ');
    const commitMessage = `Smart edit: ${previews[0].explanation} (${fileList})`;

    await execAsync(`cd "${REPO_PATH}" && git add .`);
    await execAsync(`cd "${REPO_PATH}" && git commit -m "${commitMessage}"`);
    await execAsync(`cd "${REPO_PATH}" && git push`);

    // Log to unified changelog
    await fetch('http://localhost:3000/api/changelog-unified', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool: 'smart-edit',
        type: 'Smart Page Edit',
        description: previews[0].explanation,
        filesChanged: previews.map((p: any) => p.filePath),
        commitHash: '(pending)',
        canRollback: true
      })
    });

    return Response.json({
      success: true,
      message: 'Changes published and deployed',
      filesChanged: previews.length
    });
  } catch (error) {
    console.error('Publish error:', error);
    return Response.json(
      { success: false, error: 'Publish failed: ' + error },
      { status: 500 }
    );
  }
}
