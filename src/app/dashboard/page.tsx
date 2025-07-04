'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Card, Surface } from '@/components/ui';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useRequireAuth } from '@/lib/auth/hooks';
import { useTranslation } from '@/lib/i18n';

export default function DashboardPage() {
  const { user, loading } = useRequireAuth();
  const { t } = useTranslation();

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="headlineLarge" gutterBottom>
          {t('navigation.dashboard')}
        </Typography>
        <Typography variant="bodyLarge" color="text.secondary" paragraph>
          Welcome back, {user?.user_metadata?.name || user?.email}!
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="elevated">
              <Box sx={{ p: 3 }}>
                <Typography variant="labelMedium" color="text.secondary" gutterBottom>
                  Total Devices
                </Typography>
                <Typography variant="headlineMedium">12</Typography>
              </Box>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="elevated">
              <Box sx={{ p: 3 }}>
                <Typography variant="labelMedium" color="text.secondary" gutterBottom>
                  Online
                </Typography>
                <Typography variant="headlineMedium" color="success.main">10</Typography>
              </Box>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="elevated">
              <Box sx={{ p: 3 }}>
                <Typography variant="labelMedium" color="text.secondary" gutterBottom>
                  Alerts
                </Typography>
                <Typography variant="headlineMedium" color="warning.main">3</Typography>
              </Box>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="elevated">
              <Box sx={{ p: 3 }}>
                <Typography variant="labelMedium" color="text.secondary" gutterBottom>
                  Power Usage
                </Typography>
                <Typography variant="headlineMedium">245W</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Surface level={1}>
            <Typography variant="titleLarge" gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="bodyMedium" color="text.secondary">
              No recent activity to display.
            </Typography>
          </Surface>
        </Box>
      </Box>
    </DashboardLayout>
  );
}