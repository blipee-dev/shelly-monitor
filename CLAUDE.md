# Shelly Monitor - AI Assistant Context

This document provides context for AI assistants working on the Shelly Monitor project.

## Project Overview

Shelly Monitor is an enterprise-grade IoT device monitoring platform for Shelly devices (Plus 2PM and Motion 2). It provides real-time monitoring, control, analytics, and comprehensive enterprise features.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Material UI v5, Zustand
- **Backend**: Supabase (PostgreSQL, Auth, Realtime), Next.js API Routes
- **Testing**: Jest (unit/integration), Playwright (E2E)
- **Monitoring**: Prometheus metrics, custom dashboards
- **Infrastructure**: Docker, Vercel/self-hosted

## Key Features Implemented

### Day 1 (July 3, 2025)
1. **API Documentation**: OpenAPI 3.1 spec with Swagger UI at `/api-docs`
2. **Core Infrastructure**: Next.js setup, TypeScript configuration
3. **Security**: Rate limiting, JWT auth, audit logging, RBAC
4. **Monitoring**: Prometheus metrics at `/api/metrics`
5. **Testing**: Comprehensive test suites with >80% coverage
6. **i18n**: Multi-language support (EN, ES)
7. **Feature Flags**: Runtime toggles with rollout control
8. **Audit Logging**: Complete activity tracking with admin viewer

### Day 2 (July 4, 2025) - Supabase Integration
1. **Database**: Complete Supabase integration with migrations
2. **Schema**: 13 tables with partitioning for time-series data
3. **Security**: Row Level Security (RLS) on all tables
4. **Automation**: pg_cron for maintenance, partition management
5. **Scripts**: Comprehensive database management scripts
6. **Testing**: Database verification and seeding tools
7. **Documentation**: Complete setup guides and migration docs

## Important Commands

```bash
# Development
npm run dev              # Start development server
npm run lint            # Run ESLint
npm run type-check      # TypeScript validation

# Testing
npm test                # Run all tests
npm run test:unit       # Unit tests only
npm run test:e2e        # E2E tests with Playwright
npm run test:coverage   # Generate coverage report

# Database - Basic
npm run db:setup        # Initialize database with migrations
npm run db:seed         # Seed comprehensive test data
npm run db:migrate      # Run migrations only
npm run db:reset        # Reset database and re-run migrations

# Database - Advanced
npm run setup:complete  # One-command complete setup
npm run check:env       # Verify environment variables
npm run check:schema    # Verify database schema
npm run test:db         # Test database connection
npm run test:complete   # Comprehensive setup verification
npm run sync:users      # Sync Supabase auth users
npm run seed:simple     # Minimal test data

# Build & Deploy
npm run build           # Production build
npm run start           # Start production server
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   └── api-docs/       # Swagger UI
├── components/         # React components
├── lib/                # Core libraries
│   ├── api/           # API utilities & OpenAPI
│   ├── audit/         # Audit logging system
│   ├── feature-flags/ # Feature flag management
│   ├── i18n/          # Internationalization
│   ├── monitoring/    # Prometheus metrics
│   └── supabase/      # Database client
├── types/              # TypeScript definitions
└── middleware.ts       # Auth & rate limiting

tests/
├── unit/              # Component & utility tests
├── integration/       # API endpoint tests
└── e2e/              # End-to-end tests
```

## Environment Variables

Key environment variables needed:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `METRICS_AUTH_TOKEN`
- `REDIS_URL` (optional, for rate limiting)

## Shelly Device APIs

### Plus 2PM
- Control: `POST http://{ip}/relay/{0 < /dev/null | 1}?turn={on|off}`
- Status: `GET http://{ip}/status`
- Supports: 2 channels, power monitoring, temperature

### Motion 2
- Status: `GET http://{ip}/status`
- Provides: Motion detection, light levels, temperature, battery

## Development Guidelines

