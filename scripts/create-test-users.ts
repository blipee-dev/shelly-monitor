import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function createTestUsers() {
  console.log('👤 Creating test users for authentication testing\n');

  const testUsers = [
    {
      email: 'demo@shellymonitor.com',
      password: 'Demo123!',
      name: 'Demo User',
      role: 'user'
    },
    {
      email: 'test@shellymonitor.com', 
      password: 'Test123!',
      name: 'Test User',
      role: 'user'
    },
  ];

  for (const testUser of testUsers) {
    console.log(`Creating user: ${testUser.email}`);
    
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        user_metadata: { name: testUser.name },
        email_confirm: true,
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`⚠️  User ${testUser.email} already exists`);
          continue;
        }
        console.error(`❌ Failed to create ${testUser.email}:`, authError.message);
        continue;
      }

      // Create database user record
      const { error: dbError } = await supabase
        .from('users')
        .insert({
          id: authData.user!.id,
          email: testUser.email,
          name: testUser.name,
          role: testUser.role,
        });

      if (dbError) {
        console.error(`❌ Failed to create database record:`, dbError.message);
      } else {
        console.log(`✅ Successfully created ${testUser.email}`);
      }
      
    } catch (error) {
      console.error(`❌ Error creating ${testUser.email}:`, error);
    }
  }

  console.log('\n✅ Test user creation complete!');
  console.log('\nYou can now sign in with:');
  console.log('Email: demo@shellymonitor.com');
  console.log('Password: Demo123!');
  console.log('\nOr:');
  console.log('Email: test@shellymonitor.com');
  console.log('Password: Test123!');
}

createTestUsers();