# Shelly Monitor - Project Structure & Implementation Guide

## Complete Project Directory Structure

```
shelly-monitor/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Continuous Integration workflow
│       ├── deploy.yml                # Production deployment workflow
│       └── security.yml              # Security scanning workflow
│
├── public/
│   ├── favicon.ico
│   ├── icons/                        # PWA icons
│   │   ├── icon-192x192.png
│   │   └── icon-512x512.png
│   └── manifest.json                 # PWA manifest
│
├── src/
│   ├── app/                          # Next.js 14 App Router
│   │   ├── (auth)/                   # Auth group layout
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/              # Dashboard group layout
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── devices/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── add/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx
│   │   │   ├── alerts/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.ts
│   │   │   │   └── refresh/
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   ├── devices/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── control/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── status/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── discover/
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   │
│   │   │   ├── data/
│   │   │   │   ├── power/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── motion/
│   │   │   │   │   └── route.ts
│   │   │   │   └── export/
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   ├── alerts/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   │
│   │   │   ├── polling/
│   │   │   │   └── route.ts
│   │   │   │
│   │   │   └── health/
│   │   │       └── route.ts
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing page
│   │   ├── error.tsx                 # Error boundary
│   │   ├── loading.tsx               # Loading state
│   │   └── not-found.tsx             # 404 page
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── AuthGuard.tsx
│   │   │
│   │   ├── charts/
│   │   │   ├── PowerChart.tsx
│   │   │   ├── MotionHeatmap.tsx
│   │   │   ├── EnergyGauge.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── devices/
│   │   │   ├── DeviceCard.tsx
│   │   │   ├── DeviceGrid.tsx
│   │   │   ├── DeviceDetail.tsx
│   │   │   ├── DeviceControl.tsx
│   │   │   ├── AddDeviceModal.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/
│   │   │   ├── Navigation.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── StatusIndicator.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── providers/
│   │       ├── ThemeProvider.tsx
│   │       ├── AuthProvider.tsx
│   │       └── ToastProvider.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useDevices.ts
│   │   ├── useRealtimeData.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   └── index.ts
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   ├── middleware.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── shelly/
│   │   │   ├── client.ts
│   │   │   ├── discovery.ts
│   │   │   ├── types.ts
│   │   │   ├── constants.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── jwt.ts
│   │   │   ├── permissions.ts
│   │   │   └── session.ts
│   │   │
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── errors.ts
│   │   │   └── utils.ts
│   │   │
│   │   └── utils/
│   │       ├── date.ts
│   │       ├── format.ts
│   │       ├── validation.ts
│   │       └── encryption.ts
│   │
│   ├── services/
│   │   ├── analytics.service.ts
│   │   ├── notification.service.ts
│   │   ├── export.service.ts
│   │   ├── device.service.ts
│   │   └── monitoring.service.ts
│   │
│   ├── stores/                       # State management (Zustand)
│   │   ├── authStore.ts
│   │   ├── deviceStore.ts
│   │   ├── alertStore.ts
│   │   └── index.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── themes.css
│   │   └── variables.css
│   │
│   ├── types/
│   │   ├── api.ts
│   │   ├── database.ts
│   │   ├── device.ts
│   │   ├── shelly.ts
│   │   ├── user.ts
│   │   └── index.ts
│   │
│   └── utils/
│       ├── constants.ts
│       ├── config.ts
│       └── env.ts
│
├── tests/
│   ├── unit/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── services/
│   │
│   ├── integration/
│   │   ├── api/
│   │   └── database/
│   │
│   ├── e2e/
│   │   ├── auth.spec.ts
│   │   ├── devices.spec.ts
│   │   └── monitoring.spec.ts
│   │
│   └── fixtures/
│       ├── devices.json
│       └── users.json
│
├── scripts/
│   ├── setup-db.ts
│   ├── seed-data.ts
│   ├── generate-types.ts
│   └── check-env.ts
│
├── docs/
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── DEVELOPMENT.md
│   └── TROUBLESHOOTING.md
│
├── .env.example
├── .env.local
├── .env.production
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── docker-compose.yml
├── Dockerfile
├── jest.config.js
├── next.config.js
├── package.json
├── playwright.config.ts
├── README.md
├── tailwind.config.js
├── tsconfig.json
└── vercel.json
```

## Key Configuration Files

