'use client';

import React from 'react';
import { Card as MuiCard, CardProps as MuiCardProps } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

export interface CardProps extends MuiCardProps {
  variant?: 'elevated' | 'filled' | 'outlined';
  interactive?: boolean;
}

export function Card({ 
  variant = 'filled', 
  interactive = false,
  sx,
  ...props 
}: CardProps) {
  const theme = useTheme();
  
  const variantStyles = {
    elevated: {
      backgroundColor: theme.palette.background.surfaceContainerLow,
      boxShadow: theme.shadows[1],
      '&:hover': interactive ? {
        boxShadow: theme.shadows[2],
        backgroundColor: theme.palette.background.surfaceContainer,
      } : {},
    },
    filled: {
      backgroundColor: theme.palette.background.surfaceContainerLowest,
      boxShadow: 'none',
      '&:hover': interactive ? {
        backgroundColor: theme.palette.background.surfaceContainerLow,
      } : {},
    },
    outlined: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: 'none',
      border: `1px solid ${theme.palette.outlineVariant}`,
      '&:hover': interactive ? {
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
        borderColor: theme.palette.outline,
      } : {},
    },
  };

  return (
    <MuiCard
      sx={{
        borderRadius: 3, // 12px
        transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
        cursor: interactive ? 'pointer' : 'default',
        ...variantStyles[variant],
        ...sx,
      }}
      {...props}
    />
  );
}