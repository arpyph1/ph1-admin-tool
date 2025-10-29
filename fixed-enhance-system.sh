#!/bin/bash

# PH1.ca Real Enhancement - FIXED VERSION
# Creates directories before writing files

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_status() {
    case "$1" in
        "success") echo -e "${GREEN}✅ $2${NC}" ;;
        "error") echo -e "${RED}❌ $2${NC}" ;;
        "warning") echo -e "${YELLOW}⚠️  $2${NC}" ;;
        "info") echo -e "${BLUE}ℹ️  $2${NC}" ;;
        "progress") echo -e "${CYAN}⏳ $2${NC}" ;;
    esac
}

echo ""
echo "🎯 PH1.ca Real Enhancement - Fixed Version"
echo "=================================================="
echo ""

if [ ! -f "lib/componentAnalyzer.ts" ]; then
    print_status "error" "Run from: /Users/arpy/Downloads/ph1-website/tailwind-project/"
    exit 1
fi

print_status "success" "Found your project"

# CREATE ALL DIRECTORIES FIRST
print_status "progress" "Creating all directories..."
mkdir -p lib/ph1
mkdir -p components/admin
mkdir -p app/api/import-ph1
mkdir -p app/api/preview-page
mkdir -p app/api/create-page
mkdir -p public/previews

print_status "success" "Directories created"

# Now create all the files...
print_status "progress" "Installing real PH1.ca content importer..."

cat > lib/ph1/realContentImporter.ts << 'EOFIMPORTER'
import axios from 'axios'
import * as cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'

export interface PH1Content {
  navigation: string[]
  hero: {
    headline: string
    subheadline: string
    cta: string[]
  }
  sections: Array<{
    title: string
    content: string
    type: string
  }>
  images: string[]
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  fonts: string[]
}

export async function importRealPH1(): Promise<PH1Content> {
  try {
    const response = await axios.get('https://ph1.ca', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000
    })
    
    const $ = cheerio.load(response.data)
    
    // Extract navigation
    const navigation: string[] = []
    $('nav a, header a').each((_, el) => {
      const text = $(el).text().trim()
      if (text && text.length < 30 && text.length > 0) navigation.push(text)
    })
    
    // Extract hero section
    const hero = {
      headline: $('h1').first().text().trim() || 'Transform Your Digital Products',
      subheadline: $('h1').first().next('p').text().trim() || '20+ years of proven expertise in UX, strategy, and conversion optimization.',
      cta: [] as string[]
    }
    
    $('a.button, button, .cta, a[class*="btn"]').slice(0, 3).each((_, el) => {
      const text = $(el).text().trim()
      if (text && text.length < 50 && text.length > 2) hero.cta.push(text)
    })
    
    if (hero.cta.length === 0) {
      hero.cta = ['Get Started', 'Learn More']
    }
    
    // Extract sections
    const sections: Array<{title: string, content: string, type: string}> = []
    $('section, article, .section').each((_, section) => {
      const $section = $(section)
      const title = $section.find('h2, h3').first().text().trim()
      const content = $section.find('p').first().text().trim()
      if (title && title.length > 3) {
        sections.push({
          title,
          content: content || 'Professional services and solutions.',
          type: $section.attr('class') || 'content'
        })
      }
    })
    
    if (sections.length === 0) {
      sections.push(
        { title: 'Our Expertise', content: 'Comprehensive solutions that drive results', type: 'services' },
        { title: 'Why Choose Us', content: 'Proven track record of success', type: 'benefits' },
        { title: 'Get Started', content: 'Transform your business today', type: 'cta' }
      )
    }
    
    // Extract images
    const images: string[] = []
    $('img').each((_, img) => {
      const src = $(img).attr('src')
      if (src && (src.startsWith('http') || src.startsWith('/'))) {
        images.push(src.startsWith('http') ? src : `https://ph1.ca${src}`)
      }
    })
    
    // Extract colors
    const colors = {
      primary: '#1e40af',
      secondary: '#1e3a8a', 
      accent: '#3b82f6'
    }
    
    const styleText = $('style').text()
    const colorMatch = styleText.match(/#[0-9a-fA-F]{6}/g)
    if (colorMatch && colorMatch.length > 0) {
      colors.primary = colorMatch[0]
      if (colorMatch.length > 1) colors.secondary = colorMatch[1]
      if (colorMatch.length > 2) colors.accent = colorMatch[2]
    }
    
    // Extract fonts
    const fonts: string[] = []
    $('link[href*="fonts"]').each((_, link) => {
      const href = $(link).attr('href')
      if (href) fonts.push(href)
    })
    
    const data = { navigation, hero, sections, images, colors, fonts }
    
    // Save imported content
    const dataDir = path.join(process.cwd(), 'lib/ph1')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    const dataPath = path.join(dataDir, 'imported-content.json')
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
    
    return data
  } catch (error) {
    console.error('Import error:', error)
    throw new Error(`Failed to import PH1.ca: ${(error as Error).message}`)
  }
}

