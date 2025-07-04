import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function runCompleteTest() {
  console.log('🧪 Running Complete System Test\n');
  console.log('================================\n');

  let allTestsPassed = true;

  // Test 1: Database Connection
  console.log('1️⃣ Testing Database Connection...');
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    console.log('✅ Database connection successful\n');
  } catch (error: any) {
    console.log('❌ Database connection failed:', error.message, '\n');
    allTestsPassed = false;
  }

  // Test 2: Check Tables
  console.log('2️⃣ Checking Database Tables...');
  const tables = ['users', 'devices', 'device_status', 'power_readings', 'motion_events', 'alerts'];
  for (const table of tables) {
    try {
      const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      if (error) throw error;
      console.log(`✅ ${table}: ${count || 0} rows`);
    } catch (error: any) {
      console.log(`❌ ${table}: ${error.message}`);
      allTestsPassed = false;
    }
  }
  console.log();

  // Test 3: Auth Users
  console.log('3️⃣ Checking Auth Users...');
  try {
    const { data: authUsers, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;
    console.log(`✅ Found ${authUsers.users.length} auth users:`);
    authUsers.users.forEach(user => {
      console.log(`   - ${user.email} (${user.id})`);
    });
  } catch (error: any) {
    console.log('❌ Failed to list auth users:', error.message);
    allTestsPassed = false;
  }
  console.log();

  // Test 4: Check Users Table Sync
  console.log('4️⃣ Checking Users Table Sync...');
  try {
    const { data: dbUsers, error } = await supabase.from('users').select('id, email, name, role');
    if (error) throw error;
    if (dbUsers && dbUsers.length > 0) {
      console.log(`✅ Found ${dbUsers.length} users in database:`);
      dbUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.role})`);
      });
    } else {
      console.log('⚠️  No users in database table - run the complete-setup.sql script');
      allTestsPassed = false;
    }
  } catch (error: any) {
    console.log('❌ Failed to query users table:', error.message);
    allTestsPassed = false;
  }
  console.log();

  // Test 5: Check Sample Data
  console.log('5️⃣ Checking Sample Data...');
  try {
    const { data: devices, error: devError } = await supabase
      .from('devices')
      .select('*, device_status(online, data)')
      .limit(5);
    
    if (devError) throw devError;
    
    if (devices && devices.length > 0) {
      console.log(`✅ Found ${devices.length} devices:`);
      devices.forEach(device => {
        console.log(`   - ${device.name} (${device.type}) - ${device.device_status?.online ? 'Online' : 'Offline'}`);
      });
    } else {
      console.log('⚠️  No devices found - run the complete-setup.sql script');
    }
  } catch (error: any) {
    console.log('❌ Failed to query devices:', error.message);
  }
  console.log();

  // Test 6: Test API Routes
  console.log('6️⃣ Testing API Routes...');
  try {
    // We'll test this when the server is running
    console.log('⚠️  API routes can only be tested when the server is running (npm run dev)');
  } catch (error: any) {
    console.log('❌ API test failed:', error.message);
  }
  console.log();

  // Summary
  console.log('================================\n');
  if (allTestsPassed) {
    console.log('✅ All tests passed! The system is ready.');
    console.log('\nNext steps:');
    console.log('1. Run "npm run dev" to start the development server');
    console.log('2. Visit http://localhost:3000');
    console.log('3. Sign in with one of the test accounts');
  } else {
    console.log('❌ Some tests failed. Please check the issues above.');
    console.log('\nTroubleshooting:');
    console.log('1. Make sure you ran the migration scripts in Supabase');
    console.log('2. Run the complete-setup.sql script in SQL Editor');
    console.log('3. Check your environment variables are correct');
  }
}

// Run the test
runCompleteTest();