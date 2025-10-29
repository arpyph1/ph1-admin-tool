import fs from 'fs'
import path from 'path'

export interface PageOptions {
  slug: string
  template: string
  data: any
  variations: {
    tone: 'professional' | 'friendly' | 'enterprise'
    layout: 'centered' | 'wide' | 'split'
    colorScheme: 'blue' | 'purple' | 'gradient'
  }
}

export function generatePageVariations(options: PageOptions): Array<{
  name: string
  description: string
  previewHtml: string
  code: string
}> {
  const variations = []
  
  // Variation 1: Professional
  variations.push({
    name: 'Professional',
    description: 'Clean, corporate design with enterprise focus',
    previewHtml: generatePreviewHTML({
      ...options,
      variations: { tone: 'professional', layout: 'centered', colorScheme: 'blue' }
    }),
    code: generatePageCode({
      ...options,
      variations: { tone: 'professional', layout: 'centered', colorScheme: 'blue' }
    })
  })
  
  // Variation 2: Friendly
  variations.push({
    name: 'Friendly',
    description: 'Approachable design with warm colors',
    previewHtml: generatePreviewHTML({
      ...options,
      variations: { tone: 'friendly', layout: 'wide', colorScheme: 'purple' }
    }),
    code: generatePageCode({
      ...options,
      variations: { tone: 'friendly', layout: 'wide', colorScheme: 'purple' }
    })
  })
  
  // Variation 3: Enterprise
  variations.push({
    name: 'Enterprise',
    description: 'Bold, confident design for Fortune 500',
    previewHtml: generatePreviewHTML({
      ...options,
      variations: { tone: 'enterprise', layout: 'split', colorScheme: 'gradient' }
    }),
    code: generatePageCode({
      ...options,
      variations: { tone: 'enterprise', layout: 'split', colorScheme: 'gradient' }
    })
  })
  
  return variations
}

function generatePreviewHTML(options: PageOptions): string {
  const { data, variations } = options
  const { tone, layout, colorScheme } = variations
  
  const colors = {
    blue: { primary: '#1e40af', secondary: '#3b82f6', bg: '#eff6ff' },
    purple: { primary: '#7c3aed', secondary: '#a78bfa', bg: '#f5f3ff' },
    gradient: { primary: '#1e40af', secondary: '#7c3aed', bg: '#faf5ff' }
  }
  
  const scheme = colors[colorScheme]
  
  const headlines = {
    professional: data.title || 'Professional Services',
    friendly: data.title ? `${data.title} 🚀` : 'Welcome! Let\'s Work Together',
    enterprise: (data.title || 'Enterprise Solutions').toUpperCase()
  }
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title || 'Preview'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; margin: 0; }
    .hero-gradient { background: linear-gradient(135deg, ${scheme.primary} 0%, ${scheme.secondary} 100%); }
  </style>
