-- Push Notifications Support
-- Enable push notifications and user preferences

-- Push subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT,
  auth TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

-- User preferences table (extends existing if needed)
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_preferences JSONB DEFAULT '{
    "push_enabled": false,
    "email_enabled": true,
    "sms_enabled": false,
    "device_offline": true,
    "device_online": false,
    "automation_triggered": true,
    "energy_threshold": true,
    "security_alerts": true,
    "maintenance_reminders": false
  }'::JSONB,
  ui_preferences JSONB DEFAULT '{}'::JSONB,
  device_preferences JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Notification queue table
CREATE TABLE IF NOT EXISTS notification_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  channel VARCHAR(20) NOT NULL CHECK (channel IN ('push', 'email', 'sms')),
  title TEXT,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}'::JSONB,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  error TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_notification_queue_user_id ON notification_queue(user_id);
CREATE INDEX idx_notification_queue_status ON notification_queue(status);
CREATE INDEX idx_notification_queue_created_at ON notification_queue(created_at);

-- RLS Policies
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;

-- Push subscriptions policies
CREATE POLICY "Users can view own push subscriptions"
  ON push_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own push subscriptions"
  ON push_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own push subscriptions"
  ON push_subscriptions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own push subscriptions"
  ON push_subscriptions FOR DELETE
  USING (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Notification queue policies
CREATE POLICY "Users can view own notifications"
  ON notification_queue FOR SELECT
  USING (auth.uid() = user_id);

-- Service accounts can manage all notifications
CREATE POLICY "Service accounts can manage notifications"
  ON notification_queue FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_push_subscriptions_updated_at
  BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to send notification
CREATE OR REPLACE FUNCTION send_notification(
  p_user_id UUID,
  p_type VARCHAR,
  p_title TEXT,
  p_body TEXT,
  p_data JSONB DEFAULT '{}'::JSONB
) RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
  v_preferences JSONB;
BEGIN
  -- Get user preferences
  SELECT notification_preferences INTO v_preferences
  FROM user_preferences
  WHERE user_id = p_user_id;
  
  -- Check if user wants this type of notification
  IF v_preferences IS NULL OR 
     (v_preferences->>(p_type))::BOOLEAN IS NOT FALSE THEN
    
    -- Create push notification if enabled
    IF (v_preferences->>'push_enabled')::BOOLEAN = true THEN
      INSERT INTO notification_queue (user_id, type, channel, title, body, data)
      VALUES (p_user_id, p_type, 'push', p_title, p_body, p_data)
      RETURNING id INTO v_notification_id;
    END IF;
    
    -- Create email notification if enabled
    IF (v_preferences->>'email_enabled')::BOOLEAN = true THEN
      INSERT INTO notification_queue (user_id, type, channel, title, body, data)
      VALUES (p_user_id, p_type, 'email', p_title, p_body, p_data);
    END IF;
    
  END IF;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

-- Sample notification on device offline
CREATE OR REPLACE FUNCTION notify_device_offline()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_online = false AND OLD.is_online = true THEN
    PERFORM send_notification(
      NEW.user_id,
      'device_offline',
      'Device Offline',
      format('Your device %s has gone offline', NEW.name),
      jsonb_build_object('device_id', NEW.id, 'device_name', NEW.name)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER device_offline_notification
  AFTER UPDATE ON devices
  FOR EACH ROW
  EXECUTE FUNCTION notify_device_offline();