### package.json
```json
{
  "name": "shelly-monitor",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:unit": "jest --testPathPattern=tests/unit",
    "test:integration": "jest --testPathPattern=tests/integration",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage",
    "format": "prettier --write \"**/*.{js,ts,tsx,json,css,md}\"",
    "db:setup": "tsx scripts/setup-db.ts",
    "db:seed": "tsx scripts/seed-data.ts",
    "generate:types": "tsx scripts/generate-types.ts",
    "check:env": "tsx scripts/check-env.ts",
    "analyze": "ANALYZE=true next build"
  },
  "dependencies": {
    "@emotion/react": "^11.11.3",
    "@emotion/styled": "^11.11.0",
    "@mui/material": "^5.15.3",
    "@mui/material-nextjs": "^5.15.3",
    "@supabase/ssr": "^0.1.0",
    "@supabase/supabase-js": "^2.39.3",
    "axios": "^1.6.5",
    "date-fns": "^3.2.0",
    "next": "14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.49.2",
    "recharts": "^2.10.4",
    "swr": "^2.2.4",
    "zod": "^3.22.4",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.1",
    "@testing-library/jest-dom": "^6.2.0",
    "@testing-library/react": "^14.1.2",
    "@types/jest": "^29.5.11",
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.47",
    "@typescript-eslint/eslint-plugin": "^6.18.1",
    "@typescript-eslint/parser": "^6.18.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.1.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-security": "^2.1.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "postcss": "^8.4.33",
    "prettier": "^3.2.2",
    "tailwindcss": "^3.4.1",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
```

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable experimental features
  experimental: {
    serverActions: true,
    typedRoutes: true,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
  
  // Environment variables
  env: {
    APP_VERSION: process.env.npm_package_version,
  },
  
  // Image optimization
  images: {
    domains: ['localhost'],
  },
  
  // Bundle analyzer
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/services/*": ["./src/services/*"],
      "@/stores/*": ["./src/stores/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  
  "crons": [
    {
      "path": "/api/polling",
      "schedule": "*/5 * * * *"
    }
  ],
  
  "functions": {
    "src/app/api/polling/route.ts": {
      "maxDuration": 60
    },
    "src/app/api/data/export/route.ts": {
      "maxDuration": 300
    }
  },
  
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-store, max-age=0"
        }
      ]
    }
  ],
  
  "env": {
    "NEXT_PUBLIC_APP_URL": "@app_url",
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key"
  },
  
  "build": {
    "env": {
      "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_role_key",
      "CRON_SECRET": "@cron_secret"
    }
  }
}
```

## Database Migration Files

### supabase/migrations/001_initial_schema.sql
```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Create enum types
CREATE TYPE device_type AS ENUM ('plus_2pm', 'motion_2');
CREATE TYPE alert_type AS ENUM ('offline', 'motion', 'power_threshold', 'battery_low');
CREATE TYPE user_role AS ENUM ('admin', 'user', 'viewer');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role user_role DEFAULT 'user',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Devices table
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type device_type NOT NULL,
    model VARCHAR(100),
    ip_address INET NOT NULL,
    mac_address VARCHAR(17) UNIQUE,
    firmware_version VARCHAR(50),
    auth_enabled BOOLEAN DEFAULT false,
    auth_username VARCHAR(255),
    auth_password_encrypted TEXT,
    settings JSONB DEFAULT '{}',
    last_seen TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, ip_address)
);

-- Device status table (current state)
CREATE TABLE device_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    online BOOLEAN DEFAULT false,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(device_id)
);

-- Power readings table (partitioned by month)
CREATE TABLE power_readings (
    id UUID DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    channel INTEGER CHECK (channel IN (0, 1)) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    power FLOAT,
    voltage FLOAT,
    current FLOAT,
    energy FLOAT,
    power_factor FLOAT,
    temperature FLOAT,
    PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

-- Motion events table (partitioned by month)
CREATE TABLE motion_events (
    id UUID DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    light_level FLOAT,
    temperature FLOAT,
    battery_percent INTEGER,
    vibration BOOLEAN DEFAULT false,
    PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

-- Alerts configuration
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type alert_type NOT NULL,
    condition JSONB NOT NULL,
    actions JSONB NOT NULL DEFAULT '[]',
    enabled BOOLEAN DEFAULT true,
    last_triggered TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alert history
CREATE TABLE alert_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID REFERENCES alerts(id) ON DELETE CASCADE,
    triggered_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    notification_sent BOOLEAN DEFAULT false,
    details JSONB
);

-- Audit logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    result VARCHAR(20),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_devices_type ON devices(type);
CREATE INDEX idx_devices_last_seen ON devices(last_seen);
CREATE INDEX idx_device_status_device_id ON device_status(device_id);
CREATE INDEX idx_device_status_updated_at ON device_status(updated_at);
CREATE INDEX idx_power_readings_device_timestamp ON power_readings(device_id, timestamp DESC);
CREATE INDEX idx_motion_events_device_timestamp ON motion_events(device_id, timestamp DESC);
CREATE INDEX idx_alerts_device_id ON alerts(device_id);
CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_enabled ON alerts(enabled);
CREATE INDEX idx_alert_history_alert_id ON alert_history(alert_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Create partitions for the current and next 3 months
DO $$
DECLARE
    start_date date;
    end_date date;
    partition_name text;
BEGIN
    FOR i IN 0..3 LOOP
        start_date := date_trunc('month', CURRENT_DATE + (i || ' month')::interval);
        end_date := start_date + interval '1 month';
        
        -- Power readings partitions
        partition_name := 'power_readings_' || to_char(start_date, 'YYYY_MM');
        EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF power_readings FOR VALUES FROM (%L) TO (%L)',
            partition_name, start_date, end_date);
            
        -- Motion events partitions
        partition_name := 'motion_events_' || to_char(start_date, 'YYYY_MM');
        EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF motion_events FOR VALUES FROM (%L) TO (%L)',
            partition_name, start_date, end_date);
    END LOOP;
