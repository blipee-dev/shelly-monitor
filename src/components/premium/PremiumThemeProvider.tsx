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

interface PremiumThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}

export const PremiumThemeProvider: React.FC<PremiumThemeProviderProps> = ({ 
  children, 
  defaultMode = 'dark' 
}) => {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const [theme, setTheme] = useState(createPremiumTheme(mode));

  // Load saved theme preference
  useEffect(() => {
    const savedMode = localStorage.getItem('premiumThemeMode') as ThemeMode;
    if (savedMode && (savedMode === 'dark' || savedMode === 'light')) {
      setMode(savedMode);
    }
  }, []);

  // Update theme when mode changes
  useEffect(() => {
    const newTheme = createPremiumTheme(mode);
    setTheme(newTheme);
    localStorage.setItem('premiumThemeMode', mode);
    
    // Update document styles
    document.documentElement.setAttribute('data-theme', mode);
    
    // Update body background
    document.body.style.backgroundColor = newTheme.colors.background.primary;
    document.body.style.color = newTheme.colors.text.primary;
  }, [mode]);

  const toggleMode = () => {
    setMode((prevMode) => prevMode === 'dark' ? 'light' : 'dark');
  };

  const value = {
    mode,
    theme,
    toggleMode,
    setMode,
  };

  return (
    <PremiumThemeContext.Provider value={value}>
      {children}
    </PremiumThemeContext.Provider>
  );
};