import { ChangePreview } from './SmartPreviewSystem';

interface PromptAnalysis {
  intent: string;
  scope: 'element' | 'section' | 'page' | 'global';
  changeTypes: Array<'content' | 'design' | 'layout' | 'functionality' | 'seo'>;
  targetAudience?: string;
  urgency: 'low' | 'medium' | 'high';
  confidence: number;
}

interface ContentChange {
  selector: string;
  property: string;
  currentValue: any;
  newValue: any;
  reason: string;
}

class PromptAnalysisEngine {
  private static contentPatterns = {
    // Audience targeting
    enterprise: /\b(enterprise|fortune 500|corporate|b2b|business|professional|scale|compliance)\b/i,
    startup: /\b(startup|founder|entrepreneur|agile|fast|lean|growth)\b/i,
    ecommerce: /\b(ecommerce|e-commerce|retail|shopping|conversion|checkout|cart)\b/i,
    
    // Content changes
    tone: /\b(more|make.*)(urgent|professional|friendly|casual|formal|technical|simple)\b/i,
    messaging: /\b(messaging|copy|text|content|headline|title|description)\b/i,
    cta: /\b(cta|call to action|button|sign up|contact|get started|learn more)\b/i,
    
    // Design changes
    layout: /\b(layout|structure|organize|arrange|move|position)\b/i,
    colors: /\b(color|colours|theme|brand|palette)\b/i,
    typography: /\b(font|text|heading|typography|size|bold|italic)\b/i,
    
    // Functionality
    calculator: /\b(calculator|tool|interactive|form|widget)\b/i,
    analytics: /\b(tracking|analytics|metrics|measurement|roi)\b/i,
    
    // SEO
    seo: /\b(seo|search|rank|optimize|keywords|meta|schema)\b/i,
    performance: /\b(performance|speed|fast|optimize|load)\b/i
  };

  private static scopePatterns = {
    global: /\b(site|website|all pages|everywhere|global|entire)\b/i,
    page: /\b(page|this page|homepage|landing)\b/i,
    section: /\b(section|area|part|component|block)\b/i,
    element: /\b(button|link|text|image|form|specific)\b/i
  };

  static analyzePrompt(prompt: string): PromptAnalysis {
    const intent = this.extractIntent(prompt);
    const scope = this.determineScope(prompt);
    const changeTypes = this.identifyChangeTypes(prompt);
    const targetAudience = this.identifyAudience(prompt);
    const urgency = this.assessUrgency(prompt);
    const confidence = this.calculateConfidence(prompt, changeTypes);

    return {
      intent,
      scope,
      changeTypes,
      targetAudience,
      urgency,
      confidence
    };
  }

  static async generateChanges(prompt: string, currentContent: any): Promise<ChangePreview[]> {
    const analysis = this.analyzePrompt(prompt);
    const changes: ChangePreview[] = [];

    // Generate changes based on the analysis
    if (analysis.changeTypes.includes('content')) {
      changes.push(...this.generateContentChanges(prompt, analysis, currentContent));
    }
    
    if (analysis.changeTypes.includes('design')) {
      changes.push(...this.generateDesignChanges(prompt, analysis, currentContent));
    }
    
    if (analysis.changeTypes.includes('functionality')) {
      changes.push(...this.generateFunctionalityChanges(prompt, analysis, currentContent));
    }
    
    if (analysis.changeTypes.includes('seo')) {
      changes.push(...this.generateSEOChanges(prompt, analysis, currentContent));
    }

    // Calculate impact for each change
    changes.forEach(change => {
      change.impact = this.calculateImpact(change, analysis);
      change.risks = this.assessRisks(change, analysis);
      change.estimatedTime = this.estimateTime(change);
    });

    return changes;
  }

  private static extractIntent(prompt: string): string {
    // Extract the main action/goal from the prompt
    const actionWords = prompt.match(/\b(make|create|add|remove|update|optimize|improve|change|build|generate)\b/gi);
    if (actionWords) {
      return `${actionWords[0].toLowerCase()} - ${prompt.substring(0, 100)}...`;
    }
    return prompt.substring(0, 100) + '...';
  }

  private static determineScope(prompt: string): 'element' | 'section' | 'page' | 'global' {
    for (const [scope, pattern] of Object.entries(this.scopePatterns)) {
      if (pattern.test(prompt)) {
        return scope as 'element' | 'section' | 'page' | 'global';
      }
    }
    return 'page'; // default
  }

