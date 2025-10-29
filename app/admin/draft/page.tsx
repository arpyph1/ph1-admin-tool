'use client';

import { useState, useEffect } from 'react';

export default function SmartComposer() {
  const [step, setStep] = useState<'prompt' | 'pages' | 'components' | 'preview'>('prompt');
  const [prompt, setPrompt] = useState('');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  
  const [components, setComponents] = useState<any[]>([]);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  
  const [html, setHtml] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState('');
  const [iteration, setIteration] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (step === 'pages') {
      loadPages();
    }
  }, [step]);

  async function loadPages() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/smart-compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-pages' })
      });
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
        setPages([]);
      } else {
        setPages(data.pages || []);
      }
    } catch (err: any) {
      setError(err.message);
      setPages([]);
    } finally {
      setLoading(false);
    }
  }

  async function extractComponents() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/smart-compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'extract-components', selectedPages })
      });
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setComponents(data.components || []);
        setSelectedComponents((data.components || []).map((c: any) => c.id));
        setStep('components');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function generate() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/smart-compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', prompt, selectedPages, selectedComponents, iteration })
      });
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setHtml(data.html || '');
        setQuestions(data.questions || []);
        setIteration(data.iteration || iteration + 1);
        setStep('preview');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function refine() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/smart-compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refine', html, answers, feedback, iteration })
      });
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setHtml(data.html || html);
        setIteration(data.iteration || iteration + 1);
        setFeedback('');
        setAnswers({});
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function publish() {
    if (!slug || !title) {
      setError('Enter slug and title');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/smart-compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish', slug, title, finalHtml: html })
      });
      const data = await res.json();
      
      if (data.success) {
        alert(`Published to ${data.url}`);
        window.location.href = data.url;
      } else {
        setError(data.error || 'Publish failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function togglePage(id: string) {
    setSelectedPages(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  }

  function toggleComponent(id: string) {
    setSelectedComponents(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Smart Page Composer</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg">
              {error}
            </div>
          )}

          {/* STEP 1: Prompt */}
          {step === 'prompt' && (
            <div className="space-y-4">
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Slug (e.g., ai-workshops)"
                className="w-full p-3 border rounded-lg"
              />
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (e.g., AI Strategy Workshops)"
                className="w-full p-3 border rounded-lg"
              />
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to create..."
                className="w-full h-32 p-4 border rounded-lg"
              />
              <button
                onClick={() => setStep('pages')}
                disabled={!prompt || !slug || !title}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold disabled:bg-gray-400"
              >
                Next: Select Pages
              </button>
            </div>
          )}

          {/* STEP 2: Select Pages */}
          {step === 'pages' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Select pages to base this on:</h2>
              
              {loading ? (
                <div className="text-center py-8">Loading pages...</div>
              ) : pages.length === 0 ? (
                <div className="text-center py-8 text-gray-600">No pages found</div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-auto">
                  {pages.map(page => (
                    <label key={page.id} className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPages.includes(page.id)}
                        onChange={() => togglePage(page.id)}
                        className="w-4 h-4"
                      />
                      <div>
                        <div className="font-medium">{page.title}</div>
                        <div className="text-sm text-gray-600">{page.type}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              
              <div className="flex gap-3">
                <button onClick={() => setStep('prompt')} className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold">Back</button>
                <button
                  onClick={extractComponents}
                  disabled={loading || selectedPages.length === 0}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold disabled:bg-gray-400"
                >
                  {loading ? 'Loading...' : `Next: Select Components (${selectedPages.length} pages)`}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Select Components */}
          {step === 'components' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Select components to include:</h2>
              
              {components.length === 0 ? (
                <div className="text-center py-8 text-gray-600">No components extracted</div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-auto">
                  {components.map(comp => (
                    <label key={comp.id} className="flex items-start gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedComponents.includes(comp.id)}
                        onChange={() => toggleComponent(comp.id)}
                        className="w-4 h-4 mt-1"
                      />
                      <div>
                        <div className="font-medium">{comp.label}</div>
                        <div className="text-xs text-gray-500">From: {comp.page}</div>
                        {comp.html && (
                          <div className="text-sm text-gray-600 mt-1">{comp.html.substring(0, 100)}...</div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
              
              <div className="flex gap-3">
                <button onClick={() => setStep('pages')} className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold">Back</button>
                <button
                  onClick={generate}
                  disabled={loading || selectedComponents.length === 0}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold disabled:bg-gray-400"
                >
                  {loading ? 'Generating...' : `Generate Preview (${selectedComponents.length} components)`}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Preview & Refine */}
          {step === 'preview' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Preview (Iteration {iteration})</h2>
                <div className="flex gap-2">
                  <button onClick={() => setStep('components')} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Edit</button>
                  <button onClick={publish} disabled={loading} className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold">
                    {loading ? 'Publishing...' : 'Publish'}
                  </button>
                </div>
              </div>

              <div className="border-2 rounded-lg p-4 bg-white max-h-96 overflow-auto" dangerouslySetInnerHTML={{ __html: html }} />

              {questions.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Questions:</h3>
                  {questions.map((q, i) => (
                    <div key={i} className="mb-3">
                      <label className="block text-sm font-medium mb-1">{q}</label>
                      <input
                        type="text"
                        onChange={(e) => setAnswers({...answers, [`q${i}`]: e.target.value})}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block font-medium mb-2">Feedback / Refinement:</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="How should this be improved?"
                  className="w-full h-24 p-3 border rounded-lg"
                />
                <button
                  onClick={refine}
                  disabled={loading || (!feedback && Object.keys(answers).length === 0)}
                  className="mt-3 bg-yellow-600 text-white px-6 py-3 rounded-lg font-bold disabled:bg-gray-400"
                >
                  {loading ? 'Refining...' : 'Apply Refinement'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
