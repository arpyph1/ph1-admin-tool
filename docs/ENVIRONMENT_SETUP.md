# Environment Setup Guide
## Complete Configuration for PH1 Admin Tool

This guide walks you through setting up all required environment variables and external services.

---

## Table of Contents

1. [Contentful Setup](#contentful-setup)
2. [Anthropic Claude Setup](#anthropic-claude-setup)
3. [Admin Authentication](#admin-authentication)
4. [Environment Variables](#environment-variables)
5. [Verification](#verification)

---

## 1. Contentful Setup

### Create a Contentful Space

1. **Sign up or log in** to [Contentful](https://www.contentful.com)
2. **Create a new space**:
   - Click "Add Space"
   - Name it "PH1 Website"
   - Choose "Empty space"
   - Click "Create space"

3. **Get your Space ID**:
   - Go to Settings → General settings
   - Copy your Space ID
   - Example: `abc123xyz456`

### Generate API Tokens

#### Content Delivery API Token
1. Go to Settings → API keys
2. Click "Add API key"
3. Name it "PH1 Admin Delivery"
4. Copy the "Content Delivery API - access token"
5. Save this as `NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN`

#### Content Management API Token
1. Go to Settings → CMA tokens
2. Click "Generate personal token"
3. Name it "PH1 Admin Management"
4. Copy the token immediately (shown only once!)
5. Save this as `CONTENTFUL_MANAGEMENT_TOKEN`

### Create Content Models

#### Page Content Type

1. Go to Content model → Add content type
2. Name: "Page"
3. API identifier: `page`
4. Add fields:

| Field Name | Field ID | Field Type | Required | Notes |
|-----------|----------|------------|----------|-------|
| URL Slug | urlSlug | Text | Yes | Unique identifier |
| Page Title | pageTitle | Text | Yes | H1 title |
| Page Sections | pageSections | References (many) | No | Links to Section entries |
| SEO Title | seoTitle | Text | No | Meta title |
| SEO Description | seoDescription | Text | No | Meta description |

#### Section Content Type

1. Go to Content model → Add content type
2. Name: "Section"
3. API identifier: `section`
4. Add fields:

| Field Name | Field ID | Field Type | Required | Notes |
|-----------|----------|------------|----------|-------|
| Section Type | sectionType | Text | Yes | e.g., "hero", "benefits" |
| Content | content | JSON Object | No | Structured data |
| HTML Content | htmlContent | Rich Text | No | Rich text content |

---

## 2. Anthropic Claude Setup

### Get an API Key

1. **Sign up** at [Anthropic Console](https://console.anthropic.com)
2. **Navigate** to API Keys
3. **Create** a new API key
4. **Name** it "PH1 Admin Tool"
5. **Copy** the key (starts with `sk-ant-`)
6. **Save** as `ANTHROPIC_API_KEY`

### Verify Your Key

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4.5-20241022",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

Expected response:
```json
{
  "id": "msg_...",
  "type": "message",
  "content": [{"type": "text", "text": "Hello! How can I help you today?"}]
}
```

---

## 3. Admin Authentication

### Set Admin Password

Choose a strong password for your admin panel. This will be required every time you access `/admin`.

**Requirements:**
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers
- Include special characters
- Do NOT use common passwords

**Example**: `Ph1@dM!n2024#Secur3`

Save this as `ADMIN_PASSWORD`.

---

## 4. Environment Variables

### Create `.env.local` File

In your project root, create a file named `.env.local`:

```bash
cd ~/Downloads/ph1-website/tailwind-project
touch .env.local
open .env.local  # or use your text editor
```

### Add All Variables

Copy this template and fill in your actual values:

```env
# ============================================
# CONTENTFUL CMS
# ============================================

# Your Contentful Space ID (found in Settings → General)
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id_here

# Content Delivery API token (read-only, public)
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=your_delivery_token_here

# Content Management API token (read-write, private)
CONTENTFUL_MANAGEMENT_TOKEN=your_management_token_here

# Environment (usually "master")
CONTENTFUL_ENVIRONMENT=master

# ============================================
# ANTHROPIC CLAUDE AI
# ============================================

# Your Anthropic API key (starts with sk-ant-)
ANTHROPIC_API_KEY=sk-ant-your_key_here

# Claude model to use
ANTHROPIC_MODEL=claude-sonnet-4.5-20241022

# ============================================
# ADMIN AUTHENTICATION
# ============================================

# Password for /admin access (keep this secure!)
ADMIN_PASSWORD=your_secure_password_here

# ============================================
# OPTIONAL: ANALYTICS & MONITORING
# ============================================

# Google Analytics 4 (optional)
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Vercel Analytics (optional, auto-enabled on Vercel)
# NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_id_here

# ============================================
# DEVELOPMENT SETTINGS
# ============================================

# Node environment (development, production, test)
NODE_ENV=development

# Enable debug logging
DEBUG=false
```

### Variable Descriptions

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NEXT_PUBLIC_CONTENTFUL_SPACE_ID` | Public | Yes | Your Contentful space identifier |
| `NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN` | Public | Yes | Read-only API token for fetching content |
| `CONTENTFUL_MANAGEMENT_TOKEN` | Private | Yes | Write access token for updating content |
| `CONTENTFUL_ENVIRONMENT` | Private | No | Contentful environment (default: "master") |
| `ANTHROPIC_API_KEY` | Private | Yes | Your Anthropic API key for Claude |
| `ANTHROPIC_MODEL` | Private | No | Claude model version (default: sonnet 4.5) |
| `ADMIN_PASSWORD` | Private | Yes | Password for admin panel access |

**Public vs Private Variables:**
- **Public** (`NEXT_PUBLIC_*`): Safe to expose in browser, included in client-side code
- **Private**: Server-side only, never exposed to browser

---

## 5. Verification

### Test Contentful Connection

```bash
# Test from command line
node -e "
const contentful = require('contentful');
const client = contentful.createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN
});
client.getEntries().then(entries => {
  console.log('✅ Contentful connection successful');
  console.log('Total entries:', entries.total);
}).catch(err => {
  console.error('❌ Contentful connection failed:', err.message);
});
"
```

### Test Anthropic Connection

```bash
# Test Claude API
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "Content-Type: application/json" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4.5-20241022",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Say Hello"}]
  }'
```

Expected output:
```json
{
  "id": "msg_...",
  "content": [{"type": "text", "text": "Hello!"}],
  "model": "claude-sonnet-4.5-20241022",
  ...
}
```

### Test Admin Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open admin panel:
   ```bash
   open http://localhost:3000/admin
   ```

3. Enter your `ADMIN_PASSWORD`
4. You should see the admin dashboard

### Run All Tests

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# In another terminal, test all endpoints
npm run test:env
```

---

## Troubleshooting

### "Invalid Space ID"
- Double-check your Space ID in Contentful Settings
- Ensure no extra spaces or quotes in `.env.local`
- Try logging out and back into Contentful

### "Invalid Access Token"
- Regenerate your tokens in Contentful
- Make sure you're using the correct token type:
  - Delivery Token → `NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN`
  - Management Token → `CONTENTFUL_MANAGEMENT_TOKEN`

### "Anthropic API Error"
- Verify your API key starts with `sk-ant-`
- Check your API usage at console.anthropic.com
- Ensure you have available credits

### "Admin Password Not Working"
- Clear browser cookies
- Verify `ADMIN_PASSWORD` in `.env.local`
- Restart your development server
- Check for typos or extra spaces

### Environment Variables Not Loading

```bash
# Print all environment variables (careful with sensitive data!)
env | grep NEXT_PUBLIC

# Restart development server
npm run dev

# Check if .env.local exists
ls -la .env.local
```

---

## Security Best Practices

### 1. Never Commit `.env.local`

Ensure `.gitignore` includes:
```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 2. Use Different Tokens for Production

- Create separate Contentful tokens for development and production
- Use different admin passwords for each environment
- Rotate API keys regularly

### 3. Environment-Specific Configuration

```env
# Development
ADMIN_PASSWORD=dev_password_123

# Production (in Vercel)
ADMIN_PASSWORD=super_secure_prod_pass_456!
```

### 4. Vercel Deployment

When deploying to Vercel:

1. Go to Project Settings → Environment Variables
2. Add **production** values (different from dev!)
3. Mark sensitive variables as "Sensitive"
4. Use "Preview" and "Production" scopes appropriately

---

## Quick Reference

### Contentful
- Console: https://app.contentful.com
- Docs: https://www.contentful.com/developers/docs/
- API Reference: https://www.contentful.com/developers/docs/references/

### Anthropic
- Console: https://console.anthropic.com
- Docs: https://docs.anthropic.com
- API Reference: https://docs.anthropic.com/en/api/

### Next.js Environment Variables
- Docs: https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables

---

## Next Steps

Once your environment is configured:

1. ✅ Run `npm run dev` to start development server
2. ✅ Open `http://localhost:3000/admin` and log in
3. ✅ Try creating your first page with a prompt
4. ✅ Read the [Admin Tools Guide](./ADMIN_TOOLS.md)

---

**Questions or issues?** Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
