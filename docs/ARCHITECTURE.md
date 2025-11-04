# Architecture Guide
## Technical Deep Dive into PH1 Admin Tool

This document provides a comprehensive technical overview of the system architecture.

---

## System Overview

The PH1 Admin Tool is a **three-tier architecture**:

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│  (Next.js Admin UI + Public Site)       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         APPLICATION LAYER               │
│  (API Routes + Business Logic)          │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         DATA LAYER                      │
│  (Contentful CMS + Claude AI)           │
└─────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14.x | React framework with App Router |
| React | 18.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling |
| shadcn/ui | Latest | Component library |

### Backend

| Technology | Purpose |
|-----------|---------|
| Next.js API Routes | RESTful API endpoints |
| Node.js | Runtime environment |
| TypeScript | Server-side type safety |

### External Services

| Service | Purpose |
|---------|---------|
| Contentful | Headless CMS for content storage |
| Anthropic Claude | AI for content generation |
| Vercel | Hosting and deployment |

---

## Directory Structure

```
ph1-admin-tool/
│
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Public homepage
│   │
│   ├── admin/                   # Admin panel (protected)
│   │   ├── layout.tsx          # Admin auth wrapper
│   │   ├── page.tsx            # Admin dashboard
│   │   │
│   │   ├── revise/             # Revise Page tool
│   │   │   └── page.tsx
│   │   │
│   │   ├── draft/              # Draft Page tool
│   │   │   └── page.tsx
│   │   │
│   │   ├── curate/             # Curate Page tool
│   │   │   └── page.tsx
│   │   │
│   │   ├── generate/           # Generate Page tool
│   │   │   └── page.tsx
│   │   │
│   │   ├── smart-compose/      # Smart Compose tool
│   │   │   └── page.tsx
│   │   │
│   │   ├── find-replace/       # Find & Replace tool
│   │   │   └── page.tsx
│   │   │
│   │   └── changelog/          # Change history
│   │       └── page.tsx
│   │
│   └── api/                     # API Routes
│       ├── admin/              # Admin endpoints
│       │   ├── revise/
│       │   │   ├── page/
│       │   │   │   └── route.ts
│       │   │   └── routes/
│       │   │       └── route.ts
│       │   ├── draft/
│       │   │   └── page/
│       │   │       └── route.ts
│       │   ├── curate/
│       │   │   └── page/
│       │   │       └── route.ts
│       │   ├── generate/
│       │   │   └── page/
│       │   │       └── route.ts
│       │   ├── smart-compose/
│       │   │   ├── route.ts
│       │   │   └── routes/
│       │   │       └── route.ts
│       │   └── find-replace/
│       │       ├── route.ts
│       │       └── routes/
│       │           └── route.ts
│       │
│       ├── contentful/         # Contentful integration
│       │   ├── scan/
│       │   │   └── route.ts
│       │   ├── update/
│       │   │   └── route.ts
│       │   └── create/
│       │       └── route.ts
│       │
│       └── auth/               # Authentication
│           ├── login/
│           │   └── route.ts
│           └── logout/
│               └── route.ts
│
├── lib/                         # Shared libraries
│   ├── anthropic.ts            # Claude AI client
│   ├── contentful.ts           # Contentful client
│   ├── auth.ts                 # Authentication logic
│   ├── prompts/                # AI prompt templates
│   │   ├── revise.ts
│   │   ├── draft.ts
│   │   ├── curate.ts
│   │   └── generate.ts
│   └── utils/                  # Utility functions
│       ├── markdown.ts
│       ├── slugify.ts
│       └── validation.ts
│
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── ...
│   └── admin/                  # Admin-specific components
│       ├── PromptInput.tsx
│       ├── PageSelector.tsx
│       ├── PreviewPane.tsx
│       └── ChangeHistory.tsx
│
├── types/                       # TypeScript definitions
│   ├── contentful.ts
│   ├── anthropic.ts
│   └── admin.ts
│
├── public/                      # Static assets
│   ├── images/
│   └── fonts/
│
├── docs/                        # Documentation
│   ├── ENVIRONMENT_SETUP.md
│   ├── API.md
│   ├── ADMIN_TOOLS.md
│   ├── ARCHITECTURE.md
│   ├── TROUBLESHOOTING.md
│   └── QUICK_START.md
│
├── .env.example                 # Environment template
├── .env.local                   # Local environment (gitignored)
├── .gitignore
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── package.json                # Dependencies
└── README.md                   # Main documentation
```

---

## Data Flow

### Modify Existing Page Flow

```
1. User Types Prompt
   ↓
2. Admin UI (app/admin/revise/page.tsx)
   - Validates input
   - Shows loading state
   ↓
3. API Route (app/api/admin/revise/page/route.ts)
   - Authenticates request
   - Fetches current page from Contentful
   ↓
4. Claude AI Analysis (lib/anthropic.ts)
   - Analyzes prompt intent
   - Generates modifications
   ↓
5. Contentful Update (lib/contentful.ts)
   - Updates entry via Management API
   - Publishes changes
   ↓
6. Response to User
   - Shows before/after comparison
   - Provides preview link
   ↓
7. Change Logged
   - Stored in local storage
   - Displayed in change history
```

