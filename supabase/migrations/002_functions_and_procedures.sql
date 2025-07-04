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