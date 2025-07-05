# Development Workflow Guide

## 🌳 Branch Strategy

```
main (production)
├── develop (staging/preview)
│   ├── feature/premium-design
│   ├── feature/ai-enhancements
│   └── feature/new-dashboard
└── hotfix/critical-bug (emergency fixes)
```

## 🚀 Workflow Overview

### 1. **Feature Development**
```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Work on your feature
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name

# Create PR to develop branch
# Use template: feature_to_develop.md
```

### 2. **Testing on Preview**
- Push to any branch creates preview deployment
- URL format: `https://shelly-monitor-git-[branch-name]-[team].vercel.app`
- Test thoroughly on preview before merging

### 3. **Staging (Develop Branch)**
```bash
# After PR approval, merge to develop
git checkout develop
git merge feature/your-feature-name
git push origin develop

# Staging URL: https://shelly-monitor-git-develop-[team].vercel.app
```

### 4. **Production Deployment**
```bash
# When ready for production
git checkout main
git pull origin main
git merge develop
git push origin main

# Or create PR from develop to main
# Use template: pull_request_template.md
```

## 📋 Environment Management

### Vercel Dashboard Setup
1. **Production Branch:** `main`
2. **Preview Deployments:** All other branches
3. **Environment Variables:**
   - Production: Full production values
   - Preview: Development/staging values
   - Development: Local development values

### Environment Variables by Stage
```env
# Production (main branch)
NEXT_PUBLIC_SUPABASE_URL=https://prod.supabase.co
NEXT_PUBLIC_ENVIRONMENT=production

# Staging (develop branch)
NEXT_PUBLIC_SUPABASE_URL=https://staging.supabase.co
NEXT_PUBLIC_ENVIRONMENT=staging

# Feature branches
NEXT_PUBLIC_SUPABASE_URL=https://dev.supabase.co
NEXT_PUBLIC_ENVIRONMENT=development
```

## 🔄 Common Workflows

### Creating a New Feature
1. `git checkout develop`
2. `git checkout -b feature/new-feature`
3. Make changes
4. Push and create PR to develop
5. Test on preview URL
6. Merge to develop after approval
7. Test on staging
8. Create PR from develop to main
9. Deploy to production

### Emergency Hotfix
1. `git checkout main`
2. `git checkout -b hotfix/critical-fix`
3. Make minimal fix
4. Push and create PR to main
5. Use hotfix PR template
6. Fast-track approval
7. Merge directly to main
8. Cherry-pick to develop

### Rollback Procedure
1. Go to Vercel Dashboard
2. Find last working deployment
3. Click "..." → "Promote to Production"
4. Investigate issue on develop branch

## 🏷️ Commit Convention

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test updates
- `chore:` Maintenance tasks

## 📝 PR Guidelines

### PR Size
- Keep PRs small and focused
- One feature per PR
- Easier to review and test

### PR Description
- Use provided templates
- Include screenshots for UI changes
- List testing steps
- Link related issues

### Review Process
1. Create PR with template
2. Automated preview deployment
3. Code review
4. Testing on preview
5. Approval and merge

## 🎯 Best Practices

1. **Always test on preview first**
2. **Never push directly to main**
3. **Keep develop stable**
4. **Use feature flags for gradual rollout**
5. **Monitor deployments in Vercel dashboard**
6. **Check Vercel Functions logs after deployment**

## 🔍 Monitoring Deployments

### Vercel Dashboard
- Build logs
- Function logs
- Analytics
- Error tracking

### Health Checks
- `/api/health` - API health
- `/api/metrics` - Prometheus metrics
- Browser console - Frontend errors

## 💡 Tips

1. **Preview URLs are shareable** - Send to team for review
2. **Environment variables** - Different per branch
3. **Automatic deployments** - Every push triggers deployment
4. **Rollback is instant** - Just promote old deployment
5. **Comments on PR** - Vercel bot adds preview URLs

---

For questions or issues, check the Vercel documentation or ask the team!