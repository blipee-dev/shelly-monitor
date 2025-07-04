-- Verify auth setup is correct
-- Run this in Supabase SQL Editor after fix-users-table.sql

-- Check if password_hash is nullable
SELECT 
    column_name,
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_name = 'users' 
AND column_name = 'password_hash';

-- Check if trigger exists
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Check if function exists
SELECT 
    routine_name
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- Count users in auth vs database
SELECT 
    'Auth Users' as source,
    COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
    'Database Users' as source,
    COUNT(*) as count
FROM public.users;

-- Show any auth users missing from database
SELECT 
    a.id,
    a.email,
    'Missing from database' as status
FROM auth.users a
LEFT JOIN public.users u ON a.id = u.id
WHERE u.id IS NULL;