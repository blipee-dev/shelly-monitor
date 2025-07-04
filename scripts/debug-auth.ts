import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function debugAuth() {
  console.log('🔍 Debugging Authentication Issues\n');

  // Check if we can query the users table
  console.log('1. Checking users table access...');
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, email, role')
    .limit(5);
  
  if (usersError) {
    console.error('❌ Cannot access users table:', usersError);
  } else {
    console.log('✅ Users table accessible');
    console.log('   Current users:', users?.length || 0);
  }

  // Check auth.users
  console.log('\n2. Checking auth.users...');
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.error('❌ Cannot list auth users:', authError);
  } else {
    console.log('✅ Auth users:', authUsers.users.length);
    authUsers.users.forEach(user => {
      console.log(`   - ${user.email} (${user.id})`);
    });
  }

  // Try to create a test user with minimal data
  console.log('\n3. Attempting to create test user...');
  const testEmail = `debug-${Date.now()}@test.com`;
  
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'Test123!',
      email_confirm: true
    });

    if (error) {
      console.error('❌ Create user failed:', error);
      console.error('   Full error:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ User created in auth.users');
      console.log('   User ID:', data.user?.id);
      
      // Check if user was created in public.users
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user!.id)
        .single();
      
      if (dbError) {
        console.error('❌ User not found in public.users:', dbError);
        console.log('\n⚠️  The trigger might not be working properly');
      } else {
        console.log('✅ User found in public.users');
        console.log('   Database user:', dbUser);
      }
      
      // Clean up
      await supabase.auth.admin.deleteUser(data.user!.id);
      console.log('🧹 Test user cleaned up');
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }

  // Check if password_hash is nullable
  console.log('\n4. Checking password_hash column...');
  const { data: columns, error: columnsError } = await supabase
    .rpc('get_column_info', {
      table_name: 'users',
      column_name: 'password_hash'
    })
    .single();
  
  if (columnsError) {
    // Try a different approach
    const { data: schemaData, error: schemaError } = await supabase
      .from('users')
      .select('*')
      .limit(0);
    
    console.log('Schema check:', schemaError ? '❌ Failed' : '✅ Success');
  }
}

// Create the RPC function if it doesn't exist
async function createHelperFunction() {
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE OR REPLACE FUNCTION get_column_info(table_name text, column_name text)
      RETURNS TABLE(is_nullable text)
      LANGUAGE sql
      AS $$
        SELECT is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' 
        AND table_name = table_name
        AND column_name = column_name;
      $$;
    `
  }).single();
  
  if (error) {
    console.log('Note: Cannot create helper function (this is normal)');
  }
}

// Run debugging
createHelperFunction().then(() => debugAuth());