'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  const tools = [
    {
      href: '/admin/edit',
      icon: '📄',
      title: 'Create Landing Page',
      description: 'Generate new landing pages with AI - includes preview and publish workflow',
      status: 'Primary Tool',
      color: 'from-green-500 to-emerald-600',
      textColor: 'text-green-600'
    },
    {
      href: '/admin/revise',
      icon: '🔍',
      title: 'Find & Replace',
      description: 'Search and replace text across all Contentful entries with preview',
      status: 'Primary Tool',
      color: 'from-blue-500 to-cyan-600',
      textColor: 'text-blue-600'
    },
    {
      href: '/admin/draft',
      icon: '✏️',
      title: 'Smart Composer',
      description: 'Build pages from existing components with AI assistance',
      status: 'Advanced',
      color: 'from-purple-500 to-pink-600',
      textColor: 'text-purple-600'
    },
    {
      href: '/admin/generate',
      icon: '⚡',
      title: 'Quick Generator',
      description: 'Fast page generation with guided Q&A flow',
      status: 'Quick Tool',
      color: 'from-orange-500 to-red-600',
      textColor: 'text-orange-600'
    },
    {
      href: '/admin/curate',
      icon: '📦',
      title: 'Component Library',
      description: 'Manage and curate reusable page components',
      status: 'Management',
      color: 'from-pink-500 to-rose-600',
      textColor: 'text-pink-600'
    },
    {
      href: '/admin/changelog',
      icon: '📜',
      title: 'Change Log',
      description: 'View all changes and rollback if needed',
      status: 'Tracking',
      color: 'from-indigo-500 to-blue-600',
      textColor: 'text-indigo-600'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-3">Welcome to PH1 Admin</h1>
        <p className="text-xl text-gray-600">Manage your website content with AI-powered tools</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">🚀</div>
            <Link href="/admin/edit" className="text-sm font-semibold text-green-600 hover:text-green-700">
              Go →
            </Link>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Most Used</h3>
          <p className="text-sm text-gray-600">Landing Page Generator</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">🌐</div>
            <a href="https://ph1.ca" target="_blank" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              Open →
            </a>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Live Site</h3>
          <p className="text-sm text-gray-600">ph1.ca</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">📝</div>
            <a href="https://app.contentful.com" target="_blank" className="text-sm font-semibold text-purple-600 hover:text-purple-700">
              Open →
            </a>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Contentful CMS</h3>
          <p className="text-sm text-gray-600">Manage content</p>
        </div>
      </div>

      {/* All Tools */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Tools</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group bg-white rounded-xl border-2 border-gray-200 hover:border-gray-300 p-6 transition-all hover:shadow-2xl hover:-translate-y-1"
          >
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} mb-4`}>
              <span className="text-3xl">{tool.icon}</span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700">
              {tool.title}
            </h3>
            
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {tool.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold ${tool.textColor} px-3 py-1 bg-gray-50 rounded-full`}>
                {tool.status}
              </span>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* System Status */}
      <div className="mt-12 bg-white rounded-xl border-2 border-gray-200 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">System Status</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">●</div>
            <div className="text-sm font-semibold text-gray-900">All Systems</div>
            <div className="text-xs text-gray-500">Operational</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">✓</div>
            <div className="text-sm font-semibold text-gray-900">Contentful</div>
            <div className="text-xs text-gray-500">Connected</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">6</div>
            <div className="text-sm font-semibold text-gray-900">Tools</div>
            <div className="text-xs text-gray-500">Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">💾</div>
            <div className="text-sm font-semibold text-gray-900">Auto Backup</div>
            <div className="text-xs text-gray-500">Enabled</div>
          </div>
        </div>
      </div>
    </div>
  );
}
