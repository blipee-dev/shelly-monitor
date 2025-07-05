'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Chip,
  Card,
  CardContent,
  CardActions,
  Switch,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Add,
  Schedule,
  Sensors,
  WbTwilight,
  PlayArrow,
  Pause,
  Delete,
  Edit,
  AutoAwesome,
  Timer,
  DeviceHub,
  Favorite,
  FavoriteBorder,
  NightsStay,
  Movie,
  Home,
  DirectionsRun,
} from '@mui/icons-material';
import { useAutomationStore } from '@/lib/stores/automationStore';
import { useDeviceStore } from '@/lib/stores/deviceStore';
import AskBlipeeEnhanced from '@/components/ai/AskBlipeeEnhanced';
import { format } from 'date-fns';

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

function TriggerIcon({ type }: { type: string }) {
  switch (type) {
    case 'time':
    case 'schedule':
      return <Schedule />;
    case 'device_state':
    case 'sensor_value':
      return <Sensors />;
    case 'sunset':
    case 'sunrise':
      return <WbTwilight />;
    default:
      return <Timer />;
  }
}

function SceneIcon({ name }: { name: string }) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('night') || lowerName.includes('sleep')) return <NightsStay />;
  if (lowerName.includes('movie') || lowerName.includes('tv')) return <Movie />;
  if (lowerName.includes('away') || lowerName.includes('leave')) return <DirectionsRun />;
  if (lowerName.includes('home') || lowerName.includes('morning')) return <Home />;
  return <AutoAwesome />;
}

