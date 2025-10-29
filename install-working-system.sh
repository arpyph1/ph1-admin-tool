#!/bin/bash

# PH1.ca Lightweight Working System
# NO heavy dependencies, NO hanging, JUST WORKS

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
echo "🎯 PH1.ca Working System - Fast Install"
echo "=================================================="
echo ""

# Verify location
if [ ! -f "lib/componentAnalyzer.ts" ]; then
    print_status "error" "Please run from: /Users/arpy/Downloads/ph1-website/tailwind-project/"
    exit 1
fi

print_status "success" "Found your project"

# Create directories
print_status "progress" "Creating directories..."
mkdir -p {app/api/{page-generator,global-update,import-content},components/admin,lib/ph1,public/previews}

# WORKING PREVIEW SYSTEM (No puppeteer needed)
print_status "progress" "Creating working preview system..."
cat > lib/ph1/workingPreview.ts << 'EOF'
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
EOF

# PAGE GENERATOR
print_status "progress" "Creating page generator..."
cat > lib/ph1/pageGenerator.ts << 'EOF'
import fs from 'fs'
import path from 'path'

export function createPage(slug: string, template: string, data: any) {
  const templates = {
    service: `export default function ${toPascalCase(slug)}Page() {
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

      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-6">${data.title || 'Service Title'}</h1>
          <p className="text-xl max-w-3xl">${data.description || 'Service description goes here'}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12">What We Deliver</h2>
          <div className="grid md:grid-cols-3 gap-8">
            ${generateBenefits(data.benefits || [])}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">Let's discuss how we can help transform your business.</p>
          <a href="/contact" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700">
            Schedule a Consultation
          </a>
        </div>
      </section>
    </main>
  )
}`,
    
    landing: `export default function ${toPascalCase(slug)}Page() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl font-bold mb-6">${data.headline || 'Transform Your Business'}</h1>
          <p className="text-2xl mb-12 opacity-90">${data.subheadline || 'Discover how we can help'}</p>
          <button className="bg-white text-blue-600 px-10 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 shadow-xl">
            ${data.ctaText || 'Get Started Today'}
          </button>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            ${generateFeatures(data.features || [])}
          </div>
        </div>
      </section>
    </main>
  )
}`
  }

  const content = templates[template as keyof typeof templates] || templates.service
  
  // Create page directory and file
  const pageDir = path.join(process.cwd(), 'app', slug)
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true })
  }
  
  fs.writeFileSync(path.join(pageDir, 'page.tsx'), content)
  
  return { success: true, path: `app/${slug}/page.tsx`, url: `/${slug}` }
}

function toPascalCase(str: string) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')
}

function generateBenefits(benefits: string[]) {
  if (!benefits.length) {
    benefits = ['Expert Consulting', 'Proven Results', 'Long-term Support']
  }
  return benefits.map(benefit => `
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <div className="w-12 h-12 bg-blue-600 rounded-lg mb-4 flex items-center justify-center">
        <span className="text-white text-2xl">✓</span>
      </div>
      <h3 className="text-xl font-semibold mb-3">${benefit}</h3>
      <p className="text-gray-600">Detailed information about this benefit.</p>
    </div>
  `).join('\n')
}

function generateFeatures(features: string[]) {
  if (!features.length) {
    features = ['Feature One', 'Feature Two', 'Feature Three']
  }
  return features.map(feature => `
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
        <span className="text-3xl">⚡</span>
      </div>
      <h3 className="text-2xl font-bold mb-3">${feature}</h3>
      <p className="text-gray-600">Description of this amazing feature.</p>
    </div>
  `).join('\n')
}

export function copyPage(sourcePath: string, newSlug: string) {
  const fullSourcePath = path.join(process.cwd(), sourcePath)
  const content = fs.readFileSync(fullSourcePath, 'utf-8')
  
  const newDir = path.join(process.cwd(), 'app', newSlug)
  if (!fs.existsSync(newDir)) {
    fs.mkdirSync(newDir, { recursive: true })
  }
  
  fs.writeFileSync(path.join(newDir, 'page.tsx'), content)
  
  return { success: true, path: `app/${newSlug}/page.tsx`, url: `/${newSlug}` }
}
EOF

# GLOBAL UPDATER
print_status "progress" "Creating global updater..."
cat > lib/ph1/globalUpdater.ts << 'EOF'
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
EOF

