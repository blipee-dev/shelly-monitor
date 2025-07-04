# Email/SMTP Configuration Guide

## Overview

This guide covers setting up email functionality for Shelly Monitor using Google Workspace or other SMTP providers.

## Google Workspace Setup

### Prerequisites
- Google Workspace account with your domain
- 2-Factor Authentication enabled
- Admin access to DNS records

### Configuration Steps

1. **Generate App Password**
   - Sign in to your Google account
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and generate password
   - Copy the 16-character password

2. **Configure Supabase SMTP**
   ```
   Host: smtp.gmail.com
   Port: 587
   Username: your-email@yourdomain.com
   Password: [16-character app password]
   Sender email: noreply@yourdomain.com (or your alias)
   Sender name: Your App Name
   ```

3. **Configure DNS Records**
   
   **SPF Record:**
   ```
   Type: TXT
   Name: @
   Value: v=spf1 include:_spf.google.com ~all
   ```

   **DKIM Setup:**
   - Generate in Google Admin Console
   - Add TXT record with provided value
   
   **DMARC (Optional):**
   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:admin@yourdomain.com
   ```

## Alternative SMTP Providers

### SendGrid
- Free tier: 100 emails/day
- Better for production apps
- Dedicated IP options

### Amazon SES
- Pay per use: $0.10 per 1,000 emails
- High deliverability
- Requires domain verification

### Resend
- Modern API
- 3,000 emails/month free
- Great developer experience

## Testing Your Configuration

```bash
# Test SMTP setup
npx tsx scripts/test/test-smtp.ts

# Create test users without sending emails
npx tsx scripts/test/create-test-users.ts
```

## Troubleshooting

### Emails Going to Spam
1. Ensure SPF and DKIM are configured
2. Add sender to contacts
3. Check email content for spam triggers

### Authentication Failed
1. Verify 2FA is enabled
2. Use app password, not regular password
3. Check username is full email address

### Rate Limits
- Gmail: 500 emails/day (free), 2,000/day (Workspace)
- Monitor usage to avoid limits
- Consider dedicated service for high volume

## Best Practices

1. Use dedicated email account for transactional emails
2. Monitor bounce rates
3. Implement proper unsubscribe mechanisms
4. Keep email templates simple and text-focused