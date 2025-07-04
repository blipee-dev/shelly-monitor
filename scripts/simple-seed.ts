import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function simpleSeed() {
  console.log('🌱 Simple Database Seeding...\n');

  try {
    // Check existing users
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    console.log(`Found ${authUsers?.users.length || 0} users in auth system`);

    if (!authUsers?.users.length) {
      console.log('No users found. Please sign up through the app first.');
      return;
    }

    // Use the first user for seeding
    const user = authUsers.users[0];
    console.log(`Using user: ${user.email} (${user.id})`);

    // Create sample devices
    const devices = [
      {
        user_id: user.id,
        name: 'Living Room Switch',
        type: 'plus_2pm',
        ip_address: '192.168.1.100',
        mac_address: '00:11:22:33:44:55',
        firmware_version: '1.2.3',
        auth_enabled: false,
        settings: { location: 'First Floor' }
      },
      {
        user_id: user.id,
        name: 'Kitchen Light',
        type: 'plus_2pm',
        ip_address: '192.168.1.101',
        mac_address: '00:11:22:33:44:56',
        firmware_version: '1.2.3',
        auth_enabled: false,
        settings: { location: 'First Floor' }
      },
      {
        user_id: user.id,
        name: 'Hallway Motion Sensor',
        type: 'motion_2',
        ip_address: '192.168.1.102',
        mac_address: '00:11:22:33:44:57',
        firmware_version: '1.1.0',
        auth_enabled: false,
        settings: { sensitivity: 'medium' }
      }
    ];

    console.log('\nCreating devices...');
    for (const device of devices) {
      const { data, error } = await supabase
        .from('devices')
        .insert(device)
        .select()
        .single();

      if (error) {
        console.error(`❌ Failed to create ${device.name}:`, error.message);
      } else {
        console.log(`✅ Created ${device.name}`);
        
        // Create device status
        const statusData = device.type === 'plus_2pm' ? {
          switch: [
            { id: 0, output: true, apower: 75.5, voltage: 230, current: 0.33 },
            { id: 1, output: false, apower: 0, voltage: 230, current: 0 }
          ]
        } : {
          sensor: {
            motion: false,
            light_level: 150,
            temperature: 22.5,
            battery_percent: 85,
            vibration: false
          }
        };

        await supabase.from('device_status').insert({
          device_id: data.id,
          online: true,
          data: statusData
        });
      }
    }

    // Create a few sample alerts
    console.log('\nCreating sample alerts...');
    const alerts = [
      {
        device_id: null,
        user_id: user.id,
        type: 'offline',
        condition: { duration: 600 },
        actions: ['email'],
        enabled: true
      },
      {
        device_id: null,
        user_id: user.id,
        type: 'power_threshold',
        condition: { threshold: 150, operator: '>' },
        actions: ['email', 'push'],
        enabled: true
      }
    ];

    for (const alert of alerts) {
      const { error } = await supabase.from('alerts').insert(alert);
      if (error) {
        console.error('❌ Failed to create alert:', error.message);
      } else {
        console.log('✅ Created alert rule');
      }
    }

    console.log('\n✅ Seeding completed!');
    console.log(`\nYou can now log in with: ${user.email}`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

// Run the seed
simpleSeed();