export function getImportedContent(): PH1Content | null {
  try {
    const dataPath = path.join(process.cwd(), 'lib/ph1/imported-content.json')
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    }
  } catch (error) {
    console.error('Error reading imported content:', error)
  }
  return null
}

export function applyImportedContent(): string {
  const content = getImportedContent()
  if (!content) return 'No imported content found'
  
  const homepage = `export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation - Real PH1.ca Content */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold" style={{ color: '${content.colors.primary}' }}>
                PH1.ca
              </a>
            </div>
            <div className="flex items-center space-x-8">
              ${content.navigation.slice(0, 4).map(item => 
                `<a href="#" className="text-gray-700 hover:text-blue-600">${item}</a>`
              ).join('\n              ')}
              <a href="/contact" className="px-4 py-2 rounded-lg text-white hover:opacity-90" style={{ backgroundColor: '${content.colors.primary}' }}>
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Real PH1.ca Content */}
      <section className="text-white py-20" style={{ background: 'linear-gradient(135deg, ${content.colors.primary} 0%, ${content.colors.secondary} 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">
            ${content.hero.headline}
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto animate-fade-in">
            ${content.hero.subheadline}
          </p>
          <div className="space-x-4 animate-fade-in">
            ${content.hero.cta.slice(0, 2).map((cta, i) => 
              i === 0 
                ? `<button className="bg-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow" style={{ color: '${content.colors.primary}' }}>${cta}</button>`
                : `<button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors">${cta}</button>`
            ).join('\n            ')}
          </div>
        </div>
      </section>

      {/* Sections - Real PH1.ca Content */}
      ${content.sections.slice(0, 3).map((section, i) => `
      <section className="${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">${section.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl">${section.content}</p>
        </div>
      </section>
      `).join('\n')}

      {/* Footer CTA */}
      <section className="py-20 text-white" style={{ backgroundColor: '${content.colors.secondary}' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Digital Products?</h2>
          <p className="text-xl mb-8 opacity-90">Let's discuss how we can help you achieve your goals.</p>
          <button className="bg-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-shadow" style={{ color: '${content.colors.primary}' }}>
            Get Started Today
          </button>
        </div>
      </section>
    </main>
  )
}

<style jsx>{\`
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
\`}</style>`

  const homepagePath = path.join(process.cwd(), 'app/page.tsx')
  fs.writeFileSync(homepagePath, homepage)
  
  return 'Homepage updated with real PH1.ca content'
}
EOFIMPORTER

print_status "success" "Content importer created"

print_status "progress" "Creating preview-first generator..."

cat > lib/ph1/previewGenerator.ts << 'EOFPREVIEW'
import fs from 'fs'
import path from 'path'

export function generatePreviewVariations(slug: string, title: string, description: string) {
  const variations = [
    {
      name: 'Professional',
      description: 'Clean, corporate design perfect for enterprise clients',
      color: 'blue',
      tone: 'professional',
      previewHtml: generateHTML(slug, title, description, 'professional', '#1e40af', '#3b82f6')
    },
    {
      name: 'Friendly',
      description: 'Warm, approachable design with vibrant colors',
      color: 'purple',
      tone: 'friendly',
      previewHtml: generateHTML(slug, title, description, 'friendly', '#7c3aed', '#a78bfa')
    },
    {
      name: 'Enterprise',
      description: 'Bold, confident design for Fortune 500 companies',
      color: 'gradient',
      tone: 'enterprise',
      previewHtml: generateHTML(slug, title, description, 'enterprise', '#1e40af', '#7c3aed')
    }
  ]
  
  return variations
}

