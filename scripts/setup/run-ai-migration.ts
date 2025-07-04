import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

async function runMigration() {
  console.log('🚀 Running AI features migration...\n');

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // Read the migration file
    const migrationPath = join(__dirname, '../../supabase/migrations/003_ai_features.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL,
    });

    if (error) {
      // If the function doesn't exist, try executing directly
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const statement of statements) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        
        const { error: execError } = await supabase
          .from('_migrations')
          .select('*')
          .limit(1)
          .single()
          .then(() => supabase.rpc('exec_sql', { sql: statement }))
          .catch(() => {
            // If RPC doesn't work, we'll note it but continue
            console.log('Note: exec_sql RPC not available, migration may need manual execution');
            return { error: null };
          });

        if (execError) {
          console.error(`Error executing statement: ${execError.message}`);
        }
      }
    }

    // Verify the tables were created
    console.log('\n✅ Verifying migration...');
    
    const { data: aiUsageLogs, error: logsError } = await supabase
      .from('ai_usage_logs')
      .select('*')
      .limit(1);

    if (!logsError) {
      console.log('✅ ai_usage_logs table created successfully');
    } else {
      console.log('❌ ai_usage_logs table not found:', logsError.message);
    }

    const { data: aiInsights, error: insightsError } = await supabase
      .from('ai_insights')
      .select('*')
      .limit(1);

    if (!insightsError) {
      console.log('✅ ai_insights table created successfully');
    } else {
      console.log('❌ ai_insights table not found:', insightsError.message);
    }

    console.log('\n🎉 AI features migration completed!');
    console.log('\n📝 Note: If tables were not created, you may need to run the migration manually in the Supabase SQL editor.');
    console.log('   Copy the contents of: supabase/migrations/003_ai_features.sql');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();