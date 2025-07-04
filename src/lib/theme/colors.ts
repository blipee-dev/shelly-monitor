/**
 * Material Design 3 Color System
 * Generated following MD3 color guidelines
 */

export interface MD3ColorScheme {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  
  background: string;
  onBackground: string;
  
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  
  outline: string;
  outlineVariant: string;
  
  shadow: string;
  scrim: string;
  
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  
  // Additional MD3 surface levels
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
}

// Light theme colors - Blue/Teal scheme for IoT monitoring
export const lightColorScheme: MD3ColorScheme = {
  // Primary - Blue for main actions and navigation
  primary: '#0061a4',
  onPrimary: '#ffffff',
  primaryContainer: '#d1e4ff',
  onPrimaryContainer: '#001d36',
  
  // Secondary - Teal for device status and secondary actions
  secondary: '#4a6267',
  onSecondary: '#ffffff',
  secondaryContainer: '#cde7ec',
  onSecondaryContainer: '#051f23',
  
  // Tertiary - Orange for alerts and warnings
  tertiary: '#825500',
  onTertiary: '#ffffff',
  tertiaryContainer: '#ffddb3',
  onTertiaryContainer: '#291800',
  
  // Error colors
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#410002',
  
  // Background and surface
  background: '#fdfcff',
  onBackground: '#1a1c1e',
  
  surface: '#fdfcff',
  onSurface: '#1a1c1e',
  surfaceVariant: '#dfe2eb',
  onSurfaceVariant: '#43474e',
  
  // Outlines
  outline: '#73777f',
  outlineVariant: '#c3c7cf',
  
  // Other
  shadow: '#000000',
  scrim: '#000000',
  
  inverseSurface: '#2f3033',
  inverseOnSurface: '#f1f0f4',
  inversePrimary: '#9ecaff',
  
  // Surface levels
  surfaceDim: '#dbd9dd',
  surfaceBright: '#fdfcff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f7f5f9',
  surfaceContainer: '#f1eff3',
  surfaceContainerHigh: '#ebe9ed',
  surfaceContainerHighest: '#e6e4e8',
};

// Dark theme colors
export const darkColorScheme: MD3ColorScheme = {
  // Primary
  primary: '#9ecaff',
  onPrimary: '#003258',
  primaryContainer: '#00497d',
  onPrimaryContainer: '#d1e4ff',
  
  // Secondary
  secondary: '#b1cbd0',
  onSecondary: '#1c3438',
  secondaryContainer: '#334b4f',
  onSecondaryContainer: '#cde7ec',
  
  // Tertiary
  tertiary: '#ffb951',
  onTertiary: '#442b00',
  tertiaryContainer: '#624000',
  onTertiaryContainer: '#ffddb3',
  
  // Error
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',
  
  // Background and surface
  background: '#1a1c1e',
  onBackground: '#e3e2e6',
  
  surface: '#1a1c1e',
  onSurface: '#e3e2e6',
  surfaceVariant: '#43474e',
  onSurfaceVariant: '#c3c7cf',
  
  // Outlines
  outline: '#8d9199',
  outlineVariant: '#43474e',
  
  // Other
  shadow: '#000000',
  scrim: '#000000',
  
  inverseSurface: '#e3e2e6',
  inverseOnSurface: '#2f3033',
  inversePrimary: '#0061a4',
  
  // Surface levels
  surfaceDim: '#1a1c1e',
  surfaceBright: '#404345',
  surfaceContainerLowest: '#151719',
  surfaceContainerLow: '#222426',
  surfaceContainer: '#262829',
  surfaceContainerHigh: '#313334',
  surfaceContainerHighest: '#3c3e3f',
};

// Dynamic color utilities
export const dynamicColors = {
  // State colors
  success: {
    light: '#2e7d32',
    dark: '#66bb6a',
    container: {
      light: '#c8e6c9',
      dark: '#1b5e20',
    },
  },
  warning: {
    light: '#ed6c02',
    dark: '#ffa726',
    container: {
      light: '#ffe0b2',
      dark: '#e65100',
    },
  },
  info: {
    light: '#0288d1',
    dark: '#29b6f6',
    container: {
      light: '#e1f5fe',
      dark: '#01579b',
    },
  },
  
  // Device status colors
  deviceStatus: {
    online: '#4caf50',
    offline: '#757575',
    error: '#f44336',
    warning: '#ff9800',
  },
  
  // Power usage levels
  powerLevels: {
    low: '#4caf50',
    medium: '#ffc107',
    high: '#ff5722',
    critical: '#d32f2f',
  },
  
  // Chart colors (accessible palette)
  chart: [
    '#0061a4', // Primary blue
    '#4a6267', // Secondary teal
    '#825500', // Tertiary orange
    '#6750a4', // Purple
    '#7d5260', // Pink
    '#006874', // Cyan
    '#4a6c2e', // Green
    '#7c5800', // Amber
  ],
};

// Elevation opacities for MD3
export const elevationOpacities = {
  level0: 0,
  level1: 0.05,
  level2: 0.08,
  level3: 0.11,
  level4: 0.12,
  level5: 0.14,
};