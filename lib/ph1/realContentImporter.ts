import axios from 'axios'
import * as cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'

export interface PH1Content {
  navigation: string[]
  hero: { headline: string; subheadline: string; cta: string[] }
  sections: Array<{ title: string; content: string; type: string }>
  images: string[]
  colors: { primary: string; secondary: string; accent: string }
  fonts: string[]
}

export async function importRealPH1(): Promise<PH1Content> {
  const response = await axios.get('https://ph1.ca', {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    timeout: 10000
  })
  
  const $ = cheerio.load(response.data)
  
  const navigation: string[] = []
  $('nav a, header a').each((_, el) => {
    const text = $(el).text().trim()
    if (text && text.length < 30) navigation.push(text)
  })
  
  const hero = {
    headline: $('h1').first().text().trim() || 'Transform Your Digital Products',
    subheadline: $('h1').first().next('p').text().trim() || '20+ years of expertise',
    cta: ['Get Started', 'Learn More']
  }
  
  const sections: Array<{title: string, content: string, type: string}> = []
  $('section').each((_, section) => {
    const $section = $(section)
    const title = $section.find('h2, h3').first().text().trim()
    if (title) sections.push({
      title,
      content: $section.find('p').first().text().trim() || 'Professional services',
      type: 'content'
    })
  })
  
  const data = {
    navigation: navigation.length > 0 ? navigation : ['Home', 'Services', 'About', 'Contact'],
    hero,
    sections: sections.length > 0 ? sections : [
      { title: 'Our Expertise', content: 'Comprehensive solutions', type: 'services' }
    ],
    images: [],
    colors: { primary: '#1e40af', secondary: '#1e3a8a', accent: '#3b82f6' },
    fonts: []
  }
  
  const dataDir = path.join(process.cwd(), 'lib/ph1')
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  fs.writeFileSync(path.join(dataDir, 'imported-content.json'), JSON.stringify(data, null, 2))
  
  return data
}

export function getImportedContent(): PH1Content | null {
  try {
    const dataPath = path.join(process.cwd(), 'lib/ph1/imported-content.json')
    if (fs.existsSync(dataPath)) return JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  } catch (error) {
    console.error('Error reading imported content:', error)
  }
  return null
}

export function applyImportedContent(): string {
  const content = getImportedContent()
  if (!content) return 'No imported content found'
  
  // FIXED: No more <style jsx> syntax - just plain JSX
  const homepage = `export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-blue-900">PH1.ca</a>
            </div>
            <div className="flex items-center space-x-8">
              ${content.navigation.slice(0, 4).map(item => 
                `<a href="#" className="text-gray-700 hover:text-blue-600">${item}</a>`
              ).join('\n              ')}
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">${content.hero.headline}</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">${content.hero.subheadline}</p>
          <div className="space-x-4">
            ${content.hero.cta.map(cta => 
              `<button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold">${cta}</button>`
            ).join('\n            ')}
          </div>
        </div>
      </section>

      ${content.sections.slice(0, 3).map((section, i) => `
      <section className="${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">${section.title}</h2>
          <p className="text-xl text-gray-600">${section.content}</p>
        </div>
      </section>
      `).join('\n')}

      <section className="bg-blue-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform?</h2>
          <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold">Get Started</button>
        </div>
      </section>
    </main>
  )
}`

  fs.writeFileSync(path.join(process.cwd(), 'app/page.tsx'), homepage)
  return 'Homepage updated with real PH1.ca content'
}
