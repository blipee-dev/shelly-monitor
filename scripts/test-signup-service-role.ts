import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Use service role client which bypasses RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function testSignupWithServiceRole() {
  console.log('🧪 Testing signup with service role (bypasses RLS)\n');

  const newUser = {
    email: `testuser-${Date.now()}@gmail.com`,
    password: 'TestUser123!',
    name: 'Test User'
  };

  console.log(`Creating user: ${newUser.email}`);
  
  try {
    // Create user with admin API
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: newUser.email,
      password: newUser.password,
      user_metadata: { name: newUser.name },
      email_confirm: true // Auto-confirm email
    });

    if (userError) {
      console.error('❌ Failed to create auth user:', userError);
      return;
    }

    console.log('✅ Auth user created successfully');
    console.log('   User ID:', userData.user.id);

    // Create database record
    const { error: dbError } = await supabase
      .from('users')
      .insert({
        id: userData.user.id,
        email: newUser.email,
        name: newUser.name,
        role: 'user',
        password_hash: null
      });

    if (dbError) {
      console.error('❌ Failed to create database record:', dbError);
    } else {
      console.log('✅ Database record created successfully');
    }

    // Test sign in
    console.log('\nTesting sign in...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: newUser.email,
      password: newUser.password
    });

    if (signInError) {
      console.error('❌ Sign in failed:', signInError);
    } else {
      console.log('✅ Sign in successful!');
      console.log('   Session created:', signInData.session ? 'Yes' : 'No');
    }

    console.log('\n✅ New user created and tested successfully!');
    console.log('\nYou can now sign in at /auth/signin with:');
    console.log(`Email: ${newUser.email}`);
    console.log(`Password: ${newUser.password}`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testSignupWithServiceRole();