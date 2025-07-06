import type { Metadata, Viewport } from 'next';
import { Roboto } from 'next/font/google';
import { Providers } from './providers';
import '../styles/globals.css';

const roboto = Roboto({ 
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Blipee OS',
  description: 'Monitor and control your Shelly devices',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Blipee OS',
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}