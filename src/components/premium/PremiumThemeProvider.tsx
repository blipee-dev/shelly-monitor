'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode, createPremiumTheme } from '@/lib/theme/premium-theme-v2';

interface PremiumThemeContextType {
  mode: ThemeMode;
  theme: ReturnType<typeof createPremiumTheme>;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

const PremiumThemeContext = createContext<PremiumThemeContextType | undefined>(undefined);

export const usePremiumTheme = () => {
  const context = useContext(PremiumThemeContext);
  if (!context) {
    throw new Error('usePremiumTheme must be used within a PremiumThemeProvider');
  }
  return context;
};

export const useThemeMode = () => {
  const { mode, setMode } = usePremiumTheme();
  return { mode, setMode };
};

interface PremiumThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}

export const PremiumThemeProvider: React.FC<PremiumThemeProviderProps> = ({ 
  children, 
  defaultMode = 'dark' 
}) => {
  // Initialize with the provided default mode
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const [theme, setTheme] = useState(createPremiumTheme(defaultMode));

  // Listen for theme changes from other components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Listen for storage changes from other tabs
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'theme-mode' && e.newValue) {
          const newMode = e.newValue as ThemeMode;
          if (newMode === 'dark' || newMode === 'light') {
            setMode(newMode);
          }
        }
      };

      window.addEventListener('storage', handleStorageChange);
      
      // Listen for custom events from the same window
      const handleThemeChange = (e: CustomEvent) => {
        const newMode = e.detail as ThemeMode;
        if (newMode === 'dark' || newMode === 'light') {
          setMode(newMode);
        }
      };
      
      window.addEventListener('theme-change', handleThemeChange as EventListener);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('theme-change', handleThemeChange as EventListener);
      };
    }
  }, []);

  // Update theme when mode changes
  useEffect(() => {
    const newTheme = createPremiumTheme(mode);
    setTheme(newTheme);
    
    // Update document on client side
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', mode);
    }
  }, [mode]);

  // Toggle mode and update main theme
  const toggleMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    
    // Only update localStorage on client side
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-mode', newMode);
      // Dispatch custom event for same-window updates
      window.dispatchEvent(new CustomEvent('theme-change', { detail: newMode }));
    }
  };

  // Set mode and update main theme
  const setModeWrapper = (newMode: ThemeMode) => {
    setMode(newMode);
    
    // Only update localStorage on client side
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-mode', newMode);
      // Dispatch custom event for same-window updates
      window.dispatchEvent(new CustomEvent('theme-change', { detail: newMode }));
    }
  };

  const value = {
    mode,
    theme,
    toggleMode,
    setMode: setModeWrapper,
  };

  return (
    <PremiumThemeContext.Provider value={value}>
      {children}
    </PremiumThemeContext.Provider>
  );
};