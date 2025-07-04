-- Scheduled Notifications Extension
-- Adds support for scheduled and recurring notifications

-- Scheduled notifications table
CREATE TABLE IF NOT EXISTS scheduled_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  scheduled_time TIMESTAMPTZ NOT NULL,
  cron_expression TEXT, -- For recurring notifications (e.g., '0 9 * * 1' for every Monday at 9 AM)
  is_recurring BOOLEAN DEFAULT false,
  last_sent_at TIMESTAMPTZ,
  next_send_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_scheduled_notifications_user_id ON scheduled_notifications(user_id);
CREATE INDEX idx_scheduled_notifications_status ON scheduled_notifications(status);
CREATE INDEX idx_scheduled_notifications_next_send ON scheduled_notifications(next_send_at) WHERE status = 'pending';

-- RLS Policies
ALTER TABLE scheduled_notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own scheduled notifications
CREATE POLICY "Users can view own scheduled notifications"
  ON scheduled_notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own scheduled notifications
CREATE POLICY "Users can create own scheduled notifications"
  ON scheduled_notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own scheduled notifications
CREATE POLICY "Users can update own scheduled notifications"
  ON scheduled_notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own scheduled notifications
CREATE POLICY "Users can delete own scheduled notifications"
  ON scheduled_notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Function to process scheduled notifications
CREATE OR REPLACE FUNCTION process_scheduled_notifications()
RETURNS void AS $$
DECLARE
  notification record;
BEGIN
  -- Process all pending notifications that are due
  FOR notification IN 
    SELECT * FROM scheduled_notifications 
    WHERE status = 'pending' 
    AND (scheduled_time <= NOW() OR next_send_at <= NOW())
  LOOP
    -- Send the notification
    PERFORM send_notification(
      notification.user_id,
      'scheduled',
      notification.title,
      notification.message,
      notification.metadata
    );
    
    -- Update the notification status
    IF notification.is_recurring AND notification.cron_expression IS NOT NULL THEN
      -- Calculate next send time based on cron expression
      -- For simplicity, we'll just add intervals based on common patterns
      UPDATE scheduled_notifications
      SET 
        last_sent_at = NOW(),
        next_send_at = CASE
          WHEN cron_expression LIKE '%* * *%' THEN NOW() + INTERVAL '1 day'
          WHEN cron_expression LIKE '%* * 1%' THEN NOW() + INTERVAL '7 days'
          WHEN cron_expression LIKE '%* * * *%' THEN NOW() + INTERVAL '1 hour'
          ELSE NOW() + INTERVAL '1 day'
        END,
        updated_at = NOW()
      WHERE id = notification.id;
    ELSE
      -- One-time notification, mark as sent
      UPDATE scheduled_notifications
      SET 
        status = 'sent',
        last_sent_at = NOW(),
        updated_at = NOW()
      WHERE id = notification.id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create a pg_cron job to process scheduled notifications every minute
-- Note: This requires pg_cron extension to be enabled
-- Run this in your Supabase SQL editor after enabling pg_cron:
/*
SELECT cron.schedule(
  'process-scheduled-notifications',
  '* * * * *', -- Every minute
  'SELECT process_scheduled_notifications();'
);
*/

-- Trigger to update the updated_at timestamp
CREATE TRIGGER update_scheduled_notifications_updated_at
  BEFORE UPDATE ON scheduled_notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to cancel a scheduled notification
CREATE OR REPLACE FUNCTION cancel_scheduled_notification(p_notification_id UUID, p_user_id UUID)
RETURNS boolean AS $$
BEGIN
  UPDATE scheduled_notifications
  SET 
    status = 'cancelled',
    updated_at = NOW()
  WHERE id = p_notification_id AND user_id = p_user_id AND status = 'pending';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Sample notification templates for common use cases
CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  title_template TEXT NOT NULL,
  message_template TEXT NOT NULL,
  suggested_schedule TEXT,
  is_recurring BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert some default templates
INSERT INTO notification_templates (name, category, title_template, message_template, suggested_schedule, is_recurring) VALUES
  ('Daily Energy Report', 'energy', 'Energy Usage Report', 'Your total energy consumption today was {{total_kwh}} kWh, costing approximately {{cost}}.', 'Daily at 8 PM', true),
  ('Device Check Reminder', 'maintenance', 'Device Maintenance Reminder', 'Time to check your {{device_count}} devices for updates and maintenance.', 'Weekly on Sunday', true),
  ('High Usage Alert', 'energy', 'High Energy Usage Alert', '{{device_name}} is consuming {{power}}W, which is above your threshold.', 'When threshold exceeded', false),
  ('Motion Alert', 'security', 'Motion Detected', 'Motion was detected by {{device_name}} at {{time}}.', 'On motion detection', false),
  ('Automation Summary', 'automation', 'Automation Report', '{{automation_count}} automations ran today. {{success_count}} succeeded, {{failed_count}} failed.', 'Daily at 9 AM', true);

-- Grant access to templates
GRANT SELECT ON notification_templates TO authenticated;