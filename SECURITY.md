# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Shelly Monitor seriously. If you have discovered a security vulnerability in our project, we appreciate your help in disclosing it to us in a responsible manner.

### Reporting Process

1. **DO NOT** create a public GitHub issue for the vulnerability.
2. Report vulnerabilities via one of these methods:
   - Email: security@shellymonitor.com
   - GitHub Security Advisory: https://github.com/blipee-dev/shelly-monitor/security/advisories/new

### What to Include

Please provide the following information:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 5 business days
- **Resolution Timeline**: Depends on severity
  - Critical: 7 days
  - High: 14 days
  - Medium: 30 days
  - Low: 90 days

## Security Best Practices

When using Shelly Monitor, we recommend:

1. **Keep the application updated** to the latest version
2. **Use strong passwords** for all user accounts
3. **Enable HTTPS** in production environments
4. **Regularly rotate** API keys and secrets
5. **Monitor logs** for suspicious activity
6. **Restrict network access** to Shelly devices
7. **Use environment variables** for sensitive configuration

## Security Features

Shelly Monitor implements several security measures:

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Data Encryption**: All sensitive data encrypted at rest and in transit
- **Input Validation**: Comprehensive input validation and sanitization
- **Rate Limiting**: API rate limiting to prevent abuse
- **Security Headers**: Comprehensive security headers (CSP, HSTS, etc.)
- **Audit Logging**: All security-relevant events are logged
- **Dependency Scanning**: Regular automated scanning for vulnerable dependencies

## Acknowledgments

We would like to thank the following individuals for responsibly disclosing security issues:

- [Your name could be here]

## Contact

For any security-related questions, contact: security@shellymonitor.com