# Getting Started with Shelly Monitor

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google Workspace or SMTP provider (for emails)

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/blipee-dev/shelly-monitor.git
cd shelly-monitor
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`

### 3. Database Setup

```bash
# Check environment
npm run check:env

# Set up database
npm run db:setup

# Seed with test data
npm run db:seed
```

### 4. Configure Email (Optional)

See [SMTP Setup Guide](./SMTP_SETUP.md) for email configuration.

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Test Accounts

After seeding:
- Admin: `test.admin@gmail.com` / `Admin123!`
- User: `test.user@gmail.com` / `User123!`

## Project Structure

See [PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md) for detailed information.

## Next Steps

1. Configure real Shelly devices
2. Set up monitoring schedules
3. Configure alerts
4. Customize theme (see [Theme Guide](../guides/THEME_CUSTOMIZATION.md))

## Troubleshooting

### Database Connection Issues
- Verify Supabase URL and keys
- Check if database is paused in Supabase dashboard

### Email Not Working
- Follow [SMTP Setup Guide](./SMTP_SETUP.md)
- Check DNS records (SPF, DKIM)

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`

## Support

- Documentation: `/docs`
- Issues: https://github.com/blipee-dev/shelly-monitor/issues