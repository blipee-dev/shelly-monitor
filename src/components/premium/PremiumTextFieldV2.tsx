'use client';

import React from 'react';
import { TextField, TextFieldProps, InputAdornment } from '@mui/material';
import { usePremiumTheme } from './PremiumThemeProvider';

interface PremiumTextFieldV2Props extends Omit<TextFieldProps, 'variant'> {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const PremiumTextFieldV2: React.FC<PremiumTextFieldV2Props> = ({ 
  startAdornment,
  endAdornment,
  sx,
  ...props 
}) => {
  const { theme } = usePremiumTheme();
  
  return (
    <TextField
      fullWidth
      variant="outlined"
      InputProps={{
        startAdornment: startAdornment && (
          <InputAdornment position="start" sx={{ color: theme.colors.text.secondary }}>
            {startAdornment}
          </InputAdornment>
        ),
        endAdornment: endAdornment && (
          <InputAdornment position="end" sx={{ color: theme.colors.text.secondary }}>
            {endAdornment}
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: theme.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.02)',
          borderRadius: theme.borderRadius.sm,
          transition: theme.effects.transitions.fast,
          
          '& fieldset': {
            borderColor: theme.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.2)'
              : 'rgba(0, 0, 0, 0.12)',
            transition: theme.effects.transitions.fast,
          },
          
          '&:hover': {
            backgroundColor: theme.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.07)'
              : 'rgba(0, 0, 0, 0.04)',
            
            '& fieldset': {
              borderColor: theme.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.3)'
                : 'rgba(0, 0, 0, 0.2)',
            },
          },
          
          '&.Mui-focused': {
            backgroundColor: theme.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.03)',
            
            '& fieldset': {
              borderColor: theme.colors.brand.orange,
              borderWidth: '2px',
            },
          },
          
          '&.Mui-error': {
            '& fieldset': {
              borderColor: theme.colors.status.error,
            },
          },
        },
        
        '& .MuiInputBase-input': {
          color: theme.colors.text.primary,
          fontSize: '1rem',
          
          '&::placeholder': {
            color: theme.colors.text.tertiary,
            opacity: 1,
          },
          
          '&:-webkit-autofill': {
            WebkitBoxShadow: theme.mode === 'dark'
              ? '0 0 0 100px rgba(255, 255, 255, 0.05) inset'
              : '0 0 0 100px rgba(0, 0, 0, 0.02) inset',
            WebkitTextFillColor: theme.colors.text.primary,
            caretColor: theme.colors.text.primary,
          },
        },
        
        '& .MuiInputLabel-root': {
          color: theme.colors.text.secondary,
          
          '&.Mui-focused': {
            color: theme.colors.brand.orange,
          },
          
          '&.Mui-error': {
            color: theme.colors.status.error,
          },
        },
        
        '& .MuiFormHelperText-root': {
          color: theme.colors.text.tertiary,
          marginTop: '8px',
          
          '&.Mui-error': {
            color: theme.colors.status.error,
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