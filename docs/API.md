# API Documentation
## Complete API Reference for PH1 Admin Tool

This document provides detailed information about all API endpoints, request/response formats, and usage examples.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Admin Routes](#admin-routes)
3. [Contentful Routes](#contentful-routes)
4. [Request/Response Formats](#requestresponse-formats)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)

---

## Authentication

All `/api/admin/*` routes require admin authentication.

### Authentication Methods

#### Session-Based (Web UI)
- Log in at `/admin` with password
- Session stored in httpOnly cookie
- Automatic for all admin panel requests

#### Token-Based (API Calls)
```bash
curl -X POST https://your-domain.com/api/admin/revise/page \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"pageSlug":"homepage","prompt":"test"}'
```

---

## Admin Routes

### 1. Revise Page

**Endpoint**: `POST /api/admin/revise/page`

**Purpose**: Modify existing pages through natural language prompts

**Request Body**:
```typescript
{
  pageSlug: string;        // e.g., "homepage", "services/ux-research"
  prompt: string;          // Natural language modification request
  preview?: boolean;       // If true, return preview without saving
  sections?: string[];     // Specific sections to modify (optional)
}
```

**Response**:
```typescript
{
  success: boolean;
  changes: {
    [sectionType: string]: {
      old: string | object;
      new: string | object;
    }
  };
  previewUrl?: string;     // If preview=true
  contentfulId: string;    // Updated entry ID
  timestamp: string;
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/admin/revise/page \
  -H "Content-Type: application/json" \
  -d '{
    "pageSlug": "homepage",
    "prompt": "Make the hero section more enterprise-focused",
    "preview": true
  }'
```

**Response**:
```json
{
  "success": true,
  "changes": {
    "hero": {
      "old": "Transform your product with expert design",
      "new": "Transform your enterprise with strategic design solutions"
    }
  },
  "previewUrl": "https://preview.contentful.com/...",
  "contentfulId": "abc123",
  "timestamp": "2025-10-30T19:00:00Z"
}
```

---

### 2. Draft Page

**Endpoint**: `POST /api/admin/draft/page`

**Purpose**: Create new pages from prompts

**Request Body**:
```typescript
{
  pageType: string;        // "service" | "case-study" | "landing" | "blog"
  topic: string;           // Main topic/title
  targetAudience?: string; // Who is this for?
  tone?: string;           // "professional" | "casual" | "technical"
  includeComponents?: string[]; // ["hero", "benefits", "cta", "testimonials"]
}
```

**Response**:
```typescript
{
  success: boolean;
  slug: string;            // Generated URL slug
  contentfulId: string;    // New entry ID
  previewUrl: string;
  pageStructure: {
    title: string;
    sections: Array<{
      type: string;
      content: object;
    }>;
  };
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/admin/draft/page \
  -H "Content-Type: application/json" \
  -d '{
    "pageType": "service",
    "topic": "AI Strategy Consulting",
    "targetAudience": "C-suite executives",
    "tone": "professional",
    "includeComponents": ["hero", "benefits", "process", "cta", "testimonials"]
  }'
```

---

### 3. Curate Page

**Endpoint**: `POST /api/admin/curate/page`

**Purpose**: Process uploaded documents into web pages

**Request**: `multipart/form-data`
```typescript
{
  file: File;              // PDF, DOCX, or TXT
  pageType: string;        // Target page type
  prompt?: string;         // Additional instructions
  extractImages?: boolean; // Extract images from document
}
```

**Response**:
```typescript
{
  success: boolean;
  extractedContent: {
    text: string;
    images?: string[];     // URLs to extracted images
    metadata: {
      title: string;
      author?: string;
      pages: number;
    };
  };
  generatedPage: {
    slug: string;
    contentfulId: string;
    sections: object[];
  };
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/admin/curate/page \
  -F "file=@presentation.pdf" \
  -F "pageType=service" \
  -F "prompt=Focus on enterprise benefits" \
  -F "extractImages=true"
```

---

### 4. Generate Page

**Endpoint**: `POST /api/admin/generate/page`

**Purpose**: AI-powered complete page generation

**Request Body**:
```typescript
{
  prompt: string;          // Full page generation prompt
  pageType?: string;       // Suggested page type
  context?: string;        // Additional context
  style?: string;          // Style preferences
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/admin/generate/page \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a landing page for healthcare executives interested in HIPAA-compliant design services",
    "pageType": "landing",
    "context": "Target Fortune 500 healthcare companies",
    "style": "professional, trust-building, compliance-focused"
  }'
```

---

### 5. Smart Compose

**Endpoint**: `POST /api/admin/smart-compose`

**Purpose**: Component-level updates across multiple pages

**Request Body**:
```typescript
{
  componentType: string;   // "testimonial" | "cta" | "benefit" | "hero"
  targetPages: string[];   // Page slugs or "all-services", "all-landing"
  prompt: string;          // Modification instructions
  createIfMissing?: boolean; // Add component if not present
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/admin/smart-compose \
  -H "Content-Type: application/json" \
  -d '{
    "componentType": "cta",
    "targetPages": ["all-services"],
    "prompt": "Update all CTAs to emphasize ROI and include calculator link",
    "createIfMissing": false
  }'
```

**Response**:
```typescript
{
  success: boolean;
  pagesModified: number;
  changes: Array<{
    pageSlug: string;
    sectionType: string;
    oldContent: object;
    newContent: object;
  }>;
}
```

---

### 6. Find & Replace

**Endpoint**: `POST /api/admin/find-replace`

**Purpose**: Intelligent global search and replace

**Request Body**:
```typescript
{
  searchText: string;
  replaceText: string;
  scope: "all" | "pages" | "sections";
  pageFilter?: string[];   // Specific pages (optional)
  caseSensitive?: boolean;
  wholeWord?: boolean;
  preview?: boolean;
}
```

**Response**:
```typescript
{
  success: boolean;
  matchesFound: number;
  replacements: Array<{
    pageSlug: string;
    sectionType: string;
    fieldName: string;
    oldValue: string;
    newValue: string;
    context: string;       // Surrounding text
  }>;
  preview?: boolean;
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/admin/find-replace \
  -H "Content-Type: application/json" \
  -d '{
    "searchText": "client",
    "replaceText": "partner",
    "scope": "all",
    "caseSensitive": false,
    "wholeWord": true,
    "preview": true
  }'
```

---

### 7. Get All Routes

**Endpoint**: `GET /api/admin/[tool]/routes`

**Purpose**: List all available pages and sections for targeting

**Tools**:
- `/api/admin/revise/routes` - All editable pages
- `/api/admin/smart-compose/routes` - All pages with components
- `/api/admin/find-replace/routes` - All searchable content

**Response**:
```typescript
{
  pages: Array<{
    slug: string;
    title: string;
    sections: string[];    // Section types on this page
    lastModified: string;
  }>;
  total: number;
}
```

**Example**:
```bash
curl http://localhost:3000/api/admin/revise/routes
```

**Response**:
```json
{
  "pages": [
    {
      "slug": "homepage",
      "title": "Home",
      "sections": ["hero", "benefits", "testimonials", "cta"],
      "lastModified": "2025-10-30T15:00:00Z"
    },
    {
      "slug": "services/ux-research",
      "title": "UX Research Services",
      "sections": ["hero", "process", "case-studies", "pricing", "cta"],
      "lastModified": "2025-10-29T10:30:00Z"
    }
  ],
  "total": 2
}
```

---

## Contentful Routes

### 1. Scan Content

**Endpoint**: `POST /api/contentful/scan`

**Purpose**: Analyze Contentful content structure

**Request Body**:
```typescript
{
  depth?: number;          // How many levels deep to scan (default: 2)
  includeUnpublished?: boolean;
}
```

**Response**:
```typescript
{
  contentTypes: Array<{
    id: string;
    name: string;
    fields: Array<{
      id: string;
      name: string;
      type: string;
    }>;
  }>;
  entries: {
    total: number;
    byType: {
      [contentType: string]: number;
    };
  };
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/contentful/scan \
  -H "Content-Type: application/json" \
  -d '{"depth": 3, "includeUnpublished": false}'
```

---

### 2. Update Entry

**Endpoint**: `POST /api/contentful/update`

**Purpose**: Update specific Contentful entry

**Request Body**:
```typescript
{
  entryId: string;
  fields: {
    [fieldName: string]: {
      'en-US': any;
    };
  };
  publish?: boolean;       // Auto-publish after update
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/contentful/update \
  -H "Content-Type: application/json" \
  -d '{
    "entryId": "abc123",
    "fields": {
      "pageTitle": {
        "en-US": "Updated Page Title"
      }
    },
    "publish": true
  }'
```

---

### 3. Create Entry

**Endpoint**: `POST /api/contentful/create`

**Purpose**: Create new Contentful entry

**Request Body**:
```typescript
{
  contentType: string;     // "page" | "section"
  fields: {
    [fieldName: string]: {
      'en-US': any;
    };
  };
  publish?: boolean;
}
```

---

## Request/Response Formats

### Standard Success Response

```typescript
{
  success: true;
  data: any;               // Response data
  message?: string;        // Optional success message
  timestamp: string;       // ISO 8601 timestamp
}
```

### Standard Error Response

```typescript
{
  success: false;
  error: {
    code: string;          // Error code
    message: string;       // Human-readable error
    details?: any;         // Additional error details
  };
  timestamp: string;
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `AUTH_REQUIRED` | Authentication needed |
| `INVALID_REQUEST` | Malformed request |
| `NOT_FOUND` | Resource not found |
| `CONTENTFUL_ERROR` | Contentful API error |
| `AI_ERROR` | Claude API error |
| `VALIDATION_ERROR` | Input validation failed |
| `RATE_LIMIT` | Too many requests |

---

## Error Handling

### Example Error Response

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Page with slug 'nonexistent' not found",
    "details": {
      "slug": "nonexistent",
      "availableSlugs": ["homepage", "services/ux-research"]
    }
  },
  "timestamp": "2025-10-30T19:00:00Z"
}
```

### HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Server Error |
| 502 | Bad Gateway (external API issue) |

---

## Rate Limiting

### Limits

- **Admin Routes**: 100 requests per 15 minutes per IP
- **Public Routes**: 1000 requests per 15 minutes per IP
- **AI Generation**: 20 requests per hour (Anthropic limit)

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1698765432
```

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT",
    "message": "Rate limit exceeded. Try again in 5 minutes.",
    "details": {
      "limit": 100,
      "remaining": 0,
      "resetAt": "2025-10-30T19:15:00Z"
    }
  }
}
```

---

## Testing APIs

### Using cURL

```bash
# Test revise endpoint
curl -X POST http://localhost:3000/api/admin/revise/page \
  -H "Content-Type: application/json" \
  -d '{
    "pageSlug": "homepage",
    "prompt": "Update hero section",
    "preview": true
  }'

# Test with authentication
curl -X POST https://your-domain.com/api/admin/revise/page \
  -H "Authorization: Bearer YOUR_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"pageSlug":"homepage","prompt":"test"}'
```

### Using Postman

1. **Import** collection from `/docs/postman/PH1-Admin-API.json`
2. **Set** environment variables:
   - `BASE_URL`: `http://localhost:3000`
   - `ADMIN_PASSWORD`: Your admin password
3. **Test** all endpoints with pre-configured requests

### Using JavaScript

```javascript
// Example: Revise page
const response = await fetch('/api/admin/revise/page', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    pageSlug: 'homepage',
    prompt: 'Make hero more enterprise-focused',
    preview: true
  })
});

const result = await response.json();
console.log(result);
```

---

## Webhooks (Future Feature)

### Planned Webhooks

- `page.created` - Triggered when new page created
- `page.updated` - Triggered when page modified
- `page.deleted` - Triggered when page deleted

### Webhook Payload Example

```json
{
  "event": "page.updated",
  "timestamp": "2025-10-30T19:00:00Z",
  "data": {
    "pageSlug": "homepage",
    "contentfulId": "abc123",
    "changes": {
      "hero": {
        "old": "...",
        "new": "..."
      }
    },
    "modifiedBy": "admin",
    "prompt": "Make hero more enterprise-focused"
  }
}
```

---

## API Versioning

Current version: **v1**

All routes are prefixed with `/api/` currently. Future versions will use `/api/v2/` etc.

---

## Support

For API issues or questions:
- Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Review example requests above
- Contact: [your-email@ph1.ca]

---

**Last Updated**: October 30, 2025  
**API Version**: 1.0
