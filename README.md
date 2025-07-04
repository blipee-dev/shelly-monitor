# Shelly Monitor - IoT Device Monitoring Application

A comprehensive, production-grade web application for monitoring and controlling Shelly Plus 2PM and Shelly Motion 2 devices. Built with Next.js 14, TypeScript, Supabase, and Material Design 3.

## 🎯 Overview

Shelly Monitor provides a centralized dashboard for managing your Shelly IoT devices, offering real-time monitoring, remote control, data visualization, and intelligent alerts. The application is designed for scalability, security, and optimal user experience.

## 🚀 Key Features

- **Real-time Device Monitoring**: Live status updates for all connected devices
- **Remote Control**: Control Shelly Plus 2PM switches from anywhere
- **Power Analytics**: Track energy consumption with detailed charts and reports
- **Motion Detection**: Monitor motion events from Shelly Motion 2 sensors
- **Smart Alerts**: Customizable notifications for device events
- **Data Export**: Export historical data in multiple formats
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Secure Architecture**: Enterprise-grade security implementation

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
   # Edit .env.local with your credentials
   ```

4. **Set up the database**
   ```bash
   # Create a Supabase project at https://supabase.com
   # Run the migrations in supabase/migrations/
   npm run db:setup
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   Navigate to `http://localhost:3000`

### Configuration

1. **Supabase Setup**
   - Create a new project at [Supabase](https://supabase.com)
   - Copy your project URL and anon key to `.env.local`
   - Run the database migrations

2. **Device Setup**
   - Ensure your Shelly devices are on the same network
   - Enable HTTP API on your Shelly devices
   - Note the IP addresses of your devices

## 📊 Project Status

🚧 **Currently in Development** 🚧

- [x] Phase 1: Project Foundation (Day 1 Complete)
- [ ] Phase 2: Core Infrastructure (Days 4-6)
- [ ] Phase 3: Shelly Integration (Days 7-9)
- [ ] Phase 4: User Interface (Days 10-12)
- [ ] Phase 5: Advanced Features (Days 13-15)
- [ ] Phase 6: Testing & Security (Days 16-17)
- [ ] Phase 7: Deployment & Launch (Days 18-20)

## 🔐 Security Features

- TLS 1.3 encryption for all communications
- Secure credential storage with encryption
- Role-based access control (RBAC)
- Rate limiting on all APIs
- OWASP Top 10 compliance
- Regular security audits
- Comprehensive audit logging

## 📈 Performance Targets

- Page load time < 2 seconds
- API response time < 200ms
- Device control latency < 500ms
- Support for 100+ devices per user
- 99.9% uptime SLA

## 🧪 Testing

```bash
# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run all tests with coverage
npm run test:coverage
```

## 📚 Documentation

- [Technical Specification](./docs/SHELLY_MONITOR_SPECIFICATION.md)
- [Project Structure](./docs/PROJECT_STRUCTURE.md)
- [Implementation Checklist](./docs/IMPLEMENTATION_CHECKLIST.md)
- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🤝 Contributing

While this project is currently under initial development, contributions will be welcome once the core functionality is complete. Please check back later for contribution guidelines.

## 📄 License

This project is currently private. License information will be added upon public release.

## 🙏 Acknowledgments

- Shelly for their excellent IoT devices and APIs
- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- Material Design team for the design system

## 📞 Support

For questions about this project:
- Review the documentation in the `/docs` folder
- Check the implementation checklist
- Open an issue on GitHub

---

**Note**: This project is under active development. Features and documentation are being added daily according to the implementation plan.