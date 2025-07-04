/**
 * Material Design 3 Typography System
 * Following MD3 type scale guidelines
 */

import { TypographyOptions } from '@mui/material/styles/createTypography';

// MD3 Type Scale
export const md3Typography: TypographyOptions = {
  fontFamily: [
    'Roboto',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  
  // Display styles
  displayLarge: {
    fontSize: '3.5625rem', // 57px
    lineHeight: '4rem', // 64px
    fontWeight: 400,
    letterSpacing: '-0.015625em',
  },
  displayMedium: {
    fontSize: '2.8125rem', // 45px
    lineHeight: '3.25rem', // 52px
    fontWeight: 400,
    letterSpacing: 0,
  },
  displaySmall: {
    fontSize: '2.25rem', // 36px
    lineHeight: '2.75rem', // 44px
    fontWeight: 400,
    letterSpacing: 0,
  },
  
  // Headline styles
  headlineLarge: {
    fontSize: '2rem', // 32px
    lineHeight: '2.5rem', // 40px
    fontWeight: 400,
    letterSpacing: 0,
  },
  headlineMedium: {
    fontSize: '1.75rem', // 28px
    lineHeight: '2.25rem', // 36px
    fontWeight: 400,
    letterSpacing: 0,
  },
  headlineSmall: {
    fontSize: '1.5rem', // 24px
    lineHeight: '2rem', // 32px
    fontWeight: 400,
    letterSpacing: 0,
  },
  
  // Title styles
  titleLarge: {
    fontSize: '1.375rem', // 22px
    lineHeight: '1.75rem', // 28px
    fontWeight: 400,
    letterSpacing: 0,
  },
  titleMedium: {
    fontSize: '1rem', // 16px
    lineHeight: '1.5rem', // 24px
    fontWeight: 500,
    letterSpacing: '0.009375em',
  },
  titleSmall: {
    fontSize: '0.875rem', // 14px
    lineHeight: '1.25rem', // 20px
    fontWeight: 500,
    letterSpacing: '0.00625em',
  },
  
  // Body styles
  bodyLarge: {
    fontSize: '1rem', // 16px
    lineHeight: '1.5rem', // 24px
    fontWeight: 400,
    letterSpacing: '0.03125em',
  },
  bodyMedium: {
    fontSize: '0.875rem', // 14px
    lineHeight: '1.25rem', // 20px
    fontWeight: 400,
    letterSpacing: '0.015625em',
  },
  bodySmall: {
    fontSize: '0.75rem', // 12px
    lineHeight: '1rem', // 16px
    fontWeight: 400,
    letterSpacing: '0.025em',
  },
  
  // Label styles
  labelLarge: {
    fontSize: '0.875rem', // 14px
    lineHeight: '1.25rem', // 20px
    fontWeight: 500,
    letterSpacing: '0.00625em',
  },
  labelMedium: {
    fontSize: '0.75rem', // 12px
    lineHeight: '1rem', // 16px
    fontWeight: 500,
    letterSpacing: '0.03125em',
  },
  labelSmall: {
    fontSize: '0.6875rem', // 11px
    lineHeight: '1rem', // 16px
    fontWeight: 500,
    letterSpacing: '0.03125em',
  },
  
  // MUI default mappings (for backward compatibility)
  h1: {
    fontSize: '2.25rem', // displaySmall
    lineHeight: '2.75rem',
    fontWeight: 400,
    letterSpacing: 0,
  },
  h2: {
    fontSize: '2rem', // headlineLarge
    lineHeight: '2.5rem',
    fontWeight: 400,
    letterSpacing: 0,
  },
  h3: {
    fontSize: '1.75rem', // headlineMedium
    lineHeight: '2.25rem',
    fontWeight: 400,
    letterSpacing: 0,
  },
  h4: {
    fontSize: '1.5rem', // headlineSmall
    lineHeight: '2rem',
    fontWeight: 400,
    letterSpacing: 0,
  },
  h5: {
    fontSize: '1.375rem', // titleLarge
    lineHeight: '1.75rem',
    fontWeight: 400,
    letterSpacing: 0,
  },
  h6: {
    fontSize: '1rem', // titleMedium
    lineHeight: '1.5rem',
    fontWeight: 500,
    letterSpacing: '0.009375em',
  },
  subtitle1: {
    fontSize: '1rem', // bodyLarge
    lineHeight: '1.5rem',
    fontWeight: 400,
    letterSpacing: '0.009375em',
  },
  subtitle2: {
    fontSize: '0.875rem', // bodyMedium
    lineHeight: '1.25rem',
    fontWeight: 500,
    letterSpacing: '0.00625em',
  },
  body1: {
    fontSize: '1rem', // bodyLarge
    lineHeight: '1.5rem',
    fontWeight: 400,
    letterSpacing: '0.03125em',
  },
  body2: {
    fontSize: '0.875rem', // bodyMedium
    lineHeight: '1.25rem',
    fontWeight: 400,
    letterSpacing: '0.015625em',
  },
  button: {
    fontSize: '0.875rem', // labelLarge
    lineHeight: '1.25rem',
    fontWeight: 500,
    letterSpacing: '0.00625em',
    textTransform: 'none', // MD3 doesn't use uppercase buttons
  },
  caption: {
    fontSize: '0.75rem', // bodySmall
    lineHeight: '1rem',
    fontWeight: 400,
    letterSpacing: '0.025em',
  },
  overline: {
    fontSize: '0.75rem', // labelMedium
    lineHeight: '1rem',
    fontWeight: 500,
    letterSpacing: '0.03125em',
    textTransform: 'uppercase',
  },
};

// Responsive typography adjustments
export const responsiveTypography = {
  // Adjust display sizes for mobile
  '@media (max-width:600px)': {
    displayLarge: {
      fontSize: '2.8125rem', // 45px on mobile
      lineHeight: '3.25rem',
    },
    displayMedium: {
      fontSize: '2.25rem', // 36px on mobile
      lineHeight: '2.75rem',
    },
    displaySmall: {
      fontSize: '1.875rem', // 30px on mobile
      lineHeight: '2.375rem',
    },
  },
};