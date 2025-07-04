import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

// Test database helpers
export const testSupabase = createClient(
  process.env.TEST_SUPABASE_URL || 'http://localhost:54321',
  process.env.TEST_SUPABASE_ANON_KEY || 'test-anon-key'
);

// User factory
export function createMockUser(overrides: Partial<any> = {}) {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    created_at: faker.date.past(),
    ...overrides
  };
}

// Device factory
export function createMockDevice(overrides: Partial<any> = {}) {
  const deviceType = overrides.type || faker.helpers.arrayElement(['plus_2pm', 'motion_2']);
  
  return {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement(['Living Room', 'Kitchen', 'Bedroom', 'Office']) + ' ' + 
           faker.helpers.arrayElement(['Switch', 'Light', 'Sensor']),
    type: deviceType,
    ip_address: faker.internet.ipv4(),
    mac_address: faker.internet.mac(),
    firmware_version: faker.system.semver(),
    auth_enabled: faker.datatype.boolean(),
    last_seen: faker.date.recent(),
    online: faker.datatype.boolean({ probability: 0.8 }),
    created_at: faker.date.past(),
    ...overrides
  };
}

// Device status factory
export function createMockDeviceStatus(device: any) {
  if (device.type === 'plus_2pm') {
    return {
      device_id: device.id,
      online: device.online,
      data: {
        switch: [
          {
            id: 0,
            output: faker.datatype.boolean(),
            apower: faker.number.float({ min: 0, max: 300, fractionDigits: 0.1 }),
            voltage: faker.number.float({ min: 220, max: 240, fractionDigits: 0.1 }),
            current: faker.number.float({ min: 0, max: 2, fractionDigits: 0.01 }),
            energy: faker.number.float({ min: 0, max: 1000, fractionDigits: 0.1 }),
            temperature: faker.number.float({ min: 20, max: 40, fractionDigits: 0.1 })
          },
          {
            id: 1,
            output: faker.datatype.boolean(),
            apower: faker.number.float({ min: 0, max: 300, fractionDigits: 0.1 }),
            voltage: faker.number.float({ min: 220, max: 240, fractionDigits: 0.1 }),
            current: faker.number.float({ min: 0, max: 2, fractionDigits: 0.01 }),
            energy: faker.number.float({ min: 0, max: 1000, fractionDigits: 0.1 }),
            temperature: faker.number.float({ min: 20, max: 40, fractionDigits: 0.1 })
          }
        ]
      },
      updated_at: new Date()
    };
  } else if (device.type === 'motion_2') {
    return {
      device_id: device.id,
      online: device.online,
      data: {
        sensor: {
          motion: faker.datatype.boolean({ probability: 0.2 }),
          lux: faker.number.int({ min: 0, max: 1000 }),
          temperature: faker.number.float({ min: 15, max: 30, fractionDigits: 0.1 }),
          battery: {
            percent: faker.number.int({ min: 0, max: 100 }),
            voltage: faker.number.float({ min: 2.8, max: 3.7, fractionDigits: 0.1 })
          },
          vibration: faker.datatype.boolean({ probability: 0.1 })
        }
      },
      updated_at: new Date()
    };
  }
  
  return null;
}

// Alert factory
export function createMockAlert(overrides: Partial<any> = {}) {
  return {
    id: faker.string.uuid(),
    device_id: faker.string.uuid(),
    type: faker.helpers.arrayElement(['power_threshold', 'motion_detected', 'device_offline', 'temperature_high']),
    severity: faker.helpers.arrayElement(['info', 'warning', 'critical']),
    message: faker.lorem.sentence(),
    data: {},
    acknowledged: faker.datatype.boolean({ probability: 0.3 }),
    created_at: faker.date.recent(),
    ...overrides
  };
}

// Power reading factory
export function createMockPowerReading(deviceId: string, channel: number, overrides: Partial<any> = {}) {
  return {
    id: faker.string.uuid(),
    device_id: deviceId,
    channel: channel,
    timestamp: faker.date.recent(),
    power: faker.number.float({ min: 0, max: 300, fractionDigits: 0.1 }),
    voltage: faker.number.float({ min: 220, max: 240, fractionDigits: 0.1 }),
    current: faker.number.float({ min: 0, max: 2, fractionDigits: 0.01 }),
    energy: faker.number.float({ min: 0, max: 10, fractionDigits: 0.01 }),
    power_factor: faker.number.float({ min: 0.5, max: 1, fractionDigits: 0.01 }),
    temperature: faker.number.float({ min: 20, max: 40, fractionDigits: 0.1 }),
    ...overrides
  };
}