END $$;

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE power_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE motion_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (example for basic user isolation)
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);
    
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);
    
CREATE POLICY "Users can view own devices" ON devices
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can insert own devices" ON devices
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Users can update own devices" ON devices
    FOR UPDATE USING (auth.uid() = user_id);
    
CREATE POLICY "Users can delete own devices" ON devices
    FOR DELETE USING (auth.uid() = user_id);

-- Create scheduled jobs for maintenance
SELECT cron.schedule(
    'cleanup-old-data',
    '0 2 * * *', -- Run at 2 AM daily
    $$
    DELETE FROM power_readings WHERE timestamp < NOW() - INTERVAL '90 days';
    DELETE FROM motion_events WHERE timestamp < NOW() - INTERVAL '90 days';
    DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '180 days';
    $$
);

SELECT cron.schedule(
    'create-future-partitions',
    '0 0 1 * *', -- Run on the 1st of every month
    $$
    DO $partition$
    DECLARE
        start_date date;
        end_date date;
        partition_name text;
    BEGIN
        -- Create partition for next month
        start_date := date_trunc('month', CURRENT_DATE + interval '3 months');
        end_date := start_date + interval '1 month';
        
        partition_name := 'power_readings_' || to_char(start_date, 'YYYY_MM');
        EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF power_readings FOR VALUES FROM (%L) TO (%L)',
            partition_name, start_date, end_date);
            
        partition_name := 'motion_events_' || to_char(start_date, 'YYYY_MM');
        EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF motion_events FOR VALUES FROM (%L) TO (%L)',
            partition_name, start_date, end_date);
    END $partition$;
    $$
);
```

## Environment Variables Template

### .env.example
```bash
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Shelly Monitor"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret

# Encryption
ENCRYPTION_KEY=your-32-byte-encryption-key

# Cron Jobs
CRON_SECRET=your-cron-secret

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@shellymonitor.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Push Notifications
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
MIXPANEL_TOKEN=your-mixpanel-token

# Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_AUTH_TOKEN=your-sentry-auth-token
SENTRY_ORG=your-org
SENTRY_PROJECT=shelly-monitor

# External Integrations
IFTTT_KEY=your-ifttt-key
HASS_URL=http://homeassistant.local:8123
HASS_TOKEN=your-home-assistant-token

# Monitoring
LOGTAIL_TOKEN=your-logtail-token
DATADOG_API_KEY=your-datadog-api-key

# Feature Flags
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_EXPORTS=true
```

## Docker Configuration

### Dockerfile
```dockerfile
# Dependencies stage
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

# Security: Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set environment
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Security headers and configuration
COPY security.json .

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

CMD ["node", "server.js"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: shelly-monitor
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - shelly-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # Optional: Local development database
  postgres:
    image: postgres:16-alpine
    container_name: shelly-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: shelly_monitor
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./supabase/migrations:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    networks:
      - shelly-network
    profiles:
      - development

  # Optional: Redis for caching
  redis:
    image: redis:7-alpine
    container_name: shelly-cache
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - shelly-network
    profiles:
      - development

networks:
  shelly-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
```

## GitHub Actions Workflows

### .github/workflows/ci.yml
```yaml
name: Continuous Integration

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '20'

jobs:
  lint:
    name: Lint Code
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run TypeScript check
        run: npm run type-check
      
      - name: Check formatting
        run: npx prettier --check .

  test:
    name: Run Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Setup test database
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        run: |
          npm run db:setup
          npm run db:seed
      
      - name: Run unit tests
        run: npm run test:unit -- --coverage
      
      - name: Run integration tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        run: npm run test:integration
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  build:
    name: Build Application
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-files
          path: .next
          retention-days: 7

  security:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run security audit
        run: npm audit --production
      
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build-files
          path: .next
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          TEST_URL: http://localhost:3000
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Implementation Notes

This project structure provides:

1. **Scalable Architecture**: Modular design with clear separation of concerns
2. **Type Safety**: Full TypeScript implementation with strict typing
3. **Testing Strategy**: Comprehensive test coverage (unit, integration, E2E)
4. **Security First**: Built-in security measures and best practices
5. **Performance Optimized**: Code splitting, lazy loading, and caching strategies
6. **Developer Experience**: Hot reloading, linting, formatting, and type checking
7. **Production Ready**: Docker support, CI/CD pipelines, and monitoring
8. **Maintainable**: Clear documentation and consistent code structure

The structure follows Next.js 14 App Router conventions and industry best practices for production applications.