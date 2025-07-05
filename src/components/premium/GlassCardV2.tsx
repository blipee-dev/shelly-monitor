'use client';

import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { usePremiumTheme } from './PremiumThemeProvider';

interface GlassCardV2Props extends BoxProps {
  hover?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
  onClick?: () => void;
}

export const GlassCardV2: React.FC<GlassCardV2Props> = ({ 
  children, 
  hover = true,
  variant = 'default',
  onClick,
  sx,
  ...props 
}) => {
  const { theme } = usePremiumTheme();
  
  const variants = {
    default: {
      ...theme.effects.glass,
    },
    elevated: {
      ...theme.effects.glassElevated,
      boxShadow: theme.effects.shadows.card,
    },
    outlined: {
      background: 'transparent',
      backdropFilter: 'none',
      border: `1px solid ${theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)'}`,
    },
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        ...variants[variant],
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        transition: theme.effects.transitions.normal,
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        
        ...(hover && onClick && {
          '&:hover': {
            background: theme.colors.background.glassHover,
            transform: theme.effects.hover.transform,
            boxShadow: theme.effects.shadows.cardHover,
            borderColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
          },
          '&:active': {
            transform: theme.effects.active.transform,
          },
        }),
        
        // Custom gradient border effect on hover
        '&::before': hover && onClick ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: theme.borderRadius.xl,
          padding: '1px',
          background: theme.colors.gradients.primary,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        } : {},
        
        '&:hover::before': hover && onClick ? {
          opacity: theme.mode === 'dark' ? 0.5 : 0.3,
        } : {},
        
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};