1. **TypeScript**: Use strict mode, avoid `any`
2. **Components**: Functional components with hooks
3. **State**: Zustand for global, useState for local
4. **API**: Always validate input, use proper HTTP codes
5. **Testing**: Write tests for new features
6. **Security**: Sanitize inputs, use parameterized queries
7. **Performance**: Use SWR for caching, optimize queries

## Recent Major Changes (v2.0.0)

- Upgraded from basic monitoring to enterprise platform
- Added comprehensive security and monitoring
- Implemented i18n and feature flags
- Created audit logging system
- Added OpenAPI documentation
- Set up comprehensive testing

## Common Tasks

### Adding a New Device Type
1. Update types in `src/types/shelly.ts`
2. Add device-specific logic in components
3. Update API endpoints
4. Add tests

### Adding a New Language
1. Create locale file in `src/lib/i18n/locales/`
2. Update supported locales in i18n config
3. Test all UI strings

### Creating a Feature Flag
1. Add to default flags in `src/lib/feature-flags/`
2. Use `useFeatureFlag` hook or `FeatureFlag` component
3. Document in feature flags panel

## Debugging Tips

- Check browser console for client errors
- API errors logged in Next.js terminal
- Supabase logs in dashboard
- Metrics available at `/api/metrics`
- Audit logs viewable by admins

## Day 2 Specific Updates

### Database Implementation
- **Migrations**: Located in `supabase/migrations/`
  - `001_initial_schema.sql` - Core tables, indexes, RLS
  - `002_functions_and_procedures.sql` - Triggers, functions
- **Scripts**: Located in `scripts/`
  - Database setup and verification tools
  - Seeding scripts for different scenarios
  - Utility scripts for development

### Key Database Features
1. **Partitioning**: Time-series tables partitioned by month
2. **RLS Policies**: Complete security on all tables
3. **Automation**: pg_cron jobs for maintenance
4. **Encryption**: Credentials encrypted at rest
5. **Audit Trail**: Comprehensive logging of all actions

### Supabase Integration Points
- Client: `src/lib/supabase/client.ts`
- Server: `src/lib/supabase/server.ts`
- Middleware: `src/lib/supabase/middleware.ts`
- Types: `src/types/database.ts`

### Testing Database Setup
```bash
# Quick test with minimal data
npm run test:db && npm run seed:simple

# Full test with comprehensive data
npm run setup:complete

# Reset everything and start fresh
npm run db:reset && npm run db:seed
```

## Day 3 Specific Updates

### Material Design 3 Theme
- **Theme System**: Complete MD3 implementation in `src/lib/theme/`
  - `colors.ts` - MD3 color system with light/dark schemes
  - `typography.ts` - Full MD3 typography scale
  - `theme.ts` - Theme configuration with component overrides
  - `ThemeProvider.tsx` - Theme context with persistence
- **Custom Components**: Located in `src/components/ui/`
  - Card, Surface, NavigationRail, FAB components
  - All follow MD3 design guidelines
- **Theme Demo**: Available at `/theme-demo`
  - Showcases all components and variants
  - Interactive dark mode toggle
  - Typography and color demonstrations

### Testing Theme
```bash
# View theme demo
npm run dev
# Navigate to http://localhost:3000/theme-demo

# Test theme configuration
npx tsx scripts/test-theme.ts
```

## Day 4 Specific Updates (July 5, 2025)

### Authentication System
- **Auth Pages**: Located in `src/app/auth/`
  - Sign in, sign up, password reset pages
  - Full Material UI integration
  - Form validation with Zod
- **Auth Hooks**: `src/lib/auth/hooks.ts`
  - useAuth() for auth operations
  - useRequireAuth() for protected routes
  - useRequireNoAuth() for public routes
- **Dashboard Layout**: `src/components/layout/DashboardLayout.tsx`
  - Responsive navigation with NavigationRail
  - Mobile drawer support
  - User profile menu

### Email/SMTP Configuration
- **Provider**: Google Workspace with blipee.com domain
- **Sender**: no-reply@blipee.com
- **DNS**: SPF and DKIM properly configured
- **Documentation**: See `docs/CUSTOM_SMTP_SETUP.md`

