# Shelly Monitor - Enterprise-Grade IoT Device Monitoring Platform

A comprehensive, enterprise-grade web application for monitoring and controlling Shelly IoT devices. Built with modern technologies including Next.js 14, TypeScript, Supabase, and Material Design 3, this platform provides robust device management, real-time monitoring, advanced analytics, and enterprise security features.

## 🎯 Overview

Shelly Monitor is an enterprise-ready IoT platform that provides comprehensive device management, monitoring, and control capabilities. Designed with scalability, security, and extensibility in mind, it serves as a production-grade solution for businesses and power users managing multiple Shelly devices.

## 🚀 Enterprise Features

### Core Functionality
- **Real-time Device Monitoring**: Live status updates with WebSocket connections
- **Remote Device Control**: Secure control of Shelly Plus 2PM switches and other devices
- **Advanced Analytics**: Comprehensive power consumption tracking and insights
- **Motion Detection**: Real-time motion event monitoring from Shelly Motion 2 sensors
- **Smart Alerting System**: Multi-channel notifications (email, SMS, push, webhooks)
- **Bulk Operations**: Manage multiple devices simultaneously
- **Device Grouping**: Organize devices into logical groups and zones

### Enterprise Capabilities
- **Feature Flags System**: Dynamic feature rollout with user targeting and A/B testing
- **Internationalization (i18n)**: Multi-language support (English, Spanish, and more)
- **Comprehensive Audit Logging**: Track all user actions and system events
- **Advanced Security**: OAuth 2.0, RBAC, encryption at rest, and API key management
- **Performance Monitoring**: Built-in metrics with Prometheus integration
- **Rate Limiting**: Configurable API rate limits with Redis backing
- **Multi-tenant Architecture**: Support for multiple organizations (feature flag controlled)
- **API Documentation**: OpenAPI 3.1 specification with interactive Swagger UI
- **Webhook Integrations**: Connect with external services and automation platforms
- **Data Export**: Multiple format support (CSV, JSON, Excel) with scheduled exports

### Developer Experience
- **TypeScript**: Full type safety across the entire codebase
- **Test Suites**: Unit, integration, and E2E tests with >80% coverage
- **CI/CD Pipeline**: Automated testing and deployment with GitHub Actions
- **Code Quality**: ESLint, Prettier, and security scanning
- **Documentation**: Comprehensive technical and API documentation
- **Development Tools**: Hot reload, error boundary, and debug utilities

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.0+
- **UI Library**: Material UI v5 (Material Design 3)
- **State Management**: Zustand
- **Data Fetching**: SWR
- **Charts**: Recharts
- **Styling**: Emotion + Tailwind CSS

### Backend
- **Runtime**: Node.js 20 LTS
- **API**: Next.js API Routes (Serverless)
- **Database**: PostgreSQL (via Supabase)
- **Real-time**: Supabase Realtime
- **Authentication**: Supabase Auth
- **Validation**: Zod

### Infrastructure
- **Hosting**: Vercel
- **Database**: Supabase
- **Monitoring**: Vercel Analytics
- **Error Tracking**: Sentry
- **CI/CD**: GitHub Actions

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
├─────────────────┬──────────────────┬────────────────────────────┤
│   Web Browser   │  Mobile Browser  │    PWA Installation       │
└────────┬────────┴──────────────────┴────────────┬───────────────┘
         │              HTTPS/WSS                  │
         ▼                                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Application Layer (Vercel)                    │
├─────────────────┬──────────────────┬────────────────────────────┤
│   Next.js App   │  API Routes      │    Edge Functions         │
└────────┬────────┴──────────────────┴────────────┬───────────────┘
         │           Supabase Client               │
         ▼                                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer (Supabase)                       │
├─────────────────┬──────────────────┬────────────────────────────┤
│   PostgreSQL    │   Realtime       │    Auth Service           │
└────────┬────────┴──────────────────┴────────────┬───────────────┘
         │              HTTP/HTTPS                 │
         ▼                                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Device Layer                              │
