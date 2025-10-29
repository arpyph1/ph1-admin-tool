'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const key = params.key as string;
  
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [currentData, setCurrentData] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [fetchingData, setFetchingData] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!key) return;
    
    fetch(`/api/get-team-member?key=${key}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        console.log('Fetched data:', data);
        setCurrentData(data);
        setFetchingData(false);
      })
      .catch(err => {
        console.error('Error fetching team member:', err);
        setFetchingData(false);
      });
  }, [key]);

  const handleGeneratePreview = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/preview-team-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          key,
          prompt,
          currentData 
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setPreviewData(result.teamMember);
        setShowPreview(true);
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Preview error:', error);
      alert('Failed to generate preview');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!previewData) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/update-team-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          key,
          updatedData: previewData
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Team member updated successfully!');
        router.push('/admin/team');
        router.refresh();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update team member');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPreview = () => {
    setShowPreview(false);
    setPreviewData(null);
  };

  if (fetchingData) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <p>Loading team member data...</p>
      </div>
    );
  }

  if (!currentData) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <p className="text-red-600">Team member not found or error loading data</p>
        <p className="text-sm text-gray-600 mt-2">Key: {key}</p>
        <button
          onClick={() => router.push('/admin/team')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Team Members
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Team Member</h1>
        <p className="text-gray-600">Use AI to revise {currentData.name || 'this team member'}'s profile</p>
      </div>

      {!showPreview ? (
        <>
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Current Profile</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold">Name:</span> {currentData.name || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Key:</span> {currentData.key || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Expertise:</span> {currentData.expertise || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Experience:</span> {currentData.experience || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Bio:</span>
                <p className="mt-1 text-gray-700">{currentData.bioPlainText || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                What would you like to change?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Update the bio to emphasize their AI strategy work and add that they recently spoke at the UX Conference 2024..."
                className="w-full h-40 p-4 border rounded-lg resize-none"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Tips for editing:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4 list-disc">
                <li>Be specific about what to change (bio, expertise, experience, etc.)</li>
                <li>You can add new achievements, update titles, or revise descriptions</li>
                <li>The AI will preserve information not mentioned in your prompt</li>
                <li>Name and key (URL slug) typically should not change</li>
              </ul>
            </div>

            <button
              onClick={handleGeneratePreview}
              disabled={loading || !prompt.trim()}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Preview...' : 'Generate Preview'}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              ✓ Preview generated! Review the changes below before publishing.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-500">Current</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold">Name:</span> {currentData.name}
                </div>
                <div>
                  <span className="font-semibold">Expertise:</span> {currentData.expertise}
                </div>
                <div>
                  <span className="font-semibold">Experience:</span> {currentData.experience}
                </div>
                <div>
                  <span className="font-semibold">Bio:</span>
                  <p className="mt-1 text-gray-700">{currentData.bioPlainText}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-blue-500 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-blue-600">New (Preview)</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold">Name:</span> {previewData.name}
                </div>
                <div>
                  <span className="font-semibold">Expertise:</span> {previewData.expertise}
                </div>
                <div>
                  <span className="font-semibold">Experience:</span> {previewData.experience}
                </div>
                <div>
                  <span className="font-semibold">Bio:</span>
                  <p className="mt-1 text-gray-700">{previewData.bio}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleEditPreview}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              ← Edit Prompt
            </button>
            <button
              onClick={handlePublish}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Publishing...' : '✓ Publish Changes'}
            </button>
          </div>
        </>
      )}

      <div className="mt-6">
        <button
          onClick={() => router.push('/admin/team')}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Team Members
        </button>
      </div>
    </div>
  );
}
