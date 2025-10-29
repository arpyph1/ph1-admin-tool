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