### Create New Page Flow

```
1. User Provides Details
   ↓
2. Admin UI (app/admin/draft/page.tsx)
   - Collects page type, topic, audience
   ↓
3. API Route (app/api/admin/draft/page/route.ts)
   - Validates input
   - Prepares context
   ↓
4. Claude AI Generation (lib/prompts/draft.ts)
   - Uses template for page type
   - Generates complete page structure
   ↓
5. Contentful Creation
   - Creates Page entry
   - Creates Section entries
   - Links references
   ↓
6. Response with Preview
   - Returns preview URL
   - Shows generated structure
   ↓
7. User Review & Publish
   - Can refine sections
   - Publishes when ready
```

---

## Key Components

### Authentication System

**Location**: `lib/auth.ts`, `app/admin/layout.tsx`

**How It Works**:
1. Password stored in environment variable
2. Session created on successful login
3. httpOnly cookie stores session token
4. Middleware checks auth on protected routes
5. Expires after 24 hours

**Implementation**:
```typescript
// lib/auth.ts
export async function validatePassword(password: string): Promise<boolean> {
  return password === process.env.ADMIN_PASSWORD;
}

export async function createSession(): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  // Store in session storage
  return token;
}
```

---

### Contentful Integration

**Location**: `lib/contentful.ts`

**Two Clients**:

1. **Delivery API Client** (Read-only, public)
```typescript
const deliveryClient = contentful.createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN!,
});
```

2. **Management API Client** (Read-write, private)
```typescript
const managementClient = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
});
```

**Key Functions**:
```typescript
// Fetch page by slug
async function getPageBySlug(slug: string): Promise<Page>

// Update page content
async function updatePage(id: string, fields: Fields): Promise<Page>

// Create new page
async function createPage(fields: Fields): Promise<Page>

// Publish entry
async function publishEntry(id: string): Promise<void>
```

---

### Claude AI Integration

**Location**: `lib/anthropic.ts`

**Configuration**:
```typescript
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const MODEL = 'claude-sonnet-4.5-20241022';
```

**Key Functions**:
```typescript
// Generate content modification
async function analyzeAndModify(
  prompt: string,
  currentContent: object
): Promise<ModifiedContent>

// Generate new page
async function generatePage(
  pageType: string,
  topic: string,
  context: object
): Promise<PageStructure>

// Process document
async function processDocument(
  documentText: string,
  instructions: string
): Promise<ProcessedContent>
```

---

### Prompt Templates

**Location**: `lib/prompts/`

#### Revise Page Template

```typescript
// lib/prompts/revise.ts
export const REVISE_PROMPT = `
You are modifying website content based on user instructions.

Current Page:
- Slug: {pageSlug}
- Title: {pageTitle}
- Sections: {sections}

User Request: {userPrompt}

Provide modified content that:
1. Maintains the same structure
2. Improves based on the request
3. Preserves SEO elements
4. Keeps the brand voice

Return JSON with before/after for each modified section.
`;
```

#### Draft Page Template

```typescript
// lib/prompts/draft.ts
export const DRAFT_SERVICE_PAGE = `
Create a professional service page for: {topic}

Target Audience: {audience}
Tone: {tone}

Include these sections:
1. Hero (compelling headline + subhead)
2. Problem Statement (pain points)
3. Solution Overview (how we help)
4. Benefits (key advantages)
5. Process (step-by-step)
6. Pricing (tiers if applicable)
7. Case Studies (social proof)
8. FAQ (common questions)
9. CTA (conversion element)

Return structured JSON with all sections.
`;
```

---

## API Architecture

### RESTful Conventions

All API routes follow REST principles:

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/admin/[tool]/routes` | List resources |
| POST | `/api/admin/[tool]/[action]` | Create/modify |
| PUT | `/api/admin/[tool]/[id]` | Update specific |
| DELETE | `/api/admin/[tool]/[id]` | Delete specific |

### Request/Response Format

**Standard Request**:
```json
{
  "action": "revise|draft|curate|generate",
  "data": {
    // Action-specific data
  },
  "options": {
    "preview": true,
    "publish": false
  }
}
```

**Standard Response**:
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "timestamp": "2025-10-30T19:00:00Z",
    "processingTime": 1234
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error",
    "details": {}
  }
}
```

---

## State Management

### Client-Side State

**React State** for UI interactions:
```typescript
const [prompt, setPrompt] = useState('');
const [loading, setLoading] = useState(false);
const [preview, setPreview] = useState<Preview | null>(null);
```

### Server State

**No traditional state management** - stateless API:
- Each request is independent
- No server-side sessions for data
- State stored in Contentful

### Local Storage

**Change History**:
```typescript
interface ChangeLog {
  id: string;
  timestamp: string;
  tool: string;
  prompt: string;
  changes: object;
}

localStorage.setItem('changelog', JSON.stringify(changes));
```

