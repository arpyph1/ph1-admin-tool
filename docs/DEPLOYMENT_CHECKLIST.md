# Deployment Checklist
## Production Deployment Guide for PH1 Admin Tool

This checklist ensures a smooth, safe deployment to production.

---

## Pre-Deployment

### ✅ Development Complete

- [ ] All features tested locally
- [ ] No console errors
- [ ] All admin tools working
- [ ] Contentful integration verified
- [ ] Claude AI integration verified
- [ ] Authentication working

### ✅ Code Quality

- [ ] TypeScript errors resolved (`npm run type-check`)
- [ ] ESLint warnings addressed (`npm run lint`)
- [ ] Production build successful (`npm run build`)
- [ ] All tests passing (if tests exist)

### ✅ Environment Variables

- [ ] All variables documented in `.env.example`
- [ ] Production values ready (different from dev!)
- [ ] Secrets secured (not in code)
- [ ] API keys valid and active

### ✅ Security Review

- [ ] Admin password strong (12+ characters)
- [ ] API tokens rotated from dev
- [ ] No sensitive data in code
- [ ] `.env.local` in `.gitignore`
- [ ] Rate limiting implemented

---

## Vercel Deployment

### Step 1: Prepare Repository

```bash
# 1. Commit all changes
git add .
git commit -m "chore: prepare for production deployment"

# 2. Push to main branch
git push origin main

# 3. Tag the release
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0
```

**Checklist**:
- [ ] All changes committed
- [ ] Pushed to GitHub
- [ ] Release tagged

### Step 2: Create Vercel Project

