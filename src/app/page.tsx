'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Typography,
  useTheme,
  alpha,
  Chip,
  IconButton,
  Card,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  AutoAwesome,
  Psychology,
  Speed,
  Security,
  Language,
  TrendingUp,
  ArrowForward,
  Dashboard,
  Login,
  Rocket,
  CheckCircle,
  EmojiEvents,
  Groups,
  Public,
} from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/hooks';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { ClientOnly } from '@/components/providers/ClientOnly';

export default function HomePage() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
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

  const features = [
    {
      icon: <Psychology sx={{ fontSize: 36 }} />,
      title: 'Conversational Intelligence',
      description: 'No forms, no training. Just talk to manage your entire sustainability program.',
      gradient: 'linear-gradient(135deg, #6750A4 0%, #4A90E2 100%)',
    },
    {
      icon: <Speed sx={{ fontSize: 36 }} />,
      title: '5-Minute Setup',
      description: 'From zero to fully configured in minutes through natural conversation.',
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
    },
    {
      icon: <AutoAwesome sx={{ fontSize: 36 }} />,
      title: 'Predictive Operations',
      description: '95% accurate predictions for energy, emissions, and optimization opportunities.',
      gradient: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
    },
    {
      icon: <Language sx={{ fontSize: 36 }} />,
      title: 'Vision Intelligence',
      description: 'Point camera at bills, equipment, or documents for instant insights.',
      gradient: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)',
    },
    {
      icon: <Security sx={{ fontSize: 36 }} />,
      title: 'Autonomous Compliance',
      description: 'Self-managing CSRD, TCFD, GRI reports. Always audit-ready.',
      gradient: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 36 }} />,
      title: 'ROI Guaranteed',
      description: 'Average 40% energy reduction. 10x faster reporting. Measurable impact.',
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
    },
  ];

  const stats = [
    { value: '10k+', label: 'Active Users', color: '#6750A4' },
    { value: '96%', label: 'AI Accuracy', color: '#4CAF50' },
    { value: '30s', label: 'Report Generation', color: '#FF9800' },
    { value: '$2M+', label: 'Savings Generated', color: '#2196F3' },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: theme.palette.mode === 'dark' ? '#000000' : theme.palette.background.default, 
      color: theme.palette.text.primary, 
      overflow: 'hidden',
      transition: 'background-color 0.3s ease'
    }}>
      {/* Dynamic gradient background */}
      <ClientOnly>
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
              ${theme.palette.mode === 'dark' ? '#000000' : theme.palette.background.default}
            `,
            transition: 'background 0.3s ease',
            zIndex: 0,
          }}
        />
      </ClientOnly>

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
          position: 'sticky',
          top: 0,
          zIndex: 1200,
          bgcolor: alpha('#000000', 0.8),
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  background: 'linear-gradient(135deg, #6750A4 0%, #4A90E2 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(103, 80, 164, 0.3)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Psychology sx={{ fontSize: 28, color: '#ffffff' }} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Blipee OS
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ThemeToggle />
              {user ? (
                <Button
                  variant="contained"
                  startIcon={<Dashboard />}
                  onClick={() => router.push('/dashboard')}
                  sx={{
                    background: 'linear-gradient(135deg, #6750A4 0%, #4A90E2 100%)',
                    boxShadow: '0 4px 20px rgba(103, 80, 164, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 30px rgba(103, 80, 164, 0.4)',
                    },
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<Login />}
                  onClick={() => router.push('/auth/signin')}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  Sign In
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mt: 12, mb: 12 }}>
          <Chip
            icon={<AutoAwesome />}
            label="AI-Powered Sustainability Platform"
            sx={{
              mb: 4,
              background: 'rgba(103, 80, 164, 0.2)',
              color: '#B794F4',
              border: '1px solid rgba(103, 80, 164, 0.3)',
              '& .MuiChip-icon': {
                color: '#B794F4',
              },
            }}
          />
          
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
              fontWeight: 800,
              lineHeight: 1.1,
              mb: 3,
              letterSpacing: '-0.02em',
            }}
          >
            The Operating System for
            <br />
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #6750A4 0%, #4A90E2 50%, #4CAF50 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Sustainable Enterprises
            </Box>
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: 400,
              mb: 6,
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Transform your sustainability management with conversational AI, predictive analytics, 
            and autonomous operations. No forms. No training. Just results.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => router.push(user ? '/dashboard' : '/auth/signup')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #6750A4 0%, #4A90E2 100%)',
                boxShadow: '0 8px 32px rgba(103, 80, 164, 0.3)',
                '&:hover': {
                  boxShadow: '0 12px 48px rgba(103, 80, 164, 0.4)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {user ? 'Go to Dashboard' : 'Start Free Trial'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Rocket />}
              onClick={() => router.push('/demo')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              Try Demo
            </Button>
          </Box>
        </Box>

        {/* Stats Section */}
        <Box sx={{ mb: 12 }}>
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    animation: `fadeInUp 1s ease-out ${0.2 + index * 0.1}s`,
                    animationFillMode: 'backwards',
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 700,
                      background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Features Grid */}
        <Box sx={{ mb: 12 }}>
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: 8,
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Revolutionary Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card
                  sx={{
                    p: 4,
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    transition: 'all 0.3s ease',
                    animation: `fadeInUp 1s ease-out ${0.3 + index * 0.1}s`,
                    animationFillMode: 'backwards',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 60px rgba(103, 80, 164, 0.3)',
                      borderColor: 'rgba(103, 80, 164, 0.3)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '16px',
                      background: feature.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      boxShadow: `0 8px 32px ${alpha(feature.gradient.match(/#[0-9A-Fa-f]{6}/)?.[0] || '#6750A4', 0.3)}`,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.7 }}
                  >
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            mb: 12,
            p: 8,
            background: 'linear-gradient(135deg, rgba(103, 80, 164, 0.2) 0%, rgba(74, 144, 226, 0.2) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(103, 80, 164, 0.3)',
            borderRadius: '32px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle at center, rgba(103, 80, 164, 0.3) 0%, transparent 70%)',
            }}
          />
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, mb: 3, position: 'relative' }}
          >
            Ready to Transform Your Sustainability?
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 5, position: 'relative' }}
          >
            Join leading enterprises using AI to achieve net-zero faster
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Rocket />}
              sx={{
                px: 5,
                py: 2,
                fontSize: '1.2rem',
                background: 'linear-gradient(135deg, #6750A4 0%, #4A90E2 100%)',
                boxShadow: '0 8px 32px rgba(103, 80, 164, 0.4)',
                '&:hover': {
                  boxShadow: '0 12px 48px rgba(103, 80, 164, 0.5)',
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() => router.push(user ? '/dashboard' : '/auth/signup')}
            >
              Get Started Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 5,
                py: 2,
                fontSize: '1.2rem',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Schedule Demo
            </Button>
          </Box>
        </Box>

        {/* Trust Badges */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Chip
              icon={<Security />}
              label="SOC 2 Compliant"
              sx={{
                background: 'rgba(76, 175, 80, 0.1)',
                color: '#4CAF50',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                px: 2,
                py: 3,
                '& .MuiChip-icon': {
                  color: '#4CAF50',
                },
              }}
            />
            <Chip
              icon={<CheckCircle />}
              label="GDPR Compliant"
              sx={{
                background: 'rgba(33, 150, 243, 0.1)',
                color: '#2196F3',
                border: '1px solid rgba(33, 150, 243, 0.3)',
                px: 2,
                py: 3,
                '& .MuiChip-icon': {
                  color: '#2196F3',
                },
              }}
            />
            <Chip
              icon={<Public />}
              label="ISO 27001"
              sx={{
                background: 'rgba(255, 152, 0, 0.1)',
                color: '#FF9800',
                border: '1px solid rgba(255, 152, 0, 0.3)',
                px: 2,
                py: 3,
                '& .MuiChip-icon': {
                  color: '#FF9800',
                },
              }}
            />
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          py: 6,
          mt: 8,
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              © 2025 Blipee. All rights reserved. | 
              <Link href="/privacy" style={{ color: '#B794F4', marginLeft: 8 }}>
                Privacy Policy
              </Link> | 
              <Link href="/terms" style={{ color: '#B794F4', marginLeft: 8 }}>
                Terms of Service
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>

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
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          100% {
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