// Motion event factory
export function createMockMotionEvent(deviceId: string, overrides: Partial<any> = {}) {
  return {
    id: faker.string.uuid(),
    device_id: deviceId,
    timestamp: faker.date.recent(),
    motion_detected: true,
    lux: faker.number.int({ min: 0, max: 1000 }),
    temperature: faker.number.float({ min: 15, max: 30, fractionDigits: 0.1 }),
    battery_percent: faker.number.int({ min: 0, max: 100 }),
    vibration_detected: faker.datatype.boolean({ probability: 0.1 }),
    ...overrides
  };
}

// Test data seeder
export async function seedTestData(options: {
  users?: number;
  devicesPerUser?: number;
  readingsPerDevice?: number;
  alerts?: number;
} = {}) {
  const {
    users = 3,
    devicesPerUser = 5,
    readingsPerDevice = 100,
    alerts = 20
  } = options;

  const createdUsers = [];
  const createdDevices = [];

  // Create users
  for (let i = 0; i < users; i++) {
    const user = createMockUser();
    const { data, error } = await testSupabase.auth.admin.createUser({
      email: user.email,
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: { name: user.name }
    });
    
    if (!error && data.user) {
      createdUsers.push(data.user);
    }
  }

  // Create devices for each user
  for (const user of createdUsers) {
    for (let i = 0; i < devicesPerUser; i++) {
      const device = createMockDevice({ user_id: user.id });
      const { data, error } = await testSupabase
        .from('devices')
        .insert(device)
        .select()
        .single();
      
      if (!error && data) {
        createdDevices.push(data);
        
        // Create device status
        const status = createMockDeviceStatus(data);
        if (status) {
          await testSupabase.from('device_status').insert(status);
        }
        
        // Create power readings for Plus 2PM devices
        if (data.type === 'plus_2pm') {
          const readings = [];
          for (let j = 0; j < readingsPerDevice; j++) {
            readings.push(createMockPowerReading(data.id, 0));
            readings.push(createMockPowerReading(data.id, 1));
          }
          await testSupabase.from('power_readings').insert(readings);
        }
        
        // Create motion events for Motion 2 devices
        if (data.type === 'motion_2') {
          const events = [];
          for (let j = 0; j < readingsPerDevice / 10; j++) {
            events.push(createMockMotionEvent(data.id));
          }
          await testSupabase.from('motion_events').insert(events);
        }
      }
    }
  }

  // Create alerts
  const alertsData = [];
  for (let i = 0; i < alerts; i++) {
    const device = faker.helpers.arrayElement(createdDevices);
    alertsData.push(createMockAlert({
      device_id: device.id,
      user_id: device.user_id
    }));
  }
  await testSupabase.from('alerts').insert(alertsData);

  return {
    users: createdUsers,
    devices: createdDevices
  };
}

// Test cleanup
export async function cleanupTestData() {
  // Delete all test data in reverse order of dependencies
  await testSupabase.from('alerts').delete().gte('created_at', '1900-01-01');
  await testSupabase.from('motion_events').delete().gte('created_at', '1900-01-01');
  await testSupabase.from('power_readings').delete().gte('created_at', '1900-01-01');
  await testSupabase.from('device_status').delete().gte('created_at', '1900-01-01');
  await testSupabase.from('devices').delete().gte('created_at', '1900-01-01');
  
  // Delete test users
  const { data: users } = await testSupabase.auth.admin.listUsers();
  if (users?.users) {
    for (const user of users.users) {
      if (user.email?.includes('@example.com')) {
        await testSupabase.auth.admin.deleteUser(user.id);
      }
    }
  }
}

// Wait helpers
export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  timeout: number = 5000,
  interval: number = 100
): Promise<boolean> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  return false;
}

// Mock API responses
export function mockApiResponse(data: any, options: { status?: number; delay?: number } = {}) {
  const { status = 200, delay = 0 } = options;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' }
      }));
    }, delay);
  });
}

// Test authentication helper
export async function authenticateTestUser(email: string = 'test@example.com', password: string = 'TestPassword123!') {
  const { data, error } = await testSupabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    throw new Error(`Failed to authenticate test user: ${error.message}`);
  }
  
  return data;
}

// Performance testing helper
export async function measurePerformance(fn: () => Promise<any>, iterations: number = 10) {
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    times.push(end - start);
  }
  
  return {
    average: times.reduce((a, b) => a + b, 0) / times.length,
    min: Math.min(...times),
    max: Math.max(...times),
    median: times.sort((a, b) => a - b)[Math.floor(times.length / 2)]
  };
}