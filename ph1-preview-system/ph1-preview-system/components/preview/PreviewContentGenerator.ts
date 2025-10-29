import React from 'react';
import { ChangePreview } from './SmartPreviewSystem';

interface PreviewContent {
  html: string;
  css: string;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}

interface PreviewGeneratorConfig {
  baseContent: any;
  changes: ChangePreview[];
  mode: 'before' | 'after';
}

class PreviewContentGenerator {
  private static defaultContent = {
    hero: {
      title: "Product & Strategy Consulting",
      subtitle: "We help companies build products that people love",
      cta: "Get Started",
      background: "#ffffff"
    },
    services: [
      {
        id: "ux-research",
        title: "UX Research",
        description: "Deep user insights to guide product decisions",
        icon: "🔍"
      },
      {
        id: "product-strategy",
        title: "Product Strategy", 
        description: "Strategic roadmaps for product success",
        icon: "📋"
      },
      {
        id: "innovation",
        title: "Innovation Consulting",
        description: "Transform ideas into market-ready solutions",
        icon: "💡"
      }
    ],
    clients: [
      "Spotify", "Microsoft", "Dell", "Bell", "Telus", "Mozilla", 
      "Government of Canada", "BC Ferries", "UFC"
    ],
    metadata: {
      title: "PH1 - Product & Strategy Consulting",
      description: "Leading product and strategy consulting firm helping companies build products that people love.",
      keywords: ["product consulting", "strategy", "UX research", "innovation"]
    }
  };

  static async generatePreview(config: PreviewGeneratorConfig): Promise<PreviewContent> {
    const content = config.mode === 'before' 
      ? this.generateBeforeContent(config.baseContent)
      : this.generateAfterContent(config.baseContent, config.changes);

    return {
      html: this.generateHTML(content),
      css: this.generateCSS(content, config.changes),
      metadata: content.metadata
    };
  }

  private static generateBeforeContent(baseContent: any) {
    return {
      ...this.defaultContent,
      ...baseContent
    };
  }

  private static generateAfterContent(baseContent: any, changes: ChangePreview[]) {
    let content = this.generateBeforeContent(baseContent);

    // Apply each change to the content
    changes.forEach(change => {
      content = this.applyChange(content, change);
    });

    return content;
  }

  private static applyChange(content: any, change: ChangePreview) {
    switch (change.id) {
      case 'content-enterprise-hero':
        return {
          ...content,
          hero: {
            ...content.hero,
            title: change.after,
            subtitle: "Driving digital transformation for Fortune 500 companies with proven methodologies and enterprise-grade solutions"
          }
        };

      case 'content-enterprise-cta':
        return {
          ...content,
          hero: {
            ...content.hero,
            cta: change.after
          },
          services: content.services.map((service: any) => ({
            ...service,
            cta: "Schedule Consultation"
          }))
        };

      case 'design-color-scheme':
        return {
          ...content,
          theme: {
            primary: change.after.primary,
            secondary: change.after.secondary,
            background: "#f8fafc"
          }
        };

      case 'functionality-calculator':
        return {
          ...content,
          services: content.services.map((service: any) => 
            service.id === 'ux-research' ? {
              ...service,
              hasCalculator: true,
              calculatorType: 'roi'
            } : service
          )
        };

      case 'seo-optimization':
        return {
          ...content,
          metadata: {
            title: change.after.title,
            description: change.after.meta,
            keywords: [...content.metadata.keywords, 'enterprise', 'fortune 500', 'digital transformation']
          }
        };

      default:
        return content;
    }
  }

