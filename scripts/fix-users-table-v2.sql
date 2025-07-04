-- Fix users table to work with Supabase Auth (v2 - with proper type casting)
-- Run this in Supabase SQL Editor

-- Make password_hash nullable since Supabase Auth handles passwords
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Ensure we have proper indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create a trigger to automatically create user records when auth users are created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'user'::user_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new auth users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update existing auth users that might not have database records
INSERT INTO public.users (id, email, name, role)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  COALESCE((raw_user_meta_data->>'role')::user_role, 'user'::user_role)
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

-- If the above fails due to invalid role values, use this safer version:
-- INSERT INTO public.users (id, email, name, role)
-- SELECT 
--   id,
--   email,
--   COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
--   CASE 
--     WHEN raw_user_meta_data->>'role' IN ('admin', 'user', 'viewer') 
--     THEN (raw_user_meta_data->>'role')::user_role
--     ELSE 'user'::user_role
--   END
-- FROM auth.users
-- WHERE id NOT IN (SELECT id FROM public.users)
-- ON CONFLICT (id) DO NOTHING;