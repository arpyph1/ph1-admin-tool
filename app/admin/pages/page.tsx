'use client';

import { useState } from 'react';

export default function PagesEditor() {
  const [step, setStep] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [instructions, setInstructions] = useState('');
  const [previews, setPreviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    const res = await fetch('/api/smart-edit/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: searchQuery })
    });
    const data = await res.json();
    setResults(data.results || []);
    setStep('select');
    setLoading(false);
  }

  async function generatePreview() {
    setLoading(true);
    const res = await fetch('/api/smart-edit/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pages: selected, instructions, searchQuery })
    });
    const data = await res.json();
    setPreviews(data.previews || []);
    setStep('preview');
    setLoading(false);
  }

  async function publish() {
    setLoading(true);
    const res = await fetch('/api/smart-edit/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ previews })
    });
    if (res.ok) setStep('done');
    setLoading(false);
  }

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Smart Page Editor</h1>

      {step === 'search' && (
        <div className="max-w-2xl mx-auto bg-white rounded-xl border-2 p-8">
          <h2 className="text-2xl font-bold mb-4">Search Templates</h2>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search for content..."
            className="w-full p-4 border-2 rounded-lg mb-4"
          />
          <button
            onClick={search}
            disabled={loading || !searchQuery}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold disabled:bg-gray-300"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      )}

      {step === 'select' && (
        <div className="bg-white rounded-xl border-2 p-8">
          <h2 className="text-2xl font-bold mb-6">Select Files ({results.length} found)</h2>
          <div className="space-y-3 mb-6">
            {results.map(r => (
              <div
                key={r.pageId}
                onClick={() => toggle(r.pageId)}
                className={`border-2 rounded-lg p-4 cursor-pointer ${
                  selected.includes(r.pageId) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex gap-3">
                  <input type="checkbox" checked={selected.includes(r.pageId)} readOnly />
                  <div>
                    <div className="font-bold">{r.pageTitle}</div>
                    <div className="text-sm text-gray-600">{r.filePath}</div>
                    <div className="text-sm text-gray-700 mt-2">{r.purpose}</div>
                    {r.isSharedTemplate && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded mt-2 inline-block">
                        Shared template
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <button onClick={() => setStep('search')} className="flex-1 bg-gray-200 py-3 rounded-lg">
              Back
            </button>
            <button
              onClick={() => setStep('edit')}
              disabled={selected.length === 0}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg disabled:bg-gray-300"
            >
              Continue ({selected.length})
            </button>
          </div>
        </div>
      )}

      {step === 'edit' && (
        <div className="max-w-2xl mx-auto bg-white rounded-xl border-2 p-8">
          <h2 className="text-2xl font-bold mb-4">Describe Changes</h2>
          <textarea
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            placeholder="What changes should be made?"
            className="w-full p-4 border-2 rounded-lg h-32 mb-4"
          />
          <div className="flex gap-4">
            <button onClick={() => setStep('select')} className="flex-1 bg-gray-200 py-3 rounded-lg">
              Back
            </button>
            <button
              onClick={generatePreview}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
            >
              {loading ? 'Generating...' : 'Preview'}
            </button>
          </div>
        </div>
      )}

      {step === 'preview' && (
        <div className="bg-white rounded-xl border-2 p-8">
          <h2 className="text-2xl font-bold mb-6">Review Changes</h2>
          {previews.map((p, i) => (
            <div key={i} className="border-2 rounded-lg mb-6">
              <div className="bg-gray-50 p-4 border-b-2">
                <div className="font-bold">{p.pageTitle}</div>
                <div className="text-sm text-gray-600 mt-1">{p.explanation}</div>
              </div>
              <div className="grid md:grid-cols-2">
                <div className="p-4 border-r-2">
                  <div className="text-xs font-bold text-red-600 mb-2">BEFORE</div>
                  <pre className="text-xs bg-red-50 p-3 rounded overflow-auto">{p.before}</pre>
                </div>
                <div className="p-4">
                  <div className="text-xs font-bold text-green-600 mb-2">AFTER</div>
                  <pre className="text-xs bg-green-50 p-3 rounded overflow-auto">{p.after}</pre>
                </div>
              </div>
            </div>
          ))}
          <div className="flex gap-4">
            <button onClick={() => setStep('edit')} className="flex-1 bg-gray-200 py-3 rounded-lg">
              Edit
            </button>
            <button
              onClick={publish}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? 'Publishing...' : 'Publish to Live Site'}
            </button>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div className="max-w-2xl mx-auto bg-white rounded-xl border-2 p-12 text-center">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-3xl font-bold mb-4">Published!</h2>
          <p className="text-gray-600 mb-6">Changes will be live in 2-3 minutes</p>
          <div className="flex gap-4 justify-center">
            <a href="https://ph1.ca" target="_blank" className="px-6 py-3 bg-blue-600 text-white rounded-lg">
              View Site
            </a>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-gray-200 rounded-lg">
              New Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
