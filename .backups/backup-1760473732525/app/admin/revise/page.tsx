'use client';

import { useState } from 'react';

type TaskType = 'component' | 'content' | 'global' | 'seo' | 'custom';

interface QuickTask {
  label: string;
  prompt: string;
  type: TaskType;
}

const quickTasks: QuickTask[] = [
  {
    label: 'Show/hide team carousel on /about',
    prompt: 'Show or hide the team member carousel on the /about page',
    type: 'component'
  },
  {
    label: 'Remove duplicate titles on service pages',
    prompt: 'Remove the duplicate "Our clients" title from all /service pages',
    type: 'global'
  },
  {
    label: 'Update footer copyright year',
    prompt: 'Update the footer on all pages to change "© PH1 Research 2024" to "© PH1 Research 2026"',
    type: 'global'
  },
  {
    label: 'Prioritize AI strategy on /about',
    prompt: 'Update the content on /about page to prioritize our AI strategy work and capabilities',
    type: 'content'
  },
  {
    label: 'SEO audit and recommendations',
    prompt: 'Analyze all pages and make recommendations to improve SEO meta info to enhance search performance',
    type: 'seo'
  }
];

export default function RevisePage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'scanning' | 'analyzing' | 'preview' | 'applying' | 'complete' | 'error'>('input');
  const [projectFiles, setProjectFiles] = useState<any>(null);
  const [changes, setChanges] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [expandedChange, setExpandedChange] = useState<number | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState<any>(null);

  const handleQuickTask = (task: QuickTask) => {
    setPrompt(task.prompt);
  };

  const handleScanAndAnalyze = async () => {
    setLoading(true);
    setStep('scanning');
    
    try {
      const scanResponse = await fetch('/api/scan-project');
      const scanData = await scanResponse.json();
      
      if (!scanData.success) {
        alert('Error scanning project: ' + scanData.error);
        setLoading(false);
        setStep('input');
        return;
      }
      
      setProjectFiles(scanData);
      setStep('analyzing');
      
      const relevantFiles = [
        ...scanData.pages,
        ...scanData.layouts,
        ...scanData.components.filter((f: any) => 
          f.relativePath.includes('footer') || 
          f.relativePath.includes('about') ||
          f.relativePath.includes('service')
        )
      ];
      
      const changesResponse = await fetch('/api/generate-changes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          targetFiles: relevantFiles.slice(0, 10)
        }),
      });
      
      const changesData = await changesResponse.json();
      
      if (changesData.success) {
        setChanges(changesData);
        setStep('preview');
      } else {
        alert('Error generating changes: ' + changesData.error);
        setStep('input');
      }
      
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process request');
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyChanges = async () => {
    setLoading(true);
    setStep('applying');
    
    try {
      const applyResponse = await fetch('/api/apply-changes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changes: changes.changes }),
      });
      
      const applyData = await applyResponse.json();
      console.log('Apply response:', applyData);
      
      if (applyData.success) {
        setResult(applyData);
        setStep('complete');
      } else {
        setErrorDetails(applyData);
        setStep('error');
      }
      
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to apply changes');
      setStep('preview');
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async () => {
    if (!result?.backupId) return;
    
    if (!confirm('Are you sure you want to rollback all changes? This will restore all files to their previous state.')) {
      return;
    }
    
    setLoading(true);
    
    try {
      const rollbackResponse = await fetch('/api/rollback-changes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupId: result.backupId }),
      });
      
      const rollbackData = await rollbackResponse.json();
      
      if (rollbackData.success) {
        alert('Successfully rolled back all changes!');
        handleStartOver();
      } else {
        alert('Error rolling back: ' + rollbackData.error);
      }
      
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to rollback changes');
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setStep('input');
    setPrompt('');
    setProjectFiles(null);
    setChanges(null);
    setResult(null);
    setExpandedChange(null);
    setErrorDetails(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Site Revision Tool</h1>
        <p className="text-gray-600">
          Make site-wide changes with plain-English explanations and rollback capabilities
        </p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${step === 'input' ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">1</div>
            Input
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
          <div className={`flex items-center ${step === 'scanning' || step === 'analyzing' ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">2</div>
            Analyze
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
          <div className={`flex items-center ${step === 'preview' ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">3</div>
            Preview
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
          <div className={`flex items-center ${step === 'applying' || step === 'complete' ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">4</div>
            Apply
          </div>
        </div>
      </div>

      {step === 'input' && (
        <>
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Quick Tasks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {quickTasks.map((task, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickTask(task)}
                  className="text-left p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">{task.label}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {task.type === 'component' && '🔧 Component'}
                    {task.type === 'content' && '📝 Content'}
                    {task.type === 'global' && '🌐 Global'}
                    {task.type === 'seo' && '🔍 SEO'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Revision Request</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                What would you like to change?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Update the hero section on the homepage to emphasize our 20+ years of experience..."
                className="w-full h-40 p-4 border rounded-lg resize-none"
              />
            </div>

            <button
              onClick={handleScanAndAnalyze}
              disabled={loading || !prompt.trim()}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Scan & Analyze Changes'}
            </button>
          </div>
        </>
      )}

      {(step === 'scanning' || step === 'analyzing') && (
        <div className="bg-white border rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">
            {step === 'scanning' ? 'Scanning Project...' : 'Analyzing & Generating...'}
          </h2>
          <p className="text-gray-600">
            {step === 'scanning' ? 'Finding relevant files' : 'AI is creating plain-English explanations'}
          </p>
        </div>
      )}

      {step === 'error' && errorDetails && (
        <div className="bg-white border border-red-300 rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Changes Failed</h2>
            <p className="text-gray-600">{errorDetails.message}</p>
            <p className="text-sm text-green-600 mt-2">✓ Your backup was preserved - no files were changed</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-800 mb-3">Failed Changes:</h3>
            <div className="space-y-2">
              {errorDetails.failedChanges?.map((failed: any, index: number) => (
                <div key={index} className="text-sm bg-white p-3 rounded border border-red-200">
                  <div className="font-medium text-red-700">{failed.file}</div>
                  <div className="text-red-600 mt-1">{failed.message}</div>
                </div>
              ))}
            </div>
          </div>

          {errorDetails.results && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">All Results:</h3>
              <ul className="space-y-1">
                {errorDetails.results.map((r: any, index: number) => (
                  <li key={index} className={`text-sm ${r.success ? 'text-green-600' : 'text-red-600'}`}>
                    {r.success ? '✓' : '✗'} {r.file} - {r.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>💡 What to do:</strong> The AI couldn't find the exact code it was looking for. This usually means:
            </p>
            <ul className="text-sm text-blue-700 mt-2 ml-4 list-disc">
              <li>The file structure is different than expected</li>
              <li>The code has been modified since analysis</li>
              <li>The AI needs more specific instructions</li>
            </ul>
            <p className="text-sm text-blue-800 mt-2">
              Try rephrasing your request or check the terminal logs for more details.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleStartOver}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              ← Try Again
            </button>
            <button
              onClick={() => setStep('preview')}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              Back to Preview
            </button>
          </div>
        </div>
      )}

      {step === 'preview' && changes && (
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Preview Changes</h2>
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showTechnicalDetails ? '👁️ Hide' : '👁️ Show'} Technical Details
            </button>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-blue-800 mb-2">📋 What Will Change:</p>
            <p className="text-sm text-blue-800 mb-3">{changes.summary}</p>
            {changes.expectedOutcome && (
              <p className="text-xs text-blue-700">
                <strong>After applying:</strong> {changes.expectedOutcome}
              </p>
            )}
            <p className="text-xs text-blue-600 mt-3">
              ✓ All changes will be backed up automatically before applying
            </p>
          </div>

          {changes.warnings && changes.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-yellow-800 mb-2">⚠️ Important Notes:</p>
              <ul className="text-sm text-yellow-700 space-y-1 ml-4 list-disc">
                {changes.warnings.map((warning: string, index: number) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4 mb-6">
            {changes.changes.map((change: any, index: number) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-lg mb-1">
                        {change.description}
                      </div>
                      {change.visualImpact && (
                        <div className="text-sm text-blue-600 mb-2">
                          👁️ <strong>What you'll see:</strong> {change.visualImpact}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        📄 File: {change.file}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ml-4 ${
                      change.confidence === 'high' ? 'bg-green-100 text-green-800' :
                      change.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {change.confidence}
                    </span>
                  </div>
                  
                  {change.reasoning && (
                    <div className="text-sm text-gray-600 mt-2 italic">
                      💡 {change.reasoning}
                    </div>
                  )}
                </div>
                
                {showTechnicalDetails && (
                  <div className="border-t">
                    <button
                      onClick={() => setExpandedChange(expandedChange === index ? null : index)}
                      className="w-full p-3 flex items-center justify-between hover:bg-gray-50 text-sm text-gray-600"
                    >
                      <span>{change.technicalDetail || 'View code changes'}</span>
                      <svg 
                        className={`w-5 h-5 transition-transform ${expandedChange === index ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {expandedChange === index && (
                      <div className="border-t p-4 bg-gray-50">
                        {change.original && (
                          <div className="mb-3">
                            <div className="text-xs font-semibold text-red-700 mb-1 flex items-center">
                              <span className="bg-red-100 px-2 py-1 rounded mr-2">- REMOVE</span>
                              Original Code
                            </div>
                            <pre className="bg-red-50 p-3 rounded text-xs overflow-x-auto border border-red-200 font-mono">
                              <code>{change.original}</code>
                            </pre>
                          </div>
                        )}
                        
                        {change.replacement && (
                          <div>
                            <div className="text-xs font-semibold text-green-700 mb-1 flex items-center">
                              <span className="bg-green-100 px-2 py-1 rounded mr-2">+ ADD</span>
                              {change.type === 'add' ? 'New Code' : 'Replacement Code'}
                            </div>
                            <pre className="bg-green-50 p-3 rounded text-xs overflow-x-auto border border-green-200 font-mono">
                              <code>{change.replacement}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleStartOver}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              ← Cancel
            </button>
            <button
              onClick={handleApplyChanges}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300"
            >
              {loading ? 'Applying...' : '✓ Apply All Changes'}
            </button>
          </div>
        </div>
      )}

      {step === 'applying' && (
        <div className="bg-white border rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Applying Changes...</h2>
          <p className="text-gray-600">Creating backup and writing changes to files</p>
        </div>
      )}

      {step === 'complete' && result && (
        <div className="bg-white border rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Changes Applied!</h2>
            <p className="text-gray-600">{result.message}</p>
            {changes.expectedOutcome && (
              <p className="text-sm text-blue-600 mt-2">
                <strong>What to test:</strong> {changes.expectedOutcome}
              </p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Files Modified:</h3>
            <ul className="space-y-1">
              {result.results.map((r: any, index: number) => (
                <li key={index} className="text-sm">
                  {r.success ? '✓' : '✗'} {r.file}
                </li>
              ))}
            </ul>
            
            {result.backupPath && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-600">
                  💾 Backup saved to: <code className="bg-gray-200 px-2 py-1 rounded">{result.backupPath}</code>
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleRollback}
              disabled={loading}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300"
            >
              {loading ? 'Rolling back...' : '↺ Rollback Changes'}
            </button>
            <button
              onClick={handleStartOver}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Make Another Change
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
