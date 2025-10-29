'use client'

import { useState, useEffect } from 'react'

interface PreviewProps {
  variations: Array<{
    name: string
    description: string
    previewHtml: string
    tone: string
  }>
  onSelect: (tone: string) => void
  onClose: () => void
}

export default function InteractivePreview({ variations, onSelect, onClose }: PreviewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.action === 'select') {
        onSelect(event.data.tone)
      }
    }
    
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onSelect])
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">Choose Your Design</h2>
            <div className="flex gap-2">
              {variations.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedIndex === i
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold"
          >
            ✕ Close
          </button>
        </div>
        
        <div className="p-4 bg-blue-50 border-b">
          <p className="text-sm text-blue-900">
            <strong className="font-semibold">{variations[selectedIndex].name}:</strong> {variations[selectedIndex].description}
          </p>
        </div>
        
        <div className="flex-1 overflow-hidden bg-gray-100">
          <iframe
            srcDoc={variations[selectedIndex].previewHtml}
            className="w-full h-full border-0"
            title="Preview"
          />
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Click a design tab above or the green button in the preview
          </div>
          <button
            onClick={() => onSelect(variations[selectedIndex].tone)}
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg hover:shadow-xl transition-all"
          >
            ✓ Use {variations[selectedIndex].name} Design
          </button>
        </div>
      </div>
    </div>
  )
}
