# Shelly Monitor

Enterprise-grade monitoring platform for Shelly IoT devices with real-time dashboards, analytics, and control capabilities.

## Features

- **Real-time Monitoring**: Live device status and metrics
- **Multi-device Support**: Shelly Plus 2PM and Motion 2
- **Advanced Analytics**: Historical data and insights
- **Remote Control**: Device management from anywhere
- **Enterprise Security**: RBAC, audit logs, secure API
- **Scalable Architecture**: Built for growth
- **Material Design 3**: Modern, responsive UI
- **Email Notifications**: SMTP integration for alerts

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Material UI v5, Zustand
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
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

## Documentation

- [Getting Started Guide](docs/setup/GETTING_STARTED.md)
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