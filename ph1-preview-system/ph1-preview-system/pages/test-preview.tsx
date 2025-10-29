import React, { useState } from 'react';
import SmartPreviewSystem from '../components/preview/SmartPreviewSystem';
import { PromptAnalysisEngine } from '../components/preview/PromptAnalysisEngine';

export default function PreviewTest() {
  const [showDemo, setShowDemo] = useState(false);
  const [sampleChanges] = useState([
    {
      id: 'content-enterprise-hero',
      type: 'content' as const,
      scope: 'section' as const,
      description: 'Update hero messaging for enterprise audience',
      before: 'Product & Strategy Consulting',
      after: 'Enterprise-Grade Solutions for Fortune 500 Companies',
      impact: { seo: 7, performance: 9, accessibility: 9, conversion: 8 },
      risks: [],
      dependencies: ['hero-section'],
      estimatedTime: 5
    },
    {
      id: 'content-enterprise-cta',
      type: 'content' as const,
      scope: 'global' as const,
      description: 'Update CTAs for enterprise language',
      before: 'Get Started',
      after: 'Schedule Enterprise Consultation',
      impact: { seo: 6, performance: 10, accessibility: 10, conversion: 9 },
      risks: [],
      dependencies: ['all-cta-buttons'],
      estimatedTime: 10
    },
    {
      id: 'functionality-calculator',
      type: 'functionality' as const,
      scope: 'section' as const,
      description: 'Add interactive ROI calculator',
      before: null,
      after: 'ROI Calculator Component',
      impact: { seo: 8, performance: 6, accessibility: 7, conversion: 9 },
      risks: ['Performance impact', 'Mobile compatibility'],
      dependencies: ['calculator-logic', 'analytics-tracking'],
      estimatedTime: 45
    }
  ]);

  const originalContent = {
    hero: {
      title: "Product & Strategy Consulting",
      subtitle: "We help companies build products that people love",
      cta: "Get Started"
    }
  };

  const previewContent = {
    hero: {
      title: "Enterprise-Grade Solutions for Fortune 500 Companies",
      subtitle: "Driving digital transformation for Fortune 500 companies with proven methodologies and enterprise-grade solutions",
      cta: "Schedule Enterprise Consultation"
    }
  };

  const handleApprove = async () => {
    alert('✅ Changes would be applied to the live site!');
  };

  const handleReject = () => {
    alert('❌ Changes rejected and reverted.');
    setShowDemo(false);
  };

  const handleModify = (feedback: string) => {
    alert(`📝 Modification requested: "${feedback}"`);
  };

  if (showDemo) {
    return (
      <SmartPreviewSystem
        prompt="Make our homepage more appealing to Fortune 500 companies. Focus on enterprise-grade language, add trust signals, and emphasize compliance and scale."
        changes={sampleChanges}
        originalContent={originalContent}
        previewContent={previewContent}
        onApprove={handleApprove}
        onReject={handleReject}
        onModify={handleModify}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">PH1 Preview System Test</h1>
            <p className="text-lg text-gray-600">Test the prompt-driven preview capabilities</p>
          </div>

          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-3">Test Scenario:</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>Prompt:</strong> "Make our homepage more appealing to Fortune 500 companies"</p>
                <p><strong>Changes:</strong> {sampleChanges.length} modifications detected</p>
                <p><strong>Scope:</strong> Hero messaging, CTAs, and ROI calculator addition</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setShowDemo(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              Launch Preview System
            </button>
            
            <p className="text-sm text-gray-500">
              This will demonstrate the before/after preview with device simulation and impact analysis
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Preview Features</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Before/after comparison</li>
                  <li>• Multi-device simulation</li>
                  <li>• Change highlighting</li>
                  <li>• Impact analysis</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Test Changes</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Hero messaging update</li>
                  <li>• CTA text changes</li>
                  <li>• ROI calculator addition</li>
                  <li>• Enterprise focus</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Smart Analysis</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• SEO impact scoring</li>
                  <li>• Performance analysis</li>
                  <li>• Risk assessment</li>
                  <li>• Time estimation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}