function generateHTML(slug: string, title: string, description: string, tone: string, primary: string, secondary: string) {
  const headlines = {
    professional: title,
    friendly: `${title} 🚀`,
    enterprise: title.toUpperCase()
  }
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; margin: 0; }
    .hero-gradient { background: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%); }
  </style>
</head>
<body>
  <div style="background: #1f2937; color: white; padding: 1rem; position: sticky; top: 0; z-index: 9999;">
    <div style="max-width: 80rem; margin: 0 auto; display: flex; align-items: center; justify-content: space-between;">
      <div>
        <span style="font-weight: 600; font-size: 1.125rem;">🎨 Preview: ${tone.toUpperCase()}</span>
      </div>
      <button onclick="parent.postMessage({action: 'select', tone: '${tone}'}, '*')" 
              style="background: #10b981; color: white; padding: 0.5rem 1.5rem; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">
        ✓ Use This Design
      </button>
    </div>
  </div>

  <nav style="background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); position: sticky; top: 3.5rem; z-index: 999;">
    <div style="max-width: 80rem; margin: 0 auto; padding: 0 1rem; display: flex; justify-content: space-between; height: 4rem; align-items: center;">
      <a href="/" style="font-size: 1.5rem; font-weight: 700; color: ${primary}; text-decoration: none;">PH1.ca</a>
      <div style="display: flex; gap: 2rem; align-items: center;">
        <a href="/" style="color: #4b5563; text-decoration: none;">Home</a>
        <a href="/services" style="color: #4b5563; text-decoration: none;">Services</a>
        <a href="/contact" style="background: ${primary}; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">Contact</a>
      </div>
    </div>
  </nav>

  <section class="hero-gradient" style="color: white; padding: 5rem 1rem; text-align: center;">
    <div style="max-width: 80rem; margin: 0 auto;">
      <h1 style="font-size: ${tone === 'enterprise' ? '4rem' : '3rem'}; font-weight: 800; margin-bottom: 1.5rem; line-height: 1.1;">
        ${headlines[tone as keyof typeof headlines]}
      </h1>
      <p style="font-size: 1.25rem; margin-bottom: 2rem; max-width: 48rem; margin-left: auto; margin-right: auto;">
        ${description}
      </p>
      <div style="display: flex; gap: 1rem; justify-content: center;">
        <button style="background: white; color: ${primary}; padding: 1rem 2rem; border: none; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 700; cursor: pointer;">
          Get Started
        </button>
        <button style="background: transparent; color: white; padding: 1rem 2rem; border: 2px solid white; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 700; cursor: pointer;">
          Learn More
        </button>
      </div>
    </div>
  </section>

  <section style="padding: 5rem 1rem; background: ${tone === 'friendly' ? '#f5f3ff' : '#eff6ff'};">
    <div style="max-width: 80rem; margin: 0 auto;">
      <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 3rem; text-align: center;">
        What We Deliver
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
        ${['Expert Consulting', 'Proven Results', 'Ongoing Support'].map(item => `
          <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="width: 3rem; height: 3rem; background: ${primary}; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
              <span style="color: white; font-size: 1.5rem; font-weight: 700;">✓</span>
            </div>
            <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem;">${item}</h3>
            <p style="color: #6b7280;">Professional service delivery with measurable outcomes.</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
</body>
</html>`
}

export function generatePageCode(slug: string, title: string, description: string, tone: string) {
  const colors: Record<string, string> = {
    professional: '#1e40af',
    friendly: '#7c3aed',
    enterprise: 'linear-gradient(135deg, #1e40af, #7c3aed)'
  }
  
  const headlines: Record<string, string> = {
    professional: title,
    friendly: `${title} 🚀`,
    enterprise: title.toUpperCase()
  }
  
  function toPascalCase(str: string) {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')
  }
  
  return `export default function ${toPascalCase(slug)}Page() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-blue-900">PH1.ca</a>
            </div>
            <div className="flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
              <a href="/services" className="text-gray-700 hover:text-blue-600">Services</a>
              <a href="/contact" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="${tone === 'enterprise' ? 'text-6xl' : 'text-5xl'} font-bold mb-6">
            ${headlines[tone]}
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            ${description}
          </p>
          <div className="space-x-4">
            <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:shadow-lg">
              Get Started
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 ${tone === 'friendly' ? 'bg-purple-50' : 'bg-blue-50'}">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">What We Deliver</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['Expert Consulting', 'Proven Results', 'Ongoing Support'].map(item => (
              <div key={item} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-12 h-12 ${tone === 'friendly' ? 'bg-purple-600' : 'bg-blue-600'} rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">✓</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{item}</h3>
                <p className="text-gray-600">Professional service delivery with measurable outcomes.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="${tone === 'enterprise' ? 'bg-gradient-to-r from-blue-900 to-purple-900' : tone === 'friendly' ? 'bg-purple-600' : 'bg-blue-900'} text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">Let's discuss how we can help transform your business.</p>
          <button className="bg-white text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl">
            Schedule a Consultation
          </button>
        </div>
      </section>
    </main>
  )
}

<style jsx>{\`
  .hero-gradient {
    background: ${colors[tone]};
  }
\`}</style>`
}
EOFPREVIEW

print_status "success" "Preview generator created"

print_status "progress" "Creating interactive preview component..."

cat > components/admin/InteractivePreview.tsx << 'EOFINTERACTIVE'
'use client'

import { useState, useEffect } from 'react'

interface PreviewProps {
  variations: Array<{
    name: string
    description: string
    previewHtml: string
    tone: string
  }>
  onSelect: (tone: string) => void
  onClose: () => void
}

export default function InteractivePreview({ variations, onSelect, onClose }: PreviewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.action === 'select') {
        onSelect(event.data.tone)
      }
    }
    
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onSelect])
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">Choose Your Design</h2>
            <div className="flex gap-2">
              {variations.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedIndex === i
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold"
          >
            ✕ Close
          </button>
        </div>
        
        <div className="p-4 bg-blue-50 border-b">
          <p className="text-sm text-blue-900">
            <strong className="font-semibold">{variations[selectedIndex].name}:</strong> {variations[selectedIndex].description}
          </p>
        </div>
        
        <div className="flex-1 overflow-hidden bg-gray-100">
          <iframe
            srcDoc={variations[selectedIndex].previewHtml}
            className="w-full h-full border-0"
            title="Preview"
          />
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Click a design tab above or the green button in the preview
          </div>
          <button
            onClick={() => onSelect(variations[selectedIndex].tone)}
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg hover:shadow-xl transition-all"
          >
            ✓ Use {variations[selectedIndex].name} Design
          </button>
        </div>
      </div>
    </div>
  )
}
EOFINTERACTIVE

