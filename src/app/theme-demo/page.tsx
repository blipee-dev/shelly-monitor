'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Grid2 as Grid,
  Chip,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { Card, Surface, NavigationRail, FAB } from '@/components/ui';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useTheme } from '@/lib/theme/ThemeProvider';

export default function ThemeDemoPage() {
  const { mode } = useTheme();
  const [checked, setChecked] = React.useState(true);
  const [selectedNav, setSelectedNav] = React.useState('home');

  const navigationItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon /> },
    { id: 'devices', label: 'Devices', icon: <SettingsIcon />, badge: 3 },
    { id: 'alerts', label: 'Alerts', icon: <NotificationsIcon />, badge: '!' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <NavigationRail
        items={navigationItems}
        activeId={selectedNav}
        onItemClick={setSelectedNav}
        expanded={true}
        header={
          <Typography variant="titleLarge">Shelly Monitor</Typography>
        }
        footer={<ThemeToggle />}
      />
      
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Stack spacing={4}>
            {/* Header */}
            <Box>
              <Typography variant="displaySmall" gutterBottom>
                Material Design 3 Theme Demo
              </Typography>
              <Typography variant="bodyLarge" color="text.secondary">
                Showcasing the Material You design system with {mode} theme
              </Typography>
            </Box>

            {/* Typography */}
            <Surface level={1}>
              <Typography variant="headlineMedium" gutterBottom>
                Typography Scale
              </Typography>
              <Stack spacing={2}>
                <Typography variant="displayLarge">Display Large</Typography>
                <Typography variant="displayMedium">Display Medium</Typography>
                <Typography variant="displaySmall">Display Small</Typography>
                <Typography variant="headlineLarge">Headline Large</Typography>
                <Typography variant="headlineMedium">Headline Medium</Typography>
                <Typography variant="headlineSmall">Headline Small</Typography>
                <Typography variant="titleLarge">Title Large</Typography>
                <Typography variant="titleMedium">Title Medium</Typography>
                <Typography variant="titleSmall">Title Small</Typography>
                <Typography variant="bodyLarge">Body Large</Typography>
                <Typography variant="bodyMedium">Body Medium</Typography>
                <Typography variant="bodySmall">Body Small</Typography>
                <Typography variant="labelLarge">Label Large</Typography>
                <Typography variant="labelMedium">Label Medium</Typography>
                <Typography variant="labelSmall">Label Small</Typography>
              </Stack>
            </Surface>

            {/* Colors */}
            <Surface level={2}>
              <Typography variant="headlineMedium" gutterBottom>
                Color System
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                    }}
                  >
                    <Typography variant="labelLarge">Primary</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: 'secondary.main',
                      color: 'secondary.contrastText',
                    }}
                  >
                    <Typography variant="labelLarge">Secondary</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: 'tertiary.main',
                      color: 'tertiary.contrastText',
                    }}
                  >
                    <Typography variant="labelLarge">Tertiary</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: 'error.main',
                      color: 'error.contrastText',
                    }}
                  >
                    <Typography variant="labelLarge">Error</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Surface>

            {/* Components */}
            <Surface level={3}>
              <Typography variant="headlineMedium" gutterBottom>
                Components
              </Typography>
              
              <Stack spacing={3}>
                {/* Buttons */}
                <Box>
                  <Typography variant="titleMedium" gutterBottom>
                    Buttons
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Button variant="contained">Contained</Button>
                    <Button variant="outlined">Outlined</Button>
                    <Button variant="text">Text</Button>
                    <Button variant="contained" color="secondary">
                      Secondary
                    </Button>
                    <Button variant="contained" color="error">
                      Error
                    </Button>
                  </Stack>
                </Box>

                {/* FABs */}
                <Box>
                  <Typography variant="titleMedium" gutterBottom>
                    Floating Action Buttons
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <FAB size="small" variant="primary">
                      <AddIcon />
                    </FAB>
                    <FAB size="medium" variant="secondary">
                      <EditIcon />
                    </FAB>
                    <FAB variant="tertiary">
                      <AddIcon sx={{ fontSize: 36 }} />
                    </FAB>
                    <FAB extended variant="surface">
                      <AddIcon sx={{ mr: 1 }} />
                      Extended FAB
                    </FAB>
                  </Stack>
                </Box>

                {/* Chips */}
                <Box>
                  <Typography variant="titleMedium" gutterBottom>
                    Chips
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip label="Default" />
                    <Chip label="Primary" color="primary" />
                    <Chip label="Secondary" color="secondary" />
                    <Chip label="Clickable" onClick={() => {}} />
                    <Chip label="Deletable" onDelete={() => {}} />
                    <Chip label="Outlined" variant="outlined" />
                  </Stack>
                </Box>

                {/* Form Controls */}
                <Box>
                  <Typography variant="titleMedium" gutterBottom>
                    Form Controls
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      label="Outlined TextField"
                      variant="outlined"
                      helperText="Helper text"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={checked}
                          onChange={(e) => setChecked(e.target.checked)}
                        />
                      }
                      label="Toggle switch"
                    />
                  </Stack>
                </Box>

                {/* Alerts */}
                <Box>
                  <Typography variant="titleMedium" gutterBottom>
                    Alerts
                  </Typography>
                  <Stack spacing={2}>
                    <Alert severity="success">Success alert message</Alert>
                    <Alert severity="info">Info alert message</Alert>
                    <Alert severity="warning">Warning alert message</Alert>
                    <Alert severity="error">Error alert message</Alert>
                  </Stack>
                </Box>
              </Stack>
            </Surface>

            {/* Cards */}
            <Box>
              <Typography variant="headlineMedium" gutterBottom>
                Card Variants
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card variant="elevated" interactive>
                    <Box sx={{ p: 3 }}>
                      <Typography variant="titleLarge" gutterBottom>
                        Elevated Card
                      </Typography>
                      <Typography variant="bodyMedium" color="text.secondary">
                        This card has elevation and interactive hover effects
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card variant="filled">
                    <Box sx={{ p: 3 }}>
                      <Typography variant="titleLarge" gutterBottom>
                        Filled Card
                      </Typography>
                      <Typography variant="bodyMedium" color="text.secondary">
                        This card uses a filled background style
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card variant="outlined">
                    <Box sx={{ p: 3 }}>
                      <Typography variant="titleLarge" gutterBottom>
                        Outlined Card
                      </Typography>
                      <Typography variant="bodyMedium" color="text.secondary">
                        This card has an outline border style
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* Surface Levels */}
            <Box>
              <Typography variant="headlineMedium" gutterBottom>
                Surface Levels
              </Typography>
              <Stack spacing={2}>
                {[0, 1, 2, 3, 4, 5].map((level) => (
                  <Surface key={level} level={level as any}>
                    <Typography variant="titleMedium">
                      Surface Level {level}
                    </Typography>
                    <Typography variant="bodyMedium" color="text.secondary">
                      Different elevation levels for visual hierarchy
                    </Typography>
                  </Surface>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}