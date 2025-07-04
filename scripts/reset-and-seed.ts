import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function resetAndSeed() {
  console.log('🔄 Resetting database...');

  try {
    // Get existing users
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    
    // Delete test users
    if (authUsers?.users) {
      for (const user of authUsers.users) {
        if (user.email === 'admin@example.com' || user.email === 'user@example.com') {
          console.log(`Deleting user: ${user.email}`);
          await supabase.auth.admin.deleteUser(user.id);
        }
      }
    }

    // Clean up any orphaned data
    await supabase.from('alerts').delete().gte('created_at', '1900-01-01');
    await supabase.from('alert_history').delete().gte('created_at', '1900-01-01');
    await supabase.from('motion_events').delete().gte('created_at', '1900-01-01');
    await supabase.from('power_readings').delete().gte('created_at', '1900-01-01');
    await supabase.from('device_status').delete().gte('created_at', '1900-01-01');
    await supabase.from('devices').delete().gte('created_at', '1900-01-01');
    await supabase.from('user_preferences').delete().gte('created_at', '1900-01-01');

    console.log('✅ Database reset complete');
    console.log('\n🌱 Running seed script...\n');

    // Import and run the seed script
    await import('./seed-data');
    
  } catch (error) {
    console.error('❌ Reset failed:', error);
  }
}

// Run the reset
resetAndSeed();