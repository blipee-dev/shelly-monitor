'use client';

import React from 'react';
import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import { useFeatureFlag, withFeatureFlag } from '@/lib/feature-flags';
import * as FeatureFlags from '@/lib/feature-flags';
import { useTranslation } from '@/lib/i18n';

// Example 1: Using the useFeatureFlag hook
function ExportButton() {
  const { t } = useTranslation();
  const canExport = useFeatureFlag('EXPORT_DATA');
  
  if (!canExport) {
    return null;
  }
  
  return (
    <Button variant="outlined" color="primary">
      {t('common.export')} Data
    </Button>
  );
}

// Example 2: Using the FeatureFlag component
function AnalyticsSection() {
  const { t } = useTranslation();
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('navigation.analytics')}
      </Typography>
      
      <FeatureFlags.FeatureFlagGate flag="ADVANCED_ANALYTICS">
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1">Advanced Analytics</Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed charts and insights about your energy usage
          </Typography>
        </Paper>
      </FeatureFlags.FeatureFlagGate>
      
      <FeatureFlags.FeatureFlagGate 
        flag="ENERGY_INSIGHTS"
        fallback={
          <Alert severity="info">
            Energy insights are coming soon!
          </Alert>
        }
      >
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1">Energy Insights</Typography>
          <Typography variant="body2" color="text.secondary">
            AI-powered recommendations to reduce energy consumption
          </Typography>
        </Paper>
      </FeatureFlags.FeatureFlagGate>
    </Box>
  );
}

// Example 3: Component wrapped with HOC
const BetaFeaturePanel = () => (
  <Paper sx={{ p: 2, backgroundColor: 'warning.light' }}>
    <Typography variant="h6">Beta Feature</Typography>
    <Typography variant="body2">
      This is an experimental feature available to beta testers
    </Typography>
  </Paper>
);

const FeatureFlaggedBetaPanel = withFeatureFlag(
  'BETA_FEATURES',
  BetaFeaturePanel,
  () => null // Fallback component (optional)
);

// Example 4: Multiple feature flags
function DeviceControlPanel() {
  const canSchedule = useFeatureFlag('AUTOMATED_SCHEDULES');
  const canGroup = useFeatureFlag('DEVICE_GROUPING');
  const hasVoiceControl = useFeatureFlag('VOICE_CONTROL');
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Device Controls
      </Typography>
      
      {canSchedule && (
        <Button variant="contained" sx={{ mr: 1, mb: 1 }}>
          Schedule Device
        </Button>
      )}
      
      {canGroup && (
        <Button variant="contained" sx={{ mr: 1, mb: 1 }}>
          Create Group
        </Button>
      )}
      
      {hasVoiceControl && (
        <Button variant="contained" color="secondary" sx={{ mr: 1, mb: 1 }}>
          Voice Control
        </Button>
      )}
      
      {!canSchedule && !canGroup && !hasVoiceControl && (
        <Typography variant="body2" color="text.secondary">
          No advanced controls available
        </Typography>
      )}
    </Box>
  );
}

// Main example component showing all patterns
export default function FeatureFlagExample() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Feature Flag Examples
      </Typography>
      
      <Box sx={{ display: 'grid', gap: 3, mt: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Hook Usage
          </Typography>
          <ExportButton />
        </Paper>
        
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Component Usage
          </Typography>
          <AnalyticsSection />
        </Paper>
        
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            HOC Usage
          </Typography>
          <FeatureFlaggedBetaPanel />
        </Paper>
        
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Multiple Flags
          </Typography>
          <DeviceControlPanel />
        </Paper>
      </Box>
    </Box>
  );
}