-- Fix the users table to work with Supabase Auth
-- Run this in Supabase SQL Editor

-- First, let's check if the users table exists and what columns it has
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- If the password_hash column exists and is causing issues, we can either:
-- Option 1: Make it nullable (recommended for Supabase Auth)
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Option 2: Set a default value
-- ALTER TABLE users ALTER COLUMN password_hash SET DEFAULT 'managed_by_supabase_auth';

-- Now let's sync the auth users to the users table
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
ON CONFLICT (id) DO NOTHING;

-- Verify the sync
SELECT id, email, name, role FROM users;