-- Check and fix RLS policies
-- Run this in Supabase SQL Editor

-- 1. First, check current policies on users table
SELECT 
    policyname,
    cmd,
    permissive,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- 2. Drop potentially conflicting policies
DROP POLICY IF EXISTS "Users can insert own record on signup" ON users;
DROP POLICY IF EXISTS "Service role can manage all users" ON users;

-- 3. Create comprehensive policies
-- Allow authenticated users to insert their own record
CREATE POLICY "Enable insert for authenticated users only" ON users
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Allow users to read their own record
CREATE POLICY "Enable read access for users to own record" ON users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Allow users to update their own record
CREATE POLICY "Enable update for users to own record" ON users
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 4. For testing, you might want to temporarily disable RLS
-- WARNING: Only do this for development!
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 5. To re-enable RLS later:
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;