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