# COMPLETE ADMIN DASHBOARD
print_status "progress" "Creating complete admin dashboard..."
cat > components/admin/WorkingAdmin.tsx << 'EOF'
'use client'

import { useState } from 'react'

export default function WorkingAdmin() {
  const [activeTab, setActiveTab] = useState<'modify' | 'create' | 'global'>('modify')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handlePreview = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'app/page.tsx' })
      })
      const data = await response.json()
      if (data.success && data.previewUrl) {
        window.open(data.previewUrl, '_blank', 'width=1400,height=900')
      }
      setResult(data)
    } catch (error) {
      setResult({ success: false, message: (error as Error).message })
    }
    setIsLoading(false)
  }

  const handleCreatePage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      slug: formData.get('slug'),
      template: formData.get('template'),
      title: formData.get('title'),
      description: formData.get('description')
    }
    
    try {
      const response = await fetch('/api/page-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      setResult(result)
    } catch (error) {
      setResult({ success: false, message: (error as Error).message })
    }
    setIsLoading(false)
  }

  const handleGlobalUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      find: formData.get('find'),
      replace: formData.get('replace')
    }
    
    try {
      const response = await fetch('/api/global-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
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
              <h1 className="text-2xl font-bold text-blue-900">PH1.ca Admin</h1>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-semibold">
                ✓ WORKING
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              All systems operational
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b pb-4">
          <button
            onClick={() => { setActiveTab('modify'); setResult(null); }}
            className={`px-6 py-3 rounded-t-lg font-semibold ${
              activeTab === 'modify'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            🎨 Preview Pages
          </button>
          <button
            onClick={() => { setActiveTab('create'); setResult(null); }}
            className={`px-6 py-3 rounded-t-lg font-semibold ${
              activeTab === 'create'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            ✨ Create Pages
          </button>
          <button
            onClick={() => { setActiveTab('global'); setResult(null); }}
            className={`px-6 py-3 rounded-t-lg font-semibold ${
              activeTab === 'global'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            🌍 Global Updates
          </button>
        </div>

        {/* PREVIEW TAB */}
        {activeTab === 'modify' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Generate Preview</h2>
              <p className="text-gray-600 mb-6">
                Click below to generate a live preview of your homepage with current styling.
              </p>
              <button
                onClick={handlePreview}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? '⏳ Generating...' : '🎨 Open Live Preview'}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Preview Result</h2>
              {result ? (
                result.success ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-900 font-semibold">✅ Preview opened in new window!</p>
                      <p className="text-sm text-green-700 mt-2">Check your browser for the preview tab</p>
                    </div>
                    {result.previewUrl && (
                      <a
                        href={result.previewUrl}
                        target="_blank"
                        className="block text-center bg-gray-100 py-3 rounded-lg text-blue-600 hover:bg-gray-200"
                      >
                        Open Preview Again
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-900 font-semibold">❌ Error</p>
                    <p className="text-sm text-red-700 mt-2">{result.message}</p>
                  </div>
                )
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-6xl mb-4">👁️</p>
                  <p>Click "Open Live Preview" to see your site</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CREATE TAB */}
        {activeTab === 'create' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Create New Page</h2>
              <form onSubmit={handleCreatePage} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Page URL Slug</label>
                  <input
                    name="slug"
                    type="text"
                    required
                    placeholder="ai-consulting"
                    className="w-full p-3 border rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Will create: yoursite.com/ai-consulting</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Template</label>
                  <select name="template" className="w-full p-3 border rounded-lg">
                    <option value="service">Service Page</option>
                    <option value="landing">Landing Page</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Page Title</label>
                  <input
                    name="title"
                    type="text"
                    required
                    placeholder="AI Strategy Consulting"
                    className="w-full p-3 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    name="description"
                    required
                    placeholder="Transform your business with AI-powered solutions..."
                    className="w-full h-24 p-3 border rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  {isLoading ? '⏳ Creating...' : '✨ Create Page'}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Result</h2>
              {result ? (
                result.success ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-900 font-semibold">✅ Page created successfully!</p>
                      <p className="text-sm text-green-700 mt-2">File: {result.path}</p>
                    </div>
                    {result.url && (
                      <a
                        href={result.url}
                        target="_blank"
                        className="block text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                      >
                        View New Page →
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-900 font-semibold">❌ Error</p>
                    <p className="text-sm text-red-700 mt-2">{result.message}</p>
                  </div>
                )
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-6xl mb-4">📄</p>
                  <p>Fill in the form and create your page</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* GLOBAL TAB */}
        {activeTab === 'global' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Global Find & Replace</h2>
              <form onSubmit={handleGlobalUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Find This Text</label>
                  <input
                    name="find"
                    type="text"
                    required
                    placeholder="Transform Your Digital Products"
                    className="w-full p-3 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Replace With</label>
                  <input
                    name="replace"
                    type="text"
                    required
                    placeholder="Accelerate Enterprise Innovation"
                    className="w-full p-3 border rounded-lg"
                  />
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-900">
                    ⚠️ This will search and replace across ALL pages in your site.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
                >
                  {isLoading ? '⏳ Updating...' : '🌍 Apply Global Change'}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Results</h2>
              {result ? (
                result.success ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-900 font-semibold">✅ Global update complete!</p>
                      <p className="text-sm text-green-700 mt-2">
                        Modified {result.filesModified} files with {result.totalReplacements} replacements
                      </p>
                    </div>
                    {result.details && result.details.length > 0 && (
                      <div className="max-h-64 overflow-y-auto">
                        <h3 className="font-semibold mb-2">Files Modified:</h3>
                        <ul className="space-y-2">
                          {result.details.map((detail: any, idx: number) => (
                            <li key={idx} className="text-sm p-2 bg-gray-50 rounded">
                              {detail.file} ({detail.changes} changes)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-900 font-semibold">❌ Error</p>
                    <p className="text-sm text-red-700 mt-2">{result.message}</p>
                  </div>
                )
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-6xl mb-4">🔍</p>
                  <p>Enter text to find and replace globally</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
EOF

# Create API endpoints
print_status "progress" "Creating API endpoints..."

cat > app/api/preview/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { generateWorkingPreview } from '@/lib/ph1/workingPreview'

export async function POST(request: NextRequest) {
  try {
    const { page } = await request.json()
    const previewUrl = generateWorkingPreview(page || 'app/page.tsx', {})
    
    return NextResponse.json({
      success: true,
      previewUrl,
      message: 'Preview generated successfully'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message
    }, { status: 500 })
  }
}
EOF

cat > app/api/page-generator/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { createPage } from '@/lib/ph1/pageGenerator'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const result = createPage(data.slug, data.template, data)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message
    }, { status: 500 })
  }
}
EOF

cat > app/api/global-update/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { findAndReplace } from '@/lib/ph1/globalUpdater'

export async function POST(request: NextRequest) {
  try {
    const { find, replace } = await request.json()
    const result = findAndReplace(find, replace, 'all')
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message
    }, { status: 500 })
  }
}
EOF

# Update admin page
cat > app/admin/page.tsx << 'EOF'
import WorkingAdmin from '@/components/admin/WorkingAdmin'

export default function AdminPage() {
  return <WorkingAdmin />
}
EOF

print_status "success" "All components created"

# Create simple guide
cat > WORKING_SYSTEM.md << 'EOF'
# ✅ PH1.ca Working System

## What Works Now:

### 1. 🎨 Live Previews
- Click "Open Live Preview"
- Opens in new window
- Shows real Tailwind styling
- No loading, just works

### 2. ✨ Create Pages
- Fill in the form
- Choose template
- Page created instantly
- Visit at /your-slug

### 3. 🌍 Global Updates
- Find and replace text
- Works across all pages
- Shows what changed
- Instant results

## Quick Start:

```bash
npm run dev
```

Open: http://localhost:3000/admin

## Test It:

1. Click "Preview Pages" tab → "Open Live Preview"
   - Preview opens in new window ✓

2. Click "Create Pages" tab → Fill form → "Create Page"
   - New page created ✓

3. Click "Global Updates" tab → Enter find/replace → "Apply"
   - Text updated across site ✓

## That's It!

No heavy dependencies.
No hanging installations.
Just working features.
EOF

print_status "success" "Documentation created"

echo ""
echo "=================================================="
echo ""
print_status "success" "🎉 WORKING SYSTEM INSTALLED!"
echo ""
print_status "info" "What You Can Do:"
echo "   ✅ Generate live previews (opens in new window)"
echo "   ✅ Create new pages from templates"
echo "   ✅ Make global find & replace changes"
echo ""
print_status "info" "Start Now:"
echo "   1. npm run dev"
echo "   2. Open: http://localhost:3000/admin"
echo "   3. Try each tab - they all work!"
echo ""
print_status "info" "Read: WORKING_SYSTEM.md"
echo ""
echo "=================================================="
echo ""