1. **Go to** [vercel.com](https://vercel.com)
2. **Click** "New Project"
3. **Import** your GitHub repository:
   - Repository: `ph1-admin-tool`
4. **Configure Project**:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. **Click** "Deploy"

**Checklist**:
- [ ] Vercel project created
- [ ] GitHub repository connected
- [ ] Framework preset: Next.js

### Step 3: Configure Environment Variables

In Vercel Project Settings → Environment Variables, add:

#### Contentful Variables

```
# Contentful Space ID (Production!)
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=prod_space_id_here

# Contentful Delivery Token (Production!)
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=prod_delivery_token_here

# Contentful Management Token (Production!)
CONTENTFUL_MANAGEMENT_TOKEN=CFPAT_prod_management_token_here

# Contentful Environment
CONTENTFUL_ENVIRONMENT=master
```

#### Anthropic Variables

```
# Anthropic API Key (Production!)
ANTHROPIC_API_KEY=sk-ant-prod_key_here

# Claude Model
ANTHROPIC_MODEL=claude-sonnet-4.5-20241022
```

#### Authentication

```
# Admin Password (Production - STRONG!)
ADMIN_PASSWORD=production_secure_password_here
```

**Important**:
- ✅ Use **DIFFERENT** tokens than development
- ✅ Mark sensitive variables as "Sensitive"
- ✅ Apply to "Production" environment only
- ✅ Use strong production admin password

**Checklist**:
- [ ] All environment variables added
- [ ] Production tokens (not dev tokens!)
- [ ] Variables marked as sensitive
- [ ] Production environment scope selected

### Step 4: Configure Domain (Optional)

1. **Go to** Project Settings → Domains
2. **Add** custom domain: `admin.ph1.ca`
3. **Configure DNS**:
   ```
   Type: CNAME
   Name: admin
   Value: cname.vercel-dns.com
   ```
4. **Wait** for DNS propagation (1-24 hours)
5. **Verify** SSL certificate issued

**Checklist**:
- [ ] Custom domain added (if applicable)
- [ ] DNS configured
- [ ] SSL certificate issued

### Step 5: Deploy

1. **Trigger Deployment**:
   - Automatic on git push to main
   - Or manual: Click "Deploy" in Vercel

2. **Monitor Build**:
   - Watch build logs in real-time
   - ~2-3 minutes for completion

3. **Verify Deployment**:
   - Check deployment preview
   - Test all routes

**Checklist**:
- [ ] Deployment triggered
- [ ] Build completed successfully
- [ ] No build errors
- [ ] Deployment URL accessible

---

## Post-Deployment Verification

### ✅ Basic Functionality

```bash
# Test homepage
curl https://your-domain.vercel.app/

# Test admin login (should redirect)
curl https://your-domain.vercel.app/admin

# Test API health
curl https://your-domain.vercel.app/api/health
```

**Checklist**:
- [ ] Homepage loads
- [ ] Admin panel accessible
- [ ] API responding

### ✅ Admin Panel

1. **Navigate** to `/admin`
2. **Log in** with production password
3. **Verify**:
   - [ ] Dashboard loads
   - [ ] All 6 tools visible
   - [ ] No console errors

### ✅ Contentful Integration

**Test Connection**:
```bash
curl https://your-domain.vercel.app/api/contentful/scan \
  -X POST \
  -H "Content-Type: application/json"
```

**In Admin Panel**:
1. **Go to** "Revise Page"
2. **Select** a page
3. **Verify** page loads correctly

**Checklist**:
- [ ] Can fetch pages from Contentful
- [ ] Can list all pages
- [ ] No connection errors

### ✅ Claude AI Integration

**Test Generation**:
1. **Go to** "Generate Page"
2. **Enter** prompt: "Create test page about design services"
3. **Click** "Generate"
4. **Verify** content generated

**Checklist**:
- [ ] AI generating content
- [ ] No API key errors
- [ ] Reasonable response time (<15 seconds)

### ✅ All Admin Tools

Test each tool:

| Tool | Test | Status |
|------|------|--------|
| Revise Page | Modify test page | [ ] |
| Draft Page | Create new page | [ ] |
| Curate Page | Upload test document | [ ] |
| Smart Compose | Update component | [ ] |
| Find & Replace | Search and replace | [ ] |
| Generate Page | Generate from prompt | [ ] |

### ✅ Performance

**Run Lighthouse Audit**:
1. **Open** Chrome DevTools
2. **Go to** Lighthouse tab
3. **Run** audit on `/admin`

**Target Scores**:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90

**Checklist**:
- [ ] Performance score acceptable
- [ ] No critical issues
- [ ] Load time < 3 seconds

### ✅ Security

**Check Headers**:
```bash
curl -I https://your-domain.vercel.app/admin
```

**Verify**:
- [ ] HTTPS enabled (SSL)
- [ ] Security headers present
- [ ] Authentication required for /admin
- [ ] No sensitive data in responses

---

## Monitoring Setup

### ✅ Vercel Analytics

1. **Enable** in Project Settings
2. **Verify** data collection
3. **Set up** alerts

**Checklist**:
- [ ] Analytics enabled
- [ ] Dashboard accessible
- [ ] Alerts configured

### ✅ Error Tracking

**In Vercel Dashboard**:
1. **Go to** Functions tab
2. **Enable** real-time logs
3. **Set up** error alerts

**Checklist**:
- [ ] Function logs visible
- [ ] Error tracking active
- [ ] Alerts configured

### ✅ Uptime Monitoring

**Set up external monitor**:
- UptimeRobot, Pingdom, or similar
- Check `/admin` endpoint
- Alert on downtime

**Checklist**:
- [ ] Uptime monitor configured
- [ ] Alert email set
- [ ] Test alert working

---

## Backup & Recovery

### ✅ Contentful Backup

**Manual Backup**:
```bash
# Export all content
contentful space export \
  --space-id=SPACE_ID \
  --management-token=TOKEN \
  --export-dir=./backups/$(date +%Y%m%d)
```

**Set up** scheduled backups (weekly):
- GitHub Actions workflow
- Cron job
- Contentful webhooks

**Checklist**:
- [ ] Initial backup completed
- [ ] Backup schedule configured
- [ ] Backup restoration tested

### ✅ Code Backup

**Already handled by Git**:
- Code in GitHub
- Tags for releases
- Easy rollback

**Checklist**:
- [ ] Code in version control
- [ ] Release tagged
- [ ] Rollback tested

---

## Documentation & Handoff

### ✅ Update Documentation

- [ ] Update README with production URL
- [ ] Document any deployment-specific settings
- [ ] Create runbook for common operations
- [ ] Document monitoring dashboards

### ✅ Team Training

- [ ] Train content managers on admin tools
- [ ] Share admin password securely
- [ ] Walk through emergency procedures
- [ ] Document on-call rotation

### ✅ Create Runbook

Document:
1. **Emergency Contacts**
2. **Rollback Procedure**
3. **Common Issues & Solutions**
4. **Escalation Path**

---

## Go-Live Checklist

### Final Verification (10 minutes before)

- [ ] All systems green
- [ ] Team notified
- [ ] Backup completed
- [ ] Rollback plan ready

### Launch

1. **Switch DNS** (if using custom domain)
2. **Monitor** for 15 minutes
3. **Test** all critical paths
4. **Verify** analytics flowing

### Post-Launch (First Hour)

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify all integrations
- [ ] Test admin functions
- [ ] Confirm with team

### Post-Launch (First Day)

- [ ] Review error logs
- [ ] Check usage patterns
- [ ] Gather user feedback
- [ ] Address any issues

---

## Rollback Procedure

If something goes wrong:

### Step 1: Immediate Rollback

**In Vercel**:
1. **Go to** Deployments
2. **Find** previous stable deployment
3. **Click** "Promote to Production"
4. **Monitor** for recovery

**Time**: < 2 minutes

### Step 2: Investigate

1. **Check** error logs in Vercel
2. **Review** recent changes
3. **Test** locally to reproduce
4. **Fix** issue

### Step 3: Redeploy

1. **Fix** deployed
2. **Test** thoroughly locally
3. **Deploy** to preview first
4. **Verify** in preview
5. **Promote** to production

---

## Production Maintenance

### Daily

- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Review usage patterns

### Weekly

- [ ] Backup Contentful data
- [ ] Review performance metrics
- [ ] Check for security updates

### Monthly

- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance optimization
- [ ] Review and optimize

---

## Environment Comparison

| Aspect | Development | Production |
|--------|------------|------------|
| Domain | localhost:3000 | admin.ph1.ca |
| Contentful | Dev space | Prod space |
| Claude API | Dev key | Prod key |
| Admin Pass | Simple | Strong (12+ chars) |
| Analytics | Disabled | Enabled |
| Error Logs | Console | Vercel Dashboard |
| Caching | Minimal | Aggressive |
| Rate Limits | Loose | Strict |

---

## Success Metrics

Track these metrics:

### Performance

- [ ] Page load < 2 seconds
- [ ] API response < 1 second
- [ ] Uptime > 99.9%

### Usage

- [ ] Admin logins per day
- [ ] Pages modified per week
- [ ] AI requests per day

### Quality

- [ ] Error rate < 0.1%
- [ ] Successful modifications > 99%
- [ ] User satisfaction > 95%

---

## Troubleshooting Production

### High Error Rate

1. Check Vercel function logs
2. Verify environment variables
3. Check external API status (Contentful, Anthropic)
4. Review recent deployments

### Slow Performance

1. Check Vercel analytics
2. Review function execution times
3. Check Contentful response times
4. Optimize slow queries

### Authentication Issues

1. Verify ADMIN_PASSWORD set correctly
2. Check session cookie settings
3. Clear browser cache
4. Test in incognito mode

---

## Post-Deployment Checklist

### ✅ Immediately After Deployment

- [ ] Homepage loads
- [ ] Admin panel accessible
- [ ] Can log in
- [ ] All tools working
- [ ] No console errors
- [ ] Monitoring active

### ✅ Within 24 Hours

- [ ] User feedback collected
- [ ] Performance reviewed
- [ ] Error rates normal
- [ ] Team trained
- [ ] Documentation updated

### ✅ Within 1 Week

- [ ] All features used successfully
- [ ] No critical issues
- [ ] Backups verified
- [ ] Monitoring optimized
- [ ] Success metrics tracked

---

## Support Contacts

### Vercel Support
- Dashboard: https://vercel.com/support
- Status: https://www.vercel-status.com

### Contentful Support
- Dashboard: https://www.contentful.com/support
- Status: https://www.contentfulstatus.com

### Anthropic Support
- Console: https://console.anthropic.com
- Status: https://status.anthropic.com

---

## Deployment Complete! 🎉

**Congratulations on your successful deployment!**

**Next Steps**:
1. Monitor for 24 hours
2. Gather user feedback
3. Plan next iteration
4. Celebrate! 🍾

---

**Deployment Date**: _________________  
**Deployed By**: _________________  
**Deployment Version**: v1.0.0  
**Production URL**: _________________

---

*Last Updated: October 30, 2025*
