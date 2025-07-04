import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function testDatabase() {
  console.log('Testing Supabase connection...\n');

  try {
    // Test 1: List all tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.log('Error listing tables:', tablesError);
    } else {
      console.log('Tables in public schema:');
      tables?.forEach(t => console.log(`  - ${t.table_name}`));
    }

    // Test 2: Try to query specific tables
    console.log('\nTesting specific tables:');
    
    const tablesToTest = ['users', 'devices', 'device_status', 'power_readings', 'alerts'];
    
    for (const tableName of tablesToTest) {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${tableName}: ${error.message}`);
      } else {
        console.log(`✅ ${tableName}: exists (${count || 0} rows)`);
      }
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testDatabase();