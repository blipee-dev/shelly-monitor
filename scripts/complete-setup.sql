-- Complete Setup Script for Shelly Monitor
-- Run this in Supabase SQL Editor after running the migrations

-- Step 1: Fix the users table to work with Supabase Auth
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE users ALTER COLUMN password_hash SET DEFAULT 'managed_by_supabase_auth';

-- Step 2: Sync existing auth users to the users table
INSERT INTO users (id, email, name, role, preferences)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)) as name,
    CASE 
        WHEN email = 'admin@example.com' THEN 'admin'::user_role
        ELSE 'user'::user_role
    END as role,
    '{}'::jsonb as preferences
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role;

-- Step 3: Create sample devices for the first user
WITH first_user AS (
    SELECT id FROM users LIMIT 1
)
INSERT INTO devices (user_id, name, type, ip_address, mac_address, firmware_version, auth_enabled, settings)
SELECT 
    first_user.id,
    device.name,
    device.type::device_type,
    device.ip::inet,
    device.mac,
    device.fw,
    false,
    device.settings::jsonb
FROM first_user,
(VALUES 
    ('Living Room Switch', 'plus_2pm', '192.168.1.100', '00:11:22:33:44:55', '1.2.3', '{"location": "First Floor"}'),
    ('Kitchen Light', 'plus_2pm', '192.168.1.101', '00:11:22:33:44:56', '1.2.3', '{"location": "First Floor"}'),
    ('Hallway Motion', 'motion_2', '192.168.1.102', '00:11:22:33:44:57', '1.1.0', '{"sensitivity": "medium"}')
) AS device(name, type, ip, mac, fw, settings);

-- Step 4: Create device status for each device
INSERT INTO device_status (device_id, online, data)
SELECT 
    d.id,
    true,
    CASE 
        WHEN d.type = 'plus_2pm' THEN 
            '{"switch": [{"id": 0, "output": true, "apower": 75.5, "voltage": 230, "current": 0.33}, {"id": 1, "output": false, "apower": 0, "voltage": 230, "current": 0}]}'::jsonb
        ELSE
            '{"sensor": {"motion": false, "light_level": 150, "temperature": 22.5, "battery_percent": 85, "vibration": false}}'::jsonb
    END
FROM devices d
ON CONFLICT (device_id) DO UPDATE SET
    online = EXCLUDED.online,
    data = EXCLUDED.data,
    updated_at = NOW();

-- Step 5: Create sample alerts
WITH first_user AS (
    SELECT id FROM users LIMIT 1
)
INSERT INTO alerts (user_id, device_id, type, condition, actions, enabled)
SELECT 
    first_user.id,
    NULL,
    alert.type::alert_type,
    alert.condition::jsonb,
    alert.actions::jsonb,
    true
FROM first_user,
(VALUES 
    ('offline', '{"duration": 600}', '["email"]'),
    ('power_threshold', '{"threshold": 150, "operator": ">"}', '["email", "push"]')
) AS alert(type, condition, actions);

-- Step 6: Create a trigger to auto-create user records when auth users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users (id, email, name, role, preferences)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        'user'::user_role,
        '{}'::jsonb
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 7: Verify the setup
SELECT 'Users:' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Devices:', COUNT(*) FROM devices
UNION ALL
SELECT 'Device Status:', COUNT(*) FROM device_status
UNION ALL
SELECT 'Alerts:', COUNT(*) FROM alerts;

-- Show sample data
SELECT 'Sample Users:' as info;
SELECT id, email, name, role FROM users LIMIT 5;

SELECT 'Sample Devices:' as info;
SELECT d.name, d.type, d.ip_address, ds.online, ds.updated_at
FROM devices d
LEFT JOIN device_status ds ON d.id = ds.device_id
LIMIT 5;