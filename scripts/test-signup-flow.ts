import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testSignupFlow() {
  console.log('🧪 Testing complete signup flow\n');

  const newUser = {
    email: `newuser-${Date.now()}@gmail.com`,
    password: 'NewUser123!',
    name: 'New Test User'
  };

  console.log(`1. Attempting to sign up new user: ${newUser.email}`);
  
  try {
    // Sign up like the app would
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: newUser.email,
      password: newUser.password,
      options: {
        data: {
          name: newUser.name
        }
      }
    });

    if (signUpError) {
      console.error('❌ Sign up failed:', signUpError.message);
      return;
    }

    console.log('✅ Sign up successful!');
    console.log('   User ID:', signUpData.user?.id);
    console.log('   Email confirmed:', signUpData.user?.email_verified_at ? 'Yes' : 'No');

    if (signUpData.user) {
      // Check if user record needs to be created manually
      console.log('\n2. Checking database record...');
      const { data: dbUser, error: dbCheckError } = await supabase
        .from('users')
        .select('*')
        .eq('id', signUpData.user.id)
        .single();

      if (dbCheckError && dbCheckError.code === 'PGRST116') {
        console.log('⚠️  No database record found, creating one...');
        
        // Create user record manually
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: signUpData.user.id,
            email: newUser.email,
            name: newUser.name,
            role: 'user',
            password_hash: null
          });

        if (insertError) {
          console.error('❌ Failed to create database record:', insertError);
        } else {
          console.log('✅ Database record created successfully');
        }
      } else if (dbUser) {
        console.log('✅ Database record already exists');
      }

      // Test sign in
      console.log('\n3. Testing sign in with new user...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: newUser.email,
        password: newUser.password
      });

      if (signInError) {
        console.error('❌ Sign in failed:', signInError.message);
      } else {
        console.log('✅ Sign in successful!');
        console.log('   Session created:', signInData.session ? 'Yes' : 'No');
        
        // Sign out
        await supabase.auth.signOut();
        console.log('✅ Sign out successful');
      }

      // Clean up - using service role client
      console.log('\n4. Cleaning up test user...');
      const adminSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
      );
      
      const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(
        signUpData.user.id
      );
      
      if (deleteError) {
        console.error('⚠️  Could not delete test user:', deleteError.message);
      } else {
        console.log('✅ Test user cleaned up');
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }

  console.log('\n✅ Signup flow test complete!');
}

testSignupFlow();