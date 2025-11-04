# Troubleshooting Guide
## Complete Solutions for Common Issues

This guide provides solutions to common problems you may encounter with the PH1 Admin Tool.

---

## Table of Contents

1. [Contentful Issues](#contentful-issues)
2. [Anthropic Claude Issues](#anthropic-claude-issues)
3. [Authentication Issues](#authentication-issues)
4. [Page Modification Issues](#page-modification-issues)
5. [Performance Issues](#performance-issues)
6. [Deployment Issues](#deployment-issues)

---

## Contentful Issues

### "Invalid Space ID" Error

**Symptoms:**
```
Error: Request failed with status 404: Not Found
The resource could not be found
```

**Cause**: Incorrect Space ID in environment variables

**Solutions:**

1. **Verify Space ID:**
   ```bash
   # Check current value
   echo $NEXT_PUBLIC_CONTENTFUL_SPACE_ID
   ```

2. **Get Correct Space ID:**
   - Log into [Contentful](https://app.contentful.com)
   - Go to Settings → General settings
   - Copy Space ID exactly (no extra spaces)

3. **Update Environment Variable:**
   ```bash
   # In .env.local
   NEXT_PUBLIC_CONTENTFUL_SPACE_ID=abc123xyz456
   ```

4. **Restart Server:**
   ```bash
   npm run dev
   ```

---

### "Invalid Access Token" Error

**Symptoms:**
```
Error: 401 Unauthorized
The access token you sent could not be found
```

**Cause**: Wrong or expired Contentful token

**Solutions:**

1. **Verify Token Type:**
   - **Delivery Token** → For reading content (public)
   - **Management Token** → For updating content (private)

2. **Regenerate Tokens:**
   - Go to Settings → API keys (for Delivery)
   - Go to Settings → CMA tokens (for Management)
   - Generate new token
   - Update `.env.local`

3. **Check Token Format:**
   ```bash
   # Delivery token format
   NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=abc123xyz...

   # Management token format
   CONTENTFUL_MANAGEMENT_TOKEN=CFPAT-abc123xyz...
   ```

---

### "Content Not Updating" Issue

**Symptoms:**
- Changes saved but not visible on site
- Old content still showing

**Solutions:**

1. **Check if Published:**
   ```typescript
   // In Contentful web app
   - Find your entry
   - Look for "Published" badge
   - If shows "Changed", click "Publish"
   ```

2. **Clear Contentful Cache:**
   ```bash
   # Force cache refresh
   curl -X POST http://localhost:3000/api/contentful/clear-cache
   ```

3. **Wait for CDN:**
   - Contentful CDN takes 30-60 seconds to update
   - Check again after 1 minute

4. **Verify Environment:**
   ```bash
   # Make sure you're in correct environment
   CONTENTFUL_ENVIRONMENT=master  # or your environment name
   ```

---

### "Rate Limit Exceeded" Error

**Symptoms:**
```
Error: 429 Too Many Requests
Rate limit exceeded
```

**Cause**: Too many API requests in short time

**Solutions:**

1. **Contentful Rate Limits:**
   - Delivery API: 78 requests/second
   - Management API: 10 requests/second

2. **Wait and Retry:**
   ```bash
   # Wait 1 minute, then try again
   sleep 60
   ```

3. **Implement Caching:**
   - Enable request caching
   - Batch multiple changes
   - Use preview mode to test first

---

## Anthropic Claude Issues

### "Invalid API Key" Error

**Symptoms:**
```
Error: 401 authentication_error
Invalid API key
```

**Solutions:**

1. **Verify API Key Format:**
   ```bash
   # Should start with sk-ant-
   echo $ANTHROPIC_API_KEY | grep "sk-ant-"
   ```

2. **Regenerate Key:**
   - Go to [Anthropic Console](https://console.anthropic.com)
   - Navigate to API Keys
   - Create new key
   - Update `.env.local`

3. **Test API Key:**
   ```bash
   curl https://api.anthropic.com/v1/messages \
     -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "Content-Type: application/json" \
     -H "anthropic-version: 2023-06-01" \
     -d '{"model":"claude-sonnet-4.5-20241022","max_tokens":100,"messages":[{"role":"user","content":"test"}]}'
   ```

---

### "Insufficient Credits" Error

**Symptoms:**
```
Error: 429 insufficient_quota
Your account has insufficient credits
```

**Solutions:**

1. **Check Balance:**
   - Go to [Anthropic Console](https://console.anthropic.com)
   - Check Credits/Usage section

2. **Add Credits:**
   - Add credits to your account
   - Or upgrade plan

3. **Optimize Usage:**
   - Use preview mode more (doesn't call API)
   - Batch modifications
   - Use shorter prompts

---

### "Prompt Too Long" Error

**Symptoms:**
```
Error: 400 invalid_request_error
Prompt exceeds maximum length
```

**Solutions:**

1. **Shorten Prompt:**
   - Be more concise
   - Remove unnecessary context
   - Focus on key instructions

2. **Break Into Parts:**
   - Modify one section at a time
   - Use multiple smaller requests

3. **Use References:**
   ```
   Instead of: "Make it like this long example..."
   Use: "Make it similar to homepage hero style"
   ```

---

### "AI Response Not Matching Expectations"

**Symptoms:**
- Generated content is off-target
- Wrong tone or style
- Missing key information

**Solutions:**

1. **Improve Prompt Specificity:**
   ```
   Bad:  "Make it better"
   Good: "Make hero section more enterprise-focused with 
          Fortune 500 language, emphasizing security and scale"
   ```

2. **Add Context:**
   ```
   "Target audience: C-suite executives in healthcare
    Industry: Hospitals and health systems
    Focus: HIPAA compliance and patient trust"
   ```

3. **Use Examples:**
   ```
   "Similar to the tone on our UX Research page,
    but more technical"
   ```

4. **Iterate:**
   - Generate initial version
   - Refine with follow-up prompts
   - Build incrementally

---

## Authentication Issues

### "Admin Password Not Working"

**Symptoms:**
- Correct password rejected
- Infinite login loop
- "Access denied" message

**Solutions:**

1. **Verify Password:**
   ```bash
   # Check environment variable
   echo $ADMIN_PASSWORD
   ```

2. **Clear Browser Data:**
   - Clear cookies for localhost
   - Clear browser cache
   - Try incognito/private mode

3. **Restart Server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Check for Special Characters:**
   ```bash
   # If password has special characters, ensure proper escaping
   ADMIN_PASSWORD='myPass@123!'  # Use quotes
   ```

---

### "Session Expired" Error

**Symptoms:**
- Logged out unexpectedly
- Have to log in repeatedly

**Solutions:**

1. **Increase Session Duration:**
   ```typescript
   // In lib/auth.ts
   maxAge: 24 * 60 * 60  // 24 hours
   ```

2. **Check Cookie Settings:**
   - Ensure cookies enabled in browser
   - Check for cookie-blocking extensions

---

## Page Modification Issues

### "Page Not Found" Error

**Symptoms:**
```
Error: Page with slug 'homepage' not found
```

**Solutions:**

1. **Verify Page Exists:**
   ```bash
   # List all pages
   curl http://localhost:3000/api/admin/revise/routes
   ```

2. **Check Slug Format:**
   ```
   Correct: "homepage"
   Correct: "services/ux-research"
   Wrong:   "Homepage" (capital H)
   Wrong:   "/homepage" (leading slash)
   ```

3. **Refresh Page List:**
   - Go to admin dashboard
   - Click "Refresh Pages"

---

### "Changes Not Applying"

**Symptoms:**
- Preview looks good
- But changes don't save
- No error message

**Solutions:**

1. **Check Console:**
   ```bash
   # Open browser console (F12)
   # Look for error messages
   ```

2. **Verify Permissions:**
   - Check Management API token has write access
   - Verify Contentful space permissions

3. **Test API Directly:**
   ```bash
   curl -X POST http://localhost:3000/api/admin/revise/page \
     -H "Content-Type: application/json" \
     -d '{"pageSlug":"test","prompt":"test"}'
   ```

---

### "Preview Not Loading"

**Symptoms:**
- Spinning loader forever
- Preview never appears

**Solutions:**

1. **Check Network Tab:**
   - Open browser DevTools
   - Go to Network tab
   - Look for failed requests

2. **Verify Contentful Preview:**
   - Check Contentful preview API enabled
   - Verify preview token in environment

3. **Clear Cache:**
   ```bash
   # Clear all caches
   rm -rf .next/cache
   npm run dev
   ```

---

## Performance Issues

### "Slow Page Loading"

**Symptoms:**
- Admin panel takes >5 seconds to load
- Requests timing out

**Solutions:**

1. **Check Contentful Response Time:**
   ```bash
   time curl https://cdn.contentful.com/spaces/$SPACE_ID/entries
   ```

2. **Optimize Entry Queries:**
   ```typescript
   // Limit fields returned
   select: 'sys.id,fields.title,fields.urlSlug'
   
   // Limit number of entries
   limit: 20
   ```

3. **Enable Caching:**
   ```typescript
   // Cache Contentful responses
   const cache = new Map();
   ```

4. **Reduce Bundle Size:**
   ```bash
   npm run analyze
   # Identify large dependencies
   ```

---

### "AI Requests Taking Too Long"

**Symptoms:**
- Waiting 30+ seconds for responses
- Timeout errors

**Solutions:**

1. **Optimize Prompts:**
   - Make prompts more concise
   - Remove unnecessary context

2. **Use Streaming:**
   ```typescript
   // Enable streaming responses
   stream: true
   ```

3. **Check Anthropic Status:**
   - Visit https://status.anthropic.com
   - Check for service issues

---

## Deployment Issues

### "Build Failing on Vercel"

**Symptoms:**
```
Error: Build failed
Type error: ...
```

**Solutions:**

1. **Test Build Locally:**
   ```bash
   npm run build
   # Fix any errors shown
   ```

2. **Check Environment Variables:**
   - Ensure all variables set in Vercel
   - Match exact names from `.env.local`

3. **Check TypeScript Errors:**
   ```bash
   npm run type-check
   ```

4. **Verify Dependencies:**
   ```bash
   npm install
   npm run build
   ```

---

### "Environment Variables Not Working in Production"

**Symptoms:**
- Works locally
- Fails in production
- "Undefined" variable errors

**Solutions:**

1. **Verify Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Ensure all variables present
   - Check "Production" scope selected

2. **Check Variable Names:**
   ```
   Correct: NEXT_PUBLIC_CONTENTFUL_SPACE_ID
   Wrong:   CONTENTFUL_SPACE_ID (missing NEXT_PUBLIC)
   ```

3. **Redeploy:**
   ```bash
   # After adding variables
   git commit --allow-empty -m "Trigger redeploy"
   git push
   ```

---

### "500 Internal Server Error in Production"

**Symptoms:**
- 500 errors in production only
- Works fine locally

**Solutions:**

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard
   - Click "Functions" tab
   - Review error logs

2. **Verify API Routes:**
   ```bash
   # Test production endpoint
   curl https://your-domain.com/api/admin/revise/routes
   ```

3. **Check for Environment-Specific Code:**
   ```typescript
   // Avoid
   if (process.env.NODE_ENV === 'development')
   
   // Use feature flags instead
   ```

---

## Getting More Help

If you've tried these solutions and still have issues:

1. **Check Logs:**
   ```bash
   # Local development
   npm run dev  # See console output
   
   # Production (Vercel)
   vercel logs --follow
   ```

2. **Enable Debug Mode:**
   ```bash
   # In .env.local
   DEBUG=true
   ```

3. **Test Components Individually:**
   - Test Contentful connection alone
   - Test Claude API alone
   - Test auth alone

4. **Review Documentation:**
   - [API Documentation](./API.md)
   - [Environment Setup](./ENVIRONMENT_SETUP.md)
   - [Architecture Guide](./ARCHITECTURE.md)

---

## Common Error Codes

| Code | Issue | Solution |
|------|-------|----------|
| 400 | Bad request | Check request format |
| 401 | Unauthorized | Verify API keys |
| 403 | Forbidden | Check permissions |
| 404 | Not found | Verify resource exists |
| 429 | Rate limited | Wait and retry |
| 500 | Server error | Check logs |
| 502 | Bad gateway | External API issue |
| 504 | Timeout | Request took too long |

---

**Last Updated**: October 30, 2025
