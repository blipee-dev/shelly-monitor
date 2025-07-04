-- Shelly Monitor Database Schema
-- Run this entire script in Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Create enum types
CREATE TYPE device_type AS ENUM ('plus_2pm', 'motion_2');
CREATE TYPE alert_type AS ENUM ('offline', 'motion', 'power_threshold', 'battery_low');
CREATE TYPE user_role AS ENUM ('admin', 'user', 'viewer');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role user_role DEFAULT 'user',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Devices table
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type device_type NOT NULL,
    model VARCHAR(100),
    ip_address INET NOT NULL,
    mac_address VARCHAR(17) UNIQUE,
    firmware_version VARCHAR(50),
    auth_enabled BOOLEAN DEFAULT false,
    auth_username VARCHAR(255),
    auth_password_encrypted TEXT,
    settings JSONB DEFAULT '{}',
    last_seen TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, ip_address)
);

-- Device status table (current state)
CREATE TABLE device_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    online BOOLEAN DEFAULT false,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(device_id)
);

-- Power readings table (partitioned by month)
CREATE TABLE power_readings (
    id UUID DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    channel INTEGER CHECK (channel IN (0, 1)) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    power FLOAT,
    voltage FLOAT,
    current FLOAT,
    energy FLOAT,
    power_factor FLOAT,
    temperature FLOAT,
    PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

-- Motion events table (partitioned by month)
CREATE TABLE motion_events (
    id UUID DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    light_level FLOAT,
    temperature FLOAT,
    battery_percent INTEGER,
    vibration BOOLEAN DEFAULT false,
    PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

-- Alerts configuration
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type alert_type NOT NULL,
    condition JSONB NOT NULL,
    actions JSONB NOT NULL DEFAULT '[]',
    enabled BOOLEAN DEFAULT true,
    last_triggered TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alert history
CREATE TABLE alert_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID REFERENCES alerts(id) ON DELETE CASCADE,
    triggered_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    notification_sent BOOLEAN DEFAULT false,
    details JSONB
);

-- Audit logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    result VARCHAR(20),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    refresh_token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Feature flags
CREATE TABLE feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    enabled BOOLEAN DEFAULT false,
    conditions JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API keys for external integrations
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    permissions JSONB DEFAULT '[]',
    last_used TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_devices_type ON devices(type);
CREATE INDEX idx_devices_last_seen ON devices(last_seen);
CREATE INDEX idx_device_status_device_id ON device_status(device_id);
CREATE INDEX idx_device_status_updated_at ON device_status(updated_at);
CREATE INDEX idx_power_readings_device_timestamp ON power_readings(device_id, timestamp DESC);
CREATE INDEX idx_motion_events_device_timestamp ON motion_events(device_id, timestamp DESC);
CREATE INDEX idx_alerts_device_id ON alerts(device_id);
CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_enabled ON alerts(enabled);
CREATE INDEX idx_alert_history_alert_id ON alert_history(alert_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Create partitions for the current and next 3 months
DO $$
DECLARE
    start_date date;
    end_date date;
    partition_name text;
BEGIN
    FOR i IN 0..3 LOOP
        start_date := date_trunc('month', CURRENT_DATE + (i || ' month')::interval);
        end_date := start_date + interval '1 month';
        
        -- Power readings partitions
        partition_name := 'power_readings_' || to_char(start_date, 'YYYY_MM');
        EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF power_readings FOR VALUES FROM (%L) TO (%L)',
            partition_name, start_date, end_date);
            
        -- Motion events partitions
        partition_name := 'motion_events_' || to_char(start_date, 'YYYY_MM');
        EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF motion_events FOR VALUES FROM (%L) TO (%L)',
            partition_name, start_date, end_date);
    END LOOP;
END $$;

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON feature_flags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE power_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE motion_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);
    
-- Users can update own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);
    
-- Users can view own devices
CREATE POLICY "Users can view own devices" ON devices
    FOR SELECT USING (auth.uid() = user_id);
    
-- Users can insert own devices
CREATE POLICY "Users can insert own devices" ON devices
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
-- Users can update own devices
CREATE POLICY "Users can update own devices" ON devices
    FOR UPDATE USING (auth.uid() = user_id);
    
