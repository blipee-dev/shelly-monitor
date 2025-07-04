import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import I18nProvider from '@/components/providers/I18nProvider';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { FeatureFlagProvider } from '@/lib/feature-flags';
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
  themeColor: '#0061a4',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Shelly Monitor',
  },
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
            <I18nProvider>
              {children}
            </I18nProvider>
          </ThemeProvider>
        </FeatureFlagProvider>
      </body>
    </html>
  );
}