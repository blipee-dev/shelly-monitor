'use client';

import React from 'react';
import { Box, Container, Paper, Typography, useTheme, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { Surface } from '@/components/ui';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1,
        }}
      >
        <ThemeToggle />
      </Box>
      
      {/* Main Content */}
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: { xs: 4, md: 8 },
        }}
      >
        <Surface
          level={2}
          sx={{
            px: { xs: 3, sm: 6 },
            py: { xs: 4, sm: 8 },
            borderRadius: 3,
            width: '100%',
          }}
        >
          {/* Logo and Title */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                bgcolor: theme.palette.primary.container,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <Typography
                variant="headlineSmall"
                sx={{ 
                  color: theme.palette.primary.onContainer,
                  fontWeight: 600,
                }}
              >
                SM
              </Typography>
            </Box>
            
            <Typography
              variant={isMobile ? 'headlineSmall' : 'headlineMedium'}
              component="h1"
              align="center"
              gutterBottom
            >
              {title}
            </Typography>
            
            {subtitle && (
              <Typography
                variant="bodyLarge"
                color="text.secondary"
                align="center"
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          
          {/* Form Content */}
          {children}
        </Surface>
        
        {/* Footer */}
        <Typography
          variant="bodySmall"
          color="text.secondary"
          align="center"
          sx={{ mt: 4 }}
        >
          © {new Date().getFullYear()} Shelly Monitor. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}