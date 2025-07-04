import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function createTestUsers() {
  console.log('👤 Creating test users (v2 - with manual user record creation)\n');

  const testUsers = [
    {
      email: 'demo@example.com',
      password: 'Demo123!',
      name: 'Demo User',
      role: 'user'
    },
    {
      email: 'test@example.com', 
      password: 'Test123!',
      name: 'Test User',
      role: 'user'
    },
  ];

  for (const testUser of testUsers) {
    console.log(`Creating user: ${testUser.email}`);
    
    try {
      // First check if user already exists in auth
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users.find(u => u.email === testUser.email);
      
      if (existingUser) {
        console.log(`⚠️  User ${testUser.email} already exists in auth`);
        
        // Check if they have a database record
        const { data: dbUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', existingUser.id)
          .single();
        
        if (!dbUser) {
          // Create database record
          const { error: dbError } = await supabase
            .from('users')
            .insert({
              id: existingUser.id,
              email: testUser.email,
              name: testUser.name,
              role: testUser.role,
              password_hash: null, // Explicitly set to null
            });
          
          if (dbError) {
            console.error(`❌ Failed to create database record:`, dbError);
          } else {
            console.log(`✅ Created database record for existing auth user`);
          }
        }
        continue;
      }
      
      // Create new auth user without trigger
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testUser.email,
        password: testUser.password,
        options: {
          data: {
            name: testUser.name,
            role: testUser.role
          }
        }
      });

      if (authError) {
        console.error(`❌ Failed to create ${testUser.email}:`, authError.message);
        continue;
      }

      if (authData.user) {
        // Manually create database user record
        const { error: dbError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: testUser.email,
            name: testUser.name,
            role: testUser.role,
            password_hash: null, // Explicitly set to null
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (dbError) {
          console.error(`❌ Failed to create database record:`, dbError);
          // Try to clean up auth user
          await supabase.auth.admin.deleteUser(authData.user.id);
        } else {
          console.log(`✅ Successfully created ${testUser.email}`);
        }
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