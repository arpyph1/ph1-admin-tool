'use client'

import { useState } from 'react'

export default function GeneratePage() {
  const [step, setStep] = useState<'input' | 'questions' | 'generating' | 'review' | 'published'>('input')
  const [prompt, setPrompt] = useState('')
  const [questions, setQuestions] = useState<string[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [code, setCode] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState('')

  const handleGetQuestions = async () => {
    setStep('generating')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, step: 'questions' })
      })
      const data = await res.json()
      setQuestions((data.questions || []).map((q: any) => typeof q === 'string' ? q : String(q)))
      setStep('questions')
    } catch (err: any) {
      setError(err?.message || 'An error occurred')
      setStep('input')
    }
  }

  const handleGenerate = async () => {
    setStep('generating')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, step: 'generate', previousAnswers: answers })
      })
      const data = await res.json()
      setCode(data.code)
      setSlug(data.slug)
      setStep('review')
    } catch (err: any) {
      setError(err?.message || 'An error occurred')
      setStep('input')
    }
  }

  const handlePublish = async () => {
    try {
      await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, slug })
      })
      setStep('published')
    } catch (err: any) {
      setError(err?.message || 'An error occurred')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          <a href="/admin" className="text-sm hover:text-[#ffc72d]">← Back</a>
          <h1 className="text-2xl font-bold mt-2">Generate Page</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-8">
        {error && <div className="bg-red-50 border border-red-500 p-4 rounded mb-4">{error}</div>}

        {step === 'input' && (
          <div className="bg-white p-8 rounded shadow">
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe page" className="w-full border-2 p-3 rounded h-32 mb-4" />
            <button onClick={handleGetQuestions} disabled={!prompt} className="w-full bg-[#ffc72d] text-black font-bold py-4 rounded">Continue</button>
          </div>
        )}

        {step === 'questions' && (
          <div className="bg-white p-8 rounded shadow">
            {questions.map((q, i) => (
              <div key={i} className="mb-4">
                <label className="block font-bold mb-2">{q}</label>
                <textarea value={answers[q] || ''} onChange={(e) => setAnswers({...answers, [q]: e.target.value})} className="w-full border-2 p-3 rounded" rows={2} />
              </div>
            ))}
            <button onClick={handleGenerate} className="w-full bg-[#ffc72d] text-black font-bold py-4 rounded">Generate</button>
          </div>
        )}

        {step === 'generating' && (
          <div className="bg-white p-12 rounded shadow text-center">
            <div className="animate-spin w-16 h-16 border-4 border-[#ffc72d] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Generating...</p>
          </div>
        )}

        {step === 'review' && (
          <div className="bg-white p-8 rounded shadow">
            <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto max-h-96 mb-4">{code}</pre>
            <button onClick={handlePublish} className="w-full bg-green-600 text-white font-bold py-4 rounded">Publish</button>
          </div>
        )}

        {step === 'published' && (
          <div className="bg-green-50 border-2 border-green-500 p-8 rounded text-center">
            <h2 className="text-2xl font-bold mb-4">Published to /{slug}</h2>
            <p className="mb-4">Wait 3 seconds for Next.js to compile, then:</p>
            <a href={`/${slug}`} target="_blank" className="bg-[#ffc72d] text-black px-8 py-4 rounded font-bold inline-block">View Page</a>
          </div>
        )}
      </div>
    </div>
  )
}
