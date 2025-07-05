// Premium Component Library
// Export all premium components from a single location

// V1 components (dark mode only)
export { PremiumLayout } from './PremiumLayout';
export { GlassCard } from './GlassCard';
export { GradientButton } from './GradientButton';
export { PremiumTextField } from './PremiumTextField';
export { default as AskBlipeePremium } from './AskBlipeePremium';

// V2 components (dark & light mode)
export { PremiumLayoutV2 } from './PremiumLayoutV2';
export { GlassCardV2 } from './GlassCardV2';
export { GradientButtonV2 } from './GradientButtonV2';
export { PremiumTextFieldV2 } from './PremiumTextFieldV2';

// Theme context and utilities
export { PremiumThemeProvider, usePremiumTheme } from './PremiumThemeProvider';
export { ThemeModeToggle } from './ThemeModeToggle';

// Re-export theme utilities from v1
export { 
  premiumTheme, 
  getDynamicBackground, 
  gradientText, 
  glassEffect 
} from '@/lib/theme/premium-theme';

// Re-export theme utilities from v2
export {
  createPremiumTheme,
  type ThemeMode,
} from '@/lib/theme/premium-theme-v2';