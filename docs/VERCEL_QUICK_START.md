# Vercel Development Quick Start Guide

A quick reference for developers working with Blipee OS on Vercel.

## 🚀 Quick Setup

### 1. Initial Setup
```bash
# Clone the repository
git clone <repo-url>
cd shelly-monitor

# Install dependencies
npm install

# Install Vercel CLI
npm i -g vercel

# Link to Vercel project
vercel link

# Pull environment variables
vercel env pull .env.local
```

### 2. Development Workflow
```bash
# Start local development
npm run dev

# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to create preview deployment
git push origin feature/my-feature
```

### 3. Environment Variables

#### Add new variable
```bash
# For all environments
vercel env add MY_VAR

# For specific environments
vercel env add MY_VAR production
vercel env add MY_VAR preview development

# Use the configuration script
npm run configure:env -- --env=preview
```

#### Pull latest variables
```bash
npm run vercel:pull
```

## 📋 Common Commands

### Development
```bash
npm run dev              # Start local server
npm run build           # Build for production
npm run lint            # Run linter
npm run test            # Run all tests
npm run type-check      # Check TypeScript
```

### Database
```bash
npm run db:setup        # Initial database setup
npm run db:seed         # Seed with test data
npm run db:reset        # Reset and reseed
npm run check:schema    # Verify schema
```

### Vercel
```bash
vercel                  # Deploy to preview
vercel --prod          # Deploy to production
vercel env pull        # Pull env variables
vercel logs            # View logs
vercel ls              # List deployments
```

## 🔧 Environment Configuration

### Local Development (.env.local)
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_ENABLE_DEBUG=true
NEXT_PUBLIC_ENABLE_DEV_TOOLS=true
```

### Preview Deployments
- Automatically created for every branch
- Uses staging database
- Shows preview banner
- Debug mode enabled

### Production
- Protected with deployment approval
- Uses production database
- Analytics enabled
- Debug mode disabled

## 🌿 Branch Strategy

```
main         → Production (app.blipee.com)
develop      → Staging (staging.blipee.com)
feature/*    → Preview deployments
hotfix/*     → Preview deployments
release/*    → Preview deployments
```

## 🔍 Preview Deployments

### Automatic Features
- ✅ Unique URL for every commit
- ✅ Environment isolation
- ✅ GitHub PR comments
- ✅ Automatic cleanup
- ✅ Password protection available

### Preview URLs Format
```
https://blipee-os-<branch>-<team>.vercel.app
https://blipee-os-<hash>-<team>.vercel.app
```

## 🛡️ Security Best Practices

1. **Never commit .env files**
2. **Use different API keys for each environment**
3. **Rotate secrets regularly**
4. **Enable deployment protection for production**
5. **Use branch protection rules**

## 🐛 Troubleshooting

### Build Failures
```bash
# Check build logs
vercel logs <deployment-url>

# Test build locally
npm run build
```

### Environment Variables Issues
```bash
# List all variables
vercel env ls

# Pull and check
vercel env pull .env.local
cat .env.local
```

### Preview Not Updating
```bash
# Force redeploy
vercel --force

# Check git integration
vercel git
```

## 📚 Resources

- [Full Development Guide](./guides/VERCEL_DEVELOPMENT_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)

## 💡 Tips

1. **Use `vercel dev`** for testing Vercel-specific features locally
2. **Check preview deployments** before merging to main
3. **Monitor build times** in Vercel dashboard
4. **Use Vercel Analytics** for performance insights
5. **Enable Speed Insights** for Core Web Vitals

## 🆘 Need Help?

- Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Review [Vercel Status](https://www.vercel-status.com/)
- Ask in team Slack channel
- Create GitHub issue for bugs