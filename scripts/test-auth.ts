import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function testAuthFlows() {
  console.log('🔐 Testing Authentication Flows\n');

  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  const testName = 'Test User';

  try {
    // Test 1: Sign Up
    console.log('1. Testing Sign Up...');
    const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      user_metadata: { name: testName },
      email_confirm: true,
    });

    if (signUpError) {
      console.error('❌ Sign Up failed:', signUpError.message);
      return;
    }
    console.log('✅ Sign Up successful:', signUpData.user?.email);

    // Test 2: Sign In
    console.log('\n2. Testing Sign In...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (signInError) {
      console.error('❌ Sign In failed:', signInError.message);
      return;
    }
    console.log('✅ Sign In successful');
    console.log('   Session:', signInData.session ? 'Created' : 'Not created');
    console.log('   User ID:', signInData.user?.id);

    // Test 3: Get User
    console.log('\n3. Testing Get User...');
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(
      signInData.session?.access_token
    );

    if (getUserError) {
      console.error('❌ Get User failed:', getUserError.message);
    } else {
      console.log('✅ Get User successful');
      console.log('   Email:', user?.email);
      console.log('   Name:', user?.user_metadata?.name);
    }

    // Test 4: Password Reset
    console.log('\n4. Testing Password Reset Request...');
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(testEmail, {
      redirectTo: 'http://localhost:3000/auth/reset-password',
    });

    if (resetError) {
      console.error('❌ Password Reset failed:', resetError.message);
    } else {
      console.log('✅ Password Reset email sent');
    }

    // Test 5: Sign Out
    console.log('\n5. Testing Sign Out...');
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error('❌ Sign Out failed:', signOutError.message);
    } else {
      console.log('✅ Sign Out successful');
    }

    // Clean up - Delete test user
    console.log('\n6. Cleaning up test user...');
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      signUpData.user!.id
    );

    if (deleteError) {
      console.error('❌ Cleanup failed:', deleteError.message);
    } else {
      console.log('✅ Test user deleted');
    }

    console.log('\n✅ All auth flow tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Test database connection first
async function testConnection() {
  console.log('🔌 Testing Supabase connection...');
  
  const { data, error } = await supabase.from('users').select('count').limit(1);
  
  if (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
  
  console.log('✅ Database connection successful\n');
  return true;
}

// Run tests
testConnection().then(success => {
  if (success) {
    testAuthFlows();
  }
});