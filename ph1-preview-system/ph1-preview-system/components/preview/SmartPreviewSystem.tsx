import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ArrowRight, 
  Monitor, 
  Smartphone, 
  Tablet,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  RefreshCw,
  Download,
  Share2,
  Clock,
  Users,
  BarChart3
} from 'lucide-react';

interface ChangePreview {
  id: string;
  type: 'content' | 'design' | 'layout' | 'functionality' | 'seo';
  scope: 'element' | 'section' | 'page' | 'global';
  description: string;
  before: any;
  after: any;
  impact: {
    seo: number;
    performance: number;
    accessibility: number;
    conversion: number;
  };
  risks: string[];
  dependencies: string[];
  estimatedTime: number;
}

interface PreviewProps {
  prompt: string;
  changes: ChangePreview[];
  originalContent: any;
  previewContent: any;
  onApprove: () => void;
  onReject: () => void;
  onModify: (feedback: string) => void;
}

const SmartPreviewSystem: React.FC<PreviewProps> = ({
  prompt,
  changes,
  originalContent,
  previewContent,
  onApprove,
  onReject,
  onModify
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'overlay' | 'standalone'>('split');
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showChanges, setShowChanges] = useState(true);
  const [selectedChange, setSelectedChange] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showImpactAnalysis, setShowImpactAnalysis] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const deviceSizes = {
    desktop: { width: '100%', height: '800px' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' }
  };

  // Generate preview content directly in component to avoid API issues
  const generatePreviewHTML = (mode: 'before' | 'after') => {
    const content = mode === 'before' ? originalContent : previewContent;
    const title = mode === 'before' ? 
      (originalContent?.hero?.title || "Product & Strategy Consulting") :
      (changes.length > 0 && changes[0].id === 'content-enterprise-hero' ? 
        "Enterprise-Grade Solutions for Fortune 500 Companies" : 
        originalContent?.hero?.title || "Product & Strategy Consulting");
    
    const cta = mode === 'before' ? 
      (originalContent?.hero?.cta || "Get Started") :
      (changes.some(c => c.id === 'content-enterprise-cta') ? 
        "Schedule Enterprise Consultation" : 
        originalContent?.hero?.cta || "Get Started");

    const hasCalculator = mode === 'after' && changes.some(c => c.id === 'functionality-calculator');
    
    const themeColors = changes.some(c => c.id === 'design-color-scheme') && mode === 'after' ? 
      { primary: '#1E40AF', secondary: '#059669' } :
      { primary: '#3B82F6', secondary: '#10B981' };

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PH1 Preview</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; }
          .preview-container { min-height: 100vh; background: white; }
          .header { padding: 1rem 2rem; background: white; border-bottom: 1px solid #e5e7eb; }
          .nav { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; }
          .logo { font-size: 1.5rem; font-weight: bold; color: ${themeColors.primary}; }
          .nav-links { display: flex; gap: 2rem; }
          .nav-links a { text-decoration: none; color: #6b7280; font-weight: 500; }
          .hero { display: flex; align-items: center; min-height: 70vh; padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; gap: 4rem; }
          .hero-content { flex: 1; }
          .hero-title { font-size: 3rem; font-weight: bold; margin-bottom: 1rem; line-height: 1.1; color: ${mode === 'after' && changes.some(c => c.id === 'design-color-scheme') ? themeColors.primary : '#1f2937'}; }
          .hero-subtitle { font-size: 1.25rem; color: #6b7280; margin-bottom: 2rem; }
          .hero-cta { background: ${themeColors.primary}; color: white; border: none; padding: 1rem 2rem; font-size: 1.1rem; font-weight: 600; border-radius: 8px; cursor: pointer; }
          .hero-visual { flex: 1; display: flex; justify-content: center; align-items: center; }
          .hero-graphic { width: 350px; height: 250px; background: linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary}); border-radius: 20px; opacity: 0.9; }
          .clients { padding: 3rem 2rem; background: #f9fafb; text-align: center; }
          .clients h2 { margin-bottom: 2rem; color: #6b7280; font-size: 1.1rem; font-weight: 500; text-transform: uppercase; }
          .client-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1.5rem; max-width: 800px; margin: 0 auto; }
          .client-logo { padding: 0.5rem; font-weight: 600; color: #9ca3af; font-size: 0.85rem; }
          .services { padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; }
          .services h2 { text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: #1f2937; }
          .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
          .service-card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); text-align: center; }
          .service-icon { font-size: 2.5rem; margin-bottom: 1rem; }
          .service-card h3 { font-size: 1.3rem; margin-bottom: 1rem; color: #1f2937; }
          .service-card p { color: #6b7280; margin-bottom: 1.5rem; }
          .roi-calculator { background: #f8fafc; border: 2px solid ${themeColors.primary}; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0; text-align: left; }
          .roi-calculator h4 { color: ${themeColors.primary}; margin-bottom: 1rem; }
          .calculator-inputs { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; }
          .calculator-inputs input { padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; }
          .calculate-btn { background: ${themeColors.secondary}; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 600; }
          .service-cta { background: ${themeColors.primary}; color: white; border: none; padding: 1rem 2rem; border-radius: 8px; cursor: pointer; font-weight: 600; }
          ${mode === 'after' ? '.changed-element { outline: 2px solid #3B82F6; outline-offset: 2px; position: relative; }' : ''}
          ${mode === 'after' ? '.changed-element::after { content: "Modified"; position: absolute; top: -8px; right: -8px; background: #3B82F6; color: white; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; font-weight: 600; }' : ''}
        </style>
      </head>
      <body>
        <div class="preview-container">
          <header class="header">
            <nav class="nav">
              <div class="logo">PH1</div>
              <div class="nav-links">
                <a href="#services">Services</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
              </div>
            </nav>
          </header>
          <section class="hero">
            <div class="hero-content">
              <h1 class="hero-title ${mode === 'after' && changes.some(c => c.id === 'content-enterprise-hero') ? 'changed-element' : ''}">${title}</h1>
              <p class="hero-subtitle">${mode === 'after' && changes.some(c => c.id === 'content-enterprise-hero') ? 'Driving digital transformation for Fortune 500 companies with proven methodologies and enterprise-grade solutions' : 'We help companies build products that people love'}</p>
              <button class="hero-cta ${mode === 'after' && changes.some(c => c.id === 'content-enterprise-cta') ? 'changed-element' : ''}">${cta}</button>
            </div>
            <div class="hero-visual">
              <div class="hero-graphic"></div>
            </div>
          </section>
          <section class="clients">
            <h2>Trusted by industry leaders</h2>
            <div class="client-grid">
              <div class="client-logo">Spotify</div>
              <div class="client-logo">Microsoft</div>
              <div class="client-logo">Dell</div>
              <div class="client-logo">Bell</div>
              <div class="client-logo">Telus</div>
              <div class="client-logo">Mozilla</div>
              <div class="client-logo">Government of Canada</div>
              <div class="client-logo">BC Ferries</div>
            </div>
          </section>
          <section class="services">
            <h2>Our Services</h2>
            <div class="services-grid">
              <div class="service-card">
                <div class="service-icon">🔍</div>
                <h3>UX Research</h3>
                <p>Deep user insights to guide product decisions</p>
                ${hasCalculator ? `
                  <div class="roi-calculator changed-element">
                    <h4>ROI Calculator</h4>
                    <div class="calculator-inputs">
                      <input type="number" placeholder="Current conversion rate %" />
                      <input type="number" placeholder="Monthly traffic" />
                      <button class="calculate-btn">Calculate ROI</button>
                    </div>
                  </div>
                ` : ''}
                <button class="service-cta">${mode === 'after' && changes.some(c => c.id === 'content-enterprise-cta') ? 'Schedule Consultation' : 'Learn More'}</button>
              </div>
              <div class="service-card">
                <div class="service-icon">📋</div>
                <h3>Product Strategy</h3>
                <p>Strategic roadmaps for product success</p>
                <button class="service-cta">${mode === 'after' && changes.some(c => c.id === 'content-enterprise-cta') ? 'Schedule Consultation' : 'Learn More'}</button>
              </div>
              <div class="service-card">
                <div class="service-icon">💡</div>
                <h3>Innovation Consulting</h3>
                <p>Transform ideas into market-ready solutions</p>
                <button class="service-cta">${mode === 'after' && changes.some(c => c.id === 'content-enterprise-cta') ? 'Schedule Consultation' : 'Learn More'}</button>
              </div>
            </div>
          </section>
        </div>
      </body>
      </html>
    `;
  };

  const getImpactColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskLevel = (risks: string[]) => {
    if (risks.length === 0) return { level: 'low', color: 'bg-green-100 text-green-800' };
    if (risks.length <= 2) return { level: 'medium', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'high', color: 'bg-red-100 text-red-800' };
  };

  const handleApproveChanges = async () => {
    setIsLoading(true);
    try {
      await onApprove();
    } finally {
      setIsLoading(false);
    }
  };

  const handleModifyRequest = () => {
    if (feedback.trim()) {
      onModify(feedback);
      setFeedback('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">Smart Preview</h1>
              </div>
              <div className="hidden md:block">
                <div className="bg-gray-100 px-3 py-1 rounded-md">
                  <span className="text-sm text-gray-600">Prompt:</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">{prompt}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Device Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setDevice('desktop')}
                  className={`p-2 rounded ${device === 'desktop' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Monitor className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDevice('tablet')}
                  className={`p-2 rounded ${device === 'tablet' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Tablet className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDevice('mobile')}
                  className={`p-2 rounded ${device === 'mobile' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Smartphone className="h-4 w-4" />
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-1 text-sm rounded ${viewMode === 'split' ? 'bg-white shadow-sm' : ''}`}
                >
                  Split
                </button>
                <button
                  onClick={() => setViewMode('overlay')}
                  className={`px-3 py-1 text-sm rounded ${viewMode === 'overlay' ? 'bg-white shadow-sm' : ''}`}
                >
                  Overlay
                </button>
                <button
                  onClick={() => setViewMode('standalone')}
                  className={`px-3 py-1 text-sm rounded ${viewMode === 'standalone' ? 'bg-white shadow-sm' : ''}`}
                >
                  Full
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Left Sidebar - Change Analysis */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Change Analysis</h2>
              <button
                onClick={() => setShowImpactAnalysis(!showImpactAnalysis)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                <BarChart3 className="h-4 w-4" />
              </button>
            </div>

            {/* Impact Summary */}
            {showImpactAnalysis && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold mb-3">Impact Analysis</h3>
                <div className="space-y-2">
                  {changes.length > 0 && changes[0].impact && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">SEO Impact</span>
                        <span className={`text-sm font-medium ${getImpactColor(changes[0].impact.seo)}`}>
                          {changes[0].impact.seo}/10
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Performance</span>
                        <span className={`text-sm font-medium ${getImpactColor(changes[0].impact.performance)}`}>
                          {changes[0].impact.performance}/10
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Accessibility</span>
                        <span className={`text-sm font-medium ${getImpactColor(changes[0].impact.accessibility)}`}>
                          {changes[0].impact.accessibility}/10
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Conversion</span>
                        <span className={`text-sm font-medium ${getImpactColor(changes[0].impact.conversion)}`}>
                          {changes[0].impact.conversion}/10
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Changes List */}
            <div className="space-y-3">
              {changes.map((change) => {
                const riskLevel = getRiskLevel(change.risks);
                return (
                  <div
                    key={change.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedChange === change.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedChange(change.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          change.type === 'content' ? 'bg-blue-100 text-blue-800' :
                          change.type === 'design' ? 'bg-purple-100 text-purple-800' :
                          change.type === 'layout' ? 'bg-green-100 text-green-800' :
                          change.type === 'functionality' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {change.type}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${riskLevel.color}`}>
                          {riskLevel.level} risk
                        </span>
                      </div>
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                    
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{change.description}</h4>
                    <p className="text-xs text-gray-500">
                      Scope: {change.scope} • Est: {change.estimatedTime}min
                    </p>
                    
                    {change.risks.length > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="h-3 w-3 text-amber-500" />
                          <span className="text-xs text-amber-600">{change.risks.length} risk(s)</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Feedback Section */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-semibold mb-3">Modification Request</h3>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Request modifications to the proposed changes..."
                className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none"
                rows={3}
              />
              <button
                onClick={handleModifyRequest}
                disabled={!feedback.trim()}
                className="mt-2 w-full bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request Modification
              </button>
            </div>
          </div>
        </div>

        {/* Main Preview Area */}
        <div className="flex-1 flex flex-col">
          {/* Preview Controls */}
          <div className="bg-white border-b px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowChanges(!showChanges)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium ${
                    showChanges ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {showChanges ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  <span>Highlight Changes</span>
                </button>
                
                <div className="text-sm text-gray-500">
                  {changes.length} change{changes.length !== 1 ? 's' : ''} detected
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Download className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 bg-gray-100 p-6">
            {viewMode === 'split' ? (
              <div className="flex space-x-6 h-full">
                {/* Before */}
                <div className="flex-1">
                  <div className="bg-white rounded-lg shadow-sm p-2 h-full">
                    <div className="text-xs text-gray-500 mb-2 px-2">BEFORE</div>
                    <div 
                      className="border rounded overflow-hidden"
                      style={deviceSizes[device]}
                    >
                      <iframe
                        srcDoc={generatePreviewHTML('before')}
                        className="w-full h-full"
                        style={{ transform: device !== 'desktop' ? 'scale(0.8)' : 'scale(1)' }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* After */}
                <div className="flex-1">
                  <div className="bg-white rounded-lg shadow-sm p-2 h-full">
                    <div className="text-xs text-gray-500 mb-2 px-2">AFTER</div>
                    <div 
                      className="border rounded overflow-hidden"
                      style={deviceSizes[device]}
                    >
                      <iframe
                        ref={iframeRef}
                        srcDoc={generatePreviewHTML('after')}
                        className="w-full h-full"
                        style={{ transform: device !== 'desktop' ? 'scale(0.8)' : 'scale(1)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full">
                <div className="bg-white rounded-lg shadow-sm p-2 h-full">
                  <div className="text-xs text-gray-500 mb-2 px-2">PREVIEW</div>
                  <div 
                    className="border rounded overflow-hidden mx-auto"
                    style={deviceSizes[device]}
                  >
                    <iframe
                      ref={iframeRef}
                      srcDoc={generatePreviewHTML('after')}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white border-t px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onReject}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <XCircle className="h-4 w-4" />
              <span>Reject Changes</span>
            </button>
            
            <button
              onClick={() => setShowImpactAnalysis(!showImpactAnalysis)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Impact Analysis</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Estimated deployment: {changes.reduce((total, change) => total + change.estimatedTime, 0)} minutes
            </div>
            
            <button
              onClick={handleApproveChanges}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <span>{isLoading ? 'Applying...' : 'Apply Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartPreviewSystem;