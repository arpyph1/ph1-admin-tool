# Quick Start Guide
## Get PH1 Admin Tool Running in 15 Minutes

This guide gets you from zero to making your first content modification in under 15 minutes.

---

## Prerequisites Checklist

Before starting, have these ready:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Contentful account created
- [ ] Anthropic API key obtained
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

---

## Step 1: Clone & Install (3 minutes)

```bash
# Clone the repository
git clone https://github.com/arpyph1/ph1-admin-tool.git
cd ph1-admin-tool

# Install dependencies
npm install

# This will take 2-3 minutes
```

**Expected output:**
```
✓ Dependencies installed successfully
✓ 1,234 packages installed
```

---

## Step 2: Environment Setup (5 minutes)

### Get Your Contentful Credentials

1. **Go to**: [app.contentful.com](https://app.contentful.com)

2. **Get Space ID**:
   - Settings → General settings
   - Copy Space ID: `abc123xyz`

3. **Get Delivery Token**:
   - Settings → API keys → Add API key
   - Copy token: `abc123...`

4. **Get Management Token**:
   - Settings → CMA tokens → Generate personal token
   - Copy token (shown once!): `CFPAT-...`

### Get Your Anthropic API Key

1. **Go to**: [console.anthropic.com](https://console.anthropic.com)
2. **Navigate**: API Keys
3. **Create key**: "PH1 Admin"
4. **Copy key**: `sk-ant-...`

### Create Environment File

```bash
# Create .env.local file
cat > .env.local << 'EOF'
# Contentful
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id_here
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=your_delivery_token_here
CONTENTFUL_MANAGEMENT_TOKEN=your_management_token_here
CONTENTFUL_ENVIRONMENT=master

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-your_key_here
ANTHROPIC_MODEL=claude-sonnet-4.5-20241022

# Admin Authentication
ADMIN_PASSWORD=your_secure_password_here
EOF
```

**Replace** `your_*_here` with actual values from above.

---

## Step 3: Set Up Content Models in Contentful (4 minutes)

### Create Page Content Type

1. **In Contentful**: Content model → Add content type
2. **Name**: "Page"
3. **API ID**: `page`
4. **Add Fields**:

| Field Name | Field ID | Type | Required |
|-----------|----------|------|----------|
| URL Slug | urlSlug | Text | Yes |
| Page Title | pageTitle | Text | Yes |
| Page Sections | pageSections | References (many) | No |
| SEO Title | seoTitle | Text | No |
| SEO Description | seoDescription | Text | No |

### Create Section Content Type

1. **Add content type**
2. **Name**: "Section"
3. **API ID**: `section`
4. **Add Fields**:

| Field Name | Field ID | Type | Required |
|-----------|----------|------|----------|
| Section Type | sectionType | Text | Yes |
| Content | content | JSON | No |
| HTML Content | htmlContent | Rich Text | No |

---

## Step 4: Start Development Server (1 minute)

```bash
# Start the server
npm run dev
```

**Expected output:**
```
- ready started server on 0.0.0.0:3000
- Local: http://localhost:3000
```

**Open browser**: http://localhost:3000/admin

---

## Step 5: First Login (1 minute)

1. **Navigate**: http://localhost:3000/admin
2. **Enter Password**: The password you set in `.env.local`
3. **Click**: "Log In"

**You should see the Admin Dashboard** with 6 tools.

---

## Step 6: Make Your First Modification (1 minute)

Let's test the system with a simple page creation:

### Create a Test Page

1. **Click**: "Generate Page"
2. **Prompt**:
   ```
   Create a simple test page about product design
   ```
3. **Click**: "Generate"
4. **Wait**: ~10 seconds
5. **Review**: Generated page preview
6. **Click**: "Publish"

**Success!** Your first AI-generated page is live.

---

## Verification Checklist

After setup, verify everything works:

### Test Contentful Connection

```bash
curl "https://cdn.contentful.com/spaces/$NEXT_PUBLIC_CONTENTFUL_SPACE_ID/environments/master/entries?access_token=$NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN"
```

**Expected**: JSON response with entries

### Test Anthropic Connection

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "Content-Type: application/json" \
  -H "anthropic-version: 2023-06-01" \
  -d '{"model":"claude-sonnet-4.5-20241022","max_tokens":50,"messages":[{"role":"user","content":"Hi"}]}'
```

**Expected**: JSON response with message

### Test Admin Access

- [ ] Can log into `/admin`
- [ ] See all 6 tools
- [ ] No console errors

---

## Quick Test Workflow

Try this workflow to test all features:

### 1. Generate a Page (2 minutes)

```
Tool: Generate Page
Prompt: "Create a service page for UX Research targeting startups"
```

### 2. Modify the Page (1 minute)

```
Tool: Revise Page
Page: The page you just created
Prompt: "Make it more enterprise-focused"
```

### 3. Global Change (30 seconds)

```
Tool: Find & Replace
Find: "startup"
Replace: "enterprise"
Scope: All pages
```

**If all three work, you're fully set up! 🎉**

---

## Troubleshooting Quick Fixes

### "Cannot connect to Contentful"

```bash
# Verify Space ID
echo $NEXT_PUBLIC_CONTENTFUL_SPACE_ID

# Should not be empty
# Should match Contentful Space ID exactly
```

### "Invalid Anthropic API key"

```bash
# Verify API key format
echo $ANTHROPIC_API_KEY | grep "sk-ant-"

# Should start with sk-ant-
```

### "Admin password not working"

```bash
# Check environment variable
echo $ADMIN_PASSWORD

# Clear browser cookies
# Restart development server
npm run dev
```

### "Port 3000 already in use"

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

---

## Next Steps

Now that you're set up:

1. **Read**: [Admin Tools Guide](./ADMIN_TOOLS.md) - Learn all 6 tools
2. **Explore**: Try each tool with test content
3. **Import**: Bring in your existing site content
4. **Customize**: Adjust prompts for your brand voice

---

## Common First Tasks

### Import Existing Content

1. **Export** current site content
2. **Use** "Curate Page" tool
3. **Upload** PDFs/docs
4. **Generate** web pages

### Create Service Pages

1. **Use** "Draft Page" tool
2. **Select** "Service Page" template
3. **Provide** service details
4. **Publish** immediately

### Update Homepage

1. **Use** "Revise Page" tool
2. **Select** homepage
3. **Prompt** with desired changes
4. **Preview** before applying

---

## Development Tips

### Hot Reload

Changes to code automatically reload:
```bash
# Just edit files
# Browser will refresh automatically
```

### View Logs

```bash
# See all console output
npm run dev

# In browser: F12 for DevTools
```

### Test Changes

```bash
# Always use preview mode first
# Then apply when satisfied
```

---

## Production Deployment (Bonus)

When ready to deploy:

### Deploy to Vercel (5 minutes)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial setup"
   git push origin main
   ```

2. **Connect Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import `ph1-admin-tool`

3. **Add Environment Variables**:
   - Copy all from `.env.local`
   - Paste into Vercel settings

4. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site is live!

---

## Getting Help

### Documentation

- [Full Documentation](../README.md)
- [Environment Setup](./ENVIRONMENT_SETUP.md)
- [API Reference](./API.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

### Support Resources

- GitHub Issues: Report bugs
- Email: [your-email@ph1.ca]

---

## Success Checklist

You're ready to use PH1 Admin Tool when:

- [✓] Development server running
- [✓] Admin panel accessible at `/admin`
- [✓] Can log in successfully
- [✓] Can generate a test page
- [✓] Can modify existing pages
- [✓] All 6 tools visible and working

---

**Congratulations! You're ready to transform your content workflow! 🚀**

**Time to first modification**: ~15 minutes
**Time to proficiency**: ~1 hour
**Time saved per week**: 10-20 hours

---

*Last Updated: October 30, 2025*
