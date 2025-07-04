# Shelly Monitor

Enterprise-grade monitoring platform for Shelly IoT devices with real-time dashboards, AI-powered analytics, and natural language control.

## 🚀 Features

- **Real-time Monitoring**: Live device status and metrics with WebSocket updates
- **Multi-device Support**: Plus 2PM, Plus 1PM, Motion 2, Dimmer 2, BLU Motion
- **AI Assistant "Ask Blipee"**: Natural language control and automation creation
- **Predictive Notifications**: AI analyzes patterns to suggest smart alerts
- **Smart Automations**: AI-powered scheduling and trigger-based device control
- **One-tap Scenes**: Control multiple devices instantly
- **Advanced Analytics**: Energy consumption tracking with AI insights
- **Anomaly Detection**: Security alerts for unusual activity
- **Cost Optimization**: DeepSeek AI integration for affordable intelligence
- **Progressive Web App**: Install as native app with offline support
- **Push Notifications**: Real-time alerts with natural language creation
- **Enterprise Security**: RBAC, audit logs, secure API
- **Material Design 3**: Modern, responsive UI with dark mode

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Material UI v5, Zustand
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **AI**: DeepSeek, OpenAI, Anthropic (multi-provider support)
- **Testing**: Jest, Playwright
- **Monitoring**: Prometheus metrics
- **Email**: Custom SMTP support

## Quick Start

```bash
# Clone repository
git clone https://github.com/blipee-dev/shelly-monitor.git
cd shelly-monitor

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Set up database
npm run db:setup
npm run db:seed

# Run development server
npm run dev
```

Visit http://localhost:3000

## AI Assistant - Ask Blipee

Ask Blipee is your intelligent home assistant that understands natural language:

### Device Control
- "Turn off all lights"
- "Dim the living room to 50%"
- "What's my current energy usage?"

### Automations
- "Turn off all lights at 10 PM every day"
- "When motion is detected, turn on hallway lights"
- "Create a morning routine"

### Scenes
- "Create a movie night scene"
- "Activate bedtime mode"
- "Set up an away mode"

### Management
- "Show me all my automations"
- "Disable the morning routine"
- "What scenes do I have?"

## Documentation

- [Getting Started Guide](docs/setup/GETTING_STARTED.md)
- [AI Features Guide](docs/guides/AI_FEATURES.md)
- [PWA & Notifications Guide](docs/guides/PWA_GUIDE.md)
- [API Documentation](http://localhost:3000/api-docs)
- [Project Structure](docs/PROJECT_STRUCTURE.md)
- [Authentication Guide](docs/guides/AUTHENTICATION.md)
- [Theme Customization](docs/guides/THEME_CUSTOMIZATION.md)

## Test Accounts

After seeding the database:
- Admin: `test.admin@gmail.com` / `Admin123!`
- User: `test.user@gmail.com` / `User123!`

## Scripts

Common commands:
```bash
npm run dev              # Development server
npm run build           # Production build
npm run test            # Run all tests
npm run lint            # ESLint
npm run type-check      # TypeScript check

# Database
npm run db:setup        # Initialize database
npm run db:seed         # Seed test data
npm run db:reset        # Reset and re-seed

# Utilities
npm run check:env       # Verify environment
npm run create:test-users # Create test users
```

See [scripts/README.md](scripts/README.md) for all available scripts.

## Project Structure

```
src/
├── app/              # Next.js App Router
├── components/       # React components
├── lib/             # Core libraries
├── types/           # TypeScript types
docs/
├── setup/           # Setup guides
├── guides/          # Development guides
scripts/
├── setup/           # Setup scripts
├── maintenance/     # Maintenance utilities
├── test/           # Test utilities
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT