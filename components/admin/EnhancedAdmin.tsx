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
