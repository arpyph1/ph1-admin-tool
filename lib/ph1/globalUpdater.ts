import fs from 'fs'
import path from 'path'

export function findAndReplace(findText: string, replaceText: string, scope: 'all' | string[]) {
  const results: any[] = []
  const appDir = path.join(process.cwd(), 'app')
  
  function processFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const regex = new RegExp(findText, 'g')
    const matches = content.match(regex)
    
    if (matches) {
      const newContent = content.replace(regex, replaceText)
      fs.writeFileSync(filePath, newContent)
      results.push({
        file: filePath.replace(process.cwd(), ''),
        changes: matches.length
      })
    }
  }
  
  function scanDirectory(dir: string) {
    const items = fs.readdirSync(dir)
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDirectory(fullPath)
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        processFile(fullPath)
      }
    }
  }
  
  scanDirectory(appDir)
  
  return {
    success: true,
    filesModified: results.length,
    totalReplacements: results.reduce((sum, r) => sum + r.changes, 0),
    details: results
  }
}