export default function AutomationsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [askBlipeeOpen, setAskBlipeeOpen] = useState(false);
  const { devices } = useDeviceStore();
  const {
    automations,
    scenes,
    logs,
    isLoading,
    fetchAutomations,
    fetchScenes,
    fetchLogs,
    toggleAutomation,
    deleteAutomation,
    updateScene,
    deleteScene,
    activateScene,
    executeAutomation,
    subscribeToAutomations,
    subscribeToLogs,
  } = useAutomationStore();

  useEffect(() => {
    fetchAutomations();
    fetchScenes();
    fetchLogs();
    
    const unsubAutomations = subscribeToAutomations();
    const unsubLogs = subscribeToLogs();
    
    return () => {
      unsubAutomations();
      unsubLogs();
    };
  }, []);

  const handleDeviceControl = async (deviceId: string, action: string, value?: any) => {
    // Implement device control
    console.log('Device control:', { deviceId, action, value });
  };

  const enabledAutomations = automations.filter(a => a.enabled);
  const disabledAutomations = automations.filter(a => !a.enabled);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Automations & Scenes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create smart behaviors and control multiple devices with one tap
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AutoAwesome />}
          onClick={() => setAskBlipeeOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Ask Blipee to Create
        </Button>
      </Box>

      <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`Automations (${automations.length})`} />
          <Tab label={`Scenes (${scenes.length})`} />
          <Tab label="Activity Log" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {/* Automations Tab */}
          <Grid container spacing={3} sx={{ p: 2 }}>
            {automations.length === 0 ? (
              <Grid size={12}>
                <Box textAlign="center" py={8}>
                  <Schedule sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No automations yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Create your first automation to make your home smarter
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setAskBlipeeOpen(true)}
                  >
                    Create Automation
                  </Button>
                </Box>
              </Grid>
            ) : (
              <>
                {/* Enabled Automations */}
                {enabledAutomations.length > 0 && (
                  <>
                    <Grid size={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        ACTIVE ({enabledAutomations.length})
                      </Typography>
                    </Grid>
                    {enabledAutomations.map(automation => (
                      <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={automation.id}>
                        <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                          <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                              <Box flex={1}>
                                <Typography variant="h6" gutterBottom>
                                  {automation.name}
                                </Typography>
                                {automation.description && (
                                  <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {automation.description}
                                  </Typography>
                                )}
                                <Box display="flex" gap={1} mt={1}>
                                  {automation.triggers.map((trigger, idx) => (
                                    <Chip
                                      key={idx}
                                      icon={<TriggerIcon type={trigger.type} />}
                                      label={
                                        trigger.type === 'time' ? trigger.config.time :
                                        trigger.type === 'schedule' ? `${trigger.config.schedule?.frequency} at ${trigger.config.schedule?.time}` :
                                        trigger.type
                                      }
                                      size="small"
                                      variant="outlined"
                                    />
                                  ))}
                                </Box>
                              </Box>
                              <Switch
                                checked={automation.enabled}
                                onChange={(e) => toggleAutomation(automation.id, e.target.checked)}
                                color="primary"
                              />
                            </Box>
                          </CardContent>
                          <CardActions>
                            <Button size="small" startIcon={<PlayArrow />} onClick={() => executeAutomation(automation.id)}>
                              Run Now
                            </Button>
                            <Button size="small" startIcon={<Edit />}>
                              Edit
                            </Button>
                            <IconButton size="small" onClick={() => deleteAutomation(automation.id)}>
                              <Delete />
                            </IconButton>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </>
                )}

                {/* Disabled Automations */}
                {disabledAutomations.length > 0 && (
                  <>
                    <Grid size={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        INACTIVE ({disabledAutomations.length})
                      </Typography>
                    </Grid>
                    {disabledAutomations.map(automation => (
                      <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={automation.id}>
                        <Card elevation={0} sx={{ border: 1, borderColor: 'divider', opacity: 0.7 }}>
                          <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                              <Box flex={1}>
                                <Typography variant="h6" gutterBottom>
                                  {automation.name}
                                </Typography>
                                {automation.description && (
                                  <Typography variant="body2" color="text.secondary">
                                    {automation.description}
                                  </Typography>
                                )}
                              </Box>
                              <Switch
                                checked={automation.enabled}
                                onChange={(e) => toggleAutomation(automation.id, e.target.checked)}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </>
                )}
              </>
            )}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Scenes Tab */}
          <Grid container spacing={3} sx={{ p: 2 }}>
            {scenes.length === 0 ? (
              <Grid size={12}>
                <Box textAlign="center" py={8}>
                  <AutoAwesome sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No scenes yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Create scenes to control multiple devices with one tap
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setAskBlipeeOpen(true)}
                  >
                    Create Scene
                  </Button>
                </Box>
              </Grid>
            ) : (
              scenes.map(scene => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={scene.id}>
                  <Card 
                    elevation={0} 
                    sx={{ 
                      border: 1, 
                      borderColor: 'divider',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                      },
                    }}
                    onClick={() => activateScene(scene.id)}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <IconButton
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateScene(scene.id, { isFavorite: !scene.isFavorite });
                        }}
                      >
                        {scene.isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                      </IconButton>
                      <SceneIcon name={scene.name} />
                      <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                        {scene.name}
                      </Typography>
                      {scene.description && (
                        <Typography variant="body2" color="text.secondary">
                          {scene.description}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {scene.actions.length} actions
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Activity Log Tab */}
          <List sx={{ p: 2 }}>
            {logs.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Typography variant="body1" color="text.secondary">
                  No automation activity yet
                </Typography>
              </Box>
            ) : (
              logs.map(log => (
                <ListItem key={log.id} divider>
                  <ListItemText
                    primary={log.automationName}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          {log.status === 'success' ? '✅ Success' : 
                           log.status === 'failed' ? '❌ Failed' : '⚠️ Partial'}
                        </Typography>
                        {' • '}
                        <Typography component="span" variant="body2" color="text.secondary">
                          {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                        </Typography>
                        {' • '}
                        <Typography component="span" variant="body2" color="text.secondary">
                          {log.duration}ms
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>
        </TabPanel>
      </Paper>

      {/* Ask Blipee Dialog */}
      <Dialog
        open={askBlipeeOpen}
        onClose={() => setAskBlipeeOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { height: '80vh' }
        }}
      >
        <DialogTitle>
          Create with AI
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <AskBlipeeEnhanced onDeviceControl={handleDeviceControl} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAskBlipeeOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}