'use client';

import React from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
import { 
  PremiumThemeProvider,
  PremiumLayoutV2, 
  GlassCardV2, 
  GradientButtonV2, 
  PremiumTextFieldV2,
  usePremiumTheme,
  gradientText
} from '@/components/premium';
import {
  AutoAwesome,
  Psychology,
  TrendingUp,
  Speed,
  Email,
  Lock,
  Person,
  Business,
  Rocket,
  CheckCircle,
  LightMode,
  DarkMode,
  Palette,
} from '@mui/icons-material';

// Inner component that uses theme context
const PremiumDemoContent = () => {
  const { theme, mode } = usePremiumTheme();
  
  return (
    <PremiumLayoutV2>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: theme.typography.sizes.displayLarge.size,
              fontWeight: theme.typography.sizes.displayLarge.weight,
              letterSpacing: theme.typography.sizes.displayLarge.letterSpacing,
              lineHeight: theme.typography.sizes.displayLarge.lineHeight,
              ...gradientText(theme.colors.gradients.brand),
              mb: 2,
              animation: 'fadeInUp 1s ease-out',
            }}
          >
            Premium Design System
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: theme.colors.text.secondary,
              maxWidth: '800px',
              mx: 'auto',
              mb: 3,
              animation: 'fadeInUp 1s ease-out 0.2s',
              animationFillMode: 'backwards',
            }}
          >
            Experience the future of enterprise software design with sophisticated 
            glass morphism components in both dark and light modes
          </Typography>
          
          {/* Mode indicator */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 3,
              py: 1,
              background: theme.colors.background.elevated,
              backdropFilter: 'blur(20px)',
              borderRadius: theme.borderRadius.pill,
              border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
              animation: 'fadeInUp 1s ease-out 0.4s',
              animationFillMode: 'backwards',
            }}
          >
            {mode === 'dark' ? <DarkMode /> : <LightMode />}
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {mode === 'dark' ? 'Dark' : 'Light'} Mode Active
            </Typography>
          </Box>
        </Box>

        {/* Theme Showcase */}
        <GlassCardV2 variant="elevated" sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            <Palette sx={{ mr: 1, verticalAlign: 'middle' }} />
            Theme Mode Showcase
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <GlassCardV2 variant="default">
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Current Mode: {mode === 'dark' ? 'Dark' : 'Light'}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 2 }}>
                  The design system automatically adapts all components, colors, and shadows 
                  to provide optimal visibility and aesthetics in {mode} mode.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      background: theme.colors.gradients.primary,
                      borderRadius: theme.borderRadius.sm,
                      boxShadow: theme.effects.shadows.orange,
                    }}
                  />
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      background: theme.colors.gradients.blue,
                      borderRadius: theme.borderRadius.sm,
                      boxShadow: theme.effects.shadows.purple,
                    }}
                  />
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      background: theme.colors.gradients.success,
                      borderRadius: theme.borderRadius.sm,
                      boxShadow: theme.effects.shadows.button,
                    }}
                  />
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      background: theme.colors.gradients.coral,
                      borderRadius: theme.borderRadius.sm,
                      boxShadow: theme.effects.shadows.button,
                    }}
                  />
                </Box>
              </GlassCardV2>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <GlassCardV2 variant="default">
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Dynamic Adaptation
                </Typography>
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                  • Glass morphism effects adjust opacity
                  <br />• Shadows become subtler in light mode
                  <br />• Text contrast optimized for readability
                  <br />• Gradient intensities balanced
                  <br />• Background patterns adapt seamlessly
                </Typography>
              </GlassCardV2>
            </Grid>
          </Grid>
        </GlassCardV2>

        {/* Buttons Section */}
        <GlassCardV2 variant="elevated" sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            Gradient Buttons
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <GradientButtonV2 variant="primary" fullWidth startIcon={<Rocket />}>
                Primary Action
              </GradientButtonV2>
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <GradientButtonV2 variant="blue" fullWidth startIcon={<Psychology />}>
                AI Analysis
              </GradientButtonV2>
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <GradientButtonV2 variant="success" fullWidth startIcon={<CheckCircle />}>
                Success Action
              </GradientButtonV2>
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <GradientButtonV2 variant="coral" fullWidth startIcon={<AutoAwesome />}>
                Special Action
              </GradientButtonV2>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Button Sizes</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <GradientButtonV2 size="small">Small</GradientButtonV2>
              <GradientButtonV2 size="medium">Medium</GradientButtonV2>
              <GradientButtonV2 size="large">Large</GradientButtonV2>
              <GradientButtonV2 disabled>Disabled</GradientButtonV2>
              <GradientButtonV2 loading>Loading</GradientButtonV2>
            </Box>
          </Box>
        </GlassCardV2>

        {/* Cards Section */}
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Glass Cards
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <GlassCardV2 
              variant="default" 
              onClick={() => console.log('Card clicked')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    background: theme.colors.gradients.primary,
                    borderRadius: theme.borderRadius.sm,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrendingUp sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6">Default Glass</Typography>
              </Box>
              <Typography sx={{ color: theme.colors.text.secondary }}>
                Glass morphism adapts to {mode} mode with optimized backdrop blur and opacity.
              </Typography>
            </GlassCardV2>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <GlassCardV2 
              variant="elevated"
              onClick={() => console.log('Elevated card clicked')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    background: theme.colors.gradients.blue,
                    borderRadius: theme.borderRadius.sm,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Psychology sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6">Elevated Glass</Typography>
              </Box>
              <Typography sx={{ color: theme.colors.text.secondary }}>
                Elevated cards feature dynamic shadows that adjust based on the current theme.
              </Typography>
            </GlassCardV2>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <GlassCardV2 variant="outlined">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    background: theme.colors.gradients.success,
                    borderRadius: theme.borderRadius.sm,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Speed sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6">Outlined Glass</Typography>
              </Box>
              <Typography sx={{ color: theme.colors.text.secondary }}>
                Outlined cards use subtle borders that complement the active theme mode.
              </Typography>
            </GlassCardV2>
          </Grid>
        </Grid>

        {/* Form Section */}
        <GlassCardV2 variant="elevated">
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            Premium Form Components
          </Typography>
          
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <PremiumTextFieldV2
                label="Email Address"
                placeholder="Enter your email"
                startAdornment={<Email />}
                helperText="We'll never share your email"
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <PremiumTextFieldV2
                label="Password"
                type="password"
                placeholder="Enter your password"
                startAdornment={<Lock />}
                helperText="Must be at least 8 characters"
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <PremiumTextFieldV2
                label="Full Name"
                placeholder="John Doe"
                startAdornment={<Person />}
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <PremiumTextFieldV2
                label="Company"
                placeholder="Acme Corp"
                startAdornment={<Business />}
              />
            </Grid>
            
            <Grid size={12}>
              <PremiumTextFieldV2
                label="Message"
                placeholder="Tell us about your project..."
                multiline
                rows={4}
              />
            </Grid>
            
            <Grid size={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <GradientButtonV2 variant="primary" startIcon={<AutoAwesome />}>
                  Submit Form
                </GradientButtonV2>
              </Box>
            </Grid>
          </Grid>
        </GlassCardV2>
      </Container>
    </PremiumLayoutV2>
  );
};

// Main component with theme provider
export default function PremiumDemoV2Page() {
  return (
    <PremiumThemeProvider defaultMode="dark">
      <PremiumDemoContent />
    </PremiumThemeProvider>
  );
}