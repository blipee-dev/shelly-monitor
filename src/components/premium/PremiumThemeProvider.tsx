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
  // Initialize with default mode
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const [theme, setTheme] = useState(createPremiumTheme(defaultMode));
  const [mounted, setMounted] = useState(false);

  // Sync with main theme through localStorage after mount
  useEffect(() => {
    setMounted(true);
    
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      // Check the main theme's localStorage key
      const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
      if (savedMode && (savedMode === 'dark' || savedMode === 'light')) {
        setMode(savedMode);
      }

      // Listen for storage changes from other components
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'theme-mode' && e.newValue) {
          const newMode = e.newValue as ThemeMode;
          if (newMode === 'dark' || newMode === 'light') {
            setMode(newMode);
          }
        }
      };

      window.addEventListener('storage', handleStorageChange);
      
      // Also listen for custom events from the same window
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
    
    // Only update document on client side
    if (mounted && typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', mode);
    }
  }, [mode, mounted]);

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

  // Prevent SSR mismatch by ensuring consistent initial render
  if (!mounted) {
    // Return children with default theme during SSR
    return (
      <PremiumThemeContext.Provider value={value}>
        {children}
      </PremiumThemeContext.Provider>
    );
  }

  return (
    <PremiumThemeContext.Provider value={value}>
      {children}
    </PremiumThemeContext.Provider>
  );
};