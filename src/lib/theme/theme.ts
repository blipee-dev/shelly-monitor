/**
 * Material Design 3 Theme Configuration
 * Enterprise-grade theme setup with full MD3 support
 */

import { createTheme, ThemeOptions, alpha } from '@mui/material/styles';
import { lightColorScheme, darkColorScheme, elevationOpacities } from './colors';
import { md3Typography } from './typography';

// Extend MUI theme to include MD3 color properties
declare module '@mui/material/styles' {
  interface TypeBackground {
    default: string;
    paper: string;
    surfaceVariant: string;
    surfaceContainerLowest: string;
    surfaceContainerLow: string;
    surfaceContainer: string;
    surfaceContainerHigh: string;
    surfaceContainerHighest: string;
  }
  
  interface SimplePaletteColorOptions {
    container?: string;
    onContainer?: string;
  }
  
  interface PaletteColor {
    container: string;
    onContainer: string;
  }
  
  interface Palette {
    tertiary: PaletteColor;
    onTertiary: PaletteColor;
    outline: string;
    outlineVariant: string;
    surfaceVariant: string;
    onSurfaceVariant: string;
  }
  
  interface PaletteOptions {
    tertiary: SimplePaletteColorOptions;
    onTertiary: SimplePaletteColorOptions;
    outline: string;
    outlineVariant: string;
    surfaceVariant: string;
    onSurfaceVariant: string;
  }
  
  interface TypographyVariants {
    displayLarge: React.CSSProperties;
    displayMedium: React.CSSProperties;
    displaySmall: React.CSSProperties;
    headlineLarge: React.CSSProperties;
    headlineMedium: React.CSSProperties;
    headlineSmall: React.CSSProperties;
    titleLarge: React.CSSProperties;
    titleMedium: React.CSSProperties;
    titleSmall: React.CSSProperties;
    bodyLarge: React.CSSProperties;
    bodyMedium: React.CSSProperties;
    bodySmall: React.CSSProperties;
    labelLarge: React.CSSProperties;
    labelMedium: React.CSSProperties;
    labelSmall: React.CSSProperties;
  }
  
  interface TypographyVariantsOptions {
    displayLarge?: React.CSSProperties;
    displayMedium?: React.CSSProperties;
    displaySmall?: React.CSSProperties;
    headlineLarge?: React.CSSProperties;
    headlineMedium?: React.CSSProperties;
    headlineSmall?: React.CSSProperties;
    titleLarge?: React.CSSProperties;
    titleMedium?: React.CSSProperties;
    titleSmall?: React.CSSProperties;
    bodyLarge?: React.CSSProperties;
    bodyMedium?: React.CSSProperties;
    bodySmall?: React.CSSProperties;
    labelLarge?: React.CSSProperties;
    labelMedium?: React.CSSProperties;
    labelSmall?: React.CSSProperties;
  }
}

// Update typography component props
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    displayLarge: true;
    displayMedium: true;
    displaySmall: true;
    headlineLarge: true;
    headlineMedium: true;
    headlineSmall: true;
    titleLarge: true;
    titleMedium: true;
    titleSmall: true;
    bodyLarge: true;
    bodyMedium: true;
    bodySmall: true;
    labelLarge: true;
    labelMedium: true;
    labelSmall: true;
  }
}

// Shape configuration following MD3
const shape = {
  borderRadius: 12, // Medium rounding (MD3 default)
  borderRadiusSmall: 8,
  borderRadiusMedium: 12,
  borderRadiusLarge: 16,
  borderRadiusExtraLarge: 28,
};

