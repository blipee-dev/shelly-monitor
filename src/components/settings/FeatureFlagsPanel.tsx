'use client';

import React, { useState } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Chip,
  Box,
  TextField,
  IconButton,
  Collapse,
  Divider,
  Button,
  Alert
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Science as ScienceIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useFeatureFlags } from '@/lib/feature-flags';
import { useTranslation } from '@/lib/i18n';

export default function FeatureFlagsPanel() {
  const { t } = useTranslation();
  const { flags, updateFlag, isEnabled } = useFeatureFlags();
  const [expandedFlags, setExpandedFlags] = useState<Set<string>>(new Set());
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleExpanded = (flagKey: string) => {
    setExpandedFlags(prev => {
      const newSet = new Set(prev);
      if (newSet.has(flagKey)) {
        newSet.delete(flagKey);
      } else {
        newSet.add(flagKey);
      }
      return newSet;
    });
  };

  const handleToggleFlag = (flagKey: string, enabled: boolean) => {
    updateFlag(flagKey, { enabled });
  };

  const handleRolloutChange = (flagKey: string, rolloutPercentage: number) => {
    updateFlag(flagKey, { rolloutPercentage });
  };

  const flagsArray = Object.values(flags);
  const productionFlags = flagsArray.filter(flag => !flag.key.includes('BETA') && !flag.key.includes('EXPERIMENTAL'));
  const betaFlags = flagsArray.filter(flag => flag.key.includes('BETA') || flag.key.includes('EXPERIMENTAL'));

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Feature flags allow you to enable or disable features without deploying new code.
          Some features may be in beta or limited rollout.
        </Typography>
      </Alert>

      <Paper sx={{ mb: 3 }}>
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            Production Features
          </Typography>
        </Box>
        <Divider />
        <List>
          {productionFlags.map((flag) => (
            <React.Fragment key={flag.key}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle1">{flag.name}</Typography>
                      {flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100 && (
                        <Chip
                          label={`${flag.rolloutPercentage}% rollout`}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      )}
                      {flag.targetGroups?.length && (
                        <Chip
                          label="Targeted"
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                  secondary={flag.description}
                />
                <ListItemSecondaryAction>
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                      size="small"
                      onClick={() => toggleExpanded(flag.key)}
                    >
                      {expandedFlags.has(flag.key) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                    <Switch
                      checked={flag.enabled}
                      onChange={(e) => handleToggleFlag(flag.key, e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
              <Collapse in={expandedFlags.has(flag.key)}>
                <Box px={3} pb={2}>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    <Box flex={1} minWidth={200}>
                      <TextField
                        label="Flag Key"
                        value={flag.key}
                        size="small"
                        fullWidth
                        disabled
                        sx={{ mb: 2 }}
                      />
                      {flag.rolloutPercentage !== undefined && (
                        <Box>
                          <Typography variant="body2" gutterBottom>
                            Rollout Percentage
                          </Typography>
                          <Box display="flex" alignItems="center" gap={2}>
                            <TextField
                              type="number"
                              value={flag.rolloutPercentage}
                              onChange={(e) => handleRolloutChange(flag.key, parseInt(e.target.value) || 0)}
                              size="small"
                              inputProps={{ min: 0, max: 100, step: 10 }}
                              sx={{ width: 100 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              % of users
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                    <Box flex={1} minWidth={200}>
                      {flag.targetGroups && flag.targetGroups.length > 0 && (
                        <Box>
                          <Typography variant="body2" gutterBottom>
                            Target Groups
                          </Typography>
                          <Box display="flex" gap={1} flexWrap="wrap">
                            {flag.targetGroups.map((group) => (
                              <Chip
                                key={group}
                                label={group}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                      {flag.targetUsers && flag.targetUsers.length > 0 && (
                        <Box mt={2}>
                          <Typography variant="body2" gutterBottom>
                            Target Users
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {flag.targetUsers.length} users targeted
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Box mt={2}>
                    <Typography variant="caption" color="text.secondary">
                      Status: {isEnabled(flag.key) ? 'Enabled for current user' : 'Disabled for current user'}
                    </Typography>
                  </Box>
                </Box>
              </Collapse>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {betaFlags.length > 0 && (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Beta Features
            </Typography>
            <Button
              startIcon={<ScienceIcon />}
              onClick={() => setShowAdvanced(!showAdvanced)}
              size="small"
            >
              {showAdvanced ? 'Hide' : 'Show'} Beta Features
            </Button>
          </Box>

          <Collapse in={showAdvanced}>
            <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 2 }}>
              <Typography variant="body2">
                Beta features are experimental and may be unstable. Use with caution.
              </Typography>
            </Alert>

            <Paper>
              <List>
                {betaFlags.map((flag, index) => (
                  <React.Fragment key={flag.key}>
                    {index > 0 && <Divider />}
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle1">{flag.name}</Typography>
                            <Chip
                              label="BETA"
                              size="small"
                              color="warning"
                              variant="filled"
                            />
                          </Box>
                        }
                        secondary={flag.description}
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={flag.enabled}
                          onChange={(e) => handleToggleFlag(flag.key, e.target.checked)}
                          color="warning"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Collapse>
        </>
      )}
    </Box>
  );
}