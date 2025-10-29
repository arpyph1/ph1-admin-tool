import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <a href="/admin" className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PH1</span>
                </div>
                <span className="text-xl font-bold text-gray-900 group-hover:text-gray-700">Admin</span>
              </a>
              
              <div className="hidden md:flex space-x-1">
                <a href="/admin" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                  Dashboard
                </a>
                <a href="/admin/edit" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                  Landing Page
                </a>
                <a href="/admin/revise" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                  Find & Replace
                </a>
                <a href="/admin/changelog" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                  Changes
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <a 
                href="https://ph1.ca" 
                target="_blank"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <span>View Live Site</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-12">
        {children}
      </main>

      <footer className="bg-white border-t-2 border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>© 2026 PH1 Research • Admin Dashboard</div>
            <div className="flex space-x-6">
              <a href="https://app.contentful.com" target="_blank" className="hover:text-gray-900">Contentful</a>
              <a href="/admin/changelog" className="hover:text-gray-900">Change Log</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
