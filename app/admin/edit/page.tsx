'use client';

import React, { useState } from 'react';
import { Loader2, CheckCircle, Sparkles, FileText, ExternalLink, Clock, Edit2 } from 'lucide-react';

export default function EditPanel() {
  const [step, setStep] = useState<'form' | 'preview' | 'published'>('form');
  const [loading, setLoading] = useState(false);
  
  const [purpose, setPurpose] = useState('');
  const [selling, setSelling] = useState('');
  const [proofPoints, setProofPoints] = useState('');
  const [takeaway, setTakeaway] = useState('');
  const [cta, setCta] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [wordCount, setWordCount] = useState('300');
  const [includeLinks, setIncludeLinks] = useState(true);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [showCaseStudies, setShowCaseStudies] = useState(false);
  const [showTrends, setShowTrends] = useState(false);
  const [showContactForm, setShowContactForm] = useState(true);
  
  const [preview, setPreview] = useState<any>(null);
  const [modifications, setModifications] = useState<any>(null);
  const [publishedSlug, setPublishedSlug] = useState('');

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted');
    console.log('Purpose:', purpose);
    console.log('Selling:', selling);
    console.log('Document:', documentFile?.name);
    
    if (!purpose.trim() || !selling.trim()) {
      alert('Please fill in Headline and Subheadline');
      return;
    }
    
    await generateContent();
  };

  const generateContent = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('purpose', purpose.trim());
      formData.append('selling', selling.trim());
      formData.append('proofPoints', proofPoints.trim());
      formData.append('takeaway', takeaway.trim());
      formData.append('cta', cta.trim());
      formData.append('heroImage', heroImage.trim());
      formData.append('wordCount', wordCount);
      formData.append('includeLinks', includeLinks.toString());
      formData.append('showCaseStudies', showCaseStudies.toString());
      formData.append('showTrends', showTrends.toString());
      formData.append('showContactForm', showContactForm.toString());
      
      if (documentFile) {
        console.log('Adding document to request:', documentFile.name);
        formData.append('document', documentFile);
      }

      const res = await fetch('/api/prompt-modify', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        alert('Error: ' + data.error);
      } else if (data.preview) {
        setPreview(data.preview);
        setModifications(data.modifications);
        setStep('preview');
      }
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!modifications) return;
    setLoading(true);

    try {
      const res = await fetch('/api/prompt-modify', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modifications }),
      });

      const data = await res.json();
      
      if (data.error) {
        alert('Error publishing: ' + data.error);
        setLoading(false);
        return;
      }
      
      if (data.success) {
        const slug = modifications[0]?.fields?.key?.['en-US'];
        setPublishedSlug(slug);
        setStep('published');
      }
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'published') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-6">Published Successfully!</h2>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
              <Clock className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm text-yellow-800">Content will appear in 2-5 minutes</p>
            </div>
            <a href={`/${publishedSlug}`} target="_blank" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-6">
              View Page <ExternalLink className="w-4 h-4" />
            </a>
            <div className="mt-6">
              <button onClick={() => window.location.reload()} className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600">
                Create Another Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'preview' && preview) {
    const item = preview[0].after;
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gray-100 border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Preview Your Landing Page</h2>
              {documentFile && (
                <p className="text-sm text-green-600 mt-1">✓ Generated from: {documentFile.name}</p>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('form')} className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 flex items-center gap-2">
                <Edit2 className="w-4 h-4" />Edit
              </button>
              <button onClick={handlePublish} disabled={loading} className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Publish
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-20 items-start">
            <div>
              <h1 className="text-6xl font-bold mb-6">{item.heroHeadline}</h1>
              <p className="text-xl text-gray-700 mb-8">{item.heroSubheadline}</p>
              <div 
                className="prose max-w-none" 
                style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: '#374151'
                }}
                dangerouslySetInnerHTML={{ __html: item.mainContent }} 
              />
            </div>
            <div className="sticky top-20">
              <img src={item.heroImage} alt="Hero" className="w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Create Landing Page</h1>
          </div>
          
          <form onSubmit={handleInitialSubmit} className="space-y-6">
            {/* Document Upload - Simple visible input */}
            <div>
              <label className="block font-semibold mb-2">Upload Reference Document (Optional)</label>
              <input 
                type="file"
                accept=".txt,.md,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    console.log('File selected:', file.name, file.size);
                    setDocumentFile(file);
                  }
                }}
                className="w-full p-3 border-2 rounded-xl focus:border-blue-500 focus:outline-none"
              />
              {documentFile && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {documentFile.name} ({(documentFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
            
            <div>
              <label className="block font-semibold mb-2">Headline *</label>
              <input 
                type="text"
                value={purpose} 
                onChange={(e) => setPurpose(e.target.value)} 
                placeholder="e.g., Your VoC CX report is ready" 
                className="w-full p-4 border-2 rounded-xl focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block font-semibold mb-2">Subheadline *</label>
              <textarea 
                value={selling} 
                onChange={(e) => setSelling(e.target.value)} 
                placeholder="Brief description" 
                rows={3} 
                className="w-full p-4 border-2 rounded-xl focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block font-semibold mb-2">Detailed Requirements</label>
              <textarea 
                value={proofPoints} 
                onChange={(e) => setProofPoints(e.target.value)} 
                placeholder="e.g., Include 5 links, add bullet list, video: https://youtube.com/watch?v=ABC123" 
                rows={6} 
                className="w-full p-4 border-2 rounded-xl focus:border-blue-500 focus:outline-none" 
              />
            </div>
            
            <div>
              <label className="block font-semibold mb-2">Closing Statement</label>
              <textarea 
                value={takeaway} 
                onChange={(e) => setTakeaway(e.target.value)} 
                placeholder="Final impactful message" 
                rows={3} 
                className="w-full p-4 border-2 rounded-xl focus:border-blue-500 focus:outline-none" 
              />
            </div>
            
            <div>
              <label className="block font-semibold mb-2">Hero Image URL (optional)</label>
              <input 
                type="text" 
                value={heroImage} 
                onChange={(e) => setHeroImage(e.target.value)} 
                placeholder="https://example.com/image.svg" 
                className="w-full p-4 border-2 rounded-xl focus:border-blue-500 focus:outline-none" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2">Target Word Count</label>
                <input 
                  type="number" 
                  value={wordCount} 
                  onChange={(e) => setWordCount(e.target.value)} 
                  className="w-full p-4 border-2 rounded-xl focus:border-blue-500 focus:outline-none" 
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">CTA Button Text</label>
                <input 
                  type="text" 
                  value={cta} 
                  onChange={(e) => setCta(e.target.value)} 
                  placeholder="e.g., Contact Us" 
                  className="w-full p-4 border-2 rounded-xl focus:border-blue-500 focus:outline-none" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setShowCaseStudies(!showCaseStudies)}
                className={'p-4 rounded-xl border-2 transition-all text-left ' + (showCaseStudies ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300')}
              >
                <div className="font-semibold mb-1">Case Studies</div>
                <div className="text-sm">{showCaseStudies ? 'Yes' : 'No'}</div>
              </button>
              <button
                type="button"
                onClick={() => setShowTrends(!showTrends)}
                className={'p-4 rounded-xl border-2 transition-all text-left ' + (showTrends ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300')}
              >
                <div className="font-semibold mb-1">Trends</div>
                <div className="text-sm">{showTrends ? 'Yes' : 'No'}</div>
              </button>
              <button
                type="button"
                onClick={() => setShowContactForm(!showContactForm)}
                className={'p-4 rounded-xl border-2 transition-all text-left ' + (showContactForm ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300')}
              >
                <div className="font-semibold mb-1">Contact Form</div>
                <div className="text-sm">{showContactForm ? 'Yes' : 'No'}</div>
              </button>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {documentFile ? 'Generate from Document' : 'Generate Preview'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