├─────────────────┬──────────────────┬────────────────────────────┤
│ Shelly Plus 2PM │ Shelly Motion 2  │    Future Devices         │
└─────────────────┴──────────────────┴────────────────────────────┘
```

## 🚦 Getting Started

### Prerequisites
- Node.js 20+ LTS
- npm or yarn
- Supabase account
- PostgreSQL database
- Redis (for rate limiting and caching)
- Shelly devices on your network

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/blipee-dev/shelly-monitor.git
   cd shelly-monitor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**
   Edit `.env.local` with your credentials:
   ```env
   # Core Configuration
   NODE_ENV=development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME="Shelly Monitor"
   
   # Supabase (Required)
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-role-key
   
   # Security
   JWT_SECRET=your-jwt-secret
   SESSION_SECRET=your-session-secret
   ENCRYPTION_KEY=your-32-byte-encryption-key
   
   # Monitoring
   METRICS_AUTH_TOKEN=your-metrics-token
   
   # Optional: External Services
   SENDGRID_API_KEY=your-sendgrid-key        # Email notifications
   TWILIO_AUTH_TOKEN=your-twilio-token       # SMS notifications
   NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn    # Error tracking
   ```

5. **Set up the database**
   ```bash
   # Verify environment configuration
   npm run check:env
   
   # Create tables and run migrations
   npm run db:setup
   
   # Seed with sample data (optional)
   npm run db:seed
   
   # Or run complete setup in one command
   npm run setup:complete
   ```

6. **Verify setup**
   ```bash
   # Test database connection
   npm run test:db
   
   # Check schema is properly created
   npm run check:schema
   
   # Run complete verification
   npm run test:complete
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

8. **Access the application**
   Navigate to `http://localhost:3000`

   **Test Credentials** (if seeded):
   - Admin: `admin@example.com` / `Admin123!`
   - User: `user@example.com` / `User123!`

### Advanced Configuration

1. **Feature Flags**
   - Access the settings panel at `/settings`
   - Enable/disable features dynamically
   - Configure rollout percentages and user targeting

2. **Internationalization**
   - Language files located in `src/lib/i18n/locales/`
   - Add new languages by creating new JSON files
   - Set default language in user preferences

3. **Monitoring Setup**
   - Prometheus metrics available at `/api/metrics`
   - Configure Datadog or LogTail tokens for centralized logging
   - Set up Sentry for error tracking

4. **Security Configuration**
   - Configure CORS settings in `middleware.ts`
   - Set up API rate limits in `src/lib/api/rate-limiter.ts`
   - Configure CSP headers for production

## 🧪 Testing

The application includes comprehensive test suites ensuring reliability and maintainability.

### Test Commands

```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:unit          # Unit tests for components and utilities
npm run test:integration   # Integration tests for API endpoints
npm run test:e2e          # End-to-end tests with Playwright

# Generate coverage report
npm run test:coverage     # Generates coverage in ./coverage directory

# Run tests in watch mode
npm run test -- --watch
```

### Test Structure
```
tests/
├── unit/              # Unit tests for individual components
├── integration/       # API and service integration tests
├── e2e/              # End-to-end user journey tests
├── fixtures/         # Test data and mocks
└── utils/            # Test utilities and helpers
```

### Test Coverage Goals
- Unit Tests: >80% coverage
- Integration Tests: All API endpoints
- E2E Tests: Critical user journeys
- Performance Tests: Load testing for 1000+ concurrent users

## 📘 API Documentation

### Interactive Documentation
Access the interactive API documentation at `/api-docs` when running the application. This provides:
- Live API testing interface
- Request/response examples
- Authentication flow documentation
- WebSocket event documentation

### OpenAPI Specification
The complete OpenAPI 3.1 specification is available at:
- Development: `http://localhost:3000/api/openapi`
- Production: `https://api.shellymonitor.com/v1/openapi`

### API Endpoints Overview
- **Authentication**: `/api/auth/*` - User authentication and session management
- **Devices**: `/api/devices/*` - Device CRUD operations and control
- **Data**: `/api/data/*` - Historical data retrieval and analytics
- **Alerts**: `/api/alerts/*` - Alert configuration and management
- **Settings**: `/api/settings/*` - User preferences and configuration
- **Admin**: `/api/admin/*` - Administrative functions and audit logs

### Rate Limiting
- Global: 1000 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- API endpoints: 100 requests per minute
- Control endpoints: 20 requests per minute

## 🔐 Security Features

### Authentication & Authorization
- **OAuth 2.0**: Support for Google, GitHub, and Microsoft SSO
- **JWT Tokens**: Secure token-based authentication
- **RBAC**: Role-based access control with fine-grained permissions
- **2FA Support**: Time-based one-time passwords (TOTP)
- **Session Management**: Secure session handling with automatic expiry

