import fs from 'fs'
import path from 'path'

export interface PageComponent {
  id: string
  type: string
  lineStart: number
  lineEnd: number
  content: Record<string, any>
  editable: string[]
  code: string
}

export interface ParsedPage {
  path: string
  title: string
  components: PageComponent[]
  rawCode: string
}

export function parsePageFile(filePath: string): ParsedPage {
  const code = fs.readFileSync(filePath, 'utf-8')
  const lines = code.split('\n')
  
  const components: PageComponent[] = []
  let componentId = 0
  
  // Detect sections by looking for semantic HTML elements
  let currentSection: { start: number, type: string, lines: string[] } | null = null
  
  lines.forEach((line, index) => {
    // Hero detection
    if (line.includes('className="hero"') || line.includes('section className="hero')) {
      currentSection = { start: index, type: 'hero', lines: [] }
    }
    
    // Case study detection
    else if (line.includes('id="work"') || line.includes('case-study')) {
      currentSection = { start: index, type: 'caseStudy', lines: [] }
    }
    
    // Services detection
    else if (line.includes('services') && line.includes('grid')) {
      currentSection = { start: index, type: 'services', lines: [] }
    }
    
    // Testimonial detection
    else if (line.includes('testimonial')) {
      currentSection = { start: index, type: 'testimonial', lines: [] }
    }
    
    // Contact form detection
    else if (line.includes('id="contact"') || line.includes('<form')) {
      currentSection = { start: index, type: 'contactForm', lines: [] }
    }

    // Client logos detection
    else if (line.includes('client') && (line.includes('logo') || line.includes('Our clients'))) {
      currentSection = { start: index, type: 'clientLogos', lines: [] }
    }
    
    // Add lines to current section
    if (currentSection) {
      currentSection.lines.push(line)
      
      // End section on closing tag
      if (line.includes('</section>') || line.includes('</form>') || line.includes('</div>')) {
        // Check if this is actually the end of the section
        const openTags = currentSection.lines.join('').match(/<section|<form|<div/g)?.length || 0
        const closeTags = currentSection.lines.join('').match(/<\/section>|<\/form>|<\/div>/g)?.length || 0
        
        if (closeTags >= openTags) {
          const sectionCode = currentSection.lines.join('\n')
          
          components.push({
            id: `component-${componentId++}`,
            type: currentSection.type,
            lineStart: currentSection.start,
            lineEnd: index,
            content: extractContent(sectionCode, currentSection.type),
            editable: getEditableFields(currentSection.type),
            code: sectionCode
          })
          
          currentSection = null
        }
      }
    }
  })
  
  return {
    path: filePath,
    title: extractTitle(code),
    components,
    rawCode: code
  }
}

function extractContent(code: string, type: string): Record<string, any> {
  const content: Record<string, any> = {}
  
  // Extract based on component type
  if (type === 'hero') {
    const h1Match = code.match(/<h1[^>]*>(.*?)<\/h1>/s)
    const h2Match = code.match(/<h2[^>]*>(.*?)<\/h2>/s)
    const ctaMatch = code.match(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/s)
    
    if (h1Match) content.headline = h1Match[1].trim()
    if (h2Match) content.subheadline = h2Match[1].trim()
    if (ctaMatch) {
      content.ctaUrl = ctaMatch[1]
      content.cta = ctaMatch[2].trim()
    }
  }
  
  else if (type === 'contactForm') {
    const titleMatch = code.match(/<h3[^>]*>(.*?)<\/h3>/s)
    if (titleMatch) content.title = titleMatch[1].trim()
    content.fields = ['firstName', 'lastName', 'company', 'email', 'message']
    content.submitText = 'Submit'
  }

  else if (type === 'caseStudy') {
    const titleMatch = code.match(/<h3[^>]*>(.*?)<\/h3>/s)
    if (titleMatch) content.title = titleMatch[1].trim()
    content.items = 'Case studies detected'
  }

  else if (type === 'services') {
    content.items = 'Services detected'
  }

  else if (type === 'clientLogos') {
    content.logos = 'Client logos detected'
  }
  
  return content
}

function getEditableFields(type: string): string[] {
  const fieldMap: Record<string, string[]> = {
    hero: ['headline', 'subheadline', 'cta', 'ctaUrl'],
    testimonial: ['quote', 'author', 'company'],
    services: ['items'],
    caseStudy: ['title', 'description', 'image'],
    contactForm: ['title', 'fields', 'submitText'],
    clientLogos: ['logos']
  }
  
  return fieldMap[type] || []
}

function extractTitle(code: string): string {
  // Try to extract from metadata or first h1
  const h1Match = code.match(/<h1[^>]*>(.*?)<\/h1>/)
  return h1Match ? h1Match[1].substring(0, 50) : 'Untitled Page'
}

export function getAllPages(): string[] {
  const appDir = path.join(process.cwd(), 'app')
  const pages: string[] = []
  
  function scanDir(dir: string) {
    try {
      const items = fs.readdirSync(dir)
      
      items.forEach(item => {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)
        
        if (stat.isDirectory() && !item.startsWith('_') && item !== 'api' && item !== 'admin') {
          scanDir(fullPath)
        } else if (item === 'page.tsx') {
          pages.push(fullPath)
        }
      })
    } catch (e) {
      // Skip directories we can't read
    }
  }
  
  scanDir(appDir)
  return pages
}
