'use client';

import { useState, useEffect } from 'react';

export default function ChangeLog() {
  const [changes, setChanges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChanges();
  }, []);

  async function loadChanges() {
    const res = await fetch('/api/changelog-unified');
    const data = await res.json();
    setChanges(data.changes || []);
    setLoading(false);
  }

  return (
    <div className="max-w-6xl mx-auto px-8">
      <h1 className="text-4xl font-bold mb-2">Change Log</h1>
      <p className="text-gray-600 mb-8">All changes from Smart Edit and Template Editor</p>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : changes.length === 0 ? (
        <div className="bg-white rounded-xl border-2 p-12 text-center">
          <p className="text-gray-600">No changes yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {changes.map((change) => (
            <div key={change.id} className="bg-white rounded-xl border-2 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold">{change.type}</h3>
                  <p className="text-sm text-gray-600">{new Date(change.timestamp).toLocaleString()}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {change.tool}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{change.description}</p>
              <div className="text-sm text-gray-600">
                <strong>Files changed:</strong> {change.filesChanged?.join(', ')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
