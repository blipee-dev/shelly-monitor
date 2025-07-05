-- Create backup records table
CREATE TABLE IF NOT EXISTS backup_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    schedule_id UUID,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    size BIGINT NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'in_progress')),
    error TEXT,
    download_url TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create backup schedules table
CREATE TABLE IF NOT EXISTS backup_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
    time TEXT NOT NULL, -- HH:MM format
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
    day_of_month INTEGER CHECK (day_of_month >= 1 AND day_of_month <= 31),
    enabled BOOLEAN NOT NULL DEFAULT true,
    last_run TIMESTAMPTZ,
    next_run TIMESTAMPTZ,
    retention_days INTEGER NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_backup_records_user_id ON backup_records(user_id);
CREATE INDEX idx_backup_records_timestamp ON backup_records(timestamp DESC);
CREATE INDEX idx_backup_records_schedule_id ON backup_records(schedule_id);
CREATE INDEX idx_backup_schedules_user_id ON backup_schedules(user_id);
CREATE INDEX idx_backup_schedules_next_run ON backup_schedules(next_run);

-- Create storage bucket for backups (run in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('backups', 'backups', false);

-- Enable RLS
ALTER TABLE backup_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_schedules ENABLE ROW LEVEL SECURITY;

-- RLS policies for backup_records
CREATE POLICY "Users can view own backup records"
    ON backup_records FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own backup records"
    ON backup_records FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own backup records"
    ON backup_records FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own backup records"
    ON backup_records FOR DELETE
    USING (auth.uid() = user_id);

-- RLS policies for backup_schedules
CREATE POLICY "Users can view own backup schedules"
    ON backup_schedules FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own backup schedules"
    ON backup_schedules FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own backup schedules"
    ON backup_schedules FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own backup schedules"
    ON backup_schedules FOR DELETE
    USING (auth.uid() = user_id);

-- Function to run scheduled backups (called by pg_cron)
CREATE OR REPLACE FUNCTION run_scheduled_backups()
RETURNS void AS $$
DECLARE
    schedule RECORD;
BEGIN
    -- Find schedules that need to run
    FOR schedule IN 
        SELECT * FROM backup_schedules 
        WHERE enabled = true 
        AND next_run <= now()
    LOOP
        -- Create a backup record
        INSERT INTO backup_records (
            user_id,
            schedule_id,
            status
        ) VALUES (
            schedule.user_id,
            schedule.id,
            'in_progress'
        );
        
        -- Update schedule
        UPDATE backup_schedules
        SET last_run = now(),
            next_run = CASE
                WHEN frequency = 'daily' THEN 
                    (now() + interval '1 day')::date + time::time
                WHEN frequency = 'weekly' THEN 
                    (now() + interval '1 week')::date + time::time
                WHEN frequency = 'monthly' THEN 
                    (now() + interval '1 month')::date + time::time
            END
        WHERE id = schedule.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_backup_records_updated_at
    BEFORE UPDATE ON backup_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_backup_schedules_updated_at
    BEFORE UPDATE ON backup_schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add backup-related permissions to user_preferences if needed
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS backup_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS auto_backup_enabled BOOLEAN DEFAULT false;

-- Note: To enable automatic scheduled backups, you need to set up pg_cron:
-- SELECT cron.schedule('run-backup-schedules', '*/15 * * * *', 'SELECT run_scheduled_backups();');