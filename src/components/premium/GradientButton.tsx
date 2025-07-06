'use client';

import React from 'react';
import { Button, ButtonProps, CircularProgress, useTheme } from '@mui/material';
import { premiumTheme } from '@/lib/theme/premium-theme';

interface GradientButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'blue' | 'success' | 'coral';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  gradient?: string;
}

export const GradientButton: React.FC<GradientButtonProps> = ({ 
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
  const theme = useTheme();
  const gradients = {
    primary: premiumTheme.colors.gradients.primary,
    blue: premiumTheme.colors.gradients.blue,
    success: premiumTheme.colors.gradients.success,
    coral: premiumTheme.colors.gradients.coral,
  };
  
  const sizes = {
    small: { 
      padding: '8px 16px', 
      fontSize: '0.875rem',
      borderRadius: premiumTheme.borderRadius.sm,
    },
    medium: { 
      padding: '12px 24px', 
      fontSize: '1rem',
      borderRadius: premiumTheme.borderRadius.md,
    },
    large: { 
      padding: '16px 32px', 
      fontSize: '1.125rem',
      borderRadius: premiumTheme.borderRadius.lg,
    },
  };
  
  const shadowColors = {
    primary: premiumTheme.effects.shadows.orange,
    blue: premiumTheme.effects.shadows.purple,
    success: '0 4px 20px rgba(76, 175, 80, 0.3)',
    coral: '0 4px 20px rgba(255, 107, 107, 0.3)',
  };
  
  const hoverShadows = {
    primary: premiumTheme.effects.shadows.orangeHover,
    blue: premiumTheme.effects.shadows.purpleHover,
    success: '0 6px 30px rgba(76, 175, 80, 0.4)',
    coral: '0 6px 30px rgba(255, 107, 107, 0.4)',
  };
  
  return (
    <Button
      onClick={onClick}
      startIcon={!loading && startIcon}
      disabled={disabled || loading}
      sx={{
        background: gradient || gradients[variant],
        color: theme.palette.mode === 'dark' ? 'white' : theme.palette.getContrastText(gradients[variant]),
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
          background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : theme.palette.action.disabledBackground,
          color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : theme.palette.text.disabled,
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
          background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.1)',
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
        <CircularProgress size={20} sx={{ color: 'inherit' }} />
      ) : (
        children
      )}
    </Button>
  );
};