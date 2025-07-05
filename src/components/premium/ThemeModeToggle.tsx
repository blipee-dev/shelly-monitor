'use client';

import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { usePremiumTheme } from './PremiumThemeProvider';
import { premiumTheme } from '@/lib/theme/premium-theme';

export const ThemeModeToggle: React.FC = () => {
  const { mode, toggleMode, theme } = usePremiumTheme();
  
  return (
    <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
      <IconButton
        onClick={toggleMode}
        sx={{
          width: 48,
          height: 48,
          background: theme.colors.background.elevated,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
          color: theme.colors.brand.orange,
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          
          '&:hover': {
            background: theme.colors.background.glassHover,
            transform: 'rotate(180deg)',
            
            '& .icon-container': {
              transform: 'rotate(-180deg)',
            },
          },
          
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '200%',
            height: '200%',
            background: theme.colors.gradients.primary,
            transform: 'translate(-50%, -50%) scale(0)',
            borderRadius: '50%',
            opacity: 0.3,
            transition: 'transform 0.6s ease, opacity 0.6s ease',
          },
          
          '&:active::before': {
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 0,
          },
        }}
      >
        <Box
          className="icon-container"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.3s ease',
          }}
        >
          {mode === 'dark' ? (
            <LightMode sx={{ fontSize: 24 }} />
          ) : (
            <DarkMode sx={{ fontSize: 24 }} />
          )}
        </Box>
      </IconButton>
    </Tooltip>
  );
};