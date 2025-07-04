-- Fix RLS policies for users table to allow user creation
-- Run this in Supabase SQL Editor

-- First, let's see what policies exist
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'users';

-- Create a policy that allows users to insert their own record
CREATE POLICY "Users can insert own record on signup" ON users
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Also ensure the service role can insert (for our scripts)
CREATE POLICY "Service role can manage all users" ON users
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- If you want to disable email confirmation for testing (optional)
-- This must be done in Supabase Dashboard: Authentication > Settings > Email > Disable "Enable email confirmations"