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
