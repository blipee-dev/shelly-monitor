'use client';

import React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

export interface SurfaceProps extends BoxProps {
  level?: 0 | 1 | 2 | 3 | 4 | 5;
  variant?: 'surface' | 'surfaceContainer';
}

export function Surface({ 
  level = 1, 
  variant = 'surface',
  sx,
  ...props 
}: SurfaceProps) {
  const theme = useTheme();
  
  const surfaceLevels = {
    surface: {
      0: theme.palette.background.default,
      1: theme.palette.background.surfaceContainerLowest,
      2: theme.palette.background.surfaceContainerLow,
      3: theme.palette.background.surfaceContainer,
      4: theme.palette.background.surfaceContainerHigh,
      5: theme.palette.background.surfaceContainerHighest,
    },
    surfaceContainer: {
      0: theme.palette.background.surfaceContainerLowest,
      1: theme.palette.background.surfaceContainerLow,
      2: theme.palette.background.surfaceContainer,
      3: theme.palette.background.surfaceContainerHigh,
      4: theme.palette.background.surfaceContainerHighest,
      5: theme.palette.background.surfaceContainerHighest,
    },
  };

  return (
    <Box
      sx={{
        backgroundColor: surfaceLevels[variant][level],
        borderRadius: 1.5, // 12px
        padding: 2,
        transition: 'background-color 0.2s ease',
        ...sx,
      }}
      {...props}
    />
  );
}