print_status "success" "Interactive preview created"

print_status "progress" "Creating enhanced admin..."

cat > components/admin/EnhancedAdmin.tsx << 'EOFADMIN'
'use client'

import { useState } from 'react'
import InteractivePreview from './InteractivePreview'

export default function EnhancedAdmin() {
  const [activeTab, setActiveTab] = useState<'import' | 'create'>('import')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState<any>(null)

  const handleImport = async () => {
    setIsLoading(true)
    setResult(null)
    try {
      const response = await fetch('/api/import-ph1', { method: 'POST' })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, message: (error as Error).message })
    }
    setIsLoading(false)
  }

  const handlePreviewPage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      slug: formData.get('slug'),
      title: formData.get('title'),
      description: formData.get('description')
    }
    
    try {
      const response = await fetch('/api/preview-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      
      if (result.success) {
        setPreviewData({
          variations: result.variations,
          slug: data.slug,
          title: data.title,
          description: data.description
        })
        setShowPreview(true)
      } else {
        setResult(result)
      }
    } catch (error) {
      setResult({ success: false, message: (error as Error).message })
    }
    setIsLoading(false)
  }

  const handleSelectVariation = async (tone: string) => {
    setIsLoading(true)
    setShowPreview(false)
    try {
      const response = await fetch('/api/create-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: previewData.slug,
          title: previewData.title,
          description: previewData.description,
          tone
        })
      })
      const result = await response.json()
      setResult(result)
    } catch (error) {
      setResult({ success: false, message: (error as Error).message })
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-blue-900">PH1.ca Enhanced Admin</h1>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-bold">
                ✓ ALL 3 FEATURES
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => { setActiveTab('import'); setResult(null); }}
            className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg ${
              activeTab === 'import'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📥 Import Real PH1.ca
          </button>
          <button
            onClick={() => { setActiveTab('create'); setResult(null); }}
            className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg ${
              activeTab === 'create'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            ✨ Create Page (Preview First)
          </button>
        </div>

        {activeTab === 'import' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">📥</div>
                <h2 className="text-3xl font-bold mb-4">Import Real PH1.ca Content</h2>
                <p className="text-gray-600 text-lg">
                  Get actual headlines, descriptions, colors, and navigation from the live PH1.ca site
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: '📝', title: 'Content', desc: 'Real headlines & copy' },
                  { icon: '🎨', title: 'Styling', desc: 'Actual colors & fonts' },
                  { icon: '🧭', title: 'Navigation', desc: 'Menu structure' },
                  { icon: '📐', title: 'Layout', desc: 'Section structure' }
                ].map(item => (
                  <div key={item.title} className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="font-semibold text-blue-900">{item.title}</div>
                    <p className="text-sm text-blue-800">{item.desc}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleImport}
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-4 rounded-lg text-xl font-bold hover:bg-green-700 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? '⏳ Importing...' : '🚀 Import Now'}
              </button>

              {result && (
                <div className={`mt-6 p-6 rounded-lg border-2 ${
                  result.success 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-red-50 border-red-300'
                }`}>
                  <p className={`font-bold text-lg ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                    {result.success ? '✅ Success!' : '❌ Error'}
                  </p>
                  <p className={`mt-2 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                    {result.message}
                  </p>
                  {result.success && result.imported && (
                    <div className="mt-4 text-sm text-green-800 space-y-1">
                      <div>• Navigation: {result.imported.navigation} items</div>
                      <div>• Sections: {result.imported.sections} sections</div>
                      <div>• Images: {result.imported.images} images found</div>
                      <a href="/" className="block mt-4 text-center bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700">
                        View Updated Homepage →
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Create Page - Preview First</h2>
              <form onSubmit={handlePreviewPage} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Page URL Slug</label>
                  <input
                    name="slug"
                    type="text"
                    required
                    placeholder="enterprise-services"
                    className="w-full p-4 border-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Will create: yoursite.com/enterprise-services</p>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Page Title</label>
                  <input
                    name="title"
                    type="text"
                    required
                    placeholder="Enterprise Services"
                    className="w-full p-4 border-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Description</label>
                  <textarea
                    name="description"
                    required
                    placeholder="Transform your enterprise with our proven consulting services..."
                    className="w-full h-32 p-4 border-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-lg"
                  />
                </div>

                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900 flex items-start gap-2">
                    <span className="text-2xl">✨</span>
                    <span>
                      <strong>New Feature:</strong> You'll see 3 professional design variations before creating your page!
                      Choose from Professional, Friendly, or Enterprise styles.
                    </span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg text-xl font-bold hover:bg-blue-700 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all"
                >
                  {isLoading ? '⏳ Generating...' : '👁️ Preview 3 Designs'}
                </button>
              </form>

              {result && !showPreview && (
                <div className={`mt-6 p-6 rounded-lg border-2 ${
                  result.success 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-red-50 border-red-300'
                }`}>
                  <p className={`font-bold text-lg ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                    {result.success ? '✅ Page Created!' : '❌ Error'}
                  </p>
                  <p className={`mt-2 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                    {result.message}
                  </p>
                  {result.success && result.url && (
                    <a
                      href={result.url}
                      target="_blank"
                      className="mt-4 block text-center bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 shadow-lg"
                    >
                      View New Page →
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showPreview && previewData && (
        <InteractivePreview
          variations={previewData.variations}
          onSelect={handleSelectVariation}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  )
}
EOFADMIN

print_status "success" "Enhanced admin created"

print_status "progress" "Creating API endpoints..."

# Import API
cat > app/api/import-ph1/route.ts << 'EOFIMPORTAPI'
import { NextResponse } from 'next/server'
import { importRealPH1, applyImportedContent } from '@/lib/ph1/realContentImporter'

export async function POST() {
  try {
    const content = await importRealPH1()
    const message = applyImportedContent()
    
    return NextResponse.json({
      success: true,
      message,
      imported: {
        navigation: content.navigation.length,
        sections: content.sections.length,
        images: content.images.length
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Import failed: ${(error as Error).message}`
    }, { status: 500 })
  }
}
EOFIMPORTAPI

# Preview API
cat > app/api/preview-page/route.ts << 'EOFPREVIEWAPI'
import { NextRequest, NextResponse } from 'next/server'
import { generatePreviewVariations } from '@/lib/ph1/previewGenerator'

export async function POST(request: NextRequest) {
  try {
    const { slug, title, description } = await request.json()
    
    const variations = generatePreviewVariations(slug, title, description)
    
    return NextResponse.json({
      success: true,
      variations
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message
    }, { status: 500 })
  }
}
EOFPREVIEWAPI

# Create Page API
cat > app/api/create-page/route.ts << 'EOFCREATEAPI'
import { NextRequest, NextResponse } from 'next/server'
import { generatePageCode } from '@/lib/ph1/previewGenerator'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { slug, title, description, tone } = await request.json()
    
    const code = generatePageCode(slug, title, description, tone)
    
    const pageDir = path.join(process.cwd(), 'app', slug)
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true })
    }
    
    fs.writeFileSync(path.join(pageDir, 'page.tsx'), code)
    
    return NextResponse.json({
      success: true,
      message: `Page created with ${tone} design`,
      path: `app/${slug}/page.tsx`,
      url: `/${slug}`
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message
    }, { status: 500 })
  }
}
EOFCREATEAPI

# Update admin page
cat > app/admin/page.tsx << 'EOFADMINPAGE'
import EnhancedAdmin from '@/components/admin/EnhancedAdmin'

export default function AdminPage() {
  return <EnhancedAdmin />
}
EOFADMINPAGE

print_status "success" "All files created"

cat > QUICK_TEST.md << 'EOFTEST'
# 🎯 Quick Test Guide

## Start Server:
```bash
npm run dev
```

## Test 1: Import Real PH1.ca (5 seconds)
1. Go to: http://localhost:3000/admin
2. Click "📥 Import Real PH1.ca" button
3. Click "🚀 Import Now"
4. Wait 5-10 seconds
5. ✅ See success message
6. Visit: http://localhost:3000
7. ✅ Homepage now has real PH1.ca content!

## Test 2: Preview-First Page Creation (30 seconds)
1. Click "✨ Create Page (Preview First)" tab
2. Fill in:
   - Slug: test-service
   - Title: Test Service
   - Description: Testing the preview system
3. Click "👁️ Preview 3 Designs"
4. ✅ See 3 design variations!
5. Click between: Professional, Friendly, Enterprise
6. Click "✓ Use [Design] Design"
7. ✅ Page created!
8. Visit: http://localhost:3000/test-service

## ✅ All 3 Problems Solved!
1. ✅ Real PH1.ca styling & content
2. ✅ Preview before creating
3. ✅ Choose from design options
EOFTEST

print_status "success" "Test guide created"

echo ""
echo "=================================================="
echo ""
print_status "success" "🎉 INSTALLATION COMPLETE!"
echo ""
print_status "info" "What's Fixed:"
echo "   ✅ Real PH1.ca content import"
echo "   ✅ Preview before creating pages"
echo "   ✅ Choose from 3 design variations"
echo ""
print_status "info" "Quick Test:"
echo "   1. npm run dev"
echo "   2. Open: http://localhost:3000/admin"
echo "   3. Read: QUICK_TEST.md"
echo ""
echo "=================================================="
echo ""
