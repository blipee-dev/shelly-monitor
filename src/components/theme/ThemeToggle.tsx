'use client';

import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { useFeatureFlag } from '@/lib/feature-flags';
import { useTranslation } from '@/lib/i18n';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
}

export function ThemeToggle({ size = 'medium' }: ThemeToggleProps) {
  const { mode, toggleTheme } = useTheme();
  const darkModeEnabled = useFeatureFlag('DARK_MODE');
  const { t } = useTranslation();

  if (!darkModeEnabled) {
    return null;
  }

  const label = mode === 'light' 
    ? t('theme.switchToDark')
    : t('theme.switchToLight');

  return (
    <Tooltip title={label}>
      <IconButton
        size={size}
        onClick={toggleTheme}
        color="inherit"
        aria-label={label}
        sx={{
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'rotate(180deg)',
          },
        }}
      >
        {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </Tooltip>
  );
}