### Data Security
- **Encryption at Rest**: AES-256 encryption for sensitive data
- **Encryption in Transit**: TLS 1.3 for all communications
- **API Key Management**: Secure API key generation and rotation
- **Credential Vault**: Encrypted storage for device credentials
- **Data Anonymization**: PII removal for analytics and exports

### Application Security
- **OWASP Compliance**: Follows OWASP Top 10 security practices
- **CSP Headers**: Strict Content Security Policy
- **CORS Configuration**: Controlled cross-origin resource sharing
- **Input Validation**: Comprehensive input sanitization with Zod
- **SQL Injection Prevention**: Parameterized queries via Supabase
- **XSS Protection**: React's built-in XSS protection + sanitization

### Monitoring & Compliance
- **Audit Logging**: Comprehensive logging of all user actions
- **Security Headers**: HSTS, X-Frame-Options, X-Content-Type-Options
- **Rate Limiting**: DDoS protection via configurable rate limits
- **Vulnerability Scanning**: Automated dependency scanning
- **GDPR Compliance**: Data export and deletion capabilities

## 🛠️ Development

### Development Workflow

1. **Code Style**
   ```bash
   npm run lint        # Run ESLint
   npm run format      # Format with Prettier
   npm run type-check  # TypeScript type checking
   ```

2. **Database Management**
   ```bash
   npm run db:setup    # Initial database setup
   npm run db:seed     # Seed development data
   npm run generate:types  # Generate TypeScript types from DB
   ```

3. **Bundle Analysis**
   ```bash
   npm run analyze     # Analyze bundle size
   ```

### Development Guidelines
- Follow TypeScript strict mode
- Write tests for all new features
- Document API changes in OpenAPI spec
- Update translations for UI changes
- Add feature flags for experimental features

### Database Management

1. **Running Migrations**
   ```bash
   npm run db:migrate        # Run pending migrations
   npm run db:reset         # Reset and re-run all migrations
   npm run db:seed          # Seed with test data
   ```

2. **Database Scripts**
   - `setup-db.ts` - Initial database setup
   - `seed-data.ts` - Comprehensive test data
   - `simple-seed.ts` - Minimal test data
   - `reset-and-seed.ts` - Reset and seed for development
   - `sync-users.ts` - Sync Supabase auth users
   - `test-complete.ts` - Verify complete setup

3. **Maintenance**
   - Automated partition creation monthly
   - Old data cleanup runs daily at 2 AM
   - Manual maintenance available via scripts

### Git Workflow
- Main branch: Production-ready code
- Develop branch: Integration branch
- Feature branches: `feature/description`
- Hotfix branches: `hotfix/description`

## 🚀 Deployment

### Production Deployment

1. **Prerequisites**
   - Vercel account (recommended) or any Node.js hosting
   - Production Supabase project
   - Redis instance for rate limiting
   - SSL certificates (auto-managed on Vercel)

2. **Environment Setup**
   - Configure all production environment variables
   - Set `NODE_ENV=production`
   - Enable production feature flags

3. **Deployment Steps**
   ```bash
   # Build for production
   npm run build
   
   # Start production server
   npm run start
   ```

4. **Vercel Deployment**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy to Vercel
   vercel --prod
   ```

### Docker Deployment
```dockerfile
# Dockerfile included for containerized deployment
docker build -t shelly-monitor .
docker run -p 3000:3000 shelly-monitor
```

### Health Monitoring
- Health check endpoint: `/api/health`
- Metrics endpoint: `/api/metrics` (Prometheus format)
- Status page integration available

## 🎛️ Feature Flags

The application includes a sophisticated feature flag system for controlled feature rollout.

### Key Features
- **Dynamic Control**: Enable/disable features without deployment
- **User Targeting**: Target specific users or groups
- **A/B Testing**: Percentage-based rollout for gradual deployment
- **Persistent State**: Feature preferences saved locally
- **Admin UI**: Manage flags through the settings interface

### Available Feature Flags
- `ADVANCED_ANALYTICS` - Enhanced analytics dashboard
- `DEVICE_GROUPING` - Device organization features
- `AUTOMATED_SCHEDULES` - Scheduling capabilities
- `ENERGY_INSIGHTS` - Energy consumption recommendations
- `VOICE_CONTROL` - Voice assistant integration
- `BETA_FEATURES` - Early access features
- `EXPORT_DATA` - Data export functionality
- `WEBHOOKS` - External service integration
- `MULTI_TENANT` - Multi-organization support
- `DARK_MODE` - Dark theme option

### Usage in Code
```typescript
// Using the hook
const isEnabled = useFeatureFlag('ADVANCED_ANALYTICS');

