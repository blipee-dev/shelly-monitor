import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testLogin() {
  console.log('🔐 Testing login with existing users\n');

  // Try to login with existing users
  const existingUsers = [
    { email: 'user@example.com', password: 'User123!' },
    { email: 'admin@example.com', password: 'Admin123!' },
  ];

  for (const user of existingUsers) {
    console.log(`Attempting to sign in as: ${user.email}`);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    });

    if (error) {
      console.error(`❌ Failed to sign in:`, error.message);
    } else {
      console.log(`✅ Successfully signed in!`);
      console.log(`   User ID: ${data.user?.id}`);
      console.log(`   Session: ${data.session ? 'Created' : 'Not created'}`);
      
      // Sign out
      await supabase.auth.signOut();
    }
    console.log('');
  }
}

testLogin();