import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create test users
    console.log('Creating test users...');
    const users = [];
    
    // Create admin user
    const { data: adminAuth, error: adminAuthError } = await supabase.auth.admin.createUser({
      email: 'admin@example.com',
      password: 'Admin123!',
      email_confirm: true,
      user_metadata: {
        name: 'Admin User'
      }
    });

    if (adminAuthError) {
      console.error('Error creating admin user:', adminAuthError);
    } else {
      users.push(adminAuth.user);
      
      // Set admin role
      await supabase.from('user_roles').insert({
        user_id: adminAuth.user.id,
        role: 'admin'
      });
    }

    // Create regular user
    const { data: userAuth, error: userAuthError } = await supabase.auth.admin.createUser({
      email: 'user@example.com',
      password: 'User123!',
      email_confirm: true,
      user_metadata: {
        name: 'Test User'
      }
    });

    if (userAuthError) {
      console.error('Error creating test user:', userAuthError);
    } else {
      users.push(userAuth.user);
    }

    console.log(`Created ${users.length} users`);

    // Create devices for each user
    console.log('Creating devices...');
    const devices = [];
    
    for (const user of users) {
      if (!user) continue;

      // Create Plus 2PM devices
      for (let i = 0; i < 2; i++) {
        const device = {
          user_id: user.id,
          name: faker.helpers.arrayElement(['Living Room', 'Kitchen', 'Bedroom', 'Office']) + ' Switch',
          type: 'plus_2pm' as const,
          ip_address: faker.internet.ipv4(),
          mac_address: faker.internet.mac(),
          firmware_version: '1.2.3',
          auth_enabled: false,
          auth_username: null,
          auth_password_encrypted: null,
          settings: {
            location: faker.helpers.arrayElement(['First Floor', 'Second Floor', 'Basement']),
            installed_date: faker.date.past().toISOString()
          }
        };

        const { data, error } = await supabase
          .from('devices')
          .insert(device)
          .select()
          .single();

        if (error) {
          console.error('Error creating device:', error);
        } else {
          devices.push(data);
          
          // Create device status
          await supabase.from('device_status').insert({
            device_id: data.id,
            online: true,
            data: {
              switch: [
                {
                  id: 0,
                  output: faker.datatype.boolean(),
                  apower: faker.number.float({ min: 0, max: 200, fractionDigits: 0.1 }),
                  voltage: faker.number.float({ min: 220, max: 240, fractionDigits: 0.1 }),
                  current: faker.number.float({ min: 0, max: 1, fractionDigits: 0.01 }),
                  energy: faker.number.float({ min: 0, max: 100, fractionDigits: 0.01 }),
                  temperature: faker.number.float({ min: 20, max: 35, fractionDigits: 0.1 })
                },
                {
                  id: 1,
                  output: faker.datatype.boolean(),
                  apower: faker.number.float({ min: 0, max: 150, fractionDigits: 0.1 }),
                  voltage: faker.number.float({ min: 220, max: 240, fractionDigits: 0.1 }),
                  current: faker.number.float({ min: 0, max: 0.8, fractionDigits: 0.01 }),
                  energy: faker.number.float({ min: 0, max: 80, fractionDigits: 0.01 }),
                  temperature: faker.number.float({ min: 20, max: 35, fractionDigits: 0.1 })
                }
              ]
            }
          });

          // Create historical power readings
          const readings = [];
          const now = new Date();
          for (let days = 0; days < 7; days++) {
            for (let hours = 0; hours < 24; hours += 4) {
              const timestamp = new Date(now);
              timestamp.setDate(timestamp.getDate() - days);
              timestamp.setHours(hours, 0, 0, 0);

              for (let channel = 0; channel < 2; channel++) {
                readings.push({
                  device_id: data.id,
                  channel,
                  timestamp: timestamp.toISOString(),
                  power: faker.number.float({ min: 0, max: 200, fractionDigits: 0.1 }),
                  voltage: faker.number.float({ min: 220, max: 240, fractionDigits: 0.1 }),
                  current: faker.number.float({ min: 0, max: 1, fractionDigits: 0.01 }),
                  energy: faker.number.float({ min: 0, max: 10, fractionDigits: 0.01 }),
                  power_factor: faker.number.float({ min: 0.8, max: 1, fractionDigits: 0.01 }),
                  temperature: faker.number.float({ min: 20, max: 35, fractionDigits: 0.1 })
                });
              }
            }
          }
          
          if (readings.length > 0) {
            const { error: readingsError } = await supabase
              .from('power_readings')
              .insert(readings);
            
            if (readingsError) {
              console.error('Error creating power readings:', readingsError);
            }
          }
        }
      }

      // Create Motion 2 devices
      for (let i = 0; i < 1; i++) {
        const device = {
          user_id: user.id,
          name: faker.helpers.arrayElement(['Hallway', 'Garage', 'Entrance', 'Backyard']) + ' Motion',
          type: 'motion_2' as const,
          ip_address: faker.internet.ipv4(),
          mac_address: faker.internet.mac(),
          firmware_version: '1.1.0',
          auth_enabled: false,
          auth_username: null,
          auth_password_encrypted: null,
          settings: {
            sensitivity: faker.helpers.arrayElement(['low', 'medium', 'high']),
            installed_date: faker.date.past().toISOString()
          }
        };

        const { data, error } = await supabase
          .from('devices')
          .insert(device)
          .select()
          .single();

        if (error) {
          console.error('Error creating motion device:', error);
        } else {
          devices.push(data);
          
          // Create device status
          await supabase.from('device_status').insert({
            device_id: data.id,
            online: true,
            data: {
              sensor: {
                motion: faker.datatype.boolean({ probability: 0.2 }),
                lux: faker.number.int({ min: 0, max: 500 }),
                temperature: faker.number.float({ min: 15, max: 30, fractionDigits: 0.1 }),
                battery: {
                  percent: faker.number.int({ min: 20, max: 100 }),
                  voltage: faker.number.float({ min: 2.8, max: 3.7, fractionDigits: 0.1 })
                },
                vibration: faker.datatype.boolean({ probability: 0.1 })
              }
            }
          });

          // Create motion events
          const events = [];
          const now = new Date();
          for (let days = 0; days < 7; days++) {
            const eventsPerDay = faker.number.int({ min: 5, max: 20 });
            for (let i = 0; i < eventsPerDay; i++) {
              const timestamp = new Date(now);
              timestamp.setDate(timestamp.getDate() - days);
              timestamp.setHours(
                faker.number.int({ min: 0, max: 23 }),
                faker.number.int({ min: 0, max: 59 }),
                0,
                0
              );

              events.push({
                device_id: data.id,
                timestamp: timestamp.toISOString(),
                motion_detected: true,
                lux: faker.number.int({ min: 0, max: 500 }),
                temperature: faker.number.float({ min: 15, max: 30, fractionDigits: 0.1 }),
                battery_percent: faker.number.int({ min: 20, max: 100 }),
                vibration_detected: faker.datatype.boolean({ probability: 0.1 })
              });
            }
          }
          
          if (events.length > 0) {
            const { error: eventsError } = await supabase
              .from('motion_events')
              .insert(events);
            
            if (eventsError) {
              console.error('Error creating motion events:', eventsError);
            }
          }
        }
      }
    }

    console.log(`Created ${devices.length} devices`);

    // Create sample alerts
    console.log('Creating sample alerts...');
    const alerts = [];
    
    for (const user of users) {
      if (!user) continue;

      const userDevices = devices.filter(d => d.user_id === user.id);
      
      // Only create alerts if user has devices
      if (userDevices.length === 0) continue;
      
      for (let i = 0; i < 5; i++) {
        const device = faker.helpers.arrayElement(userDevices);
        const alert = {
          user_id: user.id,
          device_id: device?.id || null,
          type: faker.helpers.arrayElement(['power_threshold', 'device_offline', 'motion_detected', 'temperature_high']),
          severity: faker.helpers.arrayElement(['info', 'warning', 'critical'] as const),
          title: faker.helpers.arrayElement(['High Power Usage', 'Device Offline', 'Motion Detected', 'Temperature Alert']),
          message: faker.lorem.sentence(),
          is_read: faker.datatype.boolean({ probability: 0.7 }),
          is_resolved: faker.datatype.boolean({ probability: 0.5 }),
          created_at: faker.date.recent({ days: 7 }).toISOString()
        };

        alerts.push(alert);
      }
    }

    if (alerts.length > 0) {
      const { error: alertsError } = await supabase
        .from('alerts')
        .insert(alerts);
      
      if (alertsError) {
        console.error('Error creating alerts:', alertsError);
      } else {
        console.log(`Created ${alerts.length} alerts`);
      }
    }

    // Create alert rules
    console.log('Creating alert rules...');
    const rules = [];
    
    for (const user of users) {
      if (!user) continue;

      rules.push({
        user_id: user.id,
        name: 'High Power Alert',
        type: 'power_threshold',
        condition: {
          threshold: 150,
          duration: 300,
          operator: 'greater_than'
        },
        actions: {
          email: true,
          push: true,
          webhook: null
        },
        is_active: true
      });

      rules.push({
        user_id: user.id,
        name: 'Device Offline Alert',
        type: 'device_offline',
        condition: {
          duration: 600
        },
        actions: {
          email: true,
          push: false,
          webhook: null
        },
        is_active: true
      });
    }

    if (rules.length > 0) {
      const { error: rulesError } = await supabase
        .from('alert_rules')
        .insert(rules);
      
      if (rulesError) {
        console.error('Error creating alert rules:', rulesError);
      } else {
        console.log(`Created ${rules.length} alert rules`);
      }
    }

    // Create user settings
    console.log('Creating user settings...');
    for (const user of users) {
      if (!user) continue;

      const { error: settingsError } = await supabase
        .from('user_settings')
        .insert({
          user_id: user.id,
          theme: faker.helpers.arrayElement(['light', 'dark', 'system'] as const),
          language: faker.helpers.arrayElement(['en', 'es']),
          timezone: 'America/New_York',
          notifications_email: true,
          notifications_push: faker.datatype.boolean(),
          notifications_sms: false,
          temperature_unit: faker.helpers.arrayElement(['celsius', 'fahrenheit'] as const)
        });
      
      if (settingsError) {
        console.error('Error creating user settings:', settingsError);
      }
    }

    console.log('✅ Database seeding completed!');
    console.log('\nTest accounts:');
    console.log('  Admin: admin@example.com / Admin123!');
    console.log('  User:  user@example.com / User123!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();