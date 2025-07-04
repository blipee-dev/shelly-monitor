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

## Contact

Project repository: https://github.com/blipee-dev/shelly-monitor
