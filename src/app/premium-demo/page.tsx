'use client';

import React from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
import { 
  PremiumLayout, 
  GlassCard, 
  GradientButton, 
  PremiumTextField,
  AskBlipeePremium,
  premiumTheme,
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
} from '@mui/icons-material';

export default function PremiumDemoPage() {
  return (
    <PremiumLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: premiumTheme.typography.sizes.displayLarge.size,
              fontWeight: premiumTheme.typography.sizes.displayLarge.weight,
              letterSpacing: premiumTheme.typography.sizes.displayLarge.letterSpacing,
              lineHeight: premiumTheme.typography.sizes.displayLarge.lineHeight,
              ...gradientText(premiumTheme.colors.gradients.brand),
              mb: 2,
              animation: 'fadeInUp 1s ease-out',
            }}
          >
            Premium Design System
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: premiumTheme.colors.text.secondary,
              maxWidth: '800px',
              mx: 'auto',
              animation: 'fadeInUp 1s ease-out 0.2s',
              animationFillMode: 'backwards',
            }}
          >
            Experience the future of enterprise software design with our sophisticated 
            glass morphism components and dynamic interactions
          </Typography>
        </Box>

        {/* Buttons Section */}
        <GlassCard variant="elevated" sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            Gradient Buttons
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <GradientButton variant="primary" fullWidth startIcon={<Rocket />}>
                Primary Action
              </GradientButton>
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <GradientButton variant="blue" fullWidth startIcon={<Psychology />}>
                AI Analysis
              </GradientButton>
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <GradientButton variant="success" fullWidth startIcon={<CheckCircle />}>
                Success Action
              </GradientButton>
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <GradientButton variant="coral" fullWidth startIcon={<AutoAwesome />}>
                Special Action
              </GradientButton>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Button Sizes</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <GradientButton size="small">Small</GradientButton>
              <GradientButton size="medium">Medium</GradientButton>
              <GradientButton size="large">Large</GradientButton>
              <GradientButton disabled>Disabled</GradientButton>
              <GradientButton loading>Loading</GradientButton>
            </Box>
          </Box>
        </GlassCard>

        {/* Cards Section */}
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Glass Cards
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <GlassCard 
              variant="default" 
              onClick={() => console.log('Card clicked')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    background: premiumTheme.colors.gradients.primary,
                    borderRadius: premiumTheme.borderRadius.sm,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrendingUp sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6">Default Glass</Typography>
              </Box>
              <Typography sx={{ color: premiumTheme.colors.text.secondary }}>
                This is a default glass card with hover effects. Click to see the interaction.
              </Typography>
            </GlassCard>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <GlassCard 
              variant="elevated"
              onClick={() => console.log('Elevated card clicked')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    background: premiumTheme.colors.gradients.blue,
                    borderRadius: premiumTheme.borderRadius.sm,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Psychology sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6">Elevated Glass</Typography>
              </Box>
              <Typography sx={{ color: premiumTheme.colors.text.secondary }}>
                Elevated cards have more prominent shadows and stand out from the background.
              </Typography>
            </GlassCard>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <GlassCard variant="outlined">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    background: premiumTheme.colors.gradients.success,
                    borderRadius: premiumTheme.borderRadius.sm,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Speed sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6">Outlined Glass</Typography>
              </Box>
              <Typography sx={{ color: premiumTheme.colors.text.secondary }}>
                Outlined cards have no background blur, just a subtle border.
              </Typography>
            </GlassCard>
          </Grid>
        </Grid>

        {/* Form Section */}
        <GlassCard variant="elevated">
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            Premium Form Components
          </Typography>
          
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <PremiumTextField
                label="Email Address"
                placeholder="Enter your email"
                startAdornment={<Email />}
                helperText="We'll never share your email"
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <PremiumTextField
                label="Password"
                type="password"
                placeholder="Enter your password"
                startAdornment={<Lock />}
                helperText="Must be at least 8 characters"
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <PremiumTextField
                label="Full Name"
                placeholder="John Doe"
                startAdornment={<Person />}
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <PremiumTextField
                label="Company"
                placeholder="Acme Corp"
                startAdornment={<Business />}
              />
            </Grid>
            
            <Grid size={12}>
              <PremiumTextField
                label="Message"
                placeholder="Tell us about your project..."
                multiline
                rows={4}
              />
            </Grid>
            
            <Grid size={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <GradientButton variant="primary" startIcon={<AutoAwesome />}>
                  Submit Form
                </GradientButton>
              </Box>
            </Grid>
          </Grid>
        </GlassCard>

        {/* Ask Blipee Premium Section */}
        <Box sx={{ mt: 6, mb: 6 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            Ask Blipee AI Assistant
          </Typography>
          <Box sx={{ height: 600 }}>
            <AskBlipeePremium />
          </Box>
        </Box>

        {/* Features Grid */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            Feature Cards with Metrics
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                title: 'Active Users',
                value: '12,459',
                change: '+12.5%',
                icon: <Person />,
                color: premiumTheme.colors.brand.purple,
              },
              {
                title: 'Revenue',
                value: '$847K',
                change: '+23.1%',
                icon: <TrendingUp />,
                color: premiumTheme.colors.brand.green,
              },
              {
                title: 'Performance',
                value: '98.5%',
                change: '+2.3%',
                icon: <Speed />,
                color: premiumTheme.colors.brand.blue,
              },
              {
                title: 'AI Accuracy',
                value: '96%',
                change: '+5.7%',
                icon: <Psychology />,
                color: premiumTheme.colors.brand.orange,
              },
            ].map((metric, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
                <GlassCard 
                  variant="elevated"
                  onClick={() => console.log(`${metric.title} clicked`)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        background: `linear-gradient(135deg, ${metric.color} 0%, ${metric.color}99 100%)`,
                        borderRadius: premiumTheme.borderRadius.sm,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {React.cloneElement(metric.icon, { sx: { color: 'white' } })}
                    </Box>
                    <Box
                      sx={{
                        background: premiumTheme.colors.status.successBg,
                        color: premiumTheme.colors.status.success,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: premiumTheme.borderRadius.pill,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      {metric.change}
                    </Box>
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: '2rem',
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    {metric.value}
                  </Typography>
                  <Typography
                    sx={{
                      color: premiumTheme.colors.text.secondary,
                      fontSize: '0.875rem',
                    }}
                  >
                    {metric.title}
                  </Typography>
                </GlassCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </PremiumLayout>
  );
}