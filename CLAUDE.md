# Blipee Operating System - AI Assistant Context

This document provides context for AI assistants working on the Blipee OS project.

## Project Overview

Blipee Operating System (formerly Shelly Monitor) is an AI-powered sustainability intelligence platform that serves as the intelligent core of the Blipee Sustainability Platform. It transforms enterprise data into actionable insights through conversational interfaces, computer vision, predictive analytics, and autonomous operations.

### Vision
Transform from a $10M IoT monitoring platform to a $1B AI-powered enterprise sustainability intelligence system that will be integrated into the main Blipee Sustainability App.

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

## Day 7 Specific Updates - Automation & Scheduling

### Implemented Features
1. **AI-Powered Automation System**
   - Natural language automation creation
   - Time-based triggers (daily, specific times)
   - Event-based triggers (motion, device state)
   - Sunrise/sunset triggers with offsets
   - Multi-action support with delays

2. **Enhanced Ask Blipee Integration**
   - Full automation management via chat
   - Create: "Turn off all lights at 10 PM"
   - Manage: "Disable the morning routine"
   - Query: "Show me all my automations"
   - Scene control: "Activate movie night"

3. **Scenes System**
   - One-tap multi-device control
   - AI-created scenes from descriptions
   - Favorite scenes for quick access
   - Visual scene cards with contextual icons

4. **Automation UI**
   - Visual automation management page
   - Three tabs: Automations, Scenes, Activity Log
   - Real-time status updates
   - Enable/disable toggles
   - Manual execution buttons

### Natural Language Examples
```
// Creating Automations
"Create an automation to turn off all lights at bedtime"
"When motion is detected in the hallway, turn on the lights"
"Turn on the porch light 30 minutes before sunset"

// Managing Automations
"Show me all my automations"
"Disable the morning routine"
"Delete the vacation mode automation"
"Enable all lighting automations"

// Creating Scenes
"Create a movie night scene that dims the lights"
"Make a good morning scene that turns on kitchen and living room lights"
"Create an away mode that turns everything off"

// Activating Scenes
"Activate movie night"
"Turn on bedtime mode"
"Set the house to away mode"
```

### Key Files
- `src/types/automation.ts` - Comprehensive automation types
- `src/lib/automation/parser.ts` - Natural language parser
- `src/lib/stores/automationStore.ts` - Automation state management
- `src/components/ai/AskBlipeeEnhanced.tsx` - Enhanced AI chat
- `src/app/(dashboard)/automations/page.tsx` - Automations UI
- `src/app/api/automations/` - Automation execution endpoints

### Database Migration Required
Run the automation migration in Supabase SQL editor:
```sql
-- Copy contents of supabase/migrations/004_automations.sql
```

This adds:
- `automations` table with triggers, conditions, and actions
- `scenes` table for one-tap device control
- `automation_logs` table for execution history
- Validation functions and triggers
- Next trigger time calculation

### Architecture Notes
1. **Automation Engine**
   - JSONB storage for flexible trigger/action definitions
   - Real-time subscriptions for status updates
   - Execution logging for debugging
   - Automatic next trigger calculation

2. **AI Integration**
   - Function calling for all automation operations
   - Context-aware responses with existing automations
   - Natural language parsing to structured rules
   - Smart scene name generation

3. **Execution Flow**
   - API endpoints handle execution
   - Actions processed sequentially with delays
   - Device control integration ready
   - Error handling with partial success states

### Testing Automations
```bash
# Start development server
npm run dev

# Navigate to Automations page
http://localhost:3000/automations

# Test with Ask Blipee
- "Create a daily automation to turn off lights at 11 PM"
- "Show me all my automations"
- "Create a movie night scene"
- "Activate movie night"
```

## Phase 1 Progress
- ✅ Day 1: Core Infrastructure
- ✅ Day 2: Supabase Integration
- ✅ Day 3: Material Design 3 Theme
- ✅ Day 4: Authentication System
- ✅ Day 5: Device Management UI
- ✅ Day 6: Analytics & AI Integration
- ✅ Day 7: Automation & Scheduling
- ✅ Day 8: Mobile PWA & Push Notifications
- ✅ Day 9: Export/Import & Backup System
- ✅ Day 10: Dashboard Development

## Day 8 Specific Updates - Mobile PWA & Push Notifications

### Implemented Features
1. **Progressive Web App**
   - Installable on all platforms (iOS, Android, Desktop)
   - Custom install prompt with benefits explanation
   - Offline fallback page
   - Service worker with caching strategies

2. **Push Notifications**
   - Web Push API integration
   - Notification preferences management
   - Multiple notification channels (push, email, SMS)
   - Natural language notification creation
   - Scheduled and recurring notifications
   - Test notification functionality

3. **AI-Powered Predictive Notifications**
   - Pattern detection from usage history (95% confidence)
   - Anomaly detection for security alerts
   - Energy optimization suggestions
   - Behavioral predictions and automation suggestions
   - Maintenance need predictions
   - Auto-enable top recommendations

4. **Mobile Optimization**
   - Bottom navigation bar for mobile devices
   - Touch-optimized UI elements (44px targets)
   - Safe area insets for modern phones
   - Mobile-specific styles and animations

5. **Offline Functionality**
   - Service worker caches critical assets
   - Offline device data viewing
   - Background sync for queued actions
   - Online/offline status indicators

### Key Files
- `public/sw.js` - Service worker implementation
- `public/manifest.json` - PWA manifest configuration
- `src/components/pwa/InstallPrompt.tsx` - Install UI component
- `src/lib/notifications/push-manager.ts` - Push notification manager
- `src/lib/ai/predictive-notifications.ts` - Predictive notification engine
- `src/components/settings/NotificationSettings.tsx` - Notification preferences
- `src/components/layout/MobileNavigation.tsx` - Mobile bottom nav
- `docs/guides/PWA_GUIDE.md` - Comprehensive PWA documentation

