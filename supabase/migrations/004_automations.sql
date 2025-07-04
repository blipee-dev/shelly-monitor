-- Automations and Scenes tables

-- Automations table
CREATE TABLE IF NOT EXISTS automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT true,
  triggers JSONB NOT NULL DEFAULT '[]',
  conditions JSONB DEFAULT '[]',
  actions JSONB NOT NULL DEFAULT '[]',
  last_triggered TIMESTAMPTZ,
  next_trigger TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_automations_user_id ON automations(user_id);
CREATE INDEX idx_automations_enabled ON automations(enabled);
CREATE INDEX idx_automations_next_trigger ON automations(next_trigger);
CREATE INDEX idx_automations_name ON automations(name);

-- Enable RLS
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own automations" ON automations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own automations" ON automations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own automations" ON automations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own automations" ON automations
  FOR DELETE USING (auth.uid() = user_id);

-- Scenes table
CREATE TABLE IF NOT EXISTS scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  actions JSONB NOT NULL DEFAULT '[]',
  is_favorite BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_scenes_user_id ON scenes(user_id);
CREATE INDEX idx_scenes_name ON scenes(name);
CREATE INDEX idx_scenes_favorite ON scenes(is_favorite);

-- Enable RLS
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own scenes" ON scenes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scenes" ON scenes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scenes" ON scenes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scenes" ON scenes
  FOR DELETE USING (auth.uid() = user_id);

-- Automation logs table
CREATE TABLE IF NOT EXISTS automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
  automation_name VARCHAR(255) NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  triggered_by VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed', 'partial')),
  executed_actions JSONB NOT NULL DEFAULT '[]',
  duration INTEGER NOT NULL, -- milliseconds
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_automation_logs_automation_id ON automation_logs(automation_id);
CREATE INDEX idx_automation_logs_user_id ON automation_logs(user_id);
CREATE INDEX idx_automation_logs_created_at ON automation_logs(created_at);
CREATE INDEX idx_automation_logs_status ON automation_logs(status);

-- Enable RLS
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own automation logs" ON automation_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert automation logs" ON automation_logs
  FOR INSERT WITH CHECK (true);

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_automation_timestamp() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER tr_automations_updated_at
  BEFORE UPDATE ON automations
  FOR EACH ROW
  EXECUTE FUNCTION update_automation_timestamp();

CREATE TRIGGER tr_scenes_updated_at
  BEFORE UPDATE ON scenes
  FOR EACH ROW
  EXECUTE FUNCTION update_automation_timestamp();

-- Function to validate automation structure
CREATE OR REPLACE FUNCTION validate_automation() RETURNS TRIGGER AS $$
BEGIN
  -- Validate triggers array
  IF jsonb_array_length(NEW.triggers) = 0 THEN
    RAISE EXCEPTION 'Automation must have at least one trigger';
  END IF;
  
  -- Validate actions array
  IF jsonb_array_length(NEW.actions) = 0 THEN
    RAISE EXCEPTION 'Automation must have at least one action';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to validate automation
CREATE TRIGGER tr_validate_automation
  BEFORE INSERT OR UPDATE ON automations
  FOR EACH ROW
  EXECUTE FUNCTION validate_automation();

-- Function to get next trigger time for time-based automations
CREATE OR REPLACE FUNCTION calculate_next_trigger(
  p_triggers JSONB,
  p_last_triggered TIMESTAMPTZ
) RETURNS TIMESTAMPTZ AS $$
DECLARE
  v_next_trigger TIMESTAMPTZ;
  v_trigger JSONB;
  v_trigger_time TIME;
  v_schedule JSONB;
BEGIN
  -- Loop through triggers to find the next execution time
  FOR v_trigger IN SELECT * FROM jsonb_array_elements(p_triggers)
  LOOP
    IF v_trigger->>'type' = 'time' THEN
      v_trigger_time := (v_trigger->'config'->>'time')::TIME;
      v_next_trigger := CURRENT_DATE + v_trigger_time;
      
      -- If the time has passed today, schedule for tomorrow
      IF v_next_trigger <= NOW() THEN
        v_next_trigger := v_next_trigger + INTERVAL '1 day';
      END IF;
      
      RETURN v_next_trigger;
      
    ELSIF v_trigger->>'type' = 'schedule' THEN
      v_schedule := v_trigger->'config'->'schedule';
      -- Simplified: just return next occurrence based on frequency
      -- In production, would need more complex logic for weekly/monthly
      v_trigger_time := (v_schedule->>'time')::TIME;
      v_next_trigger := CURRENT_DATE + v_trigger_time;
      
      IF v_next_trigger <= NOW() THEN
        CASE v_schedule->>'frequency'
          WHEN 'daily' THEN
            v_next_trigger := v_next_trigger + INTERVAL '1 day';
          WHEN 'weekly' THEN
            v_next_trigger := v_next_trigger + INTERVAL '7 days';
          WHEN 'monthly' THEN
            v_next_trigger := v_next_trigger + INTERVAL '1 month';
        END CASE;
      END IF;
      
      RETURN v_next_trigger;
    END IF;
  END LOOP;
  
  RETURN NULL; -- No time-based triggers
END;
$$ LANGUAGE plpgsql;

-- Function to execute automation (placeholder - actual execution would be in application)
CREATE OR REPLACE FUNCTION log_automation_execution(
  p_automation_id UUID,
  p_automation_name VARCHAR,
  p_user_id UUID,
  p_triggered_by VARCHAR,
  p_status VARCHAR,
  p_executed_actions JSONB,
  p_duration INTEGER,
  p_error_message TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO automation_logs (
    automation_id,
    automation_name,
    user_id,
    triggered_by,
    status,
    executed_actions,
    duration,
    error_message
  ) VALUES (
    p_automation_id,
    p_automation_name,
    p_user_id,
    p_triggered_by,
    p_status,
    p_executed_actions,
    p_duration,
    p_error_message
  ) RETURNING id INTO v_log_id;
  
  -- Update last triggered time
  UPDATE automations 
  SET last_triggered = NOW(),
      next_trigger = calculate_next_trigger(triggers, NOW())
  WHERE id = p_automation_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;