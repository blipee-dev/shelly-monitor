# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.7.0] - 2025-01-07

### Added
- AI-powered automation system with natural language processing
- DeepSeek AI integration as primary provider (cost-optimized)
- Multi-provider AI architecture with automatic fallback
- Ask Blipee enhanced chat assistant for full platform control
- Scenes system for one-tap device control
- Natural language automation creation
- Automation execution logging and history
- Support for 5 Shelly device types (Plus 2PM, Plus 1PM, Motion 2, Dimmer 2, BLU Motion)

### Fixed
- Middleware rate limiting import errors
- FeatureFlagProvider undefined function error
- Next.js 14 metadata/viewport warnings
- Content Security Policy blocking Supabase connections
- MUI Grid v1 deprecation warnings (updated to Grid v2)
- Added placeholder PWA icons

### Changed
- Enhanced device management with real-time updates
- Improved analytics dashboard with AI insights
- Updated to Material UI Grid v2 syntax
- Temporarily disabled rate limiting (to be re-enabled)

## [2.0.0] - 2025-07-04

### Added - Enterprise Grade Features

#### API & Documentation
- OpenAPI 3.1 specification for all API endpoints
- Interactive Swagger UI at `/api-docs`
- Comprehensive API documentation with request/response schemas

#### Database & Infrastructure
- Supabase database migrations with versioning
- Partitioned tables for time-series data optimization
- Row Level Security (RLS) policies
- Automated maintenance with pg_cron
- Database connection pooling

#### Security & Compliance
- Rate limiting middleware with configurable limits
- Redis-backed rate limiter with memory fallback
- Comprehensive audit logging system
- Audit log viewer for administrators
- Security headers and CORS configuration
- API key management

#### Monitoring & Observability
- Prometheus metrics integration
- Custom metrics for devices, API, and system performance
- Alert rules configuration
- Grafana-ready dashboards
- Health check endpoints

#### Testing & Quality
- Comprehensive test suites (unit, integration, E2E)
- Jest configuration with coverage reporting
- Playwright E2E testing setup
- Test utilities and fixtures
- Mock data generators

#### Internationalization
- Multi-language support (English, Spanish)
- Translation management system
- Locale-aware date/time formatting
- Language selector component
- Support for adding new languages

#### Feature Management
- Feature flags system with rollout control
- User and group targeting
- A/B testing capabilities
- Admin UI for flag management
- Runtime feature toggles

#### Developer Experience
- TypeScript strict mode enabled
- ESLint and Prettier configuration
- Git hooks for code quality
- CI/CD pipeline with GitHub Actions
- Docker support with multi-stage builds

### Changed
- Upgraded from basic monitoring to enterprise-grade platform
- Enhanced security with multiple authentication methods
- Improved performance with caching and optimization
- Better error handling and logging throughout

### Security
- Added rate limiting to prevent abuse
- Implemented audit logging for compliance
- Enhanced authentication with JWT tokens
- Added input validation and sanitization

## [1.0.0] - 2025-07-03

### Added
- Initial release
- Basic Shelly device monitoring
- Device control functionality
- Simple authentication
- Basic UI with Material Design