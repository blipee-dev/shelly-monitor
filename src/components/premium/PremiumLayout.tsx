'use client';

import React, { useState, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { getDynamicBackground } from '@/lib/theme/premium-theme';

interface PremiumLayoutProps {
  children: React.ReactNode;
  showFloatingOrbs?: boolean;
}

export const PremiumLayout: React.FC<PremiumLayoutProps> = ({ 
  children, 
  showFloatingOrbs = true 
}) => {
  const theme = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let lastX = 0;
    let lastY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      // Only update if mouse moved significantly (more than 2%)
      if (Math.abs(x - lastX) > 2 || Math.abs(y - lastY) > 2) {
        lastX = x;
        lastY = y;
        
        // Clear existing timeout
        clearTimeout(timeoutId);
        
        // Debounce the state update
        timeoutId = setTimeout(() => {
          setMousePosition({ x, y });
        }, 50);
      }
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
        backgroundColor: theme.palette.mode === 'dark' ? '#000000' : theme.palette.background.default,
        color: theme.palette.text.primary,
        position: 'relative',
        overflow: 'hidden',
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
          background: getDynamicBackground(mousePosition.x, mousePosition.y),
          transition: 'background 0.3s ease',
          zIndex: 0,
        }}
      />
      
      {/* Floating orbs */}
      {showFloatingOrbs && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              left: '5%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at center, rgba(255, 111, 0, 0.1) 0%, transparent 70%)',
              animation: 'float 20s ease-in-out infinite',
              zIndex: 0,
              pointerEvents: 'none',
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
              background: 'radial-gradient(circle at center, rgba(103, 80, 164, 0.1) 0%, transparent 70%)',
              animation: 'float 25s ease-in-out infinite reverse',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              right: '15%',
              width: '250px',
              height: '250px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at center, rgba(76, 175, 80, 0.08) 0%, transparent 70%)',
              animation: 'float 30s ease-in-out infinite',
              animationDelay: '5s',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
        </>
      )}
      
      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </Box>
      
      {/* Global styles for animations */}
      <style jsx global>{`
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
        
        @keyframes pulse {
          0% { 
            opacity: 1; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.6; 
            transform: scale(1.2); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </Box>
  );
};