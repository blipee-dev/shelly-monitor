'use client';

import React from 'react';
import { TextField, TextFieldProps, InputAdornment } from '@mui/material';
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
  return (
    <TextField
      fullWidth
      variant="outlined"
      InputProps={{
        startAdornment: startAdornment && (
          <InputAdornment position="start" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            {startAdornment}
          </InputAdornment>
        ),
        endAdornment: endAdornment && (
          <InputAdornment position="end" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            {endAdornment}
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: premiumTheme.borderRadius.sm,
          transition: premiumTheme.effects.transitions.fast,
          
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
            transition: premiumTheme.effects.transitions.fast,
          },
          
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.07)',
            
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
          },
          
          '&.Mui-focused': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            
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
          color: '#ffffff',
          fontSize: '1rem',
          
          '&::placeholder': {
            color: 'rgba(255, 255, 255, 0.5)',
            opacity: 1,
          },
          
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px rgba(255, 255, 255, 0.05) inset',
            WebkitTextFillColor: '#ffffff',
            caretColor: '#ffffff',
          },
        },
        
        '& .MuiInputLabel-root': {
          color: 'rgba(255, 255, 255, 0.7)',
          
          '&.Mui-focused': {
            color: premiumTheme.colors.brand.orange,
          },
          
          '&.Mui-error': {
            color: premiumTheme.colors.status.error,
          },
        },
        
        '& .MuiFormHelperText-root': {
          color: 'rgba(255, 255, 255, 0.6)',
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