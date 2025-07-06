'use client';

import React from 'react';
import { Box, BoxProps, useTheme } from '@mui/material';
import { premiumTheme } from '@/lib/theme/premium-theme';

interface GlassCardProps extends BoxProps {
  hover?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  hover = true,
  variant = 'default',
  onClick,
  sx,
  ...props 
}) => {
  const theme = useTheme();
  const variants = {
    default: {
      background: premiumTheme.colors.background.glass,
      backdropFilter: 'blur(20px)',
      border: `1px solid ${premiumTheme.colors.background.glass}`,
    },
    elevated: {
      background: premiumTheme.colors.background.elevated,
      backdropFilter: 'blur(20px)',
      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : theme.palette.divider}`,
      boxShadow: premiumTheme.effects.shadows.card,
    },
    outlined: {
      background: 'transparent',
      backdropFilter: 'none',
      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : theme.palette.divider}`,
    },
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        ...variants[variant],
        borderRadius: premiumTheme.borderRadius.xl,
        padding: premiumTheme.spacing.lg,
        transition: premiumTheme.effects.transitions.normal,
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        
        ...(hover && onClick && {
          '&:hover': {
            background: premiumTheme.effects.hover.glassBackground,
            transform: premiumTheme.effects.hover.transform,
            boxShadow: premiumTheme.effects.shadows.cardHover,
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : theme.palette.action.selected,
          },
          '&:active': {
            transform: premiumTheme.effects.active.transform,
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
          borderRadius: premiumTheme.borderRadius.xl,
          padding: '1px',
          background: premiumTheme.colors.gradients.primary,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        } : {},
        
        '&:hover::before': hover && onClick ? {
          opacity: 0.5,
        } : {},
        
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};