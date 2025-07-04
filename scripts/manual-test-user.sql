-- Manually create a test user to bypass the trigger issue
-- Run this in Supabase SQL Editor

-- First, let's check what's in the tables
SELECT 'Auth Users' as table_name, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 'Public Users' as table_name, COUNT(*) as count FROM public.users;

-- Check if the trigger exists and is enabled
SELECT 
    tgname as trigger_name,
    tgenabled as is_enabled,
    tgtype as trigger_type
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- Temporarily disable the trigger if it's causing issues
ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;

-- Now you can try creating users through the app
-- After testing, re-enable with:
-- ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;

-- Alternative: Drop the trigger completely and handle user creation in the app
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP FUNCTION IF EXISTS public.handle_new_user();