-- Users can delete own devices
CREATE POLICY "Users can delete own devices" ON devices
    FOR DELETE USING (auth.uid() = user_id);

-- Device status follows device permissions
CREATE POLICY "Device status follows device permissions" ON device_status
    FOR ALL USING (
        device_id IN (
            SELECT id FROM devices WHERE user_id = auth.uid()
        )
    );

-- Power readings follow device permissions
CREATE POLICY "Power readings follow device permissions" ON power_readings
    FOR ALL USING (
        device_id IN (
            SELECT id FROM devices WHERE user_id = auth.uid()
        )
    );

-- Motion events follow device permissions
CREATE POLICY "Motion events follow device permissions" ON motion_events
    FOR ALL USING (
        device_id IN (
            SELECT id FROM devices WHERE user_id = auth.uid()
        )
    );

-- Users can manage own alerts
CREATE POLICY "Users can manage own alerts" ON alerts
    FOR ALL USING (auth.uid() = user_id);

-- Alert history follows alert permissions
CREATE POLICY "Alert history follows alert permissions" ON alert_history
    FOR ALL USING (
        alert_id IN (
            SELECT id FROM alerts WHERE user_id = auth.uid()
        )
    );

-- Users can view own audit logs
CREATE POLICY "Users can view own audit logs" ON audit_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Users can manage own sessions
CREATE POLICY "Users can manage own sessions" ON user_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Users can manage own API keys
CREATE POLICY "Users can manage own API keys" ON api_keys
    FOR ALL USING (auth.uid() = user_id);

-- Create scheduled jobs for maintenance
SELECT cron.schedule(
    'cleanup-old-data',
    '0 2 * * *', -- Run at 2 AM daily
    $$
    -- Delete old power readings
    DELETE FROM power_readings WHERE timestamp < NOW() - INTERVAL '90 days';
    
    -- Delete old motion events
    DELETE FROM motion_events WHERE timestamp < NOW() - INTERVAL '90 days';
    
    -- Delete old audit logs
    DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '180 days';
    
    -- Delete expired sessions
    DELETE FROM user_sessions WHERE expires_at < NOW();
    
    -- Delete old alert history
    DELETE FROM alert_history WHERE triggered_at < NOW() - INTERVAL '30 days';
    $$
);

-- Create future partitions monthly
SELECT cron.schedule(
    'create-future-partitions',
    '0 0 1 * *', -- Run on the 1st of every month
    $$
    DO $partition$
    DECLARE
        start_date date;
        end_date date;
        partition_name text;
    BEGIN
        -- Create partition for next month
        start_date := date_trunc('month', CURRENT_DATE + interval '3 months');
        end_date := start_date + interval '1 month';
        
        partition_name := 'power_readings_' || to_char(start_date, 'YYYY_MM');
        EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF power_readings FOR VALUES FROM (%L) TO (%L)',
            partition_name, start_date, end_date);
            
        partition_name := 'motion_events_' || to_char(start_date, 'YYYY_MM');
        EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF motion_events FOR VALUES FROM (%L) TO (%L)',
            partition_name, start_date, end_date);
    END $partition$;
    $$
);

-- Insert default feature flags
INSERT INTO feature_flags (name, description, enabled) VALUES
    ('real_time_updates', 'Enable real-time WebSocket updates', true),
    ('device_control', 'Allow remote device control', true),
    ('data_export', 'Enable data export functionality', true),
    ('alerting', 'Enable alert system', true),
    ('api_access', 'Enable external API access', false),
    ('maintenance_mode', 'Put application in maintenance mode', false);

-- Functions and Procedures

