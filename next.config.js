/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable experimental features
  experimental: {
    typedRoutes: false,
  },
  
  // Disable ESLint during builds temporarily
  eslint: {
    ignoreDuringBuilds: true,
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
            value: process.env.NODE_ENV === 'development' 
              ? "default-src 'self' https://hdkibjbrfrhqedzbgvek.supabase.co https://vercel.live; connect-src 'self' https://hdkibjbrfrhqedzbgvek.supabase.co wss://hdkibjbrfrhqedzbgvek.supabase.co https://api.deepseek.com https://api.openai.com https://api.anthropic.com ws://localhost:* wss://localhost:* https://vercel.live; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
              : "default-src 'self' https://hdkibjbrfrhqedzbgvek.supabase.co; connect-src 'self' https://hdkibjbrfrhqedzbgvek.supabase.co wss://hdkibjbrfrhqedzbgvek.supabase.co https://api.deepseek.com https://api.openai.com https://api.anthropic.com; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
          }
        ]
      }
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      // Commented out temporarily to fix build issue
      // {
      //   source: '/',
      //   destination: '/dashboard',
      //   permanent: false,
      // },
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