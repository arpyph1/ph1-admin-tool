import OpenAI from 'openai';

export interface ContentGenerationRequest {
  prompt: string;
  type: 'page' | 'section' | 'rewrite' | 'optimize';
  context?: {
    audienceType?: 'enterprise' | 'smb' | 'startup';
    industry?: string;
    tone?: 'professional' | 'friendly' | 'urgent' | 'trustworthy';
    keywords?: string[];
    existingContent?: string;
  };
}

export interface ContentGenerationResult {
  content: string;
  metadata: {
    title?: string;
    description?: string;
    keywords?: string[];
    improvements?: string[];
  };
  type: string;
  confidence: number;
}

export class PH1ContentGenerator {
  private openai: OpenAI;
  
  constructor(apiKey?: string) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  async generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResult> {
    const systemPrompt = this.buildSystemPrompt(request);
    const userPrompt = this.buildUserPrompt(request);

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const result = completion.choices[0]?.message?.content || '';
      
      return this.parseResult(result, request.type);
    } catch (error) {
      console.error('Content generation failed:', error);
      throw new Error('Failed to generate content. Please try again.');
    }
  }

  private buildSystemPrompt(request: ContentGenerationRequest): string {
    const basePrompt = `You are an expert content strategist for PH1, a 20-year-old product & strategy consultancy. 

PH1's Background:
- 20+ years of experience in product strategy and UX research
- Client portfolio includes Fortune 500 companies (Spotify, Microsoft, Dell, Bell, Telus, Mozilla, Government of Canada)
- Core services: AI strategy consulting, UX research, product discovery, digital transformation
- Known for measurable outcomes and ROI-focused approaches

Your role is to create compelling, conversion-optimized content that positions PH1 as the premium choice for enterprise clients while maintaining authenticity and expertise.`;

    const contextualPrompts = {
      page: `Create complete page content including headers, body text, and CTAs. Focus on structure and conversion optimization.`,
      section: `Generate specific section content that integrates seamlessly with existing page structure.`,
      rewrite: `Improve existing content while maintaining core messaging. Focus on clarity, persuasion, and SEO.`,
      optimize: `Optimize content for search engines and user experience without losing conversion focus.`
    };

    const audienceGuidance = {
      enterprise: `Target Fortune 500 decision-makers. Emphasize scale, compliance, security, and proven ROI.`,
      smb: `Target growing businesses. Focus on efficiency, cost-effectiveness, and rapid implementation.`,
      startup: `Target innovative companies. Emphasize agility, competitive advantage, and growth acceleration.`
    };

    let prompt = basePrompt + '\n\n' + (contextualPrompts[request.type] || '');
    
    if (request.context?.audienceType) {
      prompt += '\n\n' + (audienceGuidance[request.context.audienceType] || '');
    }

    return prompt;
  }

  private buildUserPrompt(request: ContentGenerationRequest): string {
    let prompt = `Task: ${request.prompt}\n\n`;

    if (request.context) {
      if (request.context.tone) {
        prompt += `Tone: ${request.context.tone}\n`;
      }
      if (request.context.keywords?.length) {
        prompt += `Target Keywords: ${request.context.keywords.join(', ')}\n`;
      }
      if (request.context.industry) {
        prompt += `Industry Focus: ${request.context.industry}\n`;
      }
      if (request.context.existingContent) {
        prompt += `Existing Content to Modify:\n${request.context.existingContent}\n\n`;
      }
    }

    prompt += `\nProvide the response in this JSON format:
{
  "content": "The main content (HTML format if applicable)",
  "title": "Suggested page/section title",
  "description": "Meta description (150-160 chars)",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "improvements": ["improvement suggestion 1", "improvement suggestion 2"]
}`;

    return prompt;
  }

  private parseResult(result: string, type: string): ContentGenerationResult {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(result);
      return {
        content: parsed.content || result,
        metadata: {
          title: parsed.title,
          description: parsed.description,
          keywords: parsed.keywords || [],
          improvements: parsed.improvements || []
        },
        type,
        confidence: 0.9
      };
    } catch {
      // Fallback to plain text
      return {
        content: result,
        metadata: {
          improvements: []
        },
        type,
        confidence: 0.7
      };
    }
  }

  // Specific content generation methods
  async generateServicePage(serviceName: string, audienceType: 'enterprise' | 'smb' = 'enterprise'): Promise<ContentGenerationResult> {
    return this.generateContent({
      prompt: `Create a complete service page for "${serviceName}" that converts enterprise prospects`,
      type: 'page',
      context: {
        audienceType,
        tone: 'professional',
        keywords: [serviceName, 'consulting', 'strategy', 'ROI']
      }
    });
  }

  async generateCaseStudy(clientName: string, projectType: string, results: string): Promise<ContentGenerationResult> {
    return this.generateContent({
      prompt: `Create a compelling case study for ${clientName} focusing on ${projectType} with results: ${results}`,
      type: 'page',
      context: {
        audienceType: 'enterprise',
        tone: 'trustworthy',
        keywords: ['case study', projectType, 'results', 'ROI']
      }
    });
  }

  async optimizeForEnterprise(existingContent: string): Promise<ContentGenerationResult> {
    return this.generateContent({
      prompt: 'Rewrite this content to be more appealing to Fortune 500 decision-makers',
      type: 'rewrite',
      context: {
        audienceType: 'enterprise',
        tone: 'professional',
        existingContent
      }
    });
  }

  async addPricingCalculator(serviceName: string): Promise<ContentGenerationResult> {
    return this.generateContent({
      prompt: `Create an interactive ROI calculator section for ${serviceName} that helps prospects understand value`,
      type: 'section',
      context: {
        audienceType: 'enterprise',
        tone: 'professional'
      }
    });
  }

  async globalContentRewrite(targetAudience: string, newMessaging: string): Promise<ContentGenerationResult> {
    return this.generateContent({
      prompt: `Create a global content strategy to reposition PH1 for ${targetAudience} with emphasis on ${newMessaging}`,
      type: 'rewrite',
      context: {
        tone: 'professional'
      }
    });
  }

  async seoOptimize(content: string, targetKeywords: string[]): Promise<ContentGenerationResult> {
    return this.generateContent({
      prompt: 'Optimize this content for SEO while maintaining conversion focus',
      type: 'optimize',
      context: {
        keywords: targetKeywords,
        existingContent: content
      }
    });
  }
}

