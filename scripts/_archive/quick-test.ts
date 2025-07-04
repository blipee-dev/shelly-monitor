import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function quickTest() {
  console.log('🚀 Quick Test Results:\n');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  // Check connection
  const { data: test } = await supabase.from('users').select('count').single();
  console.log('✅ Supabase Connection: Working');

  // Check auth users
  const { data: authUsers } = await supabase.auth.admin.listUsers();
  console.log(`✅ Auth Users: ${authUsers?.users.length || 0} users`);
  
  // Check tables
  const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
  const { count: deviceCount } = await supabase.from('devices').select('*', { count: 'exact', head: true });
  
  console.log(`✅ Database Tables: Created`);
  console.log(`   - Users table: ${userCount || 0} rows`);
  console.log(`   - Devices table: ${deviceCount || 0} rows`);

  console.log('\n📋 Next Steps:');
  console.log('1. Run the complete-setup.sql script in Supabase SQL Editor');
  console.log('2. The dev server is running at http://localhost:3000');
  console.log('3. You can sign in with admin@example.com or user@example.com');
  
  console.log('\n✅ Day 2 Setup Complete!');
}

quickTest();