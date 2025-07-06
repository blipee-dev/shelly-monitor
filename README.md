# Blipee Operating System

AI-powered sustainability intelligence platform that transforms enterprise data into actionable insights through conversational interfaces and autonomous operations.

## 🚀 Vision

Blipee OS is the intelligent core of the Blipee Sustainability Platform - an AI brain that understands your business through conversation, sees through documents and images, predicts and prevents problems, and automates compliance and reporting at enterprise scale.

## 🌟 Key Features

### AI Intelligence Core
- **Conversational Everything**: Natural language as the primary interface - no forms, just talk
- **Vision Analysis**: Point camera at utility bills, equipment, or documents for instant insights
- **Predictive Intelligence**: Know problems before they occur with 95% confidence
- **Autonomous Operations**: Self-managing, self-optimizing, self-healing systems

### Enterprise Capabilities
- **5-Minute Setup**: Conversational onboarding vs traditional 50-hour implementations
- **Multi-Organization**: Manage subsidiaries, locations, and complex hierarchies
- **Compliance Automation**: CSRD, TCFD, GRI, CDP report generation
- **Industry Modules**: Manufacturing, Retail, Commercial Real Estate
- **White-Label Ready**: Full customization for partners

### Sustainability Intelligence
- **Real-time Monitoring**: IoT devices, energy systems, and environmental sensors
- **Carbon Footprint Tracking**: Scope 1, 2, and 3 emissions with AI predictions
- **ESG Reporting**: Automated compliance and investor-grade reports
- **Supply Chain Analytics**: End-to-end visibility and optimization
- **ROI Calculations**: AI-powered investment recommendations

### Technical Excellence
- **Progressive Web App**: Install on any device with offline support
- **Enterprise Security**: SOC2, RBAC, audit trails, encryption
- **API Marketplace**: 100+ integrations with enterprise systems
- **Real-time Everything**: WebSocket updates, live dashboards
- **Multi-Provider AI**: GPT-4, Claude, DeepSeek with automatic fallback

## 🏗️ Architecture

```
Blipee Operating System
├── AI Intelligence Layer
│   ├── Natural Language Processing
│   ├── Computer Vision (GPT-4V)
│   ├── Predictive Analytics
│   └── Autonomous Agents
├── Data Platform
│   ├── IoT Integration
│   ├── Document Processing
│   ├── Real-time Analytics
│   └── Time-series Database
├── Enterprise Services
│   ├── Multi-tenant Management
│   ├── Compliance Engine
│   ├── Reporting System
│   └── API Gateway
└── User Experience
    ├── Conversational UI
    ├── Executive Dashboards
    ├── Mobile PWA
    └── Voice Interface
```

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/blipee-dev/blipee-os.git
cd blipee-os

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Set up database
npm run db:setup
npm run db:seed

# Run development server
npm run dev
```

Visit http://localhost:3000 and start with our conversational onboarding!

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (or self-hosted instance)
- AI API keys (at least one):
  - DeepSeek (recommended for cost efficiency)
  - OpenAI GPT-4
  - Anthropic Claude

## 🔧 Configuration

### Essential Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# AI Providers (at least one required)
DEEPSEEK_API_KEY=your-deepseek-key    # Primary (cost-efficient)
OPENAI_API_KEY=your-openai-key        # Fallback
ANTHROPIC_API_KEY=your-anthropic-key   # Fallback

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=no-reply@blipee.com
SMTP_PASS=your-app-password

# Push Notifications (Optional)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_EMAIL=mailto:support@blipee.com

# Monitoring (Optional)
METRICS_AUTH_TOKEN=your-metrics-token
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Unit tests only
npm run test:unit

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 📚 Documentation

### Getting Started
- [Quick Start Guide](./docs/setup/GETTING_STARTED.md) - Get up and running in 5 minutes
- [Supabase Setup](./docs/setup/SUPABASE_SETUP.md) - Database configuration guide
- [Environment Setup](./docs/setup/SMTP_SETUP.md) - Email and environment configuration

### Feature Guides
- [AI Features](./docs/guides/AI_FEATURES.md) - Ask Blipee and predictive intelligence
- [Device Management](./docs/guides/DEVICE_MANAGEMENT.md) - Managing IoT devices
- [PWA Guide](./docs/guides/PWA_GUIDE.md) - Progressive Web App features
- [Authentication](./docs/guides/AUTHENTICATION.md) - User authentication and security
- [Theme Customization](./docs/guides/THEME_CUSTOMIZATION.md) - Material Design 3 theming

### Technical Documentation
- [API Documentation](/api-docs) - Interactive Swagger UI
- [Project Structure](./docs/PROJECT_STRUCTURE.md) - Codebase organization
- [Testing Guide](./docs/guides/TESTING.md) - Running and writing tests
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md) - Production deployment

### Vision & Planning
- [Transformation Plan](./BLIPEE_OS_TRANSFORMATION_PLAN.md) - Our journey from IoT to AI platform
- [AI Master Plan](./AI_TRANSFORMATION_MASTER_PLAN.md) - AI strategy and roadmap
- [Contributing](./CONTRIBUTING.md) - How to contribute to Blipee OS

## 🎯 Use Cases

### For Enterprises
- Achieve net-zero with AI-powered optimization
- Automate ESG reporting and compliance
- Predict and prevent equipment failures
- Optimize energy consumption across locations

### For Sustainability Consultants
- 10x your client capacity with AI automation
- Generate reports in minutes, not weeks
- Provide predictive insights, not just historical data

### For Facility Managers
- Natural language control of all systems
- Predictive maintenance alerts
- Energy optimization recommendations
- One-tap scene control

## 🚀 Roadmap

### Phase 1: Foundation (✅ Complete)
- ✅ Core platform with IoT monitoring
- ✅ AI chat interface (Ask Blipee)
- ✅ Predictive notifications with 95% confidence
- ✅ PWA with offline support
- ✅ Natural language automations
- ✅ Multi-provider AI (DeepSeek, OpenAI, Anthropic)
- ✅ Real-time device control
- ✅ Export/Import & Backup system
- ✅ Material Design 3 theme system

### Phase 2: Intelligence (Q1 2025)
- 🔄 GPT-4 Vision integration
- 🔲 Advanced report generation
- 🔲 Scenario planning
- 🔲 Industry modules
- 🔲 Enterprise rebranding

### Phase 3: Scale (Q2 2025)
- 🔲 Multi-region deployment
- 🔲 White-label platform
- 🔲 API marketplace
- 🔲 Voice interface

### Phase 4: Integration (Q3 2025)
- 🔲 Merge with main Blipee platform
- 🔲 Unified sustainability suite
- 🔲 Global expansion

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

Copyright © 2025 Blipee. All rights reserved.

## 🌐 Links

- [Website](https://blipee.com)
- [Documentation](https://docs.blipee.com)
- [API Reference](https://api.blipee.com)
- [Status Page](https://status.blipee.com)

---

**Blipee OS** - Where AI meets sustainability to create a better tomorrow. 🌍