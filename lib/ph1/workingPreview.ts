import fs from 'fs'
import path from 'path'

export function generateWorkingPreview(pagePath: string, modifications: any) {
  // Read actual page
  const fullPath = path.join(process.cwd(), pagePath)
  let content = fs.readFileSync(fullPath, 'utf-8')
  
  // Extract JSX content
  const returnMatch = content.match(/return \(([\s\S]*?)\)(?:\s*})?$/m)
  let html = returnMatch ? returnMatch[1] : '<div>Error parsing page</div>'
  
  // Convert JSX to HTML
  html = html.replace(/className=/g, 'class=')
  html = html.replace(/\{`([^`]*)`\}/g, '$1')
  html = html.replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  
  const previewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PH1.ca Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; margin: 0; padding: 0; }
    .hero-gradient { background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); }
    .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  <!-- Preview Banner -->
  <div style="background: linear-gradient(90deg, #3b82f6, #8b5cf6); color: white; padding: 1rem; position: sticky; top: 0; z-index: 9999; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="max-width: 80rem; margin: 0 auto; display: flex; align-items: center; gap: 1rem;">
      <span style="font-size: 1.5rem;">🎨</span>
      <div>
        <div style="font-weight: 600;">LIVE PREVIEW MODE</div>
        <div style="font-size: 0.875rem; opacity: 0.9;">Viewing changes to: ${pagePath}</div>
      </div>
      <button onclick="window.close()" style="margin-left: auto; background: white; color: #3b82f6; border: none; padding: 0.5rem 1.5rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">
        Close Preview
      </button>
    </div>
  </div>

  <!-- Page Content -->
  ${html}
</body>
</html>`

  // Save preview
  const previewDir = path.join(process.cwd(), 'public/previews')
  if (!fs.existsSync(previewDir)) {
    fs.mkdirSync(previewDir, { recursive: true })
  }
  
  const filename = `preview-${Date.now()}.html`
  fs.writeFileSync(path.join(previewDir, filename), previewHtml)
  
  return `/previews/${filename}`
}
