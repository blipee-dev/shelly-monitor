# Supabase Setup Guide

This guide will walk you through setting up Supabase for the Shelly Monitor application.

## Prerequisites

- A Supabase account (free tier is sufficient)
- Node.js and npm installed
- The Shelly Monitor repository cloned locally

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New Project" 
3. Fill in the project details:
   - **Name**: `shelly-monitor` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select the closest region to you
   - **Pricing Plan**: Free tier is fine for development

4. Click "Create new project" and wait for it to be provisioned (takes ~2 minutes)

## Step 2: Get Your Project Credentials

Once your project is ready:

1. Go to your project dashboard
2. Click on "Settings" (gear icon) in the left sidebar
3. Navigate to "API" under Configuration
4. You'll find:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role**: This is your `SUPABASE_SERVICE_KEY` (keep this secret!)

## Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_KEY=your-service-key-here
   
   # Monitoring
   METRICS_AUTH_TOKEN=generate-a-random-string-here
   ```

3. Generate a secure metrics token:
   ```bash
   openssl rand -base64 32
   ```

## Step 4: Run Database Migrations

### Option A: Using SQL Editor (Recommended for first setup)

1. In your Supabase dashboard, go to "SQL Editor"
2. Click "New query"
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click "Run" 
6. Repeat for `002_functions_and_procedures.sql`

### Option B: Using the Setup Script

1. Ensure your environment variables are set
2. Run the setup script:
   ```bash
   npm run db:setup
   ```

## Step 5: Seed the Database (Optional)

To add sample data for testing:

```bash
npm run db:seed
```

This will create:
- 2 test users (admin@example.com and user@example.com)
- Sample devices for each user
- Historical data for charts
- Sample alerts and rules

Test credentials:
- **Admin**: admin@example.com / Admin123!
- **User**: user@example.com / User123!

## Step 6: Enable Row Level Security (RLS)

RLS should be automatically enabled by the migrations, but verify:

1. Go to "Authentication" → "Policies" in Supabase dashboard
2. Ensure all tables have the shield icon (RLS enabled)
3. Check that policies are created for each table

## Step 7: Configure Authentication

1. Go to "Authentication" → "Providers" in Supabase
2. Ensure "Email" is enabled
3. Configure email templates if desired:
   - Go to "Authentication" → "Email Templates"
   - Customize the confirmation, reset password, and other emails

4. (Optional) Enable OAuth providers:
   - Click on providers like Google, GitHub, etc.
   - Add your OAuth app credentials
   - Update redirect URLs

## Step 8: Set Up Realtime (Optional)

For real-time updates:

1. Go to "Database" → "Replication" in Supabase
2. Enable replication for tables:
   - `devices`
   - `device_status`
   - `alerts`

## Step 9: Test the Connection

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:3000
3. Try signing up with a new account
4. If successful, you're connected!

## Troubleshooting

### Connection Refused
- Check that your Supabase project is active
- Verify your environment variables are correct
- Ensure no typos in the URLs or keys

### Authentication Errors
- Verify Email provider is enabled in Supabase
- Check that RLS policies are properly set
- Look at Supabase logs for detailed errors

### Migration Failures
- Run migrations one at a time in SQL editor
- Check for any syntax errors
- Ensure you're using the service role key for migrations

### Performance Issues
- Enable connection pooling in Supabase settings
- Consider upgrading to a paid plan for production
- Use proper indexes (already included in migrations)

## Production Considerations

1. **Security**:
   - Never expose your service role key
   - Use environment variables in production
   - Enable 2FA on your Supabase account

2. **Backups**:
   - Enable Point-in-Time Recovery (paid feature)
   - Set up regular backups
   - Test restore procedures

3. **Monitoring**:
   - Set up alerts in Supabase dashboard
   - Monitor database size and performance
   - Watch for rate limiting

4. **Scaling**:
   - Consider connection pooling
   - Implement caching strategies
   - Use read replicas if needed

## Next Steps

1. Complete the authentication setup (Phase 2, Day 4)
2. Build the UI components
3. Implement device discovery
4. Set up monitoring and alerts

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)