# Getting Started with Blipee OS

Welcome to Blipee OS! This guide will help you get up and running in just 5 minutes using our conversational AI setup.

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- At least one AI API key:
  - DeepSeek (recommended - most cost-efficient)
  - OpenAI GPT-4
  - Anthropic Claude

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/blipee-dev/blipee-os.git
cd blipee-os
npm install
```

### 2. Environment Setup

Create your environment file:

```bash
cp .env.example .env.local
```

Configure these essential variables in `.env.local`:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# AI Providers (at least one required)
DEEPSEEK_API_KEY=your-deepseek-key    # Primary (recommended)
OPENAI_API_KEY=your-openai-key        # Fallback
ANTHROPIC_API_KEY=your-anthropic-key   # Fallback

# Email (Optional but recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=no-reply@blipee.com
SMTP_PASS=your-app-password
```

### 3. Database Setup

Our intelligent setup will guide you through the process:

```bash
# Verify your environment
npm run check:env

# Set up the database with all migrations
npm run db:setup

# Seed with sample data
npm run db:seed
```

### 4. Start the Development Server

```bash
npm run dev
```

Visit http://localhost:3000 and experience our conversational onboarding!

## 🎯 First Steps After Setup

### 1. Conversational Onboarding
When you first visit Blipee OS, Ask Blipee will guide you through:
- Setting up your organization profile
- Connecting your first devices
- Creating your first automations
- Understanding the platform features

Just tell Ask Blipee what you want to do in natural language!

### 2. Test Accounts
If you ran the seed script, you can sign in with:
- **Admin**: `test.admin@gmail.com` / `Admin123!`
- **User**: `test.user@gmail.com` / `User123!`

### 3. Try These Commands with Ask Blipee
- "Show me all my devices"
- "Create an automation to turn off lights at 10 PM"
- "What's my current energy usage?"
- "Set up a notification when motion is detected"
- "Create a movie night scene"

## 🌟 Key Features to Explore

### AI-Powered Intelligence
- **Ask Blipee**: Your AI assistant for everything
- **Predictive Notifications**: Get alerts before problems occur
- **Natural Language Automations**: Just describe what you want

### Device Management
- Real-time monitoring of all IoT devices
- One-click control through the dashboard
- Voice commands through Ask Blipee

### Progressive Web App
- Install on any device (mobile, tablet, desktop)
- Works offline with cached data
- Push notifications for important alerts

### Analytics & Insights
- Energy usage tracking and predictions
- Cost optimization recommendations
- Anomaly detection for security

## 📱 Installing as a PWA

### Desktop (Chrome/Edge)
1. Click the install icon in the address bar
2. Follow the prompts to install

### Mobile (iOS/Android)
1. Open in Safari (iOS) or Chrome (Android)
2. Tap the share button
3. Select "Add to Home Screen"

## 🔧 Configuration Options

### AI Provider Selection
DeepSeek is recommended as the primary provider due to cost efficiency:
- DeepSeek: $0.14/1M tokens (input), $0.28/1M (output)
- OpenAI GPT-4: $10/1M tokens (input), $30/1M (output)
- Anthropic Claude: $15/1M tokens (input), $75/1M (output)

### Email Configuration
For production use, configure SMTP:
1. Use Google Workspace with app-specific password
2. Or use any SMTP provider (SendGrid, AWS SES, etc.)

See [SMTP Setup Guide](./SMTP_SETUP.md) for details.

### Push Notifications
To enable push notifications:
1. Generate VAPID keys (see PWA Guide)
2. Add to environment variables
3. Enable in user settings

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:migrate      # Run new migrations
npm run db:reset        # Reset and re-seed database
npm run db:backup       # Create a backup

# Testing
npm test                # Run all tests
npm run test:e2e        # Run end-to-end tests
npm run lint            # Check code quality
npm run type-check      # TypeScript validation
```

## 🚨 Troubleshooting

### Database Connection Issues
```bash
# Test your database connection
npm run test:db

# Check Supabase status
# Visit your Supabase dashboard to ensure the project is active
```

### AI Provider Issues
- Ensure at least one AI API key is configured
- Check API key validity and credits
- The system will automatically fallback to available providers

### Build or Runtime Errors
```bash
# Clear caches and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

### Hydration Errors
These have been fixed, but if you encounter any:
1. Check browser console for specific errors
2. Ensure all browser-only code is wrapped in useEffect
3. Use the ClientOnly wrapper for dynamic content

## 📚 Next Steps

1. **Explore the Dashboard**: Get familiar with the interface
2. **Connect Real Devices**: Add your Shelly or other IoT devices
3. **Create Automations**: Use natural language to automate your space
4. **Set Up Notifications**: Configure alerts for important events
5. **Customize Your Theme**: Make it match your brand

## 🤝 Getting Help

- **Documentation**: Check `/docs` for detailed guides
- **Ask Blipee**: Your AI assistant can answer most questions
- **GitHub Issues**: https://github.com/blipee-dev/blipee-os/issues
- **Community**: Join our Discord (coming soon)

## 🎉 Welcome to the Future!

Blipee OS transforms how you interact with technology. No more complex forms or confusing interfaces - just natural conversation with an AI that understands your needs.

Start by asking Blipee: "What can you help me with today?"

---

**Pro Tip**: Try voice commands! Just say "Hey Blipee" followed by your request (requires microphone permission).