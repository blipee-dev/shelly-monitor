# Scripts Directory

Organized utility scripts for Shelly Monitor development and maintenance.

## Directory Structure

### `/setup`
Core setup and initialization scripts:
- `setup-db.ts` - Database initialization
- `seed-data.ts` - Production seed data
- `check-env.ts` - Environment validation
- `run-migrations.sql` - Migration runner

### `/maintenance`
Database and system maintenance:
- `reset-and-seed.ts` - Reset database with fresh data
- `check-schema.ts` - Validate database schema
- `sync-users.ts` - Sync auth users with database

### `/test`
Testing utilities:
- `test-complete.ts` - Comprehensive test suite
- `test-db.ts` - Database connection testing
- `create-test-users.ts` - Create test users (no emails)

### `/build`
Build and asset generation:
- `generate-icons.js` - Generate app icons

### `/_archive`
Temporary scripts and fixes (can be deleted):
- Various SQL fixes from development
- One-time test scripts
- Debug utilities

## Common Commands

```bash
# Initial setup
npm run db:setup
npm run db:seed

# Testing
npm run test:db
npm run create:test-users

# Maintenance
npm run db:reset
npm run check:schema
```