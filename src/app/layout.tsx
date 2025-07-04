import type { Metadata, Viewport } from 'next';
import { Roboto } from 'next/font/google';
import I18nProvider from '@/components/providers/I18nProvider';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { FeatureFlagProvider } from '@/lib/feature-flags';
import { SnackbarProvider } from '@/components/providers/SnackbarProvider';
import { PWAProvider } from '@/components/providers/PWAProvider';
import '../styles/globals.css';

const roboto = Roboto({ 
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Shelly Monitor',
  description: 'Monitor and control your Shelly devices',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Shelly Monitor',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0061a4',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <FeatureFlagProvider>
          <ThemeProvider>
            <SnackbarProvider>
              <I18nProvider>
                <PWAProvider>
                  {children}
                </PWAProvider>
              </I18nProvider>
            </SnackbarProvider>
          </ThemeProvider>
        </FeatureFlagProvider>
      </body>
    </html>
  );
}