-- Function to encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
    -- In production, use proper encryption
    -- This is a placeholder for pgcrypto extension
    RETURN encode(digest(password, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify encrypted password
CREATE OR REPLACE FUNCTION verify_password(password TEXT, encrypted_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN encode(digest(password, 'sha256'), 'hex') = encrypted_password;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
    p_user_id UUID,
    p_action VARCHAR(100),
    p_resource VARCHAR(100),
    p_resource_id UUID,
    p_ip_address INET,
    p_user_agent TEXT,
    p_result VARCHAR(20),
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_audit_id UUID;
BEGIN
    INSERT INTO audit_logs (
        user_id,
        action,
        resource,
        resource_id,
        ip_address,
        user_agent,
        result,
        metadata
    ) VALUES (
        p_user_id,
        p_action,
        p_resource,
        p_resource_id,
        p_ip_address,
        p_user_agent,
        p_result,
        p_metadata
    ) RETURNING id INTO v_audit_id;
    
    RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check feature flag
CREATE OR REPLACE FUNCTION is_feature_enabled(p_feature_name VARCHAR(100), p_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
    v_enabled BOOLEAN;
    v_conditions JSONB;
BEGIN
    SELECT enabled, conditions
    INTO v_enabled, v_conditions
    FROM feature_flags
    WHERE name = p_feature_name;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- If no conditions, return enabled status
    IF v_conditions = '{}' THEN
        RETURN v_enabled;
    END IF;
    
    -- Check user-specific conditions if user_id provided
    IF p_user_id IS NOT NULL AND v_conditions ? 'users' THEN
        IF v_conditions->'users' ? p_user_id::TEXT THEN
            RETURN (v_conditions->'users'->p_user_id::TEXT)::BOOLEAN;
        END IF;
    END IF;
    
    -- Check role-based conditions
    IF p_user_id IS NOT NULL AND v_conditions ? 'roles' THEN
        DECLARE
            v_user_role user_role;
        BEGIN
            SELECT role INTO v_user_role FROM users WHERE id = p_user_id;
            IF v_conditions->'roles' ? v_user_role::TEXT THEN
                RETURN (v_conditions->'roles'->v_user_role::TEXT)::BOOLEAN;
            END IF;
        END;
    END IF;
    
    RETURN v_enabled;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate power statistics
CREATE OR REPLACE FUNCTION get_power_statistics(
    p_device_id UUID,
    p_start_date TIMESTAMPTZ,
    p_end_date TIMESTAMPTZ,
    p_channel INTEGER DEFAULT NULL
)
RETURNS TABLE (
    total_energy FLOAT,
    average_power FLOAT,
    peak_power FLOAT,
    min_power FLOAT,
    total_cost FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        SUM(energy) as total_energy,
        AVG(power) as average_power,
        MAX(power) as peak_power,
        MIN(power) as min_power,
        SUM(energy) * 0.12 as total_cost -- Assuming $0.12 per kWh
    FROM power_readings
    WHERE device_id = p_device_id
        AND timestamp BETWEEN p_start_date AND p_end_date
        AND (p_channel IS NULL OR channel = p_channel);
END;
$$ LANGUAGE plpgsql;

-- Function to get device uptime
CREATE OR REPLACE FUNCTION get_device_uptime(p_device_id UUID)
RETURNS TABLE (
    total_uptime INTERVAL,
    uptime_percentage FLOAT,
    last_downtime TIMESTAMPTZ,
    downtime_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH status_changes AS (
        SELECT 
            device_id,
            online,
            updated_at,
            LAG(online) OVER (PARTITION BY device_id ORDER BY updated_at) as prev_online,
            LAG(updated_at) OVER (PARTITION BY device_id ORDER BY updated_at) as prev_updated_at
        FROM device_status
        WHERE device_id = p_device_id
        ORDER BY updated_at
    ),
    downtime_periods AS (
        SELECT
            CASE 
                WHEN NOT online AND prev_online THEN updated_at
                ELSE NULL
            END as downtime_start,
            CASE
                WHEN online AND NOT prev_online THEN updated_at
                ELSE NULL
            END as downtime_end
        FROM status_changes
        WHERE prev_online IS NOT NULL
    )
    SELECT
        SUM(
            CASE 
                WHEN downtime_end IS NOT NULL AND downtime_start IS NOT NULL 
                THEN downtime_end - downtime_start
                ELSE INTERVAL '0'
            END
        ) as total_uptime,
        (EXTRACT(EPOCH FROM SUM(
            CASE 
                WHEN downtime_end IS NOT NULL AND downtime_start IS NOT NULL 
                THEN downtime_end - downtime_start
                ELSE INTERVAL '0'
            END
        )) / EXTRACT(EPOCH FROM (NOW() - MIN(updated_at)))) * 100 as uptime_percentage,
        MAX(downtime_start) as last_downtime,
        COUNT(downtime_start) as downtime_count
    FROM downtime_periods;
END;
$$ LANGUAGE plpgsql;

-- Function to trigger alerts
CREATE OR REPLACE FUNCTION check_and_trigger_alerts()
RETURNS void AS $$
DECLARE
    v_alert RECORD;
    v_should_trigger BOOLEAN;
BEGIN
    FOR v_alert IN 
        SELECT a.*, d.name as device_name, d.type as device_type
        FROM alerts a
        JOIN devices d ON a.device_id = d.id
        WHERE a.enabled = true
    LOOP
        v_should_trigger := FALSE;
        
        -- Check alert conditions based on type
        CASE v_alert.type
            WHEN 'offline' THEN
                SELECT NOT online INTO v_should_trigger
                FROM device_status
                WHERE device_id = v_alert.device_id
                AND updated_at < NOW() - INTERVAL '5 minutes';
                
            WHEN 'power_threshold' THEN
                SELECT EXISTS (
                    SELECT 1 FROM power_readings
                    WHERE device_id = v_alert.device_id
                    AND timestamp > NOW() - INTERVAL '5 minutes'
                    AND power > (v_alert.condition->>'threshold')::FLOAT
                ) INTO v_should_trigger;
                
            WHEN 'motion' THEN
                SELECT EXISTS (
                    SELECT 1 FROM motion_events
                    WHERE device_id = v_alert.device_id
                    AND timestamp > NOW() - INTERVAL '1 minute'
                ) INTO v_should_trigger;
                
            WHEN 'battery_low' THEN
                SELECT EXISTS (
                    SELECT 1 FROM motion_events
                    WHERE device_id = v_alert.device_id
                    AND timestamp = (
                        SELECT MAX(timestamp) FROM motion_events
                        WHERE device_id = v_alert.device_id
                    )
                    AND battery_percent < 20
                ) INTO v_should_trigger;
        END CASE;
        
        -- Trigger alert if conditions met and not recently triggered
        IF v_should_trigger AND (
            v_alert.last_triggered IS NULL OR 
            v_alert.last_triggered < NOW() - INTERVAL '15 minutes'
        ) THEN
            -- Insert alert history
            INSERT INTO alert_history (alert_id, details)
            VALUES (v_alert.id, jsonb_build_object(
                'device_name', v_alert.device_name,
                'device_type', v_alert.device_type,
                'alert_type', v_alert.type,
                'condition', v_alert.condition
            ));
            
            -- Update last triggered
            UPDATE alerts SET last_triggered = NOW()
            WHERE id = v_alert.id;
            
            -- TODO: Execute alert actions (email, SMS, webhook, etc.)
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Schedule alert checking
SELECT cron.schedule(
    'check-alerts',
    '* * * * *', -- Run every minute
    'SELECT check_and_trigger_alerts();'
);

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_statistics(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_stats JSONB;
BEGIN
    SELECT jsonb_build_object(
        'device_count', (SELECT COUNT(*) FROM devices WHERE user_id = p_user_id),
        'online_devices', (
            SELECT COUNT(*) FROM devices d
            JOIN device_status ds ON d.id = ds.device_id
            WHERE d.user_id = p_user_id AND ds.online = true
        ),
        'total_power_usage', (
            SELECT COALESCE(SUM(power), 0) FROM power_readings pr
            JOIN devices d ON pr.device_id = d.id
            WHERE d.user_id = p_user_id
            AND pr.timestamp > NOW() - INTERVAL '24 hours'
        ),
        'motion_events_today', (
            SELECT COUNT(*) FROM motion_events me
            JOIN devices d ON me.device_id = d.id
            WHERE d.user_id = p_user_id
            AND me.timestamp > CURRENT_DATE
        ),
        'active_alerts', (
            SELECT COUNT(*) FROM alerts
            WHERE user_id = p_user_id AND enabled = true
        ),
        'api_calls_today', (
            SELECT COUNT(*) FROM audit_logs
            WHERE user_id = p_user_id
            AND created_at > CURRENT_DATE
            AND action LIKE 'api.%'
        )
    ) INTO v_stats;
    
    RETURN v_stats;
END;
$$ LANGUAGE plpgsql;