  private static identifyChangeTypes(prompt: string): Array<'content' | 'design' | 'layout' | 'functionality' | 'seo'> {
    const types: Array<'content' | 'design' | 'layout' | 'functionality' | 'seo'> = [];
    
    if (this.contentPatterns.messaging.test(prompt) || this.contentPatterns.tone.test(prompt) || this.contentPatterns.cta.test(prompt)) {
      types.push('content');
    }
    
    if (this.contentPatterns.colors.test(prompt) || this.contentPatterns.typography.test(prompt)) {
      types.push('design');
    }
    
    if (this.contentPatterns.layout.test(prompt)) {
      types.push('layout');
    }
    
    if (this.contentPatterns.calculator.test(prompt) || this.contentPatterns.analytics.test(prompt)) {
      types.push('functionality');
    }
    
    if (this.contentPatterns.seo.test(prompt) || this.contentPatterns.performance.test(prompt)) {
      types.push('seo');
    }

    return types.length > 0 ? types : ['content']; // default to content if unclear
  }

  private static identifyAudience(prompt: string): string | undefined {
    for (const [audience, pattern] of Object.entries(this.contentPatterns)) {
      if (['enterprise', 'startup', 'ecommerce'].includes(audience) && pattern.test(prompt)) {
        return audience;
      }
    }
    return undefined;
  }

  private static assessUrgency(prompt: string): 'low' | 'medium' | 'high' {
    const urgentWords = /\b(urgent|asap|immediately|quick|fast|now|critical)\b/i;
    const highPriorityWords = /\b(important|priority|significant|major)\b/i;
    
    if (urgentWords.test(prompt)) return 'high';
    if (highPriorityWords.test(prompt)) return 'medium';
    return 'low';
  }

  private static calculateConfidence(prompt: string, changeTypes: string[]): number {
    let confidence = 0.5; // base confidence
    
    // Increase confidence based on specificity
    if (changeTypes.length > 0) confidence += 0.2;
    if (prompt.length > 50) confidence += 0.1;
    if (prompt.includes('page') || prompt.includes('section')) confidence += 0.1;
    
    // Decrease confidence for vague prompts
    if (prompt.length < 20) confidence -= 0.2;
    if (prompt.split(' ').length < 5) confidence -= 0.1;
    
    return Math.max(0, Math.min(1, confidence));
  }

  private static generateContentChanges(prompt: string, analysis: PromptAnalysis, currentContent: any): ChangePreview[] {
    const changes: ChangePreview[] = [];

    // Example: Enterprise-focused content changes
    if (analysis.targetAudience === 'enterprise') {
      changes.push({
        id: 'content-enterprise-hero',
        type: 'content',
        scope: 'section',
        description: 'Update hero messaging for enterprise audience',
        before: currentContent.hero?.title || 'Current hero title',
        after: 'Enterprise-Grade Solutions for Fortune 500 Companies',
        impact: { seo: 7, performance: 9, accessibility: 9, conversion: 8 },
        risks: [],
        dependencies: ['hero-section'],
        estimatedTime: 5
      });

      changes.push({
        id: 'content-enterprise-cta',
        type: 'content',
        scope: 'global',
        description: 'Update CTAs for enterprise language',
        before: 'Get Started',
        after: 'Schedule Enterprise Consultation',
        impact: { seo: 6, performance: 10, accessibility: 10, conversion: 9 },
        risks: [],
        dependencies: ['all-cta-buttons'],
        estimatedTime: 10
      });
    }

    // Example: Tone adjustments
    if (this.contentPatterns.tone.test(prompt)) {
      changes.push({
        id: 'content-tone-adjustment',
        type: 'content',
        scope: analysis.scope,
        description: 'Adjust content tone and voice',
        before: 'Current content tone',
        after: 'Updated tone based on prompt',
        impact: { seo: 6, performance: 10, accessibility: 9, conversion: 7 },
        risks: ['Brand voice consistency'],
        dependencies: ['content-review'],
        estimatedTime: 15
      });
    }

    return changes;
  }

