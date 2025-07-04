import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as readline from 'readline';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function testBlipeeEmail() {
  console.log('🚀 Blipee.com SMTP Test\n');
  console.log('This will test if your Google Workspace SMTP is properly configured.\n');
  console.log('ℹ️  Note: If using an alias (like noreply@blipee.com):');
  console.log('   - Username in SMTP should be your main account');
  console.log('   - Sender email should be your alias\n');

  try {
    // Get email to test with
    const email = await question('Enter your email address to receive test email: ');
    
    if (!email.includes('@')) {
      console.error('❌ Please enter a valid email address');
      rl.close();
      return;
    }

    console.log('\n📧 Sending password reset email to:', email);
    console.log('   (This tests the SMTP configuration)\n');

    // Send password reset email
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password`,
    });

    if (error) {
      console.error('❌ Failed to send email:', error.message);
      console.log('\nPossible issues:');
      console.log('1. SMTP not configured in Supabase Dashboard');
      console.log('2. Invalid app password');
      console.log('3. 2FA not enabled on the sender account');
      console.log('4. Incorrect SMTP settings');
    } else {
      console.log('✅ Email sent successfully!');
      console.log('\nPlease check:');
      console.log('1. Your inbox at', email);
      console.log('2. Your spam folder (just in case)');
      console.log('3. The sender should be from your configured SMTP account');
      console.log('\nIf you receive the email, your SMTP is configured correctly! 🎉');
    }

    // Optional: Test sign up (creates a test user)
    const testSignup = await question('\nDo you want to test signup email as well? (y/n): ');
    
    if (testSignup.toLowerCase() === 'y') {
      const testEmail = `test-${Date.now()}@blipee.com`;
      console.log(`\n📧 Creating test account: ${testEmail}`);
      
      const { error: signupError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'TestPassword123!',
        options: {
          data: {
            name: 'SMTP Test User'
          }
        }
      });

      if (signupError) {
        console.error('❌ Signup test failed:', signupError.message);
      } else {
        console.log('✅ Signup email sent!');
        console.log('   Note: This created a test user that you may want to delete later.');
      }
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err);
  } finally {
    rl.close();
  }
}

// Display setup reminder
console.log('='.repeat(60));
console.log('Before running this test, ensure you have:');
console.log('1. ✓ Created an app password in Google Workspace');
console.log('2. ✓ Configured SMTP in Supabase Dashboard');
console.log('3. ✓ Used your @blipee.com email as the sender');
console.log('='.repeat(60));
console.log('');

testBlipeeEmail();