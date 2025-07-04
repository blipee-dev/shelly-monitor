-- Combined migration script for easy execution in Supabase SQL Editor
-- Run this entire script in your Supabase SQL Editor

-- First, let's check if we're in the right place
SELECT current_database(), current_user, version();

-- Now run the migrations
\echo 'Starting database migration...'

-- Include the contents of 001_initial_schema.sql
\i ../supabase/migrations/001_initial_schema.sql

-- Include the contents of 002_functions_and_procedures.sql
\i ../supabase/migrations/002_functions_and_procedures.sql

\echo 'Migration completed!'