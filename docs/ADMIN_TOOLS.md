# Admin Tools User Guide
## Complete Guide to All 6 PH1 Admin Tools

This guide provides detailed instructions for using each tool in the PH1 Admin panel.

---

## Table of Contents

1. [Admin Dashboard Overview](#admin-dashboard-overview)
2. [Tool 1: Revise Page](#tool-1-revise-page)
3. [Tool 2: Draft Page](#tool-2-draft-page)
4. [Tool 3: Curate Page](#tool-3-curate-page)
5. [Tool 4: Smart Compose](#tool-4-smart-compose)
6. [Tool 5: Find & Replace](#tool-5-find--replace)
7. [Tool 6: Generate Page](#tool-6-generate-page)
8. [Best Practices](#best-practices)
9. [Common Workflows](#common-workflows)

---

## Admin Dashboard Overview

Access the admin panel at `/admin` using your admin password.

### Dashboard Features

- **6 Admin Tools**: Access all content management capabilities
- **Change History**: View recent modifications
- **Quick Stats**: See site-wide metrics
- **System Status**: Monitor Contentful and Claude AI connections

### Navigation

```
┌─────────────────────────────────────┐
│        PH1 Admin Dashboard          │
├─────────────────────────────────────┤
│  🔧 Revise Page                     │
│  ✍️  Draft Page                      │
│  📄 Curate Page                     │
│  🎨 Smart Compose                   │
│  🔍 Find & Replace                  │
│  ✨ Generate Page                   │
├─────────────────────────────────────┤
│  📊 Change History                  │
│  ⚙️  Settings                        │
└─────────────────────────────────────┘
```

---

## Tool 1: Revise Page

**Purpose**: Modify existing pages through natural language prompts

**Best For**:
- Updating messaging and tone
- Modifying CTAs and conversion elements
- Adjusting layouts
- Refreshing content for different audiences

### How to Use

#### Step 1: Select Page

1. Click "Revise Page" from dashboard
2. Choose page from dropdown:
   - Type to search
   - Or browse by category

#### Step 2: Write Your Prompt

Be specific about what you want to change:

**Good Prompts:**
```
"Make the hero section more enterprise-focused with Fortune 500 language"
"Update all CTAs to emphasize ROI instead of features"
"Add social proof above the main CTA"
"Simplify the benefits section for C-suite executives"
```

**Bad Prompts:**
```
"Make it better" (too vague)
"Update the page" (what specifically?)
"Change stuff" (what stuff?)
```

#### Step 3: Preview Changes

1. Click "Preview" to see changes without saving
2. Review side-by-side comparison:
   - Left: Original content
   - Right: Proposed changes
3. Changes highlighted in yellow

#### Step 4: Apply or Refine

**If satisfied:**
- Click "Apply Changes"
- Confirm when prompted
- Changes go live immediately

**If not satisfied:**
- Click "Refine" to modify prompt
- Or "Cancel" to discard

### Advanced Features

#### Selective Modification

Target specific sections:

```
Sections to Modify: [✓] Hero  [✓] CTA  [ ] Benefits
Prompt: "Make these sections more urgent"
```

#### Version History

- View all past versions
- Compare any two versions
- Restore previous version with one click

### Examples

#### Example 1: Audience Pivot

**Scenario**: Make homepage appeal to enterprise clients

**Prompt**:
```
"Update the homepage to target Fortune 500 companies. 
Emphasize scale, security, compliance, and track record. 
Change language from 'startup-friendly' to 'enterprise-grade'."
```

**Result**:
- Hero: Changed "Transform your product" → "Transform your enterprise"
- Benefits: Added compliance, security, scale mentions
- CTAs: Changed "Try it free" → "Schedule enterprise demo"
- Testimonials: Prioritized Fortune 500 logos

#### Example 2: Conversion Optimization

**Prompt**:
```
"Reduce friction in the signup process. 
Add trust signals above the CTA.
Simplify form fields to just email and company name."
```

**Result**:
- Added client logos above form
- Reduced form from 5 fields to 2
- Added "No credit card required" copy
- Emphasized "2-minute setup"

---

## Tool 2: Draft Page

**Purpose**: Create complete new pages from scratch using prompts

**Best For**:
- New service pages
- Case studies
- Landing pages
- Blog posts

### How to Use

#### Step 1: Choose Page Type

Select from templates:
- **Service Page**: For offerings
- **Case Study**: For client work
- **Landing Page**: For campaigns
- **Blog Post**: For content marketing

#### Step 2: Provide Details

Fill in the form:

**Required Fields:**
- **Topic**: Main subject (e.g., "AI Strategy Consulting")
- **Target Audience**: Who is this for? (e.g., "C-suite executives")

**Optional Fields:**
- **Tone**: Professional, casual, technical, friendly
- **Components**: Hero, benefits, process, pricing, testimonials, FAQ, CTA
- **Keywords**: SEO focus keywords
- **Context**: Any additional information

#### Step 3: Generate & Review

1. Click "Generate Page"
2. Claude AI creates complete page structure
3. Review in preview mode:
   - All sections generated
   - SEO metadata included
   - Images suggested (placeholders)

#### Step 4: Refine or Publish

**Refine**:
- Click specific sections to edit
- Use prompts to modify: "Make this section more technical"
- Regenerate individual sections

**Publish**:
- Assign URL slug
- Set publish date (now or schedule)
- Click "Publish Page"

### Page Components

#### Service Page Template

Generated sections:
1. **Hero**: Main value proposition
2. **Problem Statement**: Pain points addressed
3. **Solution Overview**: How you help
4. **Benefits**: Key advantages
5. **Process**: How it works (steps)
6. **Pricing**: Cost structure
7. **Case Studies**: Social proof
8. **FAQ**: Common questions
9. **CTA**: Conversion element

#### Case Study Template

Generated sections:
1. **Overview**: Client and challenge
2. **Background**: Context and goals
3. **Approach**: Methodology
4. **Results**: Outcomes and metrics
5. **Testimonial**: Client quote
6. **CTA**: Related services

### Examples

#### Example 1: New Service Page

**Inputs**:
```
Page Type: Service Page
Topic: AI Strategy Consulting
Target Audience: C-suite executives in healthcare
Tone: Professional, trust-building
Include Components: All
Keywords: AI strategy, healthcare AI, digital transformation
Context: Focus on HIPAA compliance and ROI
```

**Generated**:
- URL: `/services/ai-strategy-consulting`
- 9 sections (hero, problem, solution, benefits, process, pricing, cases, FAQ, CTA)
- SEO optimized for "AI strategy consulting healthcare"
- HIPAA compliance mentioned 12 times
- ROI calculator component included

#### Example 2: Campaign Landing Page

**Inputs**:
```
Page Type: Landing Page
Topic: Q4 Digital Transformation Assessment
Target Audience: VP-level technology leaders
Tone: Urgent but professional
Include Components: Hero, Benefits, Form, Testimonials
Context: Limited time offer, ends Dec 31
```

**Generated**:
- URL: `/q4-digital-transformation`
- Countdown timer in hero
- 3 key benefits for VP audience
- Simplified 3-field form
- 2 testimonials from similar roles
- SEO optimized for "digital transformation assessment"

---

## Tool 3: Curate Page

**Purpose**: Transform existing documents (PDFs, Word docs) into web pages

**Best For**:
- Repurposing presentations
- Converting whitepapers
- Digitizing print materials
- Importing existing content

### How to Use

#### Step 1: Upload Document

1. Click "Upload Document"
2. Supported formats:
   - PDF (.pdf)
   - Word (.docx)
   - Text (.txt)
   - Markdown (.md)

#### Step 2: Configure Processing

**Extraction Options:**
- [✓] Extract text
- [✓] Extract images
- [✓] Maintain formatting
- [ ] OCR for scanned documents

**Target Page Type:**
- Service page
- Case study
- Landing page
- Blog post

#### Step 3: Add Instructions

**Prompt**:
```
"Convert this presentation into a service page.
Focus on the enterprise benefits mentioned on slides 3-7.
Extract images from slides 2, 5, and 9.
Optimize for 'enterprise design services'."
```

#### Step 4: Review & Edit

1. Preview extracted content
2. AI organizes into web sections
3. Edit any section with prompts:
   - "Make this section more concise"
   - "Expand on the ROI section"
   - "Add a CTA after benefits"

#### Step 5: Publish

- Choose URL slug
- Verify SEO settings
- Publish or save as draft

### Advanced Features

#### Visual Analysis

Upload images/screenshots:
- AI describes visual content
- Extracts text from images
- Identifies charts and data
- Suggests web-friendly alternatives

#### Multi-Document Processing

Upload multiple files:
- Combine into single page
- Or create related page series
- AI merges complementary content

### Examples

#### Example 1: Presentation to Service Page

**Input**: 20-slide PDF about "UX Research Services"

**Steps**:
1. Upload PDF
2. Target: Service page
3. Prompt: "Focus on enterprise benefits, extract methodology diagrams"
4. Result: Complete service page with 8 sections, 3 diagrams converted to web graphics

#### Example 2: Whitepaper to Case Study

**Input**: 10-page Word doc about client project

**Steps**:
1. Upload DOCX
2. Target: Case study
3. Prompt: "Structure as: Challenge → Approach → Results. Include all metrics from page 7."
4. Result: Case study page with before/after metrics, client quote, key findings

---

## Tool 4: Smart Compose

**Purpose**: Update components across multiple pages simultaneously

**Best For**:
- Site-wide component updates
- Maintaining consistency
- Rolling out new sections
- Standardizing layouts

### How to Use

#### Step 1: Choose Component Type

Select component to modify:
- Hero
- CTA (Call-to-Action)
- Testimonial
- Benefits
- Pricing
- FAQ
- Footer

#### Step 2: Select Target Pages

**Options:**
- **All Pages**: Entire site
- **Page Type**: All service pages, all landing pages, etc.
- **Specific Pages**: Choose individually
- **Pages with Component**: Only pages that already have this component

**Example Selections:**
```
[✓] All service pages
[ ] All case studies
[ ] All landing pages
[✓] Homepage
```

#### Step 3: Write Modification Prompt

**Good Prompts:**
```
"Update all CTAs to emphasize ROI with 'Calculate your ROI' button"
"Add testimonials focusing on Fortune 500 clients"
"Standardize hero sections to include benefit statement + CTA"
```

#### Step 4: Preview Impact

Review affected pages:
```
Pages to be modified: 7
┌────────────────────────────────────┐
│ Homepage                           │
│   ✓ CTA component found            │
│   → Will update                    │
├────────────────────────────────────┤
│ Services / UX Research             │
│   ✓ CTA component found            │
│   → Will update                    │
├────────────────────────────────────┤
│ Services / Product Strategy        │
│   ✗ CTA component not found        │
│   → Will create (optional)         │
└────────────────────────────────────┘
```

#### Step 5: Apply Changes

- Review each page's changes
- Apply all at once
- Or apply individually

### Advanced Features

#### Conditional Updates

Only update components matching criteria:

```
Component: CTA
Condition: Contains text "Get Started"
Action: Replace with "Calculate ROI"
Pages: All service pages
```

#### Create If Missing

Add component to pages that don't have it:

```
Component: Testimonials
Target: All service pages
If Missing: Create new testimonial section
Position: Above final CTA
```

### Examples

#### Example 1: Global CTA Update

**Scenario**: Change all CTAs to emphasize ROI

**Configuration**:
```
Component: CTA
Target: All pages
Prompt: "Change all CTA buttons from 'Get Started' to 'Calculate Your ROI' 
        Add subtext: 'See your potential savings in 2 minutes'"
```

**Result**:
- 23 pages modified
- All CTA buttons updated
- Consistent messaging across site
- Change log created

#### Example 2: Add Component to Page Type

**Scenario**: Add pricing section to all service pages

**Configuration**:
```
Component: Pricing
Target: All service pages (7 pages)
If Missing: Create
Prompt: "Add pricing section with three tiers: 
        Starter ($5k), Professional ($15k), Enterprise (custom)"
```

**Result**:
- 7 service pages updated
- 5 had pricing added (new)
- 2 had pricing modified (existing)
- Consistent formatting across all

---

## Tool 5: Find & Replace

**Purpose**: Intelligent global search and replace with context awareness

**Best For**:
- Rebranding terminology
- Fixing typos site-wide
- Updating product names
- Consistency improvements

### How to Use

#### Step 1: Search

**Search Field:**
```
Find: [client          ]
```

**Options:**
- [ ] Case sensitive
- [ ] Whole word only
- [ ] Regular expression

#### Step 2: Configure Scope

**Where to search:**
- [✓] Page titles
- [✓] Page content
- [✓] Section content
- [✓] Meta descriptions
- [ ] URLs (be careful!)

**Which pages:**
- All pages
- Specific page type
- Individual pages

#### Step 3: Preview Results

```
Found 47 matches across 12 pages:

Homepage (3 matches)
  Line 15: "...trusted by 200+ clients worldwide..."
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^
  Line 34: "Our clients see an average..."
           ^^^^^^^^^^^^^^^^^^^
```

#### Step 4: Review Replacements

**Context-aware:**
```
Original: "client portal"
Replace:  "partner portal"
✓ Context: Login system
          
Original: "client-side rendering"
Replace:  [SKIP - technical term]
✗ Context: Code documentation
```

#### Step 5: Apply

- Apply all
- Apply selective
- Download change report

### Advanced Features

#### Smart Replacements

AI understands context:

```
Find: "user"
Replace: "customer"

AI Analysis:
✓ Replace: "Our users love..." → "Our customers love..."
✗ Skip: "User authentication" (technical)
✗ Skip: "username field" (compound word)
✓ Replace: "user experience" → "customer experience"
```

#### Batch Operations

Multiple find/replace pairs:

```
1. client → partner
2. customers → clients
3. users → customers
Run all in sequence
```

### Examples

#### Example 1: Rebrand Terminology

**Scenario**: Change "client" to "partner" site-wide

**Configuration**:
```
Find: client
Replace: partner
Scope: All content
Case sensitive: No
Whole word: Yes
```

**Preview**:
```
47 matches found
✓ "client portal" → "partner portal"
✓ "client success" → "partner success"
✗ Skip: "Clientele" (capitalized, different context)
✗ Skip: "client-side" (technical term)
```

**Result**:
- 43 replacements made
- 4 skipped (technical/proper nouns)
- Change log generated

#### Example 2: Fix Consistent Typo

**Scenario**: "recieve" → "receive" everywhere

**Configuration**:
```
Find: recieve
Replace: receive
Scope: All pages
Case sensitive: No
```

**Result**:
- 8 instances corrected
- No false positives
- Automatic fix

---

## Tool 6: Generate Page

**Purpose**: AI-powered complete page generation from minimal input

**Best For**:
- Quick page creation
- Campaign landing pages
- A/B test variations
- Rapid prototyping

### How to Use

#### Step 1: Describe Your Page

**Single Prompt**:
```
"Create a landing page for healthcare executives 
interested in HIPAA-compliant design services.
Focus on security, compliance, and ROI.
Include case study from major hospital system."
```

#### Step 2: AI Generates Complete Page

Claude analyzes and creates:
- Page structure
- All content sections
- SEO metadata
- Suggested images
- URL slug

**Generated Structure:**
```
1. Hero
   - Headline: "HIPAA-Compliant Design Services"
   - Subhead: "Enterprise security with measurable ROI"
   - CTA: "Schedule Compliance Consultation"

2. Problem Statement
   - Healthcare design challenges
   - Compliance requirements
   - Cost of non-compliance

3. Solution
   - Our approach to HIPAA design
   - Security-first methodology
   - ROI tracking

4. Case Study
   - Major hospital system project
   - Results and metrics
   - Compliance achievements

5. Benefits
   - Reduce compliance risk
   - Improve patient trust
   - Measure ROI

6. CTA
   - "Start Your Compliant Redesign"
```

#### Step 3: Review & Refine

Click any section to refine:

```
Section: Hero
Refine: "Make headline more specific about risk reduction"
Result: "Reduce HIPAA Compliance Risk with Proven Design"
```

#### Step 4: Publish

- URL automatically generated
- SEO optimized
- Publish immediately or schedule

### Advanced Features

#### Style Matching

Match existing page style:

```
Generate: New service page
Style: Match /services/ux-research
Result: Same structure, component order, tone
```

#### A/B Variations

Generate multiple versions:

```
Generate: 3 variations of landing page
Vary: Headlines and CTAs
Keep consistent: Benefits, case studies
```

### Examples

#### Example 1: Campaign Landing Page

**Prompt**:
```
"Create Q4 promotion landing page for digital transformation 
assessment. Target VP-level tech leaders. Limited time offer. 
Include countdown timer, 3 benefits, simple form, 2 testimonials."
```

**Generated in 30 seconds**:
- Complete landing page
- Countdown timer component
- 3 benefit cards
- 3-field form
- 2 VP-level testimonials
- SEO optimized
- URL: `/q4-digital-transformation-assessment`

#### Example 2: Service Page from Competitor Analysis

**Prompt**:
```
"Create service page for 'Voice UI Design' similar to 
competitor sites but emphasizing our unique approach: 
accessibility-first, multi-language, senior-friendly.
Include pricing, process (6 steps), case studies (smart home), 
and FAQ about accessibility."
```

**Generated**:
- Competitive analysis incorporated
- Unique positioning highlighted
- 6-step process visualized
- Smart home case study
- 8-question FAQ
- Accessibility-focused throughout

---

## Best Practices

### Writing Effective Prompts

#### Be Specific
**Bad**: "Update the page"
**Good**: "Update the hero section to target enterprise clients with Fortune 500 language"

#### Provide Context
**Bad**: "Make it better"
**Good**: "Make it more technical for developer audience, include code examples"

#### Specify Scope
**Bad**: "Add testimonials"
**Good**: "Add 2 testimonials above the main CTA, focusing on ROI results"

#### Include Constraints
**Good**: "Keep it under 50 words, maintain current CTA button"

### Using Preview Mode

**Always preview** major changes before applying.

**Best for:**
- Large-scale modifications
- Global changes
- Irreversible updates
- New page generation

### Version Control

**Use change history:**
- Review past changes
- Compare versions
- Restore if needed
- Learn from successful prompts

---

## Common Workflows

### Workflow 1: Audience Pivot

**Goal**: Change entire site focus from startups to enterprise

**Steps**:
1. **Find & Replace**: "startup" → "enterprise" (review each)
2. **Smart Compose**: Update all CTAs for enterprise language
3. **Revise Page**: Homepage hero for Fortune 500 focus
4. **Revise Page**: Each service page for enterprise context
5. **Draft Page**: Create "Enterprise Solutions" landing page

**Time**: ~2 hours (vs. 2 weeks with developer)

### Workflow 2: Campaign Launch

**Goal**: Launch new service offering with landing page

**Steps**:
1. **Generate Page**: Landing page from campaign brief
2. **Draft Page**: Supporting service page
3. **Smart Compose**: Add links to new pages in navigation
4. **Revise Page**: Update homepage to feature new offering

**Time**: ~30 minutes

### Workflow 3: SEO Optimization

**Goal**: Improve all service pages for target keywords

**Steps**:
1. **Revise Page**: Optimize each service page (one at a time)
2. **Smart Compose**: Add FAQ sections site-wide
3. **Find & Replace**: Update keyword usage site-wide
4. **Review SEO metrics** in admin dashboard

**Time**: ~1 hour

---

## Tips & Tricks

### Faster Page Creation

**Use templates:**
```
"Create service page like /services/ux-research but for Voice UI Design"
```

### Maintaining Consistency

**Reference existing pages:**
```
"Update this CTA to match the style on the homepage"
```

### Iterative Refinement

**Build incrementally:**
1. Generate basic page
2. Refine hero section
3. Refine benefits
4. Add testimonials
5. Optimize SEO

### Testing Changes

**Use preview links:**
- Share with team for review
- Get feedback before publishing
- Test on mobile devices

---

## Troubleshooting

### Common Issues

#### "Page not found"
- Check page slug spelling
- Verify page exists in Contentful
- Try refreshing page list

#### "Changes not appearing"
- Clear Contentful cache
- Wait 30 seconds for CDN update
- Check if page is published

#### "Prompt not working as expected"
- Be more specific
- Add more context
- Try breaking into smaller prompts
- Use examples in prompt

#### "AI generated incorrect content"
- Provide more context
- Use preview mode
- Refine with follow-up prompt
- Edit manually if needed

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open search | `Cmd/Ctrl + K` |
| Preview changes | `Cmd/Ctrl + P` |
| Apply changes | `Cmd/Ctrl + Enter` |
| Cancel | `Esc` |
| Undo | `Cmd/Ctrl + Z` |
| Save draft | `Cmd/Ctrl + S` |

---

## Getting Help

- Review [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Check [API Documentation](./API.md)
- See [Architecture Guide](./ARCHITECTURE.md)

---

**Happy editing! 🎉**

*Last Updated: October 30, 2025*
