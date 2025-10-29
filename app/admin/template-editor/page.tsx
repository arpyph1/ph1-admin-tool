'use client';

import { useState, useEffect } from 'react';

export default function TemplateEditor() {
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadFiles();
  }, []);

  async function loadFiles() {
    try {
      const res = await fetch('/api/template-editor/list');
      const data = await res.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  }

  async function loadFile(file: any) {
    setLoading(true);
    try {
      const res = await fetch(`/api/template-editor/read?path=${encodeURIComponent(file.path)}`);
      const data = await res.json();
      
      if (data.success) {
        setContent(data.content);
        setOriginalContent(data.content);
        setSelectedFile(file);
      } else {
        alert('Failed to load file');
      }
    } catch (error) {
      console.error('Error loading file:', error);
      alert('Error loading file');
    } finally {
      setLoading(false);
    }
  }

  async function saveAndDeploy() {
    if (!selectedFile) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/template-editor/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: selectedFile.path,
          content,
          originalContent
        })
      });

      if (res.ok) {
        alert('✓ Saved and deployed! Changes will be live in 2-3 minutes.');
        setOriginalContent(content);
      } else {
        alert('Failed to save');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving');
    } finally {
      setLoading(false);
    }
  }

  const hasChanges = content !== originalContent;
  const filteredFiles = searchTerm 
    ? files.filter(f => f.path.toLowerCase().includes(searchTerm.toLowerCase()))
    : files;

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <h1 className="text-4xl font-bold mb-2">Template Editor</h1>
      <p className="text-gray-600 mb-8">Direct file editing with auto-deploy</p>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4 sticky top-8">
            <h3 className="font-bold mb-4">Templates</h3>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded mb-4 text-sm"
            />
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {filteredFiles.map(file => (
                <button
                  key={file.path}
                  onClick={() => loadFile(file)}
                  className={`w-full text-left p-2 rounded text-sm transition-colors ${
                    selectedFile?.path === file.path 
                      ? 'bg-blue-50 text-blue-700 font-semibold' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="truncate">{file.name}</div>
                  <div className="text-xs text-gray-500 truncate">{file.dir}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-9">
          {!selectedFile ? (
            <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2">Select a template</h3>
              <p className="text-gray-600">Choose a file from the list to start editing</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border-2 border-gray-200">
              <div className="bg-gray-50 border-b-2 border-gray-200 p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{selectedFile.name}</h3>
                  <p className="text-sm text-gray-600">{selectedFile.path}</p>
                </div>
                <div className="flex gap-3 items-center">
                  {hasChanges && (
                    <span className="text-orange-600 font-semibold text-sm">• Unsaved changes</span>
                  )}
                  <button
                    onClick={() => setContent(originalContent)}
                    disabled={!hasChanges}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    Reset
                  </button>
                  <button
                    onClick={saveAndDeploy}
                    disabled={!hasChanges || loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : '💾 Save & Deploy'}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-[600px] p-4 font-mono text-sm border rounded-lg"
                  spellCheck={false}
                  style={{ lineHeight: '1.5' }}
                />
              </div>
              <div className="bg-blue-50 border-t-2 border-blue-200 p-4">
                <p className="text-sm text-blue-800">
                  💡 Changes auto-deploy to Vercel. Live in 2-3 minutes after saving.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
