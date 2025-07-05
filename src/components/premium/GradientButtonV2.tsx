'use client';

import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { usePremiumTheme } from './PremiumThemeProvider';

interface GradientButtonV2Props extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'blue' | 'success' | 'coral';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  gradient?: string;
}

export const GradientButtonV2: React.FC<GradientButtonV2Props> = ({ 
  children, 
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  gradient,
  startIcon,
  onClick,
  sx,
  ...props 
}) => {
  const { theme } = usePremiumTheme();
  
  const gradients = {
    primary: theme.colors.gradients.primary,
    blue: theme.colors.gradients.blue,
    success: theme.colors.gradients.success,
    coral: theme.colors.gradients.coral,
  };
  
  const sizes = {
    small: { 
      padding: '8px 16px', 
      fontSize: '0.875rem',
      borderRadius: theme.borderRadius.sm,
    },
    medium: { 
      padding: '12px 24px', 
      fontSize: '1rem',
      borderRadius: theme.borderRadius.md,
    },
    large: { 
      padding: '16px 32px', 
      fontSize: '1.125rem',
      borderRadius: theme.borderRadius.lg,
    },
  };
  
  const shadowColors = {
    primary: theme.effects.shadows.orange,
    blue: theme.effects.shadows.purple,
    success: theme.mode === 'dark' 
      ? '0 4px 20px rgba(76, 175, 80, 0.3)' 
      : '0 4px 20px rgba(56, 142, 60, 0.2)',
    coral: theme.mode === 'dark'
      ? '0 4px 20px rgba(255, 107, 107, 0.3)'
      : '0 4px 20px rgba(230, 74, 25, 0.2)',
  };
  
  const hoverShadows = {
    primary: theme.effects.shadows.orangeHover,
    blue: theme.effects.shadows.purpleHover,
    success: theme.mode === 'dark'
      ? '0 6px 30px rgba(76, 175, 80, 0.4)'
      : '0 6px 30px rgba(56, 142, 60, 0.3)',
    coral: theme.mode === 'dark'
      ? '0 6px 30px rgba(255, 107, 107, 0.4)'
      : '0 6px 30px rgba(230, 74, 25, 0.3)',
  };
  
  return (
    <Button
      onClick={onClick}
      startIcon={!loading && startIcon}
      disabled={disabled || loading}
      sx={{
        background: gradient || gradients[variant],
        color: 'white',
        fontWeight: 600,
        textTransform: 'none',
        boxShadow: disabled ? 'none' : shadowColors[variant],
        width: fullWidth ? '100%' : 'auto',
        position: 'relative',
        overflow: 'hidden',
        ...sizes[size],
        
        '&:hover': {
          background: gradient || gradients[variant],
          boxShadow: disabled ? 'none' : hoverShadows[variant],
          transform: disabled ? 'none' : 'translateY(-1px)',
        },
        
        '&:active': {
          transform: disabled ? 'none' : 'scale(0.98)',
        },
        
        '&:disabled': {
          background: theme.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.08)',
          color: theme.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.3)'
            : 'rgba(0, 0, 0, 0.26)',
          boxShadow: 'none',
        },
        
        // Ripple effect overlay
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 0,
          height: 0,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.5)',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.6s, height 0.6s',
        },
        
        '&:active::after': {
          width: '300px',
          height: '300px',
        },
        
        ...sx,
      }}
      {...props}
    >
      {loading ? (
        <CircularProgress size={20} sx={{ color: 'white' }} />
      ) : (
        children
      )}
    </Button>
  );
};