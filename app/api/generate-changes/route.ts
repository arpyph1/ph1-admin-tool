import { promises as fs } from 'fs';

export async function POST(request: Request) {
  try {
    const { prompt, targetFiles } = await request.json();
    
    // Read the content of target files
    const filesWithContent = await Promise.all(
      targetFiles.map(async (file: any) => {
        try {
          const content = await fs.readFile(file.path, 'utf-8');
          return { ...file, content };
        } catch (error: any) {
          return { ...file, content: null, error: 'Could not read file' };
        }
      })
    );
    
    // Filter out admin files - we never want to modify the admin panel itself
    let relevantFiles = filesWithContent.filter(f => 
      !f.relativePath.includes('app/admin/') && f.content
    );
    
    console.log('After removing admin files:', relevantFiles.map(f => f.relativePath));
    
    // If prompt mentions footer and a specific year/text, find files with that exact text
    if (prompt.toLowerCase().includes('footer')) {
      // Look for files containing copyright-like text
      const footerFiles = relevantFiles.filter(f => 
        f.content.includes('© ') || 
        f.content.toLowerCase().includes('footer') ||
        f.content.includes('copyright')
      );
      
      if (footerFiles.length > 0) {
        relevantFiles = footerFiles;
      }
    }
    
    // If prompt mentions specific year to change, filter to files with that year
    const yearMatch = prompt.match(/202\d/);
    if (yearMatch) {
      const year = yearMatch[0];
      const yearFiles = relevantFiles.filter(f => f.content.includes(year));
      
      if (yearFiles.length > 0) {
        relevantFiles = yearFiles;
      }
    }
    
    console.log('Final relevant files:', relevantFiles.map(f => f.relativePath));
    
    if (relevantFiles.length === 0) {
      return Response.json({
        success: false,
        error: 'Could not find any files matching your request in public-facing pages.'
      });
    }
    
    // Send to AI for analysis and change generation
    const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 8000,
        messages: [{
          role: 'user',
          content: `You are a code modification expert. Analyze these PUBLIC WEBSITE files and generate specific code changes.

USER REQUEST:
${prompt}

PUBLIC WEBSITE FILES TO ANALYZE:
${relevantFiles.map(f => `
FILE: ${f.relativePath}
CONTENT:
${f.content}
---
`).join('\n')}

Generate specific code changes as JSON:
{
  "summary": "What will change on the live website that visitors see",
  "changes": [
    {
      "file": "relative/path/to/file.tsx",
      "description": "What this does on the public website",
      "visualImpact": "What visitors will see when they visit the site",
      "technicalDetail": "Technical explanation",
      "type": "modify",
      "original": "Multi-line exact code to find (include 5-10 lines for context)",
      "replacement": "Multi-line code to replace it with",
      "confidence": "high",
      "reasoning": "Why this change achieves the user's goal"
    }
  ],
  "warnings": [],
  "expectedOutcome": "What to check on the live website after applying"
}

CRITICAL:
1. NEVER modify files in app/admin/ 
2. Only modify files shown above
3. "original" MUST be 5-10 lines with surrounding context
4. "original" MUST match file content EXACTLY (same whitespace)
5. Focus on PUBLIC WEBSITE changes visitors will see

Example of GOOD multi-line "original":
            <div className="text-sm text-gray-400">
              <div className="mb-4">© PH1 Research 2026</div>
              <a href="/privacy" className="hover:underline">Privacy Policy</a>
            </div>

Return ONLY raw JSON, no markdown.`,
        }],
      }),
    });

    const aiResult = await aiResponse.json();
    let generatedText = aiResult.content[0].text;
    
    generatedText = generatedText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    const changes = JSON.parse(generatedText);

    return Response.json({
      success: true,
      ...changes
    });

  } catch (error: any) {
    console.error('Error generating changes:', error);
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