  private static generateHTML(content: any): string {
    const clientLogos = content.clients.map((client: string) => 
      `<div class="client-logo">${client}</div>`
    ).join('');

    const serviceCards = content.services.map((service: any) => `
      <div class="service-card" data-service="${service.id}">
        <div class="service-icon">${service.icon}</div>
        <h3>${service.title}</h3>
        <p>${service.description}</p>
        ${service.hasCalculator ? `
          <div class="roi-calculator">
            <h4>ROI Calculator</h4>
            <div class="calculator-inputs">
              <input type="number" placeholder="Current conversion rate %" />
              <input type="number" placeholder="Monthly traffic" />
              <button class="calculate-btn">Calculate ROI</button>
            </div>
            <div class="calculator-result" style="display: none;">
              <div class="result-card">
                <h5>Potential Monthly Increase</h5>
                <div class="result-value">$<span id="roi-result">0</span></div>
              </div>
            </div>
          </div>
        ` : ''}
        <button class="service-cta">${service.cta || content.hero.cta}</button>
      </div>
    `).join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${content.metadata.title}</title>
        <meta name="description" content="${content.metadata.description}">
        <meta name="keywords" content="${content.metadata.keywords.join(', ')}">
        <link rel="stylesheet" href="/preview-styles.css">
      </head>
      <body>
        <div class="preview-container">
          <!-- Header -->
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

          <!-- Hero Section -->
          <section class="hero">
            <div class="hero-content">
              <h1 class="hero-title">${content.hero.title}</h1>
              <p class="hero-subtitle">${content.hero.subtitle}</p>
              <button class="hero-cta">${content.hero.cta}</button>
            </div>
            <div class="hero-visual">
              <div class="hero-graphic"></div>
            </div>
          </section>

          <!-- Client Logos -->
          <section class="clients">
            <h2>Trusted by industry leaders</h2>
            <div class="client-grid">
              ${clientLogos}
            </div>
          </section>

          <!-- Services -->
          <section class="services" id="services">
            <h2>Our Services</h2>
            <div class="services-grid">
              ${serviceCards}
            </div>
          </section>

          <!-- Trust Signals -->
          <section class="trust-signals">
            <div class="stat">
              <div class="stat-number">20+</div>
              <div class="stat-label">Years Experience</div>
            </div>
            <div class="stat">
              <div class="stat-number">500+</div>
              <div class="stat-label">Projects Delivered</div>
            </div>
            <div class="stat">
              <div class="stat-number">98%</div>
              <div class="stat-label">Client Satisfaction</div>
            </div>
          </section>

          <!-- Contact CTA -->
          <section class="contact-cta">
            <h2>Ready to transform your product?</h2>
            <p>Let's discuss how we can help you achieve your goals</p>
            <button class="contact-btn">${content.hero.cta}</button>
          </section>
        </div>

        <script>
          // ROI Calculator functionality
          document.querySelectorAll('.calculate-btn').forEach(btn => {
            btn.addEventListener('click', function() {
              const calculator = this.closest('.roi-calculator');
              const inputs = calculator.querySelectorAll('input');
              const conversionRate = parseFloat(inputs[0].value) || 0;
              const monthlyTraffic = parseFloat(inputs[1].value) || 0;
              
              // Simple ROI calculation (assuming 20% improvement and $100 average value)
              const improvement = 0.20;
              const avgValue = 100;
              const currentConversions = (monthlyTraffic * conversionRate) / 100;
              const improvedConversions = currentConversions * (1 + improvement);
              const additionalRevenue = (improvedConversions - currentConversions) * avgValue;
              
              calculator.querySelector('#roi-result').textContent = Math.round(additionalRevenue).toLocaleString();
              calculator.querySelector('.calculator-result').style.display = 'block';
            });
          });

          // Highlight changes (if in preview mode)
          if (window.parent && window.parent.previewMode) {
            document.querySelectorAll('[data-change-id]').forEach(el => {
              el.style.outline = '2px solid #3B82F6';
              el.style.outlineOffset = '2px';
            });
          }
        </script>
      </body>
      </html>
    `;
  }

  private static generateCSS(content: any, changes: ChangePreview[]): string {
    const theme = content.theme || {
      primary: '#3B82F6',
      secondary: '#10B981',
      background: '#ffffff'
    };

    // Check if there are design changes that affect the CSS
    const hasColorChanges = changes.some(change => change.id === 'design-color-scheme');
    const hasLayoutChanges = changes.some(change => change.type === 'layout');

    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #1f2937;
        background: ${theme.background};
      }

      .preview-container {
        min-height: 100vh;
      }

      /* Header */
      .header {
        padding: 1rem 2rem;
        background: white;
        border-bottom: 1px solid #e5e7eb;
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
      }

      .logo {
        font-size: 1.5rem;
        font-weight: bold;
        color: ${theme.primary};
      }

      .nav-links {
        display: flex;
        gap: 2rem;
      }

      .nav-links a {
        text-decoration: none;
        color: #6b7280;
        font-weight: 500;
        transition: color 0.2s;
      }

      .nav-links a:hover {
        color: ${theme.primary};
      }

      /* Hero Section */
      .hero {
        display: flex;
        align-items: center;
        min-height: 80vh;
        padding: 4rem 2rem;
        max-width: 1200px;
        margin: 0 auto;
        gap: 4rem;
        ${hasLayoutChanges ? 'flex-direction: column;' : ''}
      }

      .hero-content {
        flex: 1;
        ${hasLayoutChanges ? 'text-align: center;' : ''}
      }

      .hero-title {
        font-size: 3.5rem;
        font-weight: bold;
        margin-bottom: 1rem;
        line-height: 1.1;
        ${hasColorChanges ? `color: ${theme.primary};` : 'color: #1f2937;'}
      }

      .hero-subtitle {
        font-size: 1.25rem;
        color: #6b7280;
        margin-bottom: 2rem;
        max-width: 600px;
      }

      .hero-cta, .service-cta, .contact-btn {
        background: ${theme.primary};
        color: white;
        border: none;
        padding: 1rem 2rem;
        font-size: 1.1rem;
        font-weight: 600;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .hero-cta:hover, .service-cta:hover, .contact-btn:hover {
        background: ${this.darkenColor(theme.primary, 10)};
        transform: translateY(-1px);
      }

      .hero-visual {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .hero-graphic {
        width: 400px;
        height: 300px;
        background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary});
        border-radius: 20px;
        position: relative;
        opacity: 0.9;
      }

      .hero-graphic::before {
        content: '';
        position: absolute;
        top: 20px;
        left: 20px;
        right: 20px;
        bottom: 20px;
        background: white;
        border-radius: 12px;
        opacity: 0.1;
      }

      /* Clients Section */
      .clients {
        padding: 4rem 2rem;
        background: #f9fafb;
        text-align: center;
      }

      .clients h2 {
        margin-bottom: 3rem;
        color: #6b7280;
        font-size: 1.1rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .client-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 2rem;
        max-width: 1000px;
        margin: 0 auto;
        align-items: center;
      }

      .client-logo {
        padding: 1rem;
        font-weight: 600;
        color: #9ca3af;
        font-size: 0.9rem;
      }

      /* Services Section */
      .services {
        padding: 6rem 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .services h2 {
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 4rem;
        color: #1f2937;
      }

      .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 3rem;
      }

      .service-card {
        background: white;
        padding: 2.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        text-align: center;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .service-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
      }

      .service-icon {
        font-size: 3rem;
        margin-bottom: 1.5rem;
      }

      .service-card h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: #1f2937;
      }

      .service-card p {
        color: #6b7280;
        margin-bottom: 2rem;
      }

      /* ROI Calculator */
      .roi-calculator {
        background: #f8fafc;
        border: 2px solid ${theme.primary};
        border-radius: 8px;
        padding: 1.5rem;
        margin: 1.5rem 0;
        text-align: left;
      }

      .roi-calculator h4 {
        color: ${theme.primary};
        margin-bottom: 1rem;
        font-size: 1.1rem;
      }

      .calculator-inputs {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }

      .calculator-inputs input {
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 0.9rem;
      }

      .calculate-btn {
        background: ${theme.secondary};
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.9rem;
      }

      .result-card {
        background: white;
        padding: 1rem;
        border-radius: 6px;
        border-left: 4px solid ${theme.secondary};
      }

      .result-card h5 {
        color: #6b7280;
        font-size: 0.8rem;
        margin-bottom: 0.25rem;
      }

      .result-value {
        font-size: 1.5rem;
        font-weight: bold;
        color: ${theme.secondary};
      }

      /* Trust Signals */
      .trust-signals {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
        padding: 4rem 2rem;
        background: #f9fafb;
        max-width: 1200px;
        margin: 0 auto;
      }

      .stat {
        text-align: center;
      }

      .stat-number {
        font-size: 3rem;
        font-weight: bold;
        color: ${theme.primary};
        margin-bottom: 0.5rem;
      }

      .stat-label {
        color: #6b7280;
        font-weight: 500;
      }

      /* Contact CTA */
      .contact-cta {
        background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary});
        color: white;
        padding: 6rem 2rem;
        text-align: center;
      }

      .contact-cta h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }

      .contact-cta p {
        font-size: 1.2rem;
        margin-bottom: 2rem;
        opacity: 0.9;
      }

      .contact-btn {
        background: white;
        color: ${theme.primary};
        font-size: 1.1rem;
        padding: 1rem 2.5rem;
      }

      .contact-btn:hover {
        background: #f9fafb;
        transform: translateY(-2px);
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .hero {
          flex-direction: column;
          text-align: center;
          min-height: 60vh;
        }

        .hero-title {
          font-size: 2.5rem;
        }

        .nav-links {
          display: none;
        }

        .services-grid {
          grid-template-columns: 1fr;
        }

        .client-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      /* Preview-specific styles */
      [data-change-id] {
        position: relative;
      }

      [data-change-id]::after {
        content: 'Modified';
        position: absolute;
        top: -8px;
        right: -8px;
        background: #3B82F6;
        color: white;
        font-size: 0.7rem;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 600;
        opacity: 0.9;
        pointer-events: none;
      }
    `;
  }

  private static darkenColor(color: string, percent: number): string {
    // Simple color darkening function
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }
}

export { PreviewContentGenerator, type PreviewContent, type PreviewGeneratorConfig };