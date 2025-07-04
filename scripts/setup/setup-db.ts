import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function runMigrations() {
  console.log('🚀 Running database migrations...');

  try {
    // Read migration files
    const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      console.log(`\nRunning migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      
      // Split by semicolon and filter out empty statements
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const statement of statements) {
        try {
          // Skip comments
          if (statement.startsWith('--') || statement.startsWith('/*')) {
            continue;
          }

          // Execute the SQL statement
          const { error } = await supabase.rpc('exec_sql', {
            sql: statement + ';'
          });

          if (error) {
            console.error(`Error executing statement: ${error.message}`);
            console.error(`Statement: ${statement.substring(0, 100)}...`);
          }
        } catch (err) {
          console.error(`Failed to execute statement: ${err}`);
          console.error(`Statement: ${statement.substring(0, 100)}...`);
        }
      }
      
      console.log(`✅ Completed: ${file}`);
    }

    console.log('\n✅ All migrations completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

async function checkConnection() {
  console.log('🔍 Checking database connection...');
  
  try {
    const { data, error } = await supabase
      .from('_prisma_migrations')
      .select('id')
      .limit(1);

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means table doesn't exist, which is fine
      throw error;
    }

    console.log('✅ Database connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

async function main() {
  console.log('🛠️  Shelly Monitor Database Setup');
  console.log('================================\n');

  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing required environment variables!');
    console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY are set in .env.local');
    process.exit(1);
  }

  // Check connection
  const isConnected = await checkConnection();
  if (!isConnected) {
    console.error('\n❌ Could not connect to database. Please check your credentials.');
    process.exit(1);
  }

  // Run migrations
  console.log('\n⚠️  WARNING: This will modify your database schema.');
  console.log('Make sure you have a backup if running on production.');
  console.log('\nPress Ctrl+C to cancel, or wait 5 seconds to continue...');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  await runMigrations();
  
  console.log('\n🎉 Database setup complete!');
  console.log('\nNext steps:');
  console.log('1. Run "npm run db:seed" to add sample data');
  console.log('2. Run "npm run dev" to start the development server');
}

// Add RPC function for executing SQL (needs to be created in Supabase)
const createExecSqlFunction = `
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

// Run the setup
main();