'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTeamMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-team-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Team member created successfully!');
        router.push('/admin/team');
        router.refresh();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Failed to create team member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Team Member</h1>
        <p className="text-gray-600">Use AI to generate a new team member page</p>
      </div>

      <div className="bg-white border rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Describe the team member to create
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Create a team member page for Sarah Chen, our new Senior UX Researcher with 8 years of experience in healthcare technology..."
            className="w-full h-40 p-4 border rounded-lg resize-none"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Tips:</strong>
          </p>
          <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4 list-disc">
            <li>Include their full name, role/title, and key expertise</li>
            <li>Mention years of experience and notable achievements</li>
            <li>Include any specializations or unique skills</li>
            <li>The key (URL slug) will be auto-generated from their name</li>
          </ul>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Team Member...' : 'Generate Team Member Page'}
        </button>
      </div>

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
