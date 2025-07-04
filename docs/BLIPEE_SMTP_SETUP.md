# Setting Up Google Workspace SMTP for blipee.com

## Overview

Since you're using Google Workspace with blipee.com, you have professional email capabilities with higher limits and better branding than regular Gmail.

## Benefits of Google Workspace SMTP

- Send from your domain: `noreply@blipee.com` or `notifications@blipee.com`
- Higher limits: 2,000 emails/day per user
- Better deliverability and professional appearance
- Less likely to be marked as spam

## Setup Steps

### 1. Create a Dedicated Email Account (Optional but Recommended)

1. Go to [Google Admin Console](https://admin.google.com)
2. Navigate to **Directory** → **Users**
3. Create a new user for transactional emails:
   - Username: `noreply` or `notifications`
   - Full email: `noreply@blipee.com`
   - Set a strong password

### 2. Enable 2-Factor Authentication

1. Sign in to the account you'll use for SMTP
2. Go to https://myaccount.google.com/security
3. Enable 2-Step Verification

### 3. Generate App Password

1. While logged into the SMTP account, go to https://myaccount.google.com/apppasswords
2. Select "Mail" and your device
3. Click "Generate"
4. Copy the 16-character password

### 4. Configure Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Scroll to **SMTP Settings**
4. Enable **"Enable Custom SMTP"**
5. Enter these settings:

```
SMTP Host: smtp.gmail.com
Port Number: 587
Username: noreply@blipee.com
Password: [Your 16-character app password]
Sender email: noreply@blipee.com
Sender name: Shelly Monitor
```

### 5. Update Email Templates (Optional)

In Supabase Dashboard → Authentication → Email Templates, you can customize:
- Confirmation emails
- Password reset emails
- Magic link emails

Example footer:
```
© 2025 Blipee - Smart Home Monitoring
This is an automated message from noreply@blipee.com
```

## DNS Configuration (If Not Already Done)

For best deliverability, ensure these DNS records are set:

### SPF Record
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all
```

### DKIM
1. In Google Admin → Apps → Google Workspace → Gmail → Authenticate email
2. Generate DKIM key
3. Add the provided TXT record to your DNS

### DMARC (Optional but Recommended)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:admin@blipee.com
```

## Testing Your Configuration

### Quick Test Script
Create `test-blipee-smtp.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testBlipeeEmail() {
  // Test with your personal blipee.com email
  const { error } = await supabase.auth.resetPasswordForEmail(
    'your-email@blipee.com'
  );
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('✅ Password reset email sent! Check your inbox.');
  }
}

testBlipeeEmail();
```

## Email Limits

With Google Workspace:
- **Per user**: 2,000 emails/day
- **Recipients**: 10,000/day
- **Size**: 25MB per email

## Best Practices for blipee.com

1. **Use descriptive sender addresses**:
   - `noreply@blipee.com` - For automated notifications
   - `support@blipee.com` - For support-related emails
   - `alerts@blipee.com` - For device alerts

2. **Monitor usage** in Google Admin Console

3. **Set up email groups** for different purposes if needed

4. **Consider email aliases** instead of multiple accounts

## Troubleshooting

### "Invalid credentials"
- Ensure you're using the app password, not your regular password
- Username must be full email: `noreply@blipee.com`

### Emails not arriving
- Check spam folders
- Verify SPF/DKIM records
- Check Google Workspace admin logs

### Rate limit errors
- Monitor daily usage
- Consider multiple sender accounts
- Implement application-level rate limiting

## Next Steps

1. Set up SMTP in Supabase with your blipee.com account
2. Test email delivery
3. Update all email templates with blipee.com branding
4. Monitor delivery metrics in Google Workspace admin

## Production Considerations

When Shelly Monitor grows beyond 2,000 emails/day, consider:
- Multiple Google Workspace accounts
- Dedicated email service (SendGrid, Mailgun)
- Transactional email API integration