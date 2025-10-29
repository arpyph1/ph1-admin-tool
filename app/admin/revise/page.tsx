'use client';

import { useState } from 'react';

export default function RevisePage() {
  const [searchText, setSearchText] = useState('');
  const [replacementText, setReplacementText] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'scanning' | 'results' | 'applying' | 'complete'>('input');
  const [scanResults, setScanResults] = useState<any>(null);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  const handleScan = async () => {
    if (!searchText.trim()) {
      alert('Please enter text to search for');
      return;
    }
    
    setLoading(true);
    setStep('scanning');
    
    try {
      const response = await fetch('/api/contentful-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchText }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setScanResults(data);
        setSelectedEntries(data.entries.map((e: any) => e.entryId));
        setStep('results');
      } else {
        alert('Error: ' + data.error);
        setStep('input');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to scan Contentful');
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!replacementText.trim()) {
      alert('Please enter replacement text');
      return;
    }
    
    if (selectedEntries.length === 0) {
      alert('Please select at least one entry to modify');
      return;
    }
    
    setLoading(true);
    setStep('applying');
    
    try {
      const entriesToUpdate = scanResults.entries.filter((e: any) => 
        selectedEntries.includes(e.entryId)
      );

      const response = await fetch('/api/contentful-replace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchText,
          replacementText,
          entries: entriesToUpdate
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult(data);
        setStep('complete');
      } else {
        alert('Error: ' + data.message);
        setStep('results');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to apply changes');
      setStep('results');
    } finally {
      setLoading(false);
    }
  };

  const toggleEntry = (entryId: string) => {
    setSelectedEntries(prev =>
      prev.includes(entryId)
        ? prev.filter(id => id !== entryId)
        : [...prev, entryId]
    );
  };

  const handleStartOver = () => {
    setStep('input');
    setSearchText('');
    setReplacementText('');
    setScanResults(null);
    setSelectedEntries([]);
    setResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Management Tool</h1>
        <p className="text-gray-600">
          Find and replace text across all Contentful entries
        </p>
      </div>

      {step === 'input' && (
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Step 1: Find Content</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              What text do you want to find?
            </label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="e.g., © PH1 Research 2024"
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Tips:</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-2 ml-4 list-disc">
              <li>This searches all published content in Contentful</li>
              <li>You'll see all matches before making any changes</li>
              <li>All changes are backed up automatically</li>
            </ul>
          </div>

          <button
            onClick={handleScan}
            disabled={loading || !searchText.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300"
          >
            {loading ? 'Scanning...' : 'Scan Content'}
          </button>
        </div>
      )}

      {step === 'scanning' && (
        <div className="bg-white border rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Scanning Contentful...</h2>
          <p className="text-gray-600">Searching all entries for "{searchText}"</p>
        </div>
      )}

      {step === 'results' && scanResults && (
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Step 2: Review & Replace</h2>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800 font-semibold mb-1">
              ✓ Found {scanResults.totalMatches} match{scanResults.totalMatches !== 1 ? 'es' : ''} in {scanResults.totalEntries} entr{scanResults.totalEntries !== 1 ? 'ies' : 'y'}
            </p>
            <p className="text-xs text-green-700">
              Searching for: "{scanResults.searchText}"
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Replace with:
            </label>
            <input
              type="text"
              value={replacementText}
              onChange={(e) => setReplacementText(e.target.value)}
              placeholder="e.g., © PH1 Research 2026"
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3">Content entries with matches:</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {scanResults.entries.map((entry: any) => (
                <div key={entry.entryId} className="border rounded-lg">
                  <div className="p-4 bg-gray-50">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedEntries.includes(entry.entryId)}
                        onChange={() => toggleEntry(entry.entryId)}
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{entry.entryName}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {entry.contentType} • {entry.matches.length} match{entry.matches.length !== 1 ? 'es' : ''}
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  {selectedEntries.includes(entry.entryId) && (
                    <div className="border-t p-4">
                      {entry.matches.map((match: any, idx: number) => (
                        <div key={idx} className="mb-3 last:mb-0">
                          <div className="text-xs text-gray-500 mb-1">
                            Field: {match.fieldKey} ({match.locale})
                          </div>
                          <div className="bg-red-50 border border-red-200 rounded p-2 mb-1">
                            <pre className="text-xs font-mono text-red-700 whitespace-pre-wrap break-words">
                              ...{match.preview}...
                            </pre>
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <span>↓ will become ↓</span>
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded p-2">
                            <pre className="text-xs font-mono text-green-700 whitespace-pre-wrap break-words">
                              ...{match.preview.replace(searchText, replacementText)}...
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Before applying:</strong>
            </p>
            <ul className="text-sm text-yellow-700 mt-2 ml-4 list-disc">
              <li>Changes will be published immediately to your live site</li>
              <li>All changes are backed up automatically</li>
              <li>You can rollback if needed</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleStartOver}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              ← Start Over
            </button>
            <button
              onClick={handleApply}
              disabled={loading || !replacementText.trim() || selectedEntries.length === 0}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300"
            >
              {loading ? 'Applying...' : `✓ Apply to ${selectedEntries.length} Entr${selectedEntries.length !== 1 ? 'ies' : 'y'}`}
            </button>
          </div>
        </div>
      )}

      {step === 'applying' && (
        <div className="bg-white border rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Applying Changes...</h2>
          <p className="text-gray-600">Updating {selectedEntries.length} entr{selectedEntries.length !== 1 ? 'ies' : 'y'} in Contentful</p>
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
            <p className="text-gray-600">Successfully updated {result.entriesModified} entr{result.entriesModified !== 1 ? 'ies' : 'y'} in Contentful</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-blue-800 mb-2">🌐 Check Your Live Site:</p>
            <a 
              href="https://ph1.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Open ph1.ca in New Tab →
            </a>
            <p className="text-xs text-blue-700 mt-2">
              💡 Changes are live immediately on your site
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Summary:</h3>
            <ul className="space-y-1 text-sm">
              <li>✓ Replaced "{searchText}" with "{replacementText}"</li>
              <li>✓ Modified {result.totalReplacements} instance{result.totalReplacements !== 1 ? 's' : ''}</li>
              <li>💾 Backup ID: <code className="bg-gray-200 px-2 py-1 rounded text-xs">{result.backupId}</code></li>
            </ul>
          </div>

          <button
            onClick={handleStartOver}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Make Another Change
          </button>
        </div>
      )}
    </div>
  );
}