  private static generateDesignChanges(prompt: string, analysis: PromptAnalysis, currentContent: any): ChangePreview[] {
    const changes: ChangePreview[] = [];

    if (this.contentPatterns.colors.test(prompt)) {
      changes.push({
        id: 'design-color-scheme',
        type: 'design',
        scope: 'global',
        description: 'Update color scheme and branding',
        before: { primary: '#3B82F6', secondary: '#10B981' },
        after: { primary: '#1E40AF', secondary: '#059669' },
        impact: { seo: 5, performance: 8, accessibility: 7, conversion: 6 },
        risks: ['Brand consistency', 'Accessibility contrast'],
        dependencies: ['design-system'],
        estimatedTime: 20
      });
    }

    if (this.contentPatterns.layout.test(prompt)) {
      changes.push({
        id: 'design-layout-update',
        type: 'layout',
        scope: analysis.scope,
        description: 'Restructure page layout',
        before: 'Current layout structure',
        after: 'Optimized layout structure',
        impact: { seo: 7, performance: 6, accessibility: 8, conversion: 8 },
        risks: ['Mobile responsiveness', 'Content hierarchy'],
        dependencies: ['responsive-testing'],
        estimatedTime: 30
      });
    }

    return changes;
  }

  private static generateFunctionalityChanges(prompt: string, analysis: PromptAnalysis, currentContent: any): ChangePreview[] {
    const changes: ChangePreview[] = [];

    if (this.contentPatterns.calculator.test(prompt)) {
      changes.push({
        id: 'functionality-calculator',
        type: 'functionality',
        scope: 'section',
        description: 'Add interactive ROI calculator',
        before: null,
        after: 'ROI Calculator Component',
        impact: { seo: 8, performance: 6, accessibility: 7, conversion: 9 },
        risks: ['Performance impact', 'Mobile compatibility'],
        dependencies: ['calculator-logic', 'analytics-tracking'],
        estimatedTime: 45
      });
    }

    return changes;
  }

  private static generateSEOChanges(prompt: string, analysis: PromptAnalysis, currentContent: any): ChangePreview[] {
    const changes: ChangePreview[] = [];

    if (this.contentPatterns.seo.test(prompt)) {
      changes.push({
        id: 'seo-optimization',
        type: 'seo',
        scope: 'page',
        description: 'Optimize page for target keywords',
        before: { title: 'Current Title', meta: 'Current meta description' },
        after: { title: 'Optimized SEO Title', meta: 'Optimized meta description with keywords' },
        impact: { seo: 9, performance: 8, accessibility: 9, conversion: 7 },
        risks: [],
        dependencies: ['keyword-research'],
        estimatedTime: 15
      });
    }

    return changes;
  }

  private static calculateImpact(change: ChangePreview, analysis: PromptAnalysis) {
    // Base impact scores
    let seo = 7;
    let performance = 8;
    let accessibility = 8;
    let conversion = 6;

    // Adjust based on change type
    switch (change.type) {
      case 'content':
        seo += 2;
        conversion += 2;
        break;
      case 'design':
        accessibility += 1;
        conversion += 1;
        break;
      case 'functionality':
        performance -= 2;
        conversion += 3;
        break;
      case 'seo':
        seo += 3;
        break;
    }

    // Adjust based on scope
    if (change.scope === 'global') {
      seo += 1;
      performance -= 1;
    }

    return {
      seo: Math.max(1, Math.min(10, seo)),
      performance: Math.max(1, Math.min(10, performance)),
      accessibility: Math.max(1, Math.min(10, accessibility)),
      conversion: Math.max(1, Math.min(10, conversion))
    };
  }

  private static assessRisks(change: ChangePreview, analysis: PromptAnalysis): string[] {
    const risks: string[] = [];

    if (change.scope === 'global') {
      risks.push('Site-wide impact');
    }

    if (change.type === 'functionality') {
      risks.push('Performance impact');
      risks.push('Browser compatibility');
    }

    if (change.type === 'design') {
      risks.push('Brand consistency');
      risks.push('Mobile responsiveness');
    }

    if (analysis.urgency === 'high') {
      risks.push('Limited testing time');
    }

    return risks;
  }

  private static estimateTime(change: ChangePreview): number {
    const baseTime = {
      content: 5,
      design: 15,
      layout: 25,
      functionality: 40,
      seo: 10
    };

    let time = baseTime[change.type];

    // Adjust based on scope
    if (change.scope === 'global') time *= 2;
    if (change.scope === 'element') time *= 0.5;

    // Adjust based on dependencies
    time += change.dependencies.length * 5;

    return Math.round(time);
  }
}

export { PromptAnalysisEngine, type PromptAnalysis, type ContentChange };