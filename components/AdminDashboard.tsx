'use client'

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Zap,
  RefreshCw,
  Brain,
  Eye,
  Edit,
  Globe,
  Check,
  X,
  RotateCcw,
  Download,
  AlertTriangle,
  Clock
} from 'lucide-react';

type OperationType = 'revise' | 'global';

interface ComponentInfo {
  name: string;
  path: string;
  headings: string[];
  lastModified: string;
}

interface ModificationResult {
  component: string;
  filePath: string;
  backupId: string;
  changesApplied: number;
}

interface BackupInfo {
  id: string;
  timestamp: string;
  canRestore: boolean;
}

const RealPromptDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [promptInput, setPromptInput] = useState('');
  const [selectedOperation, setSelectedOperation] = useState<OperationType>('revise');
  const [targetPage, setTargetPage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [appliedChanges, setAppliedChanges] = useState<ModificationResult[]>([]);
  const [components, setComponents] = useState<ComponentInfo[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [backups, setBackups] = useState<BackupInfo[]>([]);

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    try {
      const response = await fetch('/api/modify-page');
      const result = await response.json();
      if (result.components) {
        setComponents(result.components);
      }
    } catch (error) {
      console.error('Failed to load components:', error);
    }
  };

  const loadBackups = async (filePath: string) => {
    try {
      const response = await fetch(`/api/modify-page?filePath=${encodeURIComponent(filePath)}`);
      const result = await response.json();
      if (result.backups) {
        setBackups(result.backups);
      }
    } catch (error) {
      console.error('Failed to load backups:', error);
    }
  };

  const handlePreview = async () => {
    if (!promptInput.trim()) {
      alert('Please enter a prompt');
      return;
    }

    if (selectedOperation === 'revise' && !targetPage) {
      alert('Please select a page to revise');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/modify-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptInput,
          operation: selectedOperation,
          targetPage: selectedOperation === 'revise' ? targetPage : undefined,
          previewOnly: true
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setPreviewData(result);
        setShowPreview(true);
      } else {
        alert('Preview failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Preview error: ' + error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyChanges = async () => {
    if (!previewData) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/modify-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptInput,
          operation: selectedOperation,
          targetPage: selectedOperation === 'revise' ? targetPage : undefined,
          previewOnly: false
        }),
      });

      const result = await response.json();
      
      if (result.success && result.applied) {
        setAppliedChanges(result.changes);
        setShowPreview(false);
        setPromptInput('');
        await loadComponents(); // Refresh component list
        alert(`✅ Successfully applied changes to ${result.changes.length} component(s)!`);
      } else {
        alert('Apply failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Apply error: ' + error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRollback = async (filePath: string, backupId: string) => {
    if (!confirm('Are you sure you want to rollback this component? This will undo recent changes.')) {
      return;
    }
    
    try {
      const response = await fetch('/api/modify-page', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath, backupId }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('✅ Successfully rolled back changes!');
        await loadComponents();
        setAppliedChanges(appliedChanges.filter(change => change.filePath !== filePath));
      } else {
        alert('Rollback failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Rollback error: ' + error);
    }
  };

  const renderPreviewModal = () => {
    if (!showPreview || !previewData) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Preview Changes</h2>
            <button
              onClick={() => setShowPreview(false)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex flex-1 max-h-[70vh]">
            {/* Modifications List */}
            <div className="w-96 border-r p-6 overflow-auto">
              <h3 className="font-semibold mb-4">Planned Changes</h3>
              
              {previewData.modifications?.map((mod: any, idx: number) => (
                <div key={idx} className="mb-6 p-4 border rounded-lg">
                  <h4 className="font-medium text-sm mb-2">
                    {mod.originalComponent.componentName}
                  </h4>
                  
                  <div className="space-y-2">
                    {mod.modifications.map((change: any, changeIdx: number) => (
                      <div key={changeIdx} className="text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium capitalize">{change.type}</span>
                          <span className="text-gray-500">{change.target}</span>
                        </div>
                        
                        <div className="bg-red-50 p-2 rounded mb-1">
                          <span className="text-red-600">- {change.originalValue}</span>
                        </div>
                        
                        <div className="bg-green-50 p-2 rounded mb-1">
                          <span className="text-green-600">+ {change.newValue}</span>
                        </div>
                        
                        <p className="text-gray-600 italic">{change.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Preview Iframe */}
            <div className="flex-1 p-6">
              <div className="h-full border rounded-lg bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-700 mb-2">Live Preview</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Preview will show modified pages with real styling applied
                  </p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm">
                    Open in New Tab →
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <AlertTriangle className="h-4 w-4" />
              <span>Changes will modify your actual website files</span>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyChanges}
                disabled={isGenerating}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
              >
                {isGenerating ? (
                  <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Status Banner */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-4">
          Real Prompt-Driven System ✨
        </h1>
        <p className="text-lg opacity-90 mb-4">
          Modify your actual website components through AI prompts with preview and rollback
        </p>
        <div className="bg-white/20 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{components.length}</div>
              <div className="text-sm opacity-90">Components</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{appliedChanges.length}</div>
              <div className="text-sm opacity-90">Applied Changes</div>
            </div>
            <div>
              <div className="text-2xl font-bold">Live</div>
              <div className="text-sm opacity-90">System Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* Operation Type Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Choose Operation</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setSelectedOperation('revise')}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selectedOperation === 'revise'
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center mb-3">
              <Edit className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Revise Existing Page</h3>
            <p className="text-sm text-gray-600">Modify and enhance an existing component</p>
          </button>

          <button
            onClick={() => setSelectedOperation('global')}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selectedOperation === 'global'
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center mb-3">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Global Changes</h3>
            <p className="text-sm text-gray-600">Apply changes across multiple components</p>
          </button>
        </div>

        {/* Component Selection for Revise */}
        {selectedOperation === 'revise' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select component to revise:
            </label>
            <select
              value={targetPage}
              onChange={(e) => {
                setTargetPage(e.target.value);
                if (e.target.value) {
                  const component = components.find(c => c.name === e.target.value);
                  if (component) {
                    loadBackups(component.path);
                  }
                }
              }}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a component...</option>
              {components.map((component) => (
                <option key={component.name} value={component.name}>
                  {component.name} ({component.path})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Prompt Input */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Describe what you want to change:
          </label>
          
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Enter your prompt here... (e.g., 'Make the homepage more enterprise-focused with Fortune 500 messaging')"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
          />
          
          <div className="flex space-x-4">
            <button
              onClick={handlePreview}
              disabled={isGenerating || !promptInput.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Changes
                </>
              )}
            </button>
            
            <button
              onClick={() => setPromptInput('')}
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Example Prompts */}
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-3">Example prompts:</p>
          <div className="space-y-2">
            {[
              'Make the homepage more enterprise-focused for Fortune 500 prospects',
              'Add ROI messaging and measurable outcomes to all CTAs',
              'Update About page to emphasize 20+ years of expertise',
              'Optimize all content for AI strategy consulting keywords'
            ].map((example, idx) => (
              <button
                key={idx}
                onClick={() => setPromptInput(example)}
                className="block w-full text-left text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded transition-colors"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applied Changes & Version Control */}
      {appliedChanges.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Recent Changes & Rollback
          </h3>
          
          <div className="space-y-3">
            {appliedChanges.map((change, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{change.component}</h4>
                  <p className="text-sm text-gray-600">
                    {change.changesApplied} modifications applied to {change.filePath}
                  </p>
                </div>
                
                <button
                  onClick={() => handleRollback(change.filePath, change.backupId)}
                  className="px-3 py-2 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 flex items-center text-sm"
                >
                  <RotateCcw className="mr-1 h-4 w-4" />
                  Rollback
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Component Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Component Status</h3>
        
        <div className="grid gap-3">
          {components.map((component, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border rounded">
              <div>
                <h4 className="font-medium">{component.name}</h4>
                <p className="text-xs text-gray-500">{component.path}</p>
                {component.headings.length > 0 && (
                  <p className="text-xs text-gray-600">
                    Headings: {component.headings.slice(0, 2).join(', ')}
                    {component.headings.length > 2 && '...'}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-xs text-gray-500">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const sidebarItems = [
    { id: 'dashboard', label: 'Live Editor', icon: LayoutDashboard },
    { id: 'components', label: 'Components', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">PH1 Live Editor</h1>
          <p className="text-sm text-gray-600">Real Component Modification</p>
        </div>
        
        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                  activeSection === item.id ? 'bg-blue-50 border-r-2 border-blue-600 text-blue-600' : 'text-gray-700'
                }`}
              >
                <IconComponent className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeSection === 'dashboard' && renderDashboard()}
          {activeSection === 'components' && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Component Library</h3>
              <p className="text-gray-600">Browse and manage your website components</p>
            </div>
          )}
          {activeSection === 'settings' && (
            <div className="text-center py-12">
              <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">System Settings</h3>
              <p className="text-gray-600">Configure your modification preferences</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {renderPreviewModal()}
    </div>
  );
};

export default RealPromptDashboard;