</head>
<body>
  <!-- Preview Controls Bar -->
  <div style="background: #1f2937; color: white; padding: 1rem; position: sticky; top: 0; z-index: 9999;">
    <div style="max-width: 80rem; margin: 0 auto; display: flex; align-items: center; justify-content: space-between;">
      <div>
        <span style="font-weight: 600; font-size: 1.125rem;">🎨 Preview: ${variations.tone.toUpperCase()}</span>
        <span style="opacity: 0.7; margin-left: 1rem; font-size: 0.875rem;">
          Layout: ${variations.layout} | Colors: ${variations.colorScheme}
        </span>
      </div>
      <div style="display: flex; gap: 0.5rem;">
        <button onclick="parent.postMessage({action: 'selectVariation', variation: '${tone}'}, '*')" 
                style="background: #10b981; color: white; padding: 0.5rem 1.5rem; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">
          ✓ Use This Design
        </button>
        <button onclick="parent.postMessage({action: 'closePreview'}, '*')" 
                style="background: #ef4444; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.5rem; cursor: pointer;">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- Navigation -->
  <nav style="background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); position: sticky; top: 3.5rem; z-index: 999;">
    <div style="max-width: 80rem; margin: 0 auto; padding: 0 1rem; display: flex; justify-content: space-between; height: 4rem; align-items: center;">
      <a href="/" style="font-size: 1.5rem; font-weight: 700; color: ${scheme.primary}; text-decoration: none;">PH1.ca</a>
      <div style="display: flex; gap: 2rem; align-items: center;">
        <a href="/" style="color: #4b5563; text-decoration: none;">Home</a>
        <a href="/services" style="color: #4b5563; text-decoration: none;">Services</a>
        <a href="/contact" style="background: ${scheme.primary}; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">Contact</a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="hero-gradient" style="color: white; padding: 5rem 1rem; text-align: ${layout === 'centered' ? 'center' : 'left'};">
    <div style="max-width: 80rem; margin: 0 auto;">
      <h1 style="font-size: ${tone === 'enterprise' ? '4rem' : '3rem'}; font-weight: 800; margin-bottom: 1.5rem; line-height: 1.1;">
        ${headlines[tone]}
      </h1>
      <p style="font-size: 1.25rem; margin-bottom: 2rem; max-width: ${layout === 'wide' ? '100%' : '48rem'}; ${layout === 'centered' ? 'margin-left: auto; margin-right: auto;' : ''}">
        ${data.description || 'Transform your business with proven expertise and innovative solutions.'}
      </p>
      <div style="display: flex; gap: 1rem; ${layout === 'centered' ? 'justify-content: center;' : ''}">
        <button style="background: white; color: ${scheme.primary}; padding: 1rem 2rem; border: none; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 700; cursor: pointer;">
          Get Started
        </button>
        <button style="background: transparent; color: white; padding: 1rem 2rem; border: 2px solid white; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 700; cursor: pointer;">
          Learn More
        </button>
      </div>
    </div>
  </section>

  <!-- Content Section -->
  <section style="padding: 5rem 1rem; background: ${scheme.bg};">
    <div style="max-width: 80rem; margin: 0 auto;">
      <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 3rem; text-align: center;">
        Why Choose Us
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
        ${['Expertise', 'Results', 'Support'].map(item => `
          <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="width: 3rem; height: 3rem; background: ${scheme.primary}; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
              <span style="color: white; font-size: 1.5rem; font-weight: 700;">✓</span>
            </div>
            <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem;">${item}</h3>
            <p style="color: #6b7280;">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section style="background: ${scheme.primary}; color: white; padding: 5rem 1rem; text-align: center;">
    <div style="max-width: 48rem; margin: 0 auto;">
      <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem;">Ready to Transform?</h2>
      <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">Let's discuss how we can help you achieve your goals.</p>
      <button style="background: white; color: ${scheme.primary}; padding: 1rem 2.5rem; border: none; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 700; cursor: pointer;">
        Schedule a Call
      </button>
    </div>
  </section>
</body>
</html>`
}

function generatePageCode(options: PageOptions): string {
  const { slug, data, variations } = options
  const { tone, colorScheme } = variations
  
  const colors = {
    blue: '#1e40af',
    purple: '#7c3aed',
    gradient: 'linear-gradient(135deg, #1e40af, #7c3aed)'
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
              <a href="/contact" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-6">${data.title || 'Page Title'}</h1>
          <p className="text-xl max-w-3xl mb-8">${data.description || 'Description'}</p>
          <div className="space-x-4">
            <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold">Get Started</button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold">Learn More</button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['Expertise', 'Results', 'Support'].map(item => (
              <div key={item} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-blue-600 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">✓</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{item}</h3>
                <p className="text-gray-600">Professional service delivery</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

<style jsx>{\`
  .hero-gradient {
    background: ${typeof colors[colorScheme] === 'string' && colors[colorScheme].startsWith('linear') 
      ? colors[colorScheme] 
      : `linear-gradient(135deg, ${colors[colorScheme]} 0%, #1e3a8a 100%)`};
  }
\`}</style>`
}

function toPascalCase(str: string) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')
}

export function savePageVariation(slug: string, code: string): string {
  const pageDir = path.join(process.cwd(), 'app', slug)
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true })
  }
  
  fs.writeFileSync(path.join(pageDir, 'page.tsx'), code)
  return `app/${slug}/page.tsx`
}
