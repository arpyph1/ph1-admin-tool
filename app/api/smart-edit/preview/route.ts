import { promises as fs } from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';

const REPO_PATH = process.env.REPO_PATH || path.join(process.cwd(), '../ph1-live');
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const { pages, instructions, searchQuery } = await request.json();
    const previews = [];

    for (const pageId of pages) {
      const filePath = path.join(REPO_PATH, pageId);
      const content = await fs.readFile(filePath, 'utf-8');

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 16000,
        messages: [{
          role: 'user',
          content: `You are editing a website template file for PH1 Research, a UX consultancy.

USER SEARCHED FOR: "${searchQuery}"
USER'S INSTRUCTION: ${instructions}

FILE PATH: ${pageId}
FILE PURPOSE: ${pageId.includes('templates/') ? 'This is a SHARED template included by multiple pages' : 'This is a standalone page template'}

COMPLETE FILE CONTENT:
${content}

YOUR TASK:
1. Make ONLY the changes the user requested
2. Be precise - if they say "remove duplicate", identify which occurrence is the duplicate
3. If this is a shared template, consider it affects multiple pages
4. Preserve all other content exactly

RESPOND WITH:
<edited_file>
[complete edited file - all lines]
</edited_file>

<explanation>
[1-2 sentences explaining what you changed and WHY you chose that specific change]
</explanation>

<before_section>
[30 lines showing the section BEFORE changes - enough context to understand what changed]
</before_section>

<after_section>
[30 lines showing the section AFTER changes]
</after_section>`
        }]
      });

      const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
      
      const editedMatch = responseText.match(/<edited_file>([\s\S]*?)<\/edited_file>/);
      const explanationMatch = responseText.match(/<explanation>([\s\S]*?)<\/explanation>/);
      const beforeMatch = responseText.match(/<before_section>([\s\S]*?)<\/before_section>/);
      const afterMatch = responseText.match(/<after_section>([\s\S]*?)<\/after_section>/);

      const editedContent = editedMatch ? editedMatch[1].trim() : content;
      const explanation = explanationMatch ? explanationMatch[1].trim() : 'Changes applied';
      const beforeSection = beforeMatch ? beforeMatch[1].trim() : '';
      const afterSection = afterMatch ? afterMatch[1].trim() : '';

      previews.push({
        pageId,
        pageTitle: path.basename(pageId, path.extname(pageId)),
        pageUrl: pageId.includes('/service/') ? '/service/*' : '/' + path.basename(pageId, path.extname(pageId)),
        before: beforeSection,
        after: afterSection,
        fullBefore: content,
        fullAfter: editedContent,
        explanation,
        filePath: pageId,
        isShared: pageId.includes('/templates/')
      });
    }

    return Response.json({ success: true, previews });
  } catch (error) {
    console.error('Preview error:', error);
    return Response.json(
      { success: false, error: 'Preview generation failed: ' + error },
      { status: 500 }
    );
  }
}
