'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from './theme';
import { useFeatureFlag } from '@/lib/feature-flags';

interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: 'light' | 'dark';
}

export function ThemeProvider({ children, defaultMode = 'light' }: ThemeProviderProps) {
  const darkModeEnabled = useFeatureFlag('DARK_MODE');
  const [mode, setMode] = useState<'light' | 'dark'>(defaultMode);

  // Load theme preference from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark' | null;
      if (savedMode && darkModeEnabled) {
        setMode(savedMode);
      } else if (!darkModeEnabled) {
        setMode('light');
      }
    }
  }, [darkModeEnabled]);

  // Save theme preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-mode', mode);
    }
  }, [mode]);

  // Check system preference
  useEffect(() => {
    if (typeof window !== 'undefined' && darkModeEnabled) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const savedMode = localStorage.getItem('theme-mode');
        if (!savedMode) {
          setMode(e.matches ? 'dark' : 'light');
        }
      };

      // Set initial mode based on system preference if no saved preference
      const savedMode = localStorage.getItem('theme-mode');
      if (!savedMode) {
        setMode(mediaQuery.matches ? 'dark' : 'light');
      }

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [darkModeEnabled]);

  const toggleTheme = () => {
    if (darkModeEnabled) {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    }
  };

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  const contextValue = useMemo(
    () => ({
      mode,
      toggleTheme,
      setTheme: (newMode: 'light' | 'dark') => {
        if (darkModeEnabled || newMode === 'light') {
          setMode(newMode);
        }
      },
    }),
    [mode, darkModeEnabled]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}