// Using the component
<FeatureFlag flag="BETA_FEATURES">
  <BetaComponent />
</FeatureFlag>

// Using the HOC
export default withFeatureFlag('VOICE_CONTROL', VoiceControlPanel);
```

## 🌍 Internationalization (i18n)

Full internationalization support with dynamic language switching.

### Supported Languages
- English (en) - Default
- Spanish (es)
- French (fr) - Coming soon
- German (de) - Coming soon
- Japanese (ja) - Coming soon

### Adding New Languages
1. Create a new locale file in `src/lib/i18n/locales/`
2. Copy the structure from `en.json`
3. Translate all keys
4. Add language to the language selector component

### Usage
```typescript
import { useTranslation } from '@/lib/i18n';

const { t, language, setLanguage } = useTranslation();
const welcomeMessage = t('dashboard.welcome');
```

## 📊 Monitoring & Metrics

### Prometheus Metrics
Access metrics at `/api/metrics` endpoint:
- Request rates and latencies
- Error rates by endpoint
- Active user sessions
- Device operation metrics
- Database query performance

### Available Metrics
- `http_requests_total` - Total HTTP requests
- `http_request_duration_ms` - Request duration histogram
- `device_operations_total` - Device control operations
- `active_websocket_connections` - Real-time connections
- `feature_flag_evaluations` - Feature flag usage

### Integration Examples
```yaml
# Prometheus configuration
scrape_configs:
  - job_name: 'shelly-monitor'
    static_configs:
      - targets: ['shelly-monitor.com']
    metrics_path: '/api/metrics'
```

## 📝 Audit Logging

Comprehensive audit trail for compliance and security.

### Logged Events
- **Authentication**: Login, logout, password changes
- **Device Operations**: Create, update, delete, control
- **Configuration Changes**: Settings updates, feature flag changes
- **Data Access**: Exports, API key usage
- **Security Events**: Failed attempts, rate limiting

### Audit Log Features
- Automatic PII sanitization
- Configurable retention policies
- Export capabilities (CSV, JSON)
- Real-time streaming to SIEM
- Compliance report generation

### Accessing Audit Logs
- Admin UI: `/settings/audit-logs`
- API: `/api/audit-logs`
- Export: `/api/audit-logs/export`

### Log Structure
```json
{
  "id": "uuid",
  "event_type": "DEVICE_CONTROL",
  "severity": "info",
  "user_id": "user123",
  "resource_type": "device",
  "resource_id": "device456",
  "action": "Device turned on",
  "ip_address": "192.168.1.1",
  "timestamp": "2024-01-20T10:30:00Z"
}
```

## 📚 Documentation

- [Technical Specification](./docs/SHELLY_MONITOR_SPECIFICATION.md)
- [Project Structure](./docs/PROJECT_STRUCTURE.md)
- [Implementation Checklist](./docs/IMPLEMENTATION_CHECKLIST.md)
- [API Reference](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Security Best Practices](./docs/SECURITY.md)
- [Performance Optimization](./docs/PERFORMANCE.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Getting Started
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code of Conduct
This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shelly** - For their excellent IoT devices and comprehensive APIs
- **Next.js Team** - For the powerful React framework
- **Supabase** - For the backend infrastructure and real-time capabilities
- **Material Design** - For the design system and components
- **Open Source Community** - For the amazing tools and libraries

## 📞 Support

### Documentation
- 📖 [Full Documentation](https://docs.shellymonitor.com)
- 🐛 [Issue Tracker](https://github.com/blipee-dev/shelly-monitor/issues)
- 💬 [Discussions](https://github.com/blipee-dev/shelly-monitor/discussions)

### Commercial Support
For enterprise support, please contact: enterprise@shellymonitor.com

---

<div align="center">

**Shelly Monitor** - Enterprise-Grade IoT Device Management

Built with ❤️ by the Shelly Monitor Team

</div>