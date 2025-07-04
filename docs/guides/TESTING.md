# Testing Guidelines - Important Email Notice

## ⚠️ IMPORTANT: Email Testing Restrictions

Supabase has detected bounced emails from our project. To avoid email sending restrictions:

### DO NOT USE:
- ❌ Fake domains (e.g., @shellymonitor.com, @testdomain.com)
- ❌ Invalid email formats
- ❌ Non-existent email addresses
- ❌ Random test emails

### SAFE TESTING OPTIONS:

1. **Use existing test accounts only:**
   - admin@example.com / Admin123!
   - user@example.com / User123!

2. **For new user testing, disable email confirmations:**
   - Go to Supabase Dashboard → Authentication → Email Auth
   - Disable "Enable email confirmations"
   - This prevents any emails from being sent

3. **Use valid test email services:**
   - Your real email address
   - Temporary email services (use sparingly):
     - 10minutemail.com addresses
     - tempmail.org addresses
   - Gmail aliases (yourname+test@gmail.com)

4. **Local development testing:**
   - Use the service role for creating test users
   - This bypasses email confirmation entirely

## Recommended Testing Approach

### For Development:
```bash
# Use existing seeded accounts
Email: admin@example.com
Password: Admin123!
```

### For Testing New Users:
1. Disable email confirmations in Supabase
2. Use the service role script: `npx tsx scripts/test-signup-service-role.ts`
3. Clean up test users after testing

### For Production:
1. Set up custom SMTP (SendGrid, Mailgun, etc.)
2. Implement email validation before signup
3. Use proper email verification flow

## Scripts to Avoid

DO NOT run these scripts with invalid emails:
- ❌ create-test-users.ts (if using fake domains)
- ❌ test-signup-flow.ts (if using fake domains)

## Safe Scripts

These scripts are safe to use:
- ✅ simple-test-login.ts (uses existing users)
- ✅ test-signup-service-role.ts (bypasses email)

## Next Steps

1. Configure custom SMTP in Supabase Dashboard
2. Add email validation to the signup form
3. Use only valid email addresses for testing