// Prompt parsing utility
export class PromptParser {
  static parsePrompt(prompt: string): ContentGenerationRequest {
    const lowerPrompt = prompt.toLowerCase();
    
    // Determine content type
    let type: ContentGenerationRequest['type'] = 'page';
    if (lowerPrompt.includes('rewrite') || lowerPrompt.includes('update') || lowerPrompt.includes('change')) {
      type = 'rewrite';
    } else if (lowerPrompt.includes('optimize') || lowerPrompt.includes('seo')) {
      type = 'optimize';
    } else if (lowerPrompt.includes('add') || lowerPrompt.includes('calculator') || lowerPrompt.includes('section')) {
      type = 'section';
    }

    // Determine audience type
    let audienceType: 'enterprise' | 'smb' | 'startup' | undefined;
    if (lowerPrompt.includes('enterprise') || lowerPrompt.includes('fortune') || lowerPrompt.includes('corporate')) {
      audienceType = 'enterprise';
    } else if (lowerPrompt.includes('startup') || lowerPrompt.includes('early stage')) {
      audienceType = 'startup';
    } else if (lowerPrompt.includes('small business') || lowerPrompt.includes('smb')) {
      audienceType = 'smb';
    }

    // Determine tone
    let tone: 'professional' | 'friendly' | 'urgent' | 'trustworthy' = 'professional';
    if (lowerPrompt.includes('urgent') || lowerPrompt.includes('action')) {
      tone = 'urgent';
    } else if (lowerPrompt.includes('friendly') || lowerPrompt.includes('approachable')) {
      tone = 'friendly';
    } else if (lowerPrompt.includes('trust') || lowerPrompt.includes('credible')) {
      tone = 'trustworthy';
    }

    // Extract keywords (simplified)
    const keywordPatterns = [
      /for "([^"]+)"/g,
      /about "([^"]+)"/g,
      /"([^"]+)" keywords/g
    ];
    
    const keywords: string[] = [];
    keywordPatterns.forEach(pattern => {
      const matches = [...prompt.matchAll(pattern)];
      matches.forEach(match => keywords.push(match[1]));
    });

    return {
      prompt,
      type,
      context: {
        audienceType,
        tone,
        keywords: keywords.length > 0 ? keywords : undefined
      }
    };
  }
}

// Example usage
export const contentGenerator = new PH1ContentGenerator();
