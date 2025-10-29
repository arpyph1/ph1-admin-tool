# PH1 Prompt-Driven Website System 🚀

A revolutionary website management system that allows you to transform your 20-year consultancy website through simple natural language prompts.

## ⚡ Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   ```bash
   cp .env.example .env.local
   # Add your OpenAI API key and other credentials
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access Admin Panel**
   - Homepage: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## 🎯 What You Can Do

### Instant Content Transformations
- **"Make the homepage more enterprise-focused for Fortune 500 prospects"**
- **"Add a pricing calculator to the UX Research service page"**
- **"Update all CTAs to emphasize measurable ROI"**
- **"Create a case study page for our Spotify checkout optimization project"**

### Rapid Business Repositioning
- **"Reposition PH1 as an AI strategy leader"**
- **"Target healthcare companies with HIPAA compliance messaging"**
- **"Optimize the entire site for 'digital transformation consulting'"**

## 🏗️ System Architecture

### Core Components
- **Next.js 14** - Modern React framework
- **Tailwind CSS** - Utility-first styling
- **OpenAI GPT-4** - Content generation engine
- **Contentful** - Headless CMS (optional)
- **TypeScript** - Type-safe development

### AI-Powered Features
- **Smart Content Generation** - Create pages, sections, and copy
- **Global Content Rewriting** - Transform messaging site-wide
- **SEO Optimization** - Automatic keyword optimization
- **Audience Targeting** - Adapt content for different segments

## 📋 Implementation Phases

### ✅ Phase 1: Foundation (Complete)
- Next.js + Tailwind setup
- Admin panel with authentication
- AI content generation system
- Content scraping utilities

### 🔄 Phase 2: Content Import (In Progress)
- PH1.ca content analysis and extraction
- Homepage recreation with prompt hooks
- Service pages and case studies import
- Asset optimization and migration

### ⏳ Phase 3: Advanced Features (Planned)
- Global find-and-replace with AI
- Real-time content preview
- A/B testing for generated content
- Performance optimization automation

## 🔧 API Endpoints

### Content Generation
```bash
POST /api/generate
{
  "prompt": "Make the homepage more enterprise-focused",
  "type": "rewrite",
  "context": {
    "audienceType": "enterprise",
    "tone": "professional"
  }
}
```

### Content Scraping
```bash
POST /api/scrape
{
  "url": "https://ph1.ca",
  "fullSiteAnalysis": true
}
```

## 💡 Prompt Examples

### Page Generation
- "Create a new service page for AI Strategy Consulting targeting Fortune 500 CTOs"
- "Generate a landing page for healthcare prospects interested in HIPAA-compliant UX research"

### Content Optimization
- "Optimize all service pages for 'digital transformation consulting' keywords"
- "Add trust signals and client logos to increase enterprise credibility"

### Business Repositioning
- "Reposition PH1 from general consultancy to AI strategy specialists"
- "Update messaging to emphasize 20+ years of innovation expertise"

## 🎨 Design System

### Brand Colors
- `ph1-blue`: #0066CC (Primary)
- `ph1-navy`: #003366 (Secondary)
- `ph1-gray`: #6B7280 (Text)
- `ph1-light`: #F8FAFC (Background)

### Utility Classes
- `.text-gradient` - Blue gradient text
- `.hero-gradient` - Background gradient
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.card` - Standard card component

## 🔐 Security

- Environment variable protection
- API rate limiting
- Content validation and sanitization
- Secure authentication for admin panel

## 📈 Performance

- **Target Metrics**:
  - Lighthouse Score: 90+
  - First Contentful Paint: <1.5s
  - Time to Interactive: <2.5s
  - Core Web Vitals: All green

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Environment Variables for Production
- `OPENAI_API_KEY`
- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_ACCESS_TOKEN`
- `JWT_SECRET`
- `ADMIN_PASSWORD`

## 📞 Support

For questions about the prompt-driven system:
1. Check the admin panel documentation
2. Review example prompts
3. Test with simple transformations first
4. Scale up to complex site-wide changes

---

**Ready to transform your consultancy website? Start with the admin panel at `/admin`! 🎯**