---

## Security

### Authentication

- Password-based admin access
- Session tokens (httpOnly cookies)
- 24-hour expiration
- No JWT for simplicity

### API Security

```typescript
// Middleware for protected routes
export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  
  if (!session) {
    return NextResponse.redirect('/admin/login');
  }
  
  // Validate session
  const isValid = await validateSession(session.value);
  if (!isValid) {
    return NextResponse.redirect('/admin/login');
  }
  
  return NextResponse.next();
}
```

### Environment Variables

**Public** (prefixed with `NEXT_PUBLIC_`):
- Exposed to browser
- Used for client-side API calls
- Example: `NEXT_PUBLIC_CONTENTFUL_SPACE_ID`

**Private** (no prefix):
- Server-side only
- Never exposed to browser
- Example: `CONTENTFUL_MANAGEMENT_TOKEN`

### Rate Limiting

**Implementation**:
```typescript
// Simple in-memory rate limiter
const requests = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;
  
  const userRequests = requests.get(ip) || [];
  const recentRequests = userRequests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return false;
  }
  
  recentRequests.push(now);
  requests.set(ip, recentRequests);
  return true;
}
```

---

## Performance Optimization

### Caching Strategy

**Contentful Content**:
```typescript
// Cache content for 5 minutes
const cache = new Map<string, { data: any; expires: number }>();

async function getCachedContent(key: string) {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  
  const data = await fetchFromContentful(key);
  cache.set(key, {
    data,
    expires: Date.now() + 5 * 60 * 1000
  });
  
  return data;
}
```

### Image Optimization

**Next.js Image Component**:
```typescript
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // For above-the-fold images
  placeholder="blur" // Smooth loading
/>
```

### Code Splitting

**Dynamic Imports**:
```typescript
// Load admin tools only when needed
const RevisePageTool = dynamic(() => import('./RevisePageTool'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

---

## Error Handling

### API Error Handling

```typescript
// app/api/admin/revise/page/route.ts
export async function POST(request: Request) {
  try {
    // Business logic
  } catch (error) {
    if (error instanceof ContentfulError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CONTENTFUL_ERROR',
            message: 'Failed to update content',
            details: error.message
          }
        },
        { status: 500 }
      );
    }
    
    if (error instanceof AnthropicError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AI_ERROR',
            message: 'Failed to generate content',
            details: error.message
          }
        },
        { status: 500 }
      );
    }
    
    // Generic error
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'An unexpected error occurred'
        }
      },
      { status: 500 }
    );
  }
}
```

---

## Testing Strategy

### Unit Tests

```typescript
// lib/__tests__/anthropic.test.ts
import { analyzeAndModify } from '../anthropic';

describe('analyzeAndModify', () => {
  it('should modify content based on prompt', async () => {
    const result = await analyzeAndModify(
      'Make it more professional',
      { title: 'Hey there!' }
    );
    
    expect(result.title).not.toBe('Hey there!');
    expect(result.title).toMatch(/professional tone/);
  });
});
```

### Integration Tests

```typescript
// app/api/admin/revise/page/__tests__/route.test.ts
describe('POST /api/admin/revise/page', () => {
  it('should revise page content', async () => {
    const response = await fetch('/api/admin/revise/page', {
      method: 'POST',
      body: JSON.stringify({
        pageSlug: 'test-page',
        prompt: 'Make hero more engaging'
      })
    });
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.changes).toBeDefined();
  });
});
```

---

## Deployment Architecture

### Vercel Deployment

```
GitHub Repository
       ↓
Vercel Build Pipeline
       ↓
Edge Network (Global CDN)
       ↓
User Requests
```

### Environment Configuration

**Development**:
```
NODE_ENV=development
Localhost:3000
.env.local variables
```

**Production**:
```
NODE_ENV=production
Custom domain
Vercel environment variables
```

---

## Monitoring & Logging

### Application Logs

```typescript
// Structured logging
logger.info('Page modified', {
  pageSlug: 'homepage',
  prompt: 'Make hero more engaging',
  duration: 1234,
  timestamp: new Date().toISOString()
});
```

### Error Tracking

**Vercel Integration**:
- Automatic error reporting
- Function logs in dashboard
- Real-time monitoring

---

## Scalability Considerations

### Horizontal Scaling

- Stateless API design
- No server-side sessions
- Edge functions on Vercel

### Database Scaling

- Contentful handles scaling
- CDN for content delivery
- Caching layer for performance

### AI API Limits

- Rate limiting implementation
- Request queueing for high volume
- Graceful degradation

---

## Future Architecture Enhancements

### Planned Improvements

1. **Webhook Integration**: Real-time updates from Contentful
2. **Background Jobs**: Queue for long-running AI tasks
3. **Version Control**: Git-like version history
4. **Multi-tenant**: Support multiple sites
5. **Advanced Caching**: Redis for distributed caching

---

**Last Updated**: October 30, 2025
**Architecture Version**: 1.0
