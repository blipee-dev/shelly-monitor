import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: '.env.local' });

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_KEY',
  'METRICS_AUTH_TOKEN'
];

const optionalEnvVars = [
  'REDIS_URL',
  'EMAIL_FROM',
  'RESEND_API_KEY',
  'OPENWEATHER_API_KEY',
  'SLACK_WEBHOOK_URL'
];

async function checkEnvironment() {
  console.log('🔍 Shelly Monitor Environment Check');
  console.log('===================================\n');

  let hasErrors = false;

  // Check required environment variables
  console.log('Required Environment Variables:');
  for (const varName of requiredEnvVars) {
    const value = process.env[varName];
    if (!value) {
      console.log(`❌ ${varName}: Missing`);
      hasErrors = true;
    } else {
      const maskedValue = varName.includes('KEY') || varName.includes('TOKEN')
        ? value.substring(0, 8) + '...'
        : value;
      console.log(`✅ ${varName}: ${maskedValue}`);
    }
  }

  // Check optional environment variables
  console.log('\nOptional Environment Variables:');
  for (const varName of optionalEnvVars) {
    const value = process.env[varName];
    if (!value) {
      console.log(`⚠️  ${varName}: Not set (optional)`);
    } else {
      const maskedValue = varName.includes('KEY') || varName.includes('TOKEN') || varName.includes('WEBHOOK')
        ? value.substring(0, 8) + '...'
        : value;
      console.log(`✅ ${varName}: ${maskedValue}`);
    }
  }

  if (hasErrors) {
    console.log('\n❌ Missing required environment variables!');
    console.log('Please copy .env.local.example to .env.local and fill in the values.');
    process.exit(1);
  }

  // Test Supabase connection
  console.log('\n🔗 Testing Supabase Connection...');
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    // Try to query a system table
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means table doesn't exist, which might be OK if migrations haven't run
      throw error;
    }

    console.log('✅ Supabase connection successful!');

    // Check if migrations have been run
    const { data: tables } = await supabase.rpc('get_tables');
    const expectedTables = ['users', 'devices', 'device_status', 'alerts'];
    
    console.log('\n📊 Database Tables:');
    let missingTables = false;
    for (const table of expectedTables) {
      if (tables?.some((t: any) => t.table_name === table)) {
        console.log(`✅ ${table}`);
      } else {
        console.log(`❌ ${table} (missing - run migrations)`);
        missingTables = true;
      }
    }

    if (missingTables) {
      console.log('\n⚠️  Some tables are missing. Run "npm run db:setup" to create them.');
    }

  } catch (error: any) {
    console.log('❌ Supabase connection failed!');
    console.log(`Error: ${error.message}`);
    console.log('\nPossible issues:');
    console.log('1. Invalid Supabase credentials');
    console.log('2. Supabase project not active');
    console.log('3. Network connectivity issues');
    hasErrors = true;
  }

  // Check Node.js version
  console.log('\n🟢 System Requirements:');
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
  if (majorVersion >= 18) {
    console.log(`✅ Node.js: ${nodeVersion}`);
  } else {
    console.log(`❌ Node.js: ${nodeVersion} (requires v18 or higher)`);
    hasErrors = true;
  }

  // Summary
  console.log('\n===================================');
  if (hasErrors) {
    console.log('❌ Environment check failed!');
    console.log('Please fix the issues above before proceeding.');
    process.exit(1);
  } else {
    console.log('✅ Environment check passed!');
    console.log('\nNext steps:');
    console.log('1. Run "npm run db:setup" if you haven\'t already');
    console.log('2. Run "npm run db:seed" to add sample data');
    console.log('3. Run "npm run dev" to start the development server');
  }
}

// Add helper RPC function for checking tables
const getTablesFunction = `
CREATE OR REPLACE FUNCTION get_tables()
RETURNS TABLE(table_name text) AS $$
BEGIN
  RETURN QUERY
  SELECT tablename::text
  FROM pg_tables
  WHERE schemaname = 'public';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

// Run the check
checkEnvironment();