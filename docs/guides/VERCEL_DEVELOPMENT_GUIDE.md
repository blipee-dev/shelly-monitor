# Vercel Development Environment Guide

This guide covers setting up a professional development workflow on Vercel with preview deployments, environment management, and branch-based deployments for the Blipee OS application.

## Table of Contents

- [Overview](#overview)
- [Preview Deployments](#preview-deployments)
- [Environment Variables Management](#environment-variables-management)
- [Branch-Based Deployments](#branch-based-deployments)
- [Protecting Production](#protecting-production)
- [Development-Specific Configurations](#development-specific-configurations)
- [Team Collaboration](#team-collaboration)
- [Troubleshooting](#troubleshooting)

## Overview

Vercel provides a powerful development workflow that includes:
- Automatic preview deployments for every push
- Environment-specific variables
- Branch-based deployment strategies
- Production protection mechanisms
- Team collaboration features

## Preview Deployments

Preview deployments are automatically created for every push to any branch, providing isolated environments for testing changes before merging to production.

### How Preview Deployments Work

1. **Automatic Creation**: Every commit to a non-production branch creates a unique preview URL
2. **Isolated Environment**: Each preview has its own environment and doesn't affect production
3. **Shareable URLs**: Preview URLs can be shared with team members and stakeholders
4. **Comments Integration**: Preview links are automatically posted to pull requests

### Setting Up Preview Deployments

Preview deployments are enabled by default, but you can customize their behavior:

1. **In Vercel Dashboard**:
   - Go to Project Settings → Git
   - Configure "Preview Deployments" settings
   - Choose which branches trigger previews

2. **Using vercel.json** (see updated configuration below)

### Preview Deployment Features

#### 1. Environment-Specific URLs
Each preview gets a unique URL format:
- `https://<project>-<branch>-<team>.vercel.app`
- `https://<project>-<commit-hash>-<team>.vercel.app`

#### 2. Preview Protection
Password-protect preview deployments:
```json
{
  "passwordProtection": {
    "deploymentType": "preview"
  }
}
```

#### 3. Preview Comments
Customize GitHub/GitLab comments:
```json
{
  "github": {
    "silent": false,
    "autoAlias": true
  }
}
```

## Environment Variables Management

Properly managing environment variables across development, preview, and production environments is crucial for security and functionality.

### Environment Variable Scopes

Vercel supports three scopes for environment variables:

1. **Production**: Only available in production deployments
2. **Preview**: Available in all preview deployments
3. **Development**: Available when running `vercel dev` locally

### Setting Environment Variables

#### 1. Via Vercel Dashboard

Navigate to Project Settings → Environment Variables:

```bash
# Production Only
SUPABASE_SERVICE_ROLE_KEY=prod_key [Production]
DATABASE_URL=prod_database_url [Production]
CRON_SECRET=prod_cron_secret [Production]

# Preview & Development
NEXT_PUBLIC_APP_URL=https://preview.yourdomain.com [Preview, Development]
NEXT_PUBLIC_ENABLE_DEBUG=true [Preview, Development]
NEXT_PUBLIC_FEATURE_FLAGS=experimental [Preview, Development]

# All Environments
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co [Production, Preview, Development]
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key [Production, Preview, Development]
```

#### 2. Via Vercel CLI

```bash
# Set for specific environments
vercel env add VARIABLE_NAME production
vercel env add VARIABLE_NAME preview development

# Pull environment variables locally
vercel env pull .env.local
```

#### 3. Environment Variable Best Practices

1. **Separate Databases**: Use different Supabase projects for dev/staging/prod
2. **Feature Flags**: Enable experimental features only in preview
3. **API Keys**: Use test keys for preview environments
4. **Secrets**: Never expose production secrets to preview environments

### Example Environment Setup

**.env.production**
```bash
# Production Database
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod_anon_key
SUPABASE_SERVICE_ROLE_KEY=prod_service_role_key

# Production API Keys
DEEPSEEK_API_KEY=prod_deepseek_key
SENDGRID_API_KEY=prod_sendgrid_key

# Production Settings
NEXT_PUBLIC_APP_URL=https://app.blipee.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEBUG=false
```

**.env.preview**
```bash
# Staging Database
NEXT_PUBLIC_SUPABASE_URL=https://staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=staging_anon_key
SUPABASE_SERVICE_ROLE_KEY=staging_service_role_key

# Test API Keys
DEEPSEEK_API_KEY=test_deepseek_key
SENDGRID_API_KEY=test_sendgrid_key

# Preview Settings
NEXT_PUBLIC_APP_URL=https://preview.blipee.com
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true
NEXT_PUBLIC_SHOW_PREVIEW_BANNER=true
```

**.env.development**
```bash
# Local Development Database
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev_anon_key
SUPABASE_SERVICE_ROLE_KEY=dev_service_role_key

# Development API Keys
DEEPSEEK_API_KEY=dev_deepseek_key
SENDGRID_API_KEY=dev_sendgrid_key

# Development Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true
NEXT_PUBLIC_ENABLE_DEV_TOOLS=true
```

## Branch-Based Deployments

Implement a professional Git workflow with automatic deployments for different branches.

### Recommended Branch Strategy

1. **main/master**: Production branch (auto-deploys to production)
2. **develop**: Development branch (auto-deploys to staging)
3. **feature/***: Feature branches (creates preview deployments)
4. **hotfix/***: Hotfix branches (creates preview deployments)

### Configuring Branch Deployments

#### 1. Production Branch
In Vercel Dashboard → Settings → Git:
- Set Production Branch: `main`
- Enable automatic deployments

#### 2. Preview Branches
Configure which branches create previews:
```json
{
  "git": {
    "deploymentEnabled": {
      "main": false,
      "develop": true,
      "feature/*": true,
      "hotfix/*": true
    }
  }
}
```

### Custom Domains for Branches

Assign custom domains to specific branches:

1. **Production**: `app.blipee.com` → main branch
2. **Staging**: `staging.blipee.com` → develop branch
3. **Preview**: `preview.blipee.com` → latest preview

Configure in Vercel Dashboard → Settings → Domains:
```
app.blipee.com → main branch
staging.blipee.com → develop branch
preview.blipee.com → preview deployments
```

### Deployment Aliases

Create consistent URLs for branches:
```json
{
  "alias": ["staging.blipee.com"],
  "scope": "your-team",
  "regions": ["sfo1"]
}
```

## Protecting Production

Implement safeguards to prevent accidental production deployments and data exposure.

### 1. Deployment Protection

Enable deployment protection in Vercel Dashboard:
- Settings → Git → Deployment Protection
- Require approval for production deployments
- Set up protection rules

### 2. Environment Variable Protection

```javascript
// src/lib/config/environment.ts
const isProd = process.env.NODE_ENV === 'production';
const isPreview = process.env.VERCEL_ENV === 'preview';

// Prevent preview deployments from using production resources
if (isPreview && process.env.DATABASE_URL?.includes('prod')) {
  throw new Error('Preview deployment cannot use production database');
}

export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: isProd 
      ? process.env.SUPABASE_SERVICE_ROLE_KEY!
      : process.env.SUPABASE_SERVICE_ROLE_KEY_DEV!,
  },
  features: {
    analytics: isProd,
    debug: !isProd,
    devTools: !isProd && !isPreview,
  }
};
```

### 3. Database Protection

Create separate Supabase projects:
1. **Production**: Real user data, strict RLS
2. **Staging**: Copy of production structure, test data
3. **Development**: Local development data

### 4. API Rate Limiting

Implement different rate limits for environments:
```javascript
// src/lib/api/rate-limiter.ts
const getRateLimit = () => {
  const env = process.env.VERCEL_ENV;
  
  switch (env) {
    case 'production':
      return { windowMs: 15 * 60 * 1000, max: 100 };
    case 'preview':
      return { windowMs: 15 * 60 * 1000, max: 1000 };
    default:
      return { windowMs: 15 * 60 * 1000, max: 10000 };
  }
};
```

### 5. Authentication Protection

```javascript
// src/middleware.ts
export async function middleware(request: NextRequest) {
  const isPreview = process.env.VERCEL_ENV === 'preview';
  const isProd = process.env.VERCEL_ENV === 'production';
  
  // Add preview banner
  if (isPreview) {
    request.headers.set('x-preview-mode', 'true');
  }
  
  // Stricter auth for production
  if (isProd) {
    // Implement additional security checks
  }
  
  return NextResponse.next();
}
```

## Development-Specific Configurations

### 1. Debug Mode

Enable debug features in preview/development:
```javascript
// src/app/layout.tsx
export default function RootLayout({ children }) {
  const showDebug = process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true';
  
  return (
    <html>
      <body>
        {showDebug && <DebugToolbar />}
        {children}
      </body>
    </html>
  );
}
```

### 2. Feature Flags

Implement feature flags for gradual rollouts:
```javascript
// src/lib/feature-flags/config.ts
export const featureFlags = {
  newDashboard: {
    production: false,
    preview: true,
    development: true,
  },
  aiInsights: {
    production: true,
    preview: true,
    development: true,
  },
  experimentalAutomations: {
    production: false,
    preview: true,
    development: true,
  },
};

export const isFeatureEnabled = (feature: string) => {
  const env = process.env.VERCEL_ENV || 'development';
  return featureFlags[feature]?.[env] ?? false;
};
```

### 3. Development Tools

Add development-specific tools:
```javascript
// src/components/dev/DevTools.tsx
export function DevTools() {
  if (process.env.NODE_ENV === 'production') return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button onClick={() => clearCache()}>Clear Cache</button>
      <button onClick={() => seedDatabase()}>Seed DB</button>
      <button onClick={() => showMetrics()}>Show Metrics</button>
    </div>
  );
}
```

### 4. Mock Data for Development

```javascript
// src/lib/mocks/index.ts
export const getMockData = () => {
  if (process.env.VERCEL_ENV === 'production') {
    throw new Error('Mock data not available in production');
  }
  
  return {
    devices: generateMockDevices(10),
    alerts: generateMockAlerts(5),
    automations: generateMockAutomations(3),
  };
};
```

### 5. Preview Banner

Show a banner in preview deployments:
```javascript
// src/components/PreviewBanner.tsx
export function PreviewBanner() {
  if (process.env.VERCEL_ENV !== 'preview') return null;
  
  return (
    <div className="bg-yellow-500 text-black p-2 text-center">
      ⚠️ Preview Environment - Using staging database
      <span className="ml-4 text-sm">
        Branch: {process.env.VERCEL_GIT_COMMIT_REF}
      </span>
    </div>
  );
}
```

## Team Collaboration

### 1. Preview Comments

Configure automatic PR comments with preview links:
```json
{
  "github": {
    "enabled": true,
    "silent": false,
    "autoAlias": true,
    "autoJobCancelation": true
  }
}
```

### 2. Team Environment Variables

Set up team-wide environment variables:
- Go to Team Settings → Environment Variables
- Add variables that apply to all projects
- Use for shared resources (analytics, error tracking)

### 3. Access Control

Configure deployment permissions:
- Team Settings → Members
- Set roles: Owner, Member, Viewer
- Control who can deploy to production

### 4. Deployment Notifications

Set up notifications for deployments:
```javascript
// vercel.json
{
  "functions": {
    "api/deploy-notification.ts": {
      "includeFiles": "templates/**"
    }
  }
}
```

### 5. Shared Preview URLs

Create stable preview URLs for QA:
```bash
# Create alias for latest preview
vercel alias set preview-blipee.vercel.app
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Environment Variables Not Loading
```bash
# Pull latest environment variables
vercel env pull .env.local

# Verify variables
vercel env ls
```

#### 2. Preview Deployment Failures
```bash
# Check build logs
vercel logs <deployment-url>

# Redeploy with verbose logging
vercel --debug
```

#### 3. Branch Deployment Not Triggering
- Check Git integration in Vercel Dashboard
- Verify branch patterns in deployment settings
- Ensure GitHub/GitLab permissions are correct

#### 4. Wrong Environment Variables in Preview
- Check variable scopes in Vercel Dashboard
- Ensure variables are set for "Preview" environment
- Verify no production variables in preview

#### 5. Slow Preview Deployments
- Optimize build process
- Use build cache
- Reduce bundle size

### Debug Commands

```bash
# List all deployments
vercel ls

# Get deployment details
vercel inspect <deployment-url>

# Check environment variables
vercel env ls

# View logs
vercel logs <deployment-url> --follow

# Rollback deployment
vercel rollback <deployment-url>
```

### Best Practices Summary

1. **Always use environment-specific variables**
2. **Never share production credentials with preview**
3. **Implement proper branch protection**
4. **Use feature flags for gradual rollouts**
5. **Monitor preview deployment performance**
6. **Regularly clean up old preview deployments**
7. **Document environment-specific behaviors**
8. **Test in preview before production**

## Conclusion

A well-configured Vercel development environment enables rapid iteration while maintaining production stability. By following this guide, you'll have:

- Automatic preview deployments for every change
- Proper environment isolation
- Protection against accidental production changes
- Efficient team collaboration
- Clear development workflows

Remember to regularly review and update your deployment configuration as your team and application grow.