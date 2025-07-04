-- AI Usage Logs table
CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  request_type VARCHAR(50) NOT NULL, -- 'chat' or 'stream'
  estimated_cost DECIMAL(10, 6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_ai_usage_logs_user_id ON ai_usage_logs(user_id);
CREATE INDEX idx_ai_usage_logs_created_at ON ai_usage_logs(created_at);
CREATE INDEX idx_ai_usage_logs_provider ON ai_usage_logs(provider);

-- Enable RLS
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own AI usage" ON ai_usage_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert AI usage" ON ai_usage_logs
  FOR INSERT WITH CHECK (true);

-- AI Insights table for storing generated insights
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'saving', 'pattern', 'anomaly', 'maintenance', 'optimization'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  impact TEXT,
  actionable BOOLEAN DEFAULT true,
  priority VARCHAR(20) NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX idx_ai_insights_user_id ON ai_insights(user_id);
CREATE INDEX idx_ai_insights_type ON ai_insights(type);
CREATE INDEX idx_ai_insights_created_at ON ai_insights(created_at);

-- Enable RLS
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own insights" ON ai_insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage insights" ON ai_insights
  FOR ALL USING (true);

-- Function to calculate estimated cost based on provider and tokens
CREATE OR REPLACE FUNCTION calculate_ai_cost(
  p_provider VARCHAR,
  p_prompt_tokens INTEGER,
  p_completion_tokens INTEGER
) RETURNS DECIMAL AS $$
DECLARE
  v_cost DECIMAL(10, 6);
BEGIN
  CASE p_provider
    WHEN 'deepseek' THEN
      -- DeepSeek: $0.14/1M input, $0.28/1M output
      v_cost := (p_prompt_tokens::DECIMAL / 1000000 * 0.14) + 
                (p_completion_tokens::DECIMAL / 1000000 * 0.28);
    WHEN 'openai' THEN
      -- GPT-4 Turbo: $10/1M input, $30/1M output
      v_cost := (p_prompt_tokens::DECIMAL / 1000000 * 10) + 
                (p_completion_tokens::DECIMAL / 1000000 * 30);
    WHEN 'anthropic' THEN
      -- Claude 3 Opus: $15/1M input, $75/1M output
      v_cost := (p_prompt_tokens::DECIMAL / 1000000 * 15) + 
                (p_completion_tokens::DECIMAL / 1000000 * 75);
    ELSE
      v_cost := 0;
  END CASE;
  
  RETURN v_cost;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate cost on insert
CREATE OR REPLACE FUNCTION set_ai_usage_cost() RETURNS TRIGGER AS $$
BEGIN
  NEW.estimated_cost := calculate_ai_cost(
    NEW.provider,
    NEW.prompt_tokens,
    NEW.completion_tokens
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_set_ai_usage_cost
  BEFORE INSERT ON ai_usage_logs
  FOR EACH ROW
  EXECUTE FUNCTION set_ai_usage_cost();

-- Function to get user's AI usage summary
CREATE OR REPLACE FUNCTION get_ai_usage_summary(
  p_user_id UUID,
  p_period_days INTEGER DEFAULT 30
) RETURNS TABLE (
  provider VARCHAR,
  total_requests BIGINT,
  total_tokens BIGINT,
  total_cost DECIMAL,
  avg_tokens_per_request DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    aul.provider,
    COUNT(*)::BIGINT as total_requests,
    SUM(aul.total_tokens)::BIGINT as total_tokens,
    SUM(aul.estimated_cost) as total_cost,
    AVG(aul.total_tokens)::DECIMAL as avg_tokens_per_request
  FROM ai_usage_logs aul
  WHERE aul.user_id = p_user_id
    AND aul.created_at >= NOW() - INTERVAL '1 day' * p_period_days
  GROUP BY aul.provider
  ORDER BY total_requests DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;