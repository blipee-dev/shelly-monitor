#!/usr/bin/env node

/**
 * Configure Vercel Environment Variables
 * 
 * This script helps set up environment variables for different environments
 * in your Vercel project.
 * 
 * Usage:
 * npm run configure:env -- --env=production
 * npm run configure:env -- --env=preview
 * npm run configure:env -- --env=development
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

interface EnvConfig {
  name: string;
  scope: ('production' | 'preview' | 'development')[];
  required: boolean;
  description: string;
  example?: string;
  generateCommand?: string;
}

const ENV_CONFIGS: EnvConfig[] = [
  // Public Variables
  {
    name: 'NEXT_PUBLIC_APP_URL',
    scope: ['production', 'preview', 'development'],
    required: true,
    description: 'Application URL',
    example: 'https://app.blipee.com',
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    scope: ['production', 'preview', 'development'],
    required: true,
    description: 'Supabase project URL',
    example: 'https://xxxxx.supabase.co',
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    scope: ['production', 'preview', 'development'],
    required: true,
    description: 'Supabase anonymous key',
  },

  // Private Variables
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    scope: ['production', 'preview', 'development'],
    required: true,
    description: 'Supabase service role key (keep secret!)',
  },
  {
    name: 'JWT_SECRET',
    scope: ['production', 'preview', 'development'],
    required: true,
    description: 'JWT signing secret',
    generateCommand: 'openssl rand -hex 32',
  },
  {
    name: 'SESSION_SECRET',
    scope: ['production', 'preview', 'development'],
    required: true,
    description: 'Session encryption secret',
    generateCommand: 'openssl rand -hex 32',
  },
  {
    name: 'ENCRYPTION_KEY',
    scope: ['production', 'preview', 'development'],
    required: true,
    description: '32-byte encryption key',
    generateCommand: 'openssl rand -hex 16',
  },
  {
    name: 'CRON_SECRET',
    scope: ['production', 'preview'],
    required: true,
    description: 'Secret for cron job authentication',
    generateCommand: 'openssl rand -hex 32',
  },

  // AI Providers
  {
    name: 'DEEPSEEK_API_KEY',
    scope: ['production', 'preview', 'development'],
    required: false,
    description: 'DeepSeek API key (recommended AI provider)',
  },
  {
    name: 'OPENAI_API_KEY',
    scope: ['production', 'preview', 'development'],
    required: false,
    description: 'OpenAI API key (alternative AI provider)',
  },
  {
    name: 'ANTHROPIC_API_KEY',
    scope: ['production', 'preview', 'development'],
    required: false,
    description: 'Anthropic API key (alternative AI provider)',
  },

  // Email
  {
    name: 'SENDGRID_API_KEY',
    scope: ['production', 'preview'],
    required: false,
    description: 'SendGrid API key for email notifications',
  },
  {
    name: 'SENDGRID_FROM_EMAIL',
    scope: ['production', 'preview'],
    required: false,
    description: 'From email address',
    example: 'noreply@blipee.com',
  },

  // Feature Flags
  {
    name: 'NEXT_PUBLIC_ENABLE_PWA',
    scope: ['production', 'preview', 'development'],
    required: false,
    description: 'Enable PWA features',
    example: 'true',
  },
  {
    name: 'NEXT_PUBLIC_ENABLE_ANALYTICS',
    scope: ['production'],
    required: false,
    description: 'Enable analytics tracking',
    example: 'true',
  },
  {
    name: 'NEXT_PUBLIC_ENABLE_DEBUG',
    scope: ['preview', 'development'],
    required: false,
    description: 'Enable debug mode',
    example: 'true',
  },
  {
    name: 'NEXT_PUBLIC_SHOW_PREVIEW_BANNER',
    scope: ['preview'],
    required: false,
    description: 'Show preview environment banner',
    example: 'true',
  },
];

async function main() {
  console.log('🚀 Vercel Environment Configuration Tool\n');

  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch {
    console.error('❌ Vercel CLI not found. Please install it first:');
    console.error('   npm i -g vercel');
    process.exit(1);
  }

  // Get environment argument
  const envArg = process.argv.find(arg => arg.startsWith('--env='));
  const environment = envArg?.split('=')[1] as 'production' | 'preview' | 'development' | undefined;

  if (!environment || !['production', 'preview', 'development'].includes(environment)) {
    console.error('❌ Please specify environment: --env=production|preview|development');
    process.exit(1);
  }

  console.log(`📋 Configuring environment variables for: ${environment}\n`);

  // Filter configs for the selected environment
  const relevantConfigs = ENV_CONFIGS.filter(config => 
    config.scope.includes(environment)
  );

  console.log(`Found ${relevantConfigs.length} variables to configure.\n`);

  // Configure each variable
  for (const config of relevantConfigs) {
    console.log(`\n📌 ${config.name}`);
    console.log(`   ${config.description}`);
    
    if (config.example) {
      console.log(`   Example: ${config.example}`);
    }
    
    if (config.generateCommand) {
      console.log(`   Generate with: ${config.generateCommand}`);
    }

    const value = await question(`   Enter value (or press Enter to skip): `);

    if (value) {
      try {
        // Set the environment variable in Vercel
        const envFlags = environment === 'production' 
          ? 'production'
          : environment === 'preview'
          ? 'preview'
          : 'development';

        execSync(
          `vercel env add ${config.name} ${envFlags}`,
          { 
            input: value,
            stdio: ['pipe', 'pipe', 'pipe']
          }
        );
        
        console.log(`   ✅ Set ${config.name} for ${environment}`);
      } catch (error) {
        console.error(`   ❌ Failed to set ${config.name}: ${error.message}`);
      }
    } else if (config.required) {
      console.log(`   ⚠️  Skipped required variable ${config.name}`);
    } else {
      console.log(`   ⏭️  Skipped optional variable`);
    }
  }

  console.log('\n✨ Configuration complete!\n');

  // Offer to pull environment variables locally
  const pullLocal = await question('Would you like to pull these variables to .env.local? (y/n): ');
  
  if (pullLocal.toLowerCase() === 'y') {
    try {
      execSync('vercel env pull .env.local', { stdio: 'inherit' });
      console.log('✅ Environment variables pulled to .env.local');
    } catch (error) {
      console.error('❌ Failed to pull environment variables:', error.message);
    }
  }

  // Show next steps
  console.log('\n📝 Next steps:');
  console.log('1. Review your environment variables in the Vercel dashboard');
  console.log('2. Ensure all required variables are set');
  console.log('3. Deploy your application');
  
  if (environment !== 'production') {
    console.log('4. Test your preview deployment thoroughly before promoting to production');
  }

  rl.close();
}

// Helper function to generate secure values
function generateSecureValue(type: string): string {
  switch (type) {
    case 'jwt':
    case 'session':
    case 'cron':
      return execSync('openssl rand -hex 32').toString().trim();
    case 'encryption':
      return execSync('openssl rand -hex 16').toString().trim();
    default:
      return '';
  }
}

main().catch(console.error);