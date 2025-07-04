import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function checkSchema() {
  // Get the schema of the devices table
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .limit(0);

  if (error) {
    console.log('Error:', error);
    return;
  }

  console.log('Devices table exists and is queryable');
  
  // Try inserting a minimal device
  const testDevice = {
    user_id: '00000000-0000-0000-0000-000000000000', // dummy UUID
    name: 'Test Device',
    type: 'plus_2pm',
    ip_address: '192.168.1.100',
    mac_address: '00:11:22:33:44:55',
  };

  console.log('\nTrying to insert test device:', testDevice);
  
  const { data: insertData, error: insertError } = await supabase
    .from('devices')
    .insert(testDevice)
    .select();

  if (insertError) {
    console.log('Insert error:', insertError);
  } else {
    console.log('Insert successful:', insertData);
    
    // Clean up
    if (insertData && insertData[0]) {
      await supabase.from('devices').delete().eq('id', insertData[0].id);
      console.log('Test device cleaned up');
    }
  }
}

checkSchema();