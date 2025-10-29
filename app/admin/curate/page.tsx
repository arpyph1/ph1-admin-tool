'use client';

import { useState, useEffect } from 'react';

export default function CurateComponents() {
  const [components, setComponents] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    loadComponents();
  }, []);

  async function loadComponents() {
    const res = await fetch('/api/curated-components');
    const data = await res.json();
    setComponents(data.components || []);
  }

  async function scanSite() {
    setScanning(true);
    try {
      const res = await fetch('/api/scan-components');
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  }

  async function addComponent(suggestion: any) {
    await fetch('/api/curated-components', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'add', 
        component: {
          name: suggestion.name,
          category: suggestion.category,
          html: suggestion.html,
          source: suggestion.source,
          description: suggestion.description
        }
      })
    });
    
    setSuggestions(suggestions.filter(s => s.id !== suggestion.id));
    await loadComponents();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Curated Components ({components.length})</h1>
            <p className="text-gray-600">Clean, reusable components from your site</p>
          </div>
          <button 
            onClick={scanSite}
            disabled={scanning}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold disabled:bg-gray-400"
          >
            {scanning ? 'Scanning...' : '🔍 Scan Site for Components'}
          </button>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-8 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Found {suggestions.length} New Components</h2>
            <div className="space-y-4">
              {suggestions.map(sugg => (
                <div key={sugg.id} className="bg-white rounded-lg p-4 flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{sugg.name}</h3>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">{sugg.category}</span>
                    <p className="text-sm text-gray-600 mt-2">{sugg.description}</p>
                  </div>
                  <button
                    onClick={() => addComponent(sugg)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold ml-4"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {components.map(comp => (
            <div key={comp.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-2">{comp.name}</h3>
              <div className="flex gap-2 mb-4">
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">{comp.category}</span>
                {comp.source && <span className="text-xs bg-gray-100 px-2 py-1 rounded">{comp.source}</span>}
              </div>
              {comp.description && <p className="text-sm text-gray-600 mb-4">{comp.description}</p>}
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  srcDoc={`<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script><style>body{margin:0;padding:20px;background:white;}</style></head><body>${comp.html.replace(/src="\//g, 'src="https://ph1.ca/')}</body></html>`}
                  className="w-full border-0"
                  style={{ height: '500px' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