### AI Notification Examples
Ask Blipee can now:
- "Send me a notification in 30 minutes"
- "Analyze my usage patterns"
- "What predictive notifications do you suggest?"
- "Detect any unusual activity"
- "Show me energy-saving opportunities"
- "Enable the top 3 suggested notifications"
- "Remind me daily at 9 PM to check devices"

### Database Migration Required
Run the push notifications migration in Supabase SQL editor:
```sql
-- Copy contents of supabase/migrations/005_push_notifications.sql
```

This adds:
- `push_subscriptions` table for Web Push endpoints
- `user_preferences` table for notification settings
- `notification_queue` table for queued notifications
- Functions for sending notifications
- RLS policies for security

## Day 9 Specific Updates - Export/Import & Backup System

### Implemented Features
1. **Export/Import System**
   - Export all data to JSON or CSV formats
   - Import from backup files with validation
   - Preview import changes before applying
   - Conflict resolution for existing data

2. **Automated Backup System**
   - Create manual backups on demand
   - Store backups in Supabase Storage
   - Automatic cleanup of old backups
   - Download backups for offline storage

3. **Backup Scheduling**
   - Daily, weekly, or monthly automatic backups
   - Customizable retention periods
   - Next run time calculation
   - Enable/disable schedules

4. **Data Migration Tools**
   - Version detection and migration
   - Backward compatibility support
   - Data validation and sanitization
   - Migration error handling

5. **Restore Functionality**
   - One-click restore from any backup
   - Selective data restoration
   - Overwrite or merge options
   - Restore progress tracking

### Key Files
- `src/lib/backup/export-manager.ts` - Export functionality
- `src/lib/backup/import-manager.ts` - Import and validation
- `src/lib/backup/backup-service.ts` - Backup management
- `src/lib/backup/migration-tools.ts` - Version migration
- `src/components/backup/BackupManager.tsx` - Backup UI
- `src/components/backup/BackupScheduler.tsx` - Schedule UI
- `src/app/(dashboard)/settings/backup/page.tsx` - Settings page

### Database Migration Required
Run the backup system migration in Supabase SQL editor:
```sql
-- Copy contents of supabase/migrations/006_backup_system.sql
```

This adds:
- `backup_records` table for tracking backups
- `backup_schedules` table for automation
- Storage bucket configuration
- RLS policies for security

### Testing Backup Features
```bash
# Navigate to backup settings
http://localhost:3000/settings/backup

# Test features:
1. Create a manual backup
2. Export data as JSON/CSV
3. Set up a daily backup schedule
4. Import from a backup file
5. Restore from a previous backup
```

### Storage Configuration
In Supabase Dashboard:
1. Go to Storage section
2. Create bucket named 'backups'
3. Set to private (not public)
4. Apply RLS policies

## Day 10 Specific Updates - Dashboard Development

### Implemented Features
1. **Main Dashboard Page**
   - Central hub at `/dashboard` for authenticated users
   - Real-time device statistics and monitoring
   - Responsive grid layout with Material UI

2. **Statistics Cards**
   - Active devices counter with online/offline status
   - Current power consumption in watts
   - Energy usage today in kWh
   - Average temperature from all sensors
   - Trend indicators showing percentage changes

3. **Device Grid**
   - Devices organized by room/location
   - Interactive device cards with status indicators
   - Real-time updates via Supabase subscriptions
   - Click navigation to device detail pages
   - Visual indicators for device types (lights, motion, etc.)

4. **Quick Actions Panel**
   - One-click access to key features
   - Automations, Analytics, Alerts, Settings buttons
   - System status monitoring
   - API health and sync status indicators

5. **Loading & Empty States**
   - Skeleton loaders during data fetch
   - Empty state with call-to-action for new users
   - Error states with retry functionality
   - Refresh button with animation

### Key Files
- `src/app/(dashboard)/dashboard/page.tsx` - Main dashboard implementation

### Dashboard Features
- **Real-time Updates**: Live device status via WebSocket
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Performance**: Optimized rendering with loading states
- **User Experience**: Intuitive navigation and visual feedback
- **Data Visualization**: Statistics with trend indicators

## Recent Fixes (January 7, 2025)
1. **Fixed middleware rate limiting error** - Temporarily disabled rate limiting imports
2. **Fixed FeatureFlagProvider error** - Changed fetchRemoteFlags to initializeFeatureFlags
3. **Fixed layout metadata warnings** - Separated viewport configuration
4. **Fixed CSP blocking Supabase** - Updated next.config.js CSP headers
5. **Fixed Grid component warnings** - Updated to Grid v2 syntax
6. **Created placeholder PWA icons** - Added basic icons for manifest
7. **Created proper favicon** - Added Material Icons psychology icon

## AI Transformation Goals

1. **Conversational Everything**: Natural language as primary interface
2. **Vision Intelligence**: Process documents, utility bills, equipment photos
3. **Predictive Analytics**: 95% confidence in behavioral predictions  
4. **Autonomous Operations**: Self-managing, self-healing systems
5. **5-Minute Setup**: Conversational onboarding vs 50-hour implementations
6. **Enterprise Scale**: Multi-org, compliance automation, industry modules

## Integration Path

This project will be absorbed into the main Blipee Sustainability App as its operating system layer, providing:
- AI intelligence core
- IoT device management
- Predictive analytics engine
- Compliance automation
- Natural language interface

## Contact

Project repository: https://github.com/blipee-dev/blipee-os