### Testing Authentication
```bash
# Create test users (no emails sent)
npx tsx scripts/create-valid-test-users.ts

# Test SMTP configuration
npx tsx scripts/test-blipee-smtp.ts
```

### Test Accounts
- Admin: test.admin@gmail.com / Password: Admin123!
- User: test.user@gmail.com / Password: User123!

## Day 5 Specific Updates - Device Management UI

### Implemented Features
1. **Device Types**: Support for 5 Shelly device types
   - Plus 2PM (dual relay with power monitoring)
   - Plus 1PM (single relay with power monitoring)
   - Motion 2 (motion sensor with temperature)
   - Dimmer 2 (dimmable light control)
   - BLU Motion (Bluetooth motion sensor)

2. **State Management**: Zustand store with real-time updates
   - Device CRUD operations
   - Real-time status synchronization
   - Group management functionality

3. **Real-time Integration**: Supabase subscriptions
   - WebSocket connections for live updates
   - Automatic reconnection handling
   - Optimistic UI updates

### Key Files
- `src/types/device.ts` - Comprehensive device type definitions
- `src/lib/stores/deviceStore.ts` - Zustand device state management
- `src/lib/realtime/deviceSubscription.ts` - Real-time subscription manager
- `src/app/(dashboard)/devices/page.tsx` - Device listing page
- `src/components/devices/` - Device UI components

## Day 6 Specific Updates - Analytics & AI Integration

### Implemented Features
1. **AI Provider Architecture**
   - Multi-provider support (DeepSeek, OpenAI, Anthropic)
   - Automatic fallback mechanism
   - Cost-optimized with DeepSeek as primary
   - Streaming support for real-time responses

2. **Ask Blipee Chat Assistant**
   - Natural language device control
   - Context-aware responses
   - Function calling for device actions
   - Real-time streaming responses

3. **Analytics Dashboard**
   - Real-time power consumption metrics
   - Energy usage charts (24-hour, device breakdown)
   - Cost estimation and tracking
   - AI-powered insights generation

4. **AI Insights System**
   - Energy saving opportunities
   - Usage pattern detection
   - Anomaly detection
   - Predictive maintenance suggestions

### AI Configuration
```bash
# Required in .env.local
DEEPSEEK_API_KEY=your-key        # Primary provider (cost-efficient)
OPENAI_API_KEY=your-key          # Optional fallback
ANTHROPIC_API_KEY=your-key       # Optional fallback
```

### Key AI Files
- `src/lib/ai/service.ts` - AI service manager with fallback
- `src/lib/ai/providers/` - Provider implementations
- `src/lib/ai/hooks.ts` - React hooks for AI chat
- `src/lib/ai/insights.ts` - Insights generation service
- `src/components/ai/AskBlipee.tsx` - Chat interface component
- `src/app/api/ai/` - AI API endpoints

### AI Features
1. **Natural Language Control**
   - "Turn off all lights"
   - "Show me today's energy usage"
   - "Create a bedtime automation"
   - "Which devices are consuming the most power?"

2. **Smart Insights**
   - Automatic anomaly detection
   - Energy saving recommendations
   - Usage pattern analysis
   - Maintenance predictions

3. **Cost Optimization**
   - DeepSeek: $0.14/1M input, $0.28/1M output tokens
   - OpenAI GPT-4: $10/1M input, $30/1M output tokens
   - Anthropic Claude 3: $15/1M input, $75/1M output tokens

### Database Migration Required
Run the AI features migration in Supabase SQL editor:
```sql
-- Copy contents of supabase/migrations/003_ai_features.sql
```

This adds:
- `ai_usage_logs` table for tracking API usage
- `ai_insights` table for storing generated insights
- Cost calculation functions
- RLS policies for security

### Testing AI Features
```bash
# Start development server
npm run dev

# Navigate to Analytics page
http://localhost:3000/analytics

# Test Ask Blipee chat
- Try: "What's my current power usage?"
- Try: "Turn off the living room lights"
- Try: "Show me energy saving tips"
```

## Contact

Project repository: https://github.com/blipee-dev/shelly-monitor
