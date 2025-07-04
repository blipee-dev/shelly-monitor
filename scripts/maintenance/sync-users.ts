import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function syncUsers() {
  console.log('🔄 Syncing auth users to database...\n');

  try {
    // Get all auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Failed to get auth users:', authError);
      return;
    }

    console.log(`Found ${authUsers.users.length} users in auth system`);

    // Sync each user to the users table
    for (const authUser of authUsers.users) {
      console.log(`\nSyncing user: ${authUser.email}`);
      
      // Check if user exists in users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', authUser.id)
        .single();

      if (!existingUser) {
        // Create user in users table
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email!,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0],
            role: authUser.email === 'admin@example.com' ? 'admin' : 'user',
            preferences: {}
          });

        if (insertError) {
          console.error(`❌ Failed to sync ${authUser.email}:`, insertError.message);
        } else {
          console.log(`✅ Created user record for ${authUser.email}`);
        }
      } else {
        console.log(`✅ User ${authUser.email} already exists in database`);
      }
    }

    console.log('\n✅ User sync completed!');
    console.log('\nNow you can run the seed script to add devices and data.');

  } catch (error) {
    console.error('❌ Sync failed:', error);
  }
}

// Run the sync
syncUsers();