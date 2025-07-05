'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, useTheme, useMediaQuery, alpha } from '@mui/material';
import { Psychology } from '@mui/icons-material';
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
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  // Track mouse for gradient effect
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setMousePosition({ x, y });
      }, 50);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#000000',
        color: '#ffffff',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Dynamic gradient background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(103, 80, 164, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(33, 150, 243, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
            #000000
          `,
          transition: 'background 0.3s ease',
          zIndex: 0,
        }}
      />

      {/* Floating orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(103, 80, 164, 0.2) 0%, transparent 70%)',
          animation: 'float 20s ease-in-out infinite',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(76, 175, 80, 0.2) 0%, transparent 70%)',
          animation: 'float 25s ease-in-out infinite reverse',
          zIndex: 0,
        }}
      />

      {/* Header */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
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
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            px: { xs: 3, sm: 6 },
            py: { xs: 4, sm: 8 },
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            animation: 'fadeInUp 1s ease-out',
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
                background: 'linear-gradient(135deg, #6750A4 0%, #4A90E2 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                boxShadow: '0 8px 32px rgba(103, 80, 164, 0.3)',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Psychology sx={{ fontSize: 36, color: '#ffffff' }} />
            </Box>
            
            <Typography
              variant={isMobile ? 'headlineSmall' : 'headlineMedium'}
              component="h1"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {title}
            </Typography>
            
            {subtitle && (
              <Typography
                variant="bodyLarge"
                align="center"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          
          {/* Form Content */}
          {children}
        </Box>
        
        {/* Footer */}
        <Typography
          variant="bodySmall"
          align="center"
          sx={{ mt: 4, color: 'rgba(255, 255, 255, 0.5)' }}
        >
          © {new Date().getFullYear()} Blipee OS. All rights reserved.
        </Typography>
      </Container>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
        }
      `}</style>
    </Box>
  );
}