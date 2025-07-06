'use client';

import { FeatureFlagProvider } from '@/lib/feature-flags';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { SnackbarProvider } from '@/components/providers/SnackbarProvider';
import I18nProvider from '@/components/providers/I18nProvider';
import { PWAProvider } from '@/components/providers/PWAProvider';
import { HydrationWrapper } from '@/components/providers/HydrationWrapper';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HydrationWrapper>
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
    </HydrationWrapper>
  );
}