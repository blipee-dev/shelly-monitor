'use client';

import React from 'react';
import { Fab as MuiFab, FabProps as MuiFabProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export interface FABProps extends MuiFabProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'surface';
  extended?: boolean;
}

export function FAB({ 
  variant = 'primary', 
  size = 'large',
  extended = false,
  sx,
  children,
  ...props 
}: FABProps) {
  const theme = useTheme();
  
  const variantStyles = {
    primary: {
      backgroundColor: theme.palette.primary.container,
      color: theme.palette.primary.onContainer,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      },
    },
    secondary: {
      backgroundColor: theme.palette.secondary.container,
      color: theme.palette.secondary.onContainer,
      '&:hover': {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
      },
    },
    tertiary: {
      backgroundColor: theme.palette.tertiary.container,
      color: theme.palette.tertiary.onContainer,
      '&:hover': {
        backgroundColor: theme.palette.tertiary.main,
        color: theme.palette.tertiary.contrastText,
      },
    },
    surface: {
      backgroundColor: theme.palette.background.surfaceContainerHigh,
      color: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.background.surfaceContainerHighest,
      },
    },
  };

  const sizeStyles = {
    small: {
      width: 40,
      height: 40,
    },
    medium: {
      width: 56,
      height: 56,
    },
    large: {
      width: extended ? 'auto' : 96,
      height: extended ? 56 : 96,
      minWidth: extended ? 80 : 96,
      borderRadius: extended ? '16px' : '28px',
      padding: extended ? '0 24px' : '0',
    },
  };

  return (
    <MuiFab
      size={size}
      sx={{
        boxShadow: theme.shadows[3],
        transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
        '&:active': {
          boxShadow: theme.shadows[1],
        },
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiFab>
  );
}