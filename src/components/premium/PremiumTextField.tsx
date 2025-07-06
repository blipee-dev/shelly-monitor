'use client';

import React from 'react';
import { TextField, TextFieldProps, InputAdornment, useTheme } from '@mui/material';
import { premiumTheme } from '@/lib/theme/premium-theme';

interface PremiumTextFieldProps extends Omit<TextFieldProps, 'variant'> {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const PremiumTextField: React.FC<PremiumTextFieldProps> = ({ 
  startAdornment,
  endAdornment,
  sx,
  ...props 
}) => {
  const theme = useTheme();
  return (
    <TextField
      fullWidth
      variant="outlined"
      InputProps={{
        startAdornment: startAdornment && (
          <InputAdornment position="start" sx={{ color: theme.palette.text.secondary }}>
            {startAdornment}
          </InputAdornment>
        ),
        endAdornment: endAdornment && (
          <InputAdornment position="end" sx={{ color: theme.palette.text.secondary }}>
            {endAdornment}
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : theme.palette.action.hover,
          borderRadius: premiumTheme.borderRadius.sm,
          transition: premiumTheme.effects.transitions.fast,
          
          '& fieldset': {
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : theme.palette.divider,
            transition: premiumTheme.effects.transitions.fast,
          },
          
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.07)' : theme.palette.action.selected,
            
            '& fieldset': {
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : theme.palette.action.selected,
            },
          },
          
          '&.Mui-focused': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : theme.palette.action.selected,
            
            '& fieldset': {
              borderColor: premiumTheme.colors.brand.orange,
              borderWidth: '2px',
            },
          },
          
          '&.Mui-error': {
            '& fieldset': {
              borderColor: premiumTheme.colors.status.error,
            },
          },
        },
        
        '& .MuiInputBase-input': {
          color: theme.palette.text.primary,
          fontSize: '1rem',
          
          '&::placeholder': {
            color: theme.palette.text.secondary,
            opacity: 1,
          },
          
          '&:-webkit-autofill': {
            WebkitBoxShadow: theme.palette.mode === 'dark' ? '0 0 0 100px rgba(255, 255, 255, 0.05) inset' : '0 0 0 100px rgba(0, 0, 0, 0.03) inset',
            WebkitTextFillColor: theme.palette.text.primary,
            caretColor: theme.palette.text.primary,
          },
        },
        
        '& .MuiInputLabel-root': {
          color: theme.palette.text.secondary,
          
          '&.Mui-focused': {
            color: premiumTheme.colors.brand.orange,
          },
          
          '&.Mui-error': {
            color: premiumTheme.colors.status.error,
          },
        },
        
        '& .MuiFormHelperText-root': {
          color: theme.palette.text.secondary,
          marginTop: '8px',
          
          '&.Mui-error': {
            color: premiumTheme.colors.status.error,
          },
        },
        
        // Multiline specific styles
        '& .MuiInputBase-multiline': {
          padding: '14px',
        },
        
        // Adornment styles
        '& .MuiInputAdornment-root': {
          '& .MuiSvgIcon-root': {
            fontSize: '1.25rem',
          },
        },
        
        ...sx,
      }}
      {...props}
    />
  );
};