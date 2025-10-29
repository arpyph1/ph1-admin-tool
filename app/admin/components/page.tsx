'use client';

import { useState, useEffect, useRef } from 'react';

export default function ComponentLibrary() {
  const [components, setComponents] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'split'>('grid');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genPrompt, setGenPrompt] = useState('');
  const [selectedForGen, setSelectedForGen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    loadComponents();
  }, []);

  async function loadComponents() {
    try {
      const res = await fetch('/api/component-library');
      const data = await res.json();
      setComponents(data.components || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleComponentClick(comp: any) {
    setSelectedComponent(comp.id);
    
    if (viewMode === 'split' && comp.appearsOn?.length > 0) {
      const pageUrl = `https://ph1.ca${comp.appearsOn[0]}`;
      if (iframeRef.current) {
        iframeRef.current.src = pageUrl;
      }
    }
  }

  async function generateVariant() {
    if (!selectedForGen || !genPrompt) return;
    
    setGenerating(true);
    try {
      const res = await fetch('/api/generate-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseComponentId: selectedForGen, prompt: genPrompt })
      });
      const data = await res.json();
      
      if (data.component) {
        setComponents([...components, data.component]);
        setGenPrompt('');
        setSelectedForGen(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  }

  const filtered = filter === 'all' ? components : components.filter(c => c.category === filter);
  const categories = ['all', 'hero', 'card', 'grid', 'cta', 'text', 'section', 'image', 'carousel', 'logo-grid'];

  const ComponentCard = ({ comp }: { comp: any }) => {
    // Fix image paths to use ph1.ca domain
    const fixedHtml = comp.html
      .replace(/data-src="/g, 'src="https://ph1.ca')
      .replace(/src="\/images/g, 'src="https://ph1.ca/images')
      .replace(/class="lazy"/g, '')
      .replace(/loading="lazy"/g, '');

    return (
      <div 
        className={`bg-white border rounded-lg p-4 hover:shadow-lg transition cursor-pointer ${
          selectedComponent === comp.id ? 'ring-4 ring-blue-500' : ''
        }`}
        onClick={() => handleComponentClick(comp)}
      >
        <h3 className="text-lg font-bold mb-2">{comp.name}</h3>
        <div className="flex gap-2 mb-3">
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">{comp.category}</span>
          <button onClick={(e) => { e.stopPropagation(); setSelectedForGen(comp.id); }} className="text-xs text-purple-600 font-bold">Generate</button>
        </div>

        <div className="mb-3">
          <div className="text-xs font-bold mb-1">Pages:</div>
          {comp.appearsOn?.map((page: string) => (
            <a key={page} href={`https://ph1.ca${page}`} target="_blank" onClick={(e) => e.stopPropagation()} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded mr-1">
              {page}
            </a>
          ))}
        </div>

        <button onClick={(e) => { e.stopPropagation(); setShowPreview(showPreview === comp.id ? null : comp.id); }} className="text-sm text-blue-600 mb-2 font-bold">
          {showPreview === comp.id ? '▼ Hide' : '▶ Show'} Visual Preview
        </button>

        {showPreview === comp.id && (
          <div className="border-2 border-blue-200 rounded-lg overflow-hidden mb-3">
            <iframe
              srcDoc={`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://ph1.ca/styles.css" rel="stylesheet" />
  <style>
    body { 
      margin: 0; 
      padding: 24px; 
      background: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    img { max-width: 100%; height: auto; display: block; }
    * { box-sizing: border-box; }
  </style>
</head>
<body>
  ${fixedHtml}
</body>
</html>`}
              className="w-full border-0"
              style={{ height: '400px', minHeight: '200px' }}
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Component Library ({components.length})</h1>
          <div className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded mb-4">
            ⚠️ <strong>Split View Limitation:</strong> Browser security (CORS) prevents auto-scrolling/highlighting in the iframe. 
            Clicking a component navigates to its page, but you must manually find it on that page.
          </div>
          
          <div className="flex gap-2 mb-4">
            <button onClick={() => setViewMode('grid')} className={`px-4 py-2 rounded-lg font-bold ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Grid View</button>
            <button onClick={() => setViewMode('split')} className={`px-4 py-2 rounded-lg font-bold ${viewMode === 'split' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Split View</button>
          </div>

          {selectedForGen && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <h3 className="font-bold mb-3">Generate Variant: {components.find(c => c.id === selectedForGen)?.name}</h3>
              <textarea value={genPrompt} onChange={(e) => setGenPrompt(e.target.value)} placeholder="E.g., Make it more corporate, add pricing" className="w-full p-3 border rounded mb-3 h-20" />
              <button onClick={generateVariant} disabled={generating} className="bg-blue-600 text-white px-6 py-2 rounded font-bold disabled:bg-gray-400 mr-2">
                {generating ? 'Generating...' : 'Generate'}
              </button>
              <button onClick={() => setSelectedForGen(null)} className="bg-gray-500 text-white px-6 py-2 rounded">Cancel</button>
            </div>
          )}
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-2 mb-6 flex-wrap">
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded font-medium ${filter === cat ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  {cat} ({cat === 'all' ? components.length : components.filter(c => c.category === cat).length})
                </button>
              ))}
            </div>
            {loading ? <div className="text-center py-12">Loading...</div> : <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">{filtered.map(comp => <ComponentCard key={comp.id} comp={comp} />)}</div>}
          </div>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-250px)]">
          <div className="w-1/2 border-r bg-white">
            <div className="p-4 border-b bg-gray-50 text-sm">
              <strong>Selected:</strong> {selectedComponent ? components.find(c => c.id === selectedComponent)?.name : 'None'} 
              <span className="text-gray-500 ml-2">(Cannot auto-scroll due to CORS)</span>
            </div>
            <iframe ref={iframeRef} src="https://ph1.ca" className="w-full h-full" />
          </div>
          <div className="w-1/2 overflow-auto p-6">
            <div className="flex gap-2 mb-4 flex-wrap">
              {categories.map(cat => (<button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1 text-sm rounded font-medium ${filter === cat ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>{cat}</button>))}
            </div>
            <div className="space-y-4">{filtered.map(comp => <ComponentCard key={comp.id} comp={comp} />)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
