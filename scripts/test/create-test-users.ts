import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Use service role to bypass email sending
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function createValidTestUsers() {
  console.log('🧪 Creating Test Users (No Emails Sent)\n');
  console.log('Using service role to bypass email confirmation.\n');

  const testUsers = [
    {
      email: 'test.admin@gmail.com',
      password: 'Admin123!',
      name: 'Test Admin',
      role: 'admin'
    },
    {
      email: 'test.user@gmail.com', 
      password: 'User123!',
      name: 'Test User',
      role: 'user'
    }
  ];

  console.log('⚠️  Note: These are fake Gmail addresses for testing only.');
  console.log('   They will not receive emails but can be used to test login.\n');

  for (const user of testUsers) {
    console.log(`Creating ${user.role}: ${user.email}`);
    
    try {
      // Create auth user with admin API (auto-confirms email)
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: { name: user.name }
      });

      if (authError) {
        console.error(`❌ Failed to create auth user: ${authError.message}`);
        continue;
      }

      // Create database record
      const { error: dbError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: user.email,
          name: user.name,
          role: user.role as 'admin' | 'user',
          password_hash: null
        });

      if (dbError) {
        console.error(`❌ Failed to create database record: ${dbError.message}`);
        // Try to clean up auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
      } else {
        console.log(`✅ ${user.role} created successfully`);
      }

    } catch (error) {
      console.error(`❌ Unexpected error: ${error}`);
    }
  }

  console.log('\n✅ Test users created!');
  console.log('\nYou can now sign in with:');
  console.log('Admin: test.admin@gmail.com / Admin123!');
  console.log('User: test.user@gmail.com / User123!');
  console.log('\n⚠️  Remember: These accounts cannot receive emails.');
}

// Clean up old example.com users
async function cleanupOldTestUsers() {
  console.log('\n🧹 Cleaning up old @example.com users...\n');
  
  try {
    // Get users with example.com
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Failed to list users:', listError);
      return;
    }

    const exampleUsers = users.users.filter(u => u.email?.endsWith('@example.com'));
    
    if (exampleUsers.length === 0) {
      console.log('No @example.com users found.');
      return;
    }

    console.log(`Found ${exampleUsers.length} @example.com users to remove.`);
    
    for (const user of exampleUsers) {
      console.log(`Removing: ${user.email}`);
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) {
        console.error(`Failed to delete ${user.email}:`, error.message);
      } else {
        console.log(`✅ Removed ${user.email}`);
      }
    }
    
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}

async function main() {
  await cleanupOldTestUsers();
  console.log('\n' + '='.repeat(50) + '\n');
  await createValidTestUsers();
}

main();