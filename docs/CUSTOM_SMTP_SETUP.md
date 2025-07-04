# Setting Up Google/Gmail as Custom SMTP Provider in Supabase

## Overview

Supabase recommends using a custom SMTP provider for production applications to have better control over email delivery, avoid rate limits, and ensure reliable transactional emails. This guide shows how to set up Google/Gmail as your SMTP provider.

## Why Use Custom SMTP?

- **Better deliverability**: Emails sent from your domain are less likely to be marked as spam
- **Higher limits**: Bypass Supabase's default email limits
- **Custom branding**: Send emails from your own domain
- **Better monitoring**: Track delivery metrics and bounces
- **Avoid restrictions**: Prevent account suspension due to bounced emails

## Prerequisites

1. A Google Workspace account (for custom domain) OR Gmail account
2. App-specific password or OAuth2 credentials
3. Access to Supabase Dashboard

## Option 1: Gmail with App Password (Simpler)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled

### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and your device
3. Click "Generate"
4. Copy the 16-character password

### Step 3: Configure Supabase
1. Go to Supabase Dashboard → Settings → Auth
2. Scroll to "SMTP Settings"
3. Enable "Enable Custom SMTP"
4. Enter the following:

```
Host: smtp.gmail.com
Port: 587
User: your-email@gmail.com
Pass: [Your 16-character app password]
Sender email: your-email@gmail.com
Sender name: Shelly Monitor
```

## Option 2: Google Workspace (Professional)

### Benefits
- Send from custom domain (noreply@yourdomain.com)
- Higher sending limits
- Better for production apps

### Setup Steps
1. Ensure you have Google Workspace with your domain
2. Create a dedicated user for SMTP (e.g., noreply@yourdomain.com)
3. Follow the same app password steps as Option 1
4. Use these settings in Supabase:

```
Host: smtp.gmail.com
Port: 587
User: noreply@yourdomain.com
Pass: [App password]
Sender email: noreply@yourdomain.com
Sender name: Shelly Monitor
```

## Option 3: Gmail API with OAuth2 (Most Secure)

For production applications requiring OAuth2:

### Prerequisites
1. Google Cloud Project
2. Gmail API enabled
3. OAuth2 credentials

### Note
This requires additional setup with Google Cloud Console and is beyond basic SMTP configuration. Consider using dedicated email services like SendGrid or Mailgun for this level of integration.

## Testing Your Configuration

1. After saving SMTP settings in Supabase, test by:
   - Creating a new user account
   - Requesting a password reset
   - Checking email delivery

2. Monitor for errors in:
   - Supabase Dashboard → Logs → Auth logs
   - Your Gmail sent folder

## Important Limits

### Gmail Free Account
- 500 emails per day
- 500 recipients per day

### Google Workspace
- 2,000 emails per day
- 10,000 recipients per day

## Best Practices

1. **Use a dedicated email account** for transactional emails
2. **Monitor your daily usage** to avoid hitting limits
3. **Set up SPF and DKIM** records for custom domains
4. **Use email templates** in Supabase for consistent branding
5. **Implement rate limiting** in your application

## Troubleshooting

### "Authentication failed"
- Verify 2FA is enabled
- Regenerate app password
- Check username includes full email

### "Connection timeout"
- Try port 465 with SSL
- Check firewall settings
- Verify host is smtp.gmail.com

### Emails going to spam
- Add SPF/DKIM records
- Use consistent "from" address
- Avoid spam trigger words

## Alternative SMTP Providers

If Google's limits don't meet your needs, consider:

1. **SendGrid** - 100 emails/day free
2. **Mailgun** - 5,000 emails/month free
3. **Amazon SES** - $0.10 per 1,000 emails
4. **Postmark** - 100 emails/month free

## Next Steps

1. Set up SMTP in Supabase Dashboard
2. Test email delivery
3. Monitor bounce rates
4. Consider upgrading to dedicated email service for production

## Security Notes

- Never commit SMTP credentials to version control
- Use environment variables for credentials
- Rotate app passwords regularly
- Monitor for unusual activity