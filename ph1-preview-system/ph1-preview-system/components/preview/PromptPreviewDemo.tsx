import React, { useState, useEffect } from 'react';
import { Zap, Send, Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react';
import SmartPreviewSystem from './SmartPreviewSystem';
import { PromptAnalysisEngine } from './PromptAnalysisEngine';
import { PreviewContentGenerator } from './PreviewContentGenerator';

interface DemoState {
  prompt: string;
  isAnalyzing: boolean;
  analysis: any;
  changes: any[];
  previewReady: boolean;
  currentContent: any;
  previewContent: any;
  showPreview: boolean;
}

const PromptPreviewDemo: React.FC = () => {
  const [state, setState] = useState<DemoState>({
    prompt: '',
    isAnalyzing: false,
    analysis: null,
    changes: [],
    previewReady: false,
    currentContent: null,
    previewContent: null,
    showPreview: false
  });

  const [selectedExample, setSelectedExample] = useState<string>('');

  const examplePrompts = {
    enterprise: "Make our homepage more appealing to Fortune 500 companies. Focus on enterprise-grade language, add trust signals, and emphasize compliance and scale.",
    calculator: "Add an ROI calculator to our UX Research service page to help prospects understand the value of our services.",
    seo: "Optimize the entire site for 'customer experience consulting' and related enterprise keywords to improve our search rankings.",
    design: "Update our color scheme to be more professional and corporate. Make the layout more prominent with larger text.",
    tone: "Make all our messaging more urgent and action-oriented. Update CTAs to emphasize measurable ROI and business outcomes."
  };

  const handlePromptSubmit = async () => {
    if (!state.prompt.trim()) return;

    setState(prev => ({ ...prev, isAnalyzing: true, showPreview: false }));

    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const analysis = PromptAnalysisEngine.analyzePrompt(state.prompt);
      const changes = await PromptAnalysisEngine.generateChanges(state.prompt, state.currentContent);
      
      setState(prev => ({
        ...prev,
        analysis,
        changes,
        isAnalyzing: false,
        previewReady: true
      }));

      // Generate preview content
      const previewContent = await PreviewContentGenerator.generatePreview({
        baseContent: state.currentContent,
        changes,
        mode: 'after'
      });

      setState(prev => ({
        ...prev,
        previewContent,
        showPreview: true
      }));

    } catch (error) {
      console.error('Error analyzing prompt:', error);
      setState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  const handleExampleSelect = (key: string) => {
    setSelectedExample(key);
    setState(prev => ({ ...prev, prompt: examplePrompts[key as keyof typeof examplePrompts] }));
  };

  const handleApproveChanges = async () => {
    console.log('Applying changes...', state.changes);
    // In a real implementation, this would apply the changes to the actual site
    alert('Changes would be applied to the live site!');
  };

  const handleRejectChanges = () => {
    setState(prev => ({
      ...prev,
      showPreview: false,
      previewReady: false,
      changes: [],
      analysis: null
    }));
  };

  const handleModifyRequest = (feedback: string) => {
    console.log('Modification requested:', feedback);
    // In a real implementation, this would refine the changes based on feedback
  };

  useEffect(() => {
    // Initialize with default content
    setState(prev => ({
      ...prev,
      currentContent: {
        hero: {
          title: "Product & Strategy Consulting",
          subtitle: "We help companies build products that people love",
          cta: "Get Started"
        }
      }
    }));
  }, []);

  if (state.showPreview) {
    return (
      <SmartPreviewSystem
        prompt={state.prompt}
        changes={state.changes}
        originalContent={state.currentContent}
        previewContent={state.previewContent}
        onApprove={handleApproveChanges}
        onReject={handleRejectChanges}
        onModify={handleModifyRequest}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">PH1 Prompt-Driven System</h1>
                <p className="text-sm text-gray-500">Transform your website with natural language</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Demo Environment
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                How the Prompt-Driven System Works
              </h2>
              <div className="text-blue-800 space-y-2">
                <p>
                  <strong>1. Describe what you want:</strong> Use natural language to describe changes you want to make to your website.
                </p>
                <p>
                  <strong>2. AI analyzes your request:</strong> Our system understands your intent and generates specific change recommendations.
                </p>
                <p>
                  <strong>3. Preview before applying:</strong> See exactly how your changes will look with side-by-side comparison and impact analysis.
                </p>
                <p>
                  <strong>4. Apply or refine:</strong> Approve the changes or request modifications until it's perfect.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Example Prompts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Try These Example Prompts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(examplePrompts).map(([key, prompt]) => (
              <button
                key={key}
                onClick={() => handleExampleSelect(key)}
                className={`text-left p-4 border rounded-lg transition-colors ${
                  selectedExample === key 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-gray-900 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </div>
                <div className="text-sm text-gray-600 line-clamp-3">
                  {prompt}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter Your Prompt</h3>
          <div className="space-y-4">
            <textarea
              value={state.prompt}
              onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
              placeholder="Describe the changes you want to make to your website..."
              className="w-full p-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Be specific about what you want to change and why
              </div>
              <button
                onClick={handlePromptSubmit}
                disabled={!state.prompt.trim() || state.isAnalyzing}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {state.isAnalyzing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
                <span>{state.isAnalyzing ? 'Analyzing...' : 'Generate Preview'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        {state.analysis && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Intent</div>
                <div className="font-medium text-gray-900">{state.analysis.intent}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Scope</div>
                <div className="font-medium text-gray-900 capitalize">{state.analysis.scope}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Change Types</div>
                <div className="font-medium text-gray-900">{state.analysis.changeTypes.join(', ')}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Confidence</div>
                <div className="font-medium text-gray-900">{Math.round(state.analysis.confidence * 100)}%</div>
              </div>
            </div>

            {state.analysis.targetAudience && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <div className="text-blue-900 font-medium">
                    Target Audience Detected: <span className="capitalize">{state.analysis.targetAudience}</span>
                  </div>
                </div>
              </div>
            )}

            {state.analysis.urgency === 'high' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <div className="text-amber-900 font-medium">
                    High urgency detected - expedited processing recommended
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Changes Summary */}
        {state.changes.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Proposed Changes ({state.changes.length})
            </h3>
            <div className="space-y-4">
              {state.changes.map((change, index) => (
                <div key={change.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        change.type === 'content' ? 'bg-blue-100 text-blue-800' :
                        change.type === 'design' ? 'bg-purple-100 text-purple-800' :
                        change.type === 'layout' ? 'bg-green-100 text-green-800' :
                        change.type === 'functionality' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {change.type}
                      </span>
                      <span className="text-sm text-gray-500 capitalize">{change.scope}</span>
                    </div>
                    <div className="text-sm text-gray-500">{change.estimatedTime} min</div>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-2">{change.description}</h4>
                  
                  {change.impact && (
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">SEO:</span>
                        <span className={`ml-1 font-medium ${
                          change.impact.seo >= 8 ? 'text-green-600' :
                          change.impact.seo >= 6 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {change.impact.seo}/10
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Performance:</span>
                        <span className={`ml-1 font-medium ${
                          change.impact.performance >= 8 ? 'text-green-600' :
                          change.impact.performance >= 6 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {change.impact.performance}/10
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Accessibility:</span>
                        <span className={`ml-1 font-medium ${
                          change.impact.accessibility >= 8 ? 'text-green-600' :
                          change.impact.accessibility >= 6 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {change.impact.accessibility}/10
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Conversion:</span>
                        <span className={`ml-1 font-medium ${
                          change.impact.conversion >= 8 ? 'text-green-600' :
                          change.impact.conversion >= 6 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {change.impact.conversion}/10
                        </span>
                      </div>
                    </div>
                  )}

                  {change.risks && change.risks.length > 0 && (
                    <div className="mt-3 flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <span className="text-sm text-amber-700">
                        Risks: {change.risks.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Total estimated time: {state.changes.reduce((total, change) => total + change.estimatedTime, 0)} minutes
                </div>
                <button
                  onClick={() => setState(prev => ({ ...prev, showPreview: true }))}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptPreviewDemo;