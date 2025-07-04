import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🚀 Quick Migration Runner for Supabase');
console.log('=====================================\n');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function runMigration() {
  try {
    // Read the migration files
    const migration1 = fs.readFileSync(
      path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql'),
      'utf8'
    );
    
    const migration2 = fs.readFileSync(
      path.join(__dirname, '..', 'supabase', 'migrations', '002_functions_and_procedures.sql'),
      'utf8'
    );

    console.log('📄 Found migration files');
    console.log('\n⚠️  IMPORTANT: Due to Supabase limitations, you need to run these migrations manually.');
    console.log('\nPlease follow these steps:');
    console.log('\n1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/hdkibjbrfrhqedzbgvek');
    console.log('2. Click on "SQL Editor" in the left sidebar');
    console.log('3. Click "New query"');
    console.log('4. Copy and paste the content from:');
    console.log('   - supabase/migrations/001_initial_schema.sql');
    console.log('5. Click "Run" (or press Ctrl/Cmd + Enter)');
    console.log('6. Create another new query and paste:');
    console.log('   - supabase/migrations/002_functions_and_procedures.sql');
    console.log('7. Click "Run" again');
    console.log('\n✅ After running both migrations, run "npm run check:env" again to verify');
    
    // Save a combined migration file for convenience
    const combinedMigration = `-- Shelly Monitor Database Schema
-- Run this entire script in Supabase SQL Editor

${migration1}

-- Functions and Procedures

${migration2}
`;

    const outputPath = path.join(__dirname, '..', 'MIGRATION_TO_RUN.sql');
    fs.writeFileSync(outputPath, combinedMigration);
    console.log(`\n💡 For convenience, a combined migration file has been created at:`);
    console.log(`   ${outputPath}`);
    console.log('   You can copy the entire content of this file and run it in one go.');

  } catch (error) {
    console.error('Error:', error);
  }
}

runMigration();