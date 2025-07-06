'use client';

import React, { useEffect, useState } from 'react';
import { ThemeMode } from '@/lib/theme/premium-theme-v2';
import { PremiumThemeProvider } from './PremiumThemeProvider';

interface PremiumThemeWrapperProps {
  children: React.ReactNode;
}

// This wrapper handles the client-side theme detection
export function PremiumThemeWrapper({ children }: PremiumThemeWrapperProps) {
  const [initialMode, setInitialMode] = useState<ThemeMode>('dark');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Get the theme from localStorage on mount
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    if (savedMode && (savedMode === 'dark' || savedMode === 'light')) {
      setInitialMode(savedMode);
    }
    setIsReady(true);
  }, []);

  // During SSR and initial client render, use default theme
  // This prevents hydration mismatch
  if (!isReady) {
    return (
      <PremiumThemeProvider defaultMode="dark">
        {children}
      </PremiumThemeProvider>
    );
  }

  // After mount, use the actual saved theme
  return (
    <PremiumThemeProvider defaultMode={initialMode}>
      {children}
    </PremiumThemeProvider>
  );
}