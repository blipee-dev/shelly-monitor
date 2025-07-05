# Blipee OS Deployment Guide

This comprehensive guide covers deploying the Blipee OS Next.js application to various platforms, with a focus on Vercel as the recommended platform for Next.js applications.

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
- [Vercel Development Environment](#vercel-development-environment)
- [Alternative Deployment Options](#alternative-deployment-options)
  - [Docker Deployment](#docker-deployment)
  - [Node.js Server Deployment](#nodejs-server-deployment)
  - [Netlify Deployment](#netlify-deployment)
  - [AWS Amplify](#aws-amplify)
- [Environment Variables Setup](#environment-variables-setup)
- [Post-Deployment Steps](#post-deployment-steps)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

## Pre-Deployment Checklist

Before deploying your Blipee OS application, ensure you've completed the following:

### 1. Code Preparation
- [ ] Run all tests: `npm run test`
- [ ] Run type checking: `npm run type-check`
- [ ] Run linting: `npm run lint`
- [ ] Format code: `npm run format`
- [ ] Build locally to check for errors: `npm run build`
- [ ] Test the production build locally: `npm run start`

### 2. Database Setup
- [ ] Complete Supabase setup (see [SUPABASE_SETUP.md](./setup/SUPABASE_SETUP.md))
- [ ] Run all migrations in production database
- [ ] Verify RLS policies are properly configured
- [ ] Test database connectivity

### 3. Environment Variables
- [ ] Create production environment variables file
- [ ] Generate secure keys for JWT_SECRET, SESSION_SECRET, and ENCRYPTION_KEY
- [ ] Configure all required API keys
- [ ] Set up SMTP credentials for email notifications
- [ ] Configure AI provider API keys (DeepSeek/OpenAI/Anthropic)

### 4. Security Review
- [ ] Review and update security headers in `next.config.js`
- [ ] Enable HTTPS/SSL for production domain
- [ ] Configure CORS policies
- [ ] Review authentication flow
- [ ] Test rate limiting

### 5. Performance Optimization
- [ ] Enable image optimization
- [ ] Configure caching strategies
- [ ] Review bundle size: `npm run analyze`
- [ ] Test loading performance

## Vercel Deployment (Recommended)

Vercel is the easiest and most optimized platform for deploying Next.js applications.

### Step 1: Create Vercel Account
1. Sign up at [vercel.com](https://vercel.com)
2. Connect your GitHub/GitLab/Bitbucket account

### Step 2: Import Project
1. Click "New Project"
2. Import your Git repository
3. Select the `shelly-monitor` directory as the root directory

### Step 3: Configure Build Settings
Vercel should auto-detect Next.js settings, but verify:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Step 4: Set Environment Variables
In the Vercel dashboard, add all environment variables:

```bash
# Required Variables
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
ENCRYPTION_KEY=your-32-byte-encryption-key
CRON_SECRET=your-cron-secret

# AI Provider (at least one required)
DEEPSEEK_API_KEY=your-deepseek-api-key
# or
OPENAI_API_KEY=your-openai-api-key
# or
ANTHROPIC_API_KEY=your-anthropic-api-key

# Email Configuration
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Optional Features
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_EXPORTS=true
```

### Step 5: Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Access your application at the provided URL

### Step 6: Configure Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Enable HTTPS (automatic with Vercel)

### Step 7: Set Up Cron Jobs
The `vercel.json` file already configures cron jobs:
```json
{
  "crons": [
    {
      "path": "/api/polling",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

## Vercel Development Environment

For a comprehensive guide on setting up a professional development workflow with Vercel, including:
- Preview deployments for every branch
- Environment variable management across dev/staging/prod
- Branch-based deployment strategies
- Production protection mechanisms
- Development-specific configurations

See the [Vercel Development Environment Guide](./guides/VERCEL_DEVELOPMENT_GUIDE.md).

## Alternative Deployment Options

### Docker Deployment

#### 1. Build Docker Image
```bash
docker build -t blipee-os:latest .
```

#### 2. Run with Docker Compose
Create a `docker-compose.production.yml`:
```yaml
version: '3.8'

services:
  app:
    image: blipee-os:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "healthcheck.js"]
      interval: 30s
      timeout: 3s
      retries: 3
```

Run:
```bash
docker-compose -f docker-compose.production.yml up -d
```

#### 3. Deploy to Container Registries
- **Docker Hub**: `docker push yourusername/blipee-os:latest`
- **AWS ECR**: Follow AWS ECR push commands
- **Google Container Registry**: Use gcloud CLI

### Node.js Server Deployment

#### 1. Server Requirements
- Node.js 20.x or higher
- PM2 for process management
- Nginx for reverse proxy

#### 2. Setup Steps
```bash
# Clone repository
git clone your-repo-url
cd shelly-monitor

# Install dependencies
npm install

# Build application
npm run build

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "blipee-os" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

#### 3. Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Netlify Deployment

#### 1. Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### 2. Configure for Netlify
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NEXT_PRIVATE_TARGET = "server"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

#### 3. Deploy
```bash
netlify deploy --prod
```

### AWS Amplify

#### 1. Install Amplify CLI
```bash
npm install -g @aws-amplify/cli
amplify configure
```

#### 2. Initialize Amplify
```bash
amplify init
amplify add hosting
```

#### 3. Deploy
```bash
amplify publish
```

## Environment Variables Setup

### Generating Secure Keys

#### JWT_SECRET and SESSION_SECRET
```bash
# Generate 32-byte random strings
openssl rand -hex 32
```

#### ENCRYPTION_KEY
```bash
# Generate exactly 32-byte key
openssl rand -hex 16
```

#### VAPID Keys for Push Notifications
```bash
# Install web-push globally
npm install -g web-push

# Generate VAPID keys
web-push generate-vapid-keys
```

### Environment Variable Best Practices

1. **Never commit `.env` files** to version control
2. **Use different values** for development and production
3. **Rotate keys regularly** for security
4. **Use secret management services** for sensitive data:
   - Vercel Secrets
   - AWS Secrets Manager
   - HashiCorp Vault
   - Docker Secrets

### Required vs Optional Variables

#### Required for Basic Functionality:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `SESSION_SECRET`
- `ENCRYPTION_KEY`

#### Required for Full Features:
- At least one AI provider key (DEEPSEEK_API_KEY recommended)
- `SENDGRID_API_KEY` for email notifications
- `CRON_SECRET` for scheduled tasks

#### Optional Enhancements:
- Analytics keys (GA, Mixpanel)
- Error tracking (Sentry)
- SMS notifications (Twilio)
- External integrations (IFTTT, Home Assistant)

## Post-Deployment Steps

### 1. Verify Core Functionality
- [ ] Test user registration and login
- [ ] Verify email notifications are sent
- [ ] Test device creation and management
- [ ] Check real-time updates
- [ ] Test AI chat functionality
- [ ] Verify backup/restore features

### 2. Configure Domain and SSL
- [ ] Set up custom domain
- [ ] Enable SSL/HTTPS
- [ ] Configure www redirect
- [ ] Test SSL certificate

### 3. Set Up Monitoring
- [ ] Configure uptime monitoring (e.g., UptimeRobot)
- [ ] Set up error tracking (Sentry)
- [ ] Enable performance monitoring
- [ ] Configure alerts for critical errors

### 4. Database Optimization
- [ ] Enable Supabase connection pooling
- [ ] Configure database backups
- [ ] Set up monitoring alerts
- [ ] Review and optimize queries

### 5. Security Hardening
- [ ] Enable WAF if available
- [ ] Configure DDoS protection
- [ ] Set up security headers
- [ ] Enable rate limiting
- [ ] Review CORS policies

### 6. Performance Optimization
- [ ] Enable CDN for static assets
- [ ] Configure image optimization
- [ ] Set up caching headers
- [ ] Enable compression
- [ ] Test with Lighthouse

### 7. Set Up CI/CD
```yaml
# Example GitHub Actions workflow
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Monitoring and Maintenance

### Health Checks
The application includes built-in health check endpoints:
- `/api/health` - Basic health check
- `/api/metrics` - Prometheus metrics

### Monitoring Tools Integration

#### 1. Application Monitoring
- **Vercel Analytics**: Automatic with Vercel deployment
- **Google Analytics**: Add `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- **Mixpanel**: Add `MIXPANEL_TOKEN`

#### 2. Error Tracking
Configure Sentry:
```bash
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-auth-token
SENTRY_ORG=your-org
SENTRY_PROJECT=blipee-os
```

#### 3. Log Management
- **Vercel Logs**: Automatic with Vercel
- **LogTail**: Add `LOGTAIL_TOKEN`
- **DataDog**: Add `DATADOG_API_KEY`

### Regular Maintenance Tasks

#### Weekly
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Monitor database usage
- [ ] Review security alerts

#### Monthly
- [ ] Update dependencies: `npm update`
- [ ] Review and rotate API keys
- [ ] Analyze usage patterns
- [ ] Optimize database queries

#### Quarterly
- [ ] Security audit
- [ ] Performance review
- [ ] Cost optimization
- [ ] Disaster recovery test

### Backup Strategy

1. **Database Backups**
   - Enable Supabase automatic backups
   - Set up point-in-time recovery
   - Test restore procedures

2. **Application Backups**
   - Use Git for code versioning
   - Tag releases properly
   - Maintain staging environment

3. **User Data Exports**
   - Enable user data export feature
   - Test export/import functionality
   - Document recovery procedures

### Scaling Considerations

#### Vertical Scaling
- Increase Vercel plan limits
- Upgrade Supabase instance
- Increase function timeout limits

#### Horizontal Scaling
- Enable Vercel Edge Functions
- Use Supabase connection pooling
- Implement caching strategies
- Use CDN for static assets

### Troubleshooting Common Issues

#### Build Failures
1. Check build logs for errors
2. Verify all environment variables
3. Test build locally
4. Check dependency versions

#### Runtime Errors
1. Review application logs
2. Check Sentry for error details
3. Verify API endpoints
4. Test database connectivity

#### Performance Issues
1. Analyze bundle size
2. Check API response times
3. Review database queries
4. Monitor memory usage

### Support Resources

- **Documentation**: `/docs` directory
- **API Reference**: `/api-docs` endpoint
- **Community**: GitHub Issues
- **Emergency**: Set up PagerDuty or similar

## Conclusion

Deploying Blipee OS is straightforward with Vercel, but the platform supports various deployment options to suit your infrastructure needs. Follow this guide carefully, and don't skip the post-deployment steps to ensure a secure, performant, and reliable application.

For specific platform issues or advanced configurations, refer to the platform-specific documentation or contact support.