// Create base theme configuration
const createBaseTheme = (mode: 'light' | 'dark'): ThemeOptions => {
  const colors = mode === 'light' ? lightColorScheme : darkColorScheme;
  
  return {
    palette: {
      mode,
      primary: {
        main: colors.primary,
        light: colors.primaryContainer,
        dark: colors.onPrimaryContainer,
        contrastText: colors.onPrimary,
        container: colors.primaryContainer,
        onContainer: colors.onPrimaryContainer,
      },
      secondary: {
        main: colors.secondary,
        light: colors.secondaryContainer,
        dark: colors.onSecondaryContainer,
        contrastText: colors.onSecondary,
        container: colors.secondaryContainer,
        onContainer: colors.onSecondaryContainer,
      },
      tertiary: {
        main: colors.tertiary,
        light: colors.tertiaryContainer,
        dark: colors.onTertiaryContainer,
        contrastText: colors.onTertiary,
        container: colors.tertiaryContainer,
        onContainer: colors.onTertiaryContainer,
      },
      error: {
        main: colors.error,
        light: colors.errorContainer,
        dark: colors.onErrorContainer,
        contrastText: colors.onError,
        container: colors.errorContainer,
        onContainer: colors.onErrorContainer,
      },
      background: {
        default: colors.background,
        paper: colors.surface,
        surfaceVariant: colors.surfaceVariant,
        surfaceContainerLowest: colors.surfaceContainerLowest,
        surfaceContainerLow: colors.surfaceContainerLow,
        surfaceContainer: colors.surfaceContainer,
        surfaceContainerHigh: colors.surfaceContainerHigh,
        surfaceContainerHighest: colors.surfaceContainerHighest,
      },
      text: {
        primary: colors.onBackground,
        secondary: colors.onSurfaceVariant,
      },
      divider: colors.outlineVariant,
      outline: colors.outline,
      outlineVariant: colors.outlineVariant,
      surfaceVariant: colors.surfaceVariant,
      onSurfaceVariant: colors.onSurfaceVariant,
      onTertiary: {
        main: colors.onTertiary,
        container: colors.tertiaryContainer,
        onContainer: colors.onTertiaryContainer,
      },
    },
    typography: md3Typography,
    shape: {
      borderRadius: shape.borderRadiusMedium,
    },
    spacing: 8, // 8px base spacing
  };
};

// Component overrides following MD3 specifications
const getComponentOverrides = (mode: 'light' | 'dark') => {
  const colors = mode === 'light' ? lightColorScheme : darkColorScheme;
  
  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: `${colors.onSurfaceVariant} ${colors.surface}`,
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 12,
            height: 12,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: colors.onSurfaceVariant,
            border: `3px solid ${colors.surface}`,
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            borderRadius: 8,
            backgroundColor: colors.surface,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20, // Full rounding for buttons
          textTransform: 'none' as const,
          fontWeight: 500,
          padding: '10px 24px',
          transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: `0px 1px 2px ${alpha(colors.shadow, 0.3)}`,
          },
        },
        outlined: {
          borderColor: colors.outline,
          '&:hover': {
            backgroundColor: alpha(colors.primary, 0.08),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadiusLarge,
          boxShadow: 'none',
          backgroundColor: colors.surfaceContainerLow,
          border: `1px solid ${colors.outlineVariant}`,
          transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
          '&:hover': {
            backgroundColor: colors.surfaceContainer,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: shape.borderRadiusMedium,
        },
        elevation1: {
          boxShadow: `0px 1px 2px ${alpha(colors.shadow, 0.3)}, 0px 1px 3px 1px ${alpha(colors.shadow, 0.15)}`,
        },
        elevation2: {
          boxShadow: `0px 1px 2px ${alpha(colors.shadow, 0.3)}, 0px 2px 6px 2px ${alpha(colors.shadow, 0.15)}`,
        },
        elevation3: {
          boxShadow: `0px 4px 8px 3px ${alpha(colors.shadow, 0.15)}, 0px 1px 3px ${alpha(colors.shadow, 0.3)}`,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined' as const,
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: shape.borderRadiusSmall,
            '& fieldset': {
              borderColor: colors.outline,
            },
            '&:hover fieldset': {
              borderColor: colors.onSurfaceVariant,
            },
            '&.Mui-focused fieldset': {
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadiusSmall,
          fontWeight: 500,
        },
        outlined: {
          borderColor: colors.outline,
          '&:hover': {
            backgroundColor: alpha(colors.onSurfaceVariant, 0.08),
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.surface,
          color: colors.onSurface,
          boxShadow: 'none',
          borderBottom: `1px solid ${colors.outlineVariant}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.surfaceContainerLow,
          borderRight: `1px solid ${colors.outlineVariant}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: shape.borderRadiusExtraLarge,
          backgroundColor: colors.surfaceContainerHigh,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          padding: 8,
        },
        switchBase: {
          '&.Mui-checked': {
            '& + .MuiSwitch-track': {
              backgroundColor: colors.primary,
              opacity: 1,
            },
          },
        },
        track: {
          borderRadius: 16,
          backgroundColor: colors.surfaceVariant,
          opacity: 1,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '50%',
          '&:hover': {
            backgroundColor: alpha(colors.onSurfaceVariant, 0.08),
          },
        },
      },
    },
  };
};

// Create light theme
export const lightTheme = createTheme({
  ...createBaseTheme('light'),
  components: getComponentOverrides('light'),
});

// Create dark theme
export const darkTheme = createTheme({
  ...createBaseTheme('dark'),
  components: getComponentOverrides('dark'),
});

// Utility to get current theme
export const getTheme = (mode: 'light' | 'dark') => 
  mode === 'light' ? lightTheme : darkTheme;