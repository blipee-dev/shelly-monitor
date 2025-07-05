'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Card,
  CardContent,
  Stack,
  Button,
  Menu,
  MenuItem,
  Divider,
  Badge,
} from '@mui/material';
import {
  Warning,
  Error,
  Info,
  CheckCircle,
  MoreVert,
  FilterList,
  Delete,
  NotificationsOff,
  Refresh,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useDeviceStore } from '@/lib/stores/deviceStore';

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  deviceId?: string;
  timestamp: string;
  read: boolean;
  resolved: boolean;
}

// Mock alerts for now - this would come from your database
const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'High Power Consumption',
    message: 'Living Room Switch is consuming 245W, above normal threshold',
    deviceId: 'device-1',
    timestamp: new Date().toISOString(),
    read: false,
    resolved: false,
  },
  {
    id: '2',
    type: 'error',
    title: 'Device Offline',
    message: 'Kitchen Motion Sensor has been offline for 2 hours',
    deviceId: 'device-2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    resolved: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Firmware Update Available',
    message: 'New firmware version 1.2.3 is available for Bedroom Switch',
    deviceId: 'device-3',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: true,
    resolved: false,
  },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'unread' | 'resolved'>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const { devices } = useDeviceStore();

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return <Error color="error" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'info':
        return <Info color="info" />;
      case 'success':
        return <CheckCircle color="success" />;
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'success':
        return 'success';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread') return !alert.read;
    if (filter === 'resolved') return alert.resolved;
    return true;
  });

  const unreadCount = alerts.filter(a => !a.read).length;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, alertId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedAlert(alertId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAlert(null);
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
    handleMenuClose();
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true, read: true } : alert
    ));
    handleMenuClose();
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    handleMenuClose();
  };

  const getDeviceName = (deviceId?: string) => {
    if (!deviceId) return null;
    const device = devices.find(d => d.id === deviceId);
    return device?.name || 'Unknown Device';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Alerts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor device alerts and system notifications
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Badge badgeContent={unreadCount} color="error">
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            >
              {filter === 'all' ? 'All Alerts' : 'Unread Only'}
            </Button>
          </Badge>
          <IconButton onClick={() => window.location.reload()}>
            <Refresh />
          </IconButton>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid size={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filter Alerts
            </Typography>
            <Stack spacing={1}>
              <Button
                fullWidth
                variant={filter === 'all' ? 'contained' : 'text'}
                onClick={() => setFilter('all')}
                sx={{ justifyContent: 'flex-start' }}
              >
                All Alerts ({alerts.length})
              </Button>
              <Button
                fullWidth
                variant={filter === 'unread' ? 'contained' : 'text'}
                onClick={() => setFilter('unread')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Unread ({unreadCount})
              </Button>
              <Button
                fullWidth
                variant={filter === 'resolved' ? 'contained' : 'text'}
                onClick={() => setFilter('resolved')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Resolved ({alerts.filter(a => a.resolved).length})
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={9}>
          <Stack spacing={2}>
            {filteredAlerts.length === 0 ? (
              <Paper sx={{ p: 8, textAlign: 'center' }}>
                <NotificationsOff sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No alerts to display
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filter === 'unread' ? 'All alerts have been read' : 
                   filter === 'resolved' ? 'No resolved alerts' : 
                   'Your system is running smoothly'}
                </Typography>
              </Paper>
            ) : (
              filteredAlerts.map(alert => (
                <Card 
                  key={alert.id}
                  elevation={0}
                  sx={{ 
                    border: 1, 
                    borderColor: 'divider',
                    opacity: alert.resolved ? 0.7 : 1,
                    bgcolor: alert.read ? 'background.paper' : 'action.hover'
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box display="flex" gap={2} flex={1}>
                        <Box sx={{ pt: 0.5 }}>
                          {getAlertIcon(alert.type)}
                        </Box>
                        <Box flex={1}>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {alert.title}
                            </Typography>
                            {!alert.read && (
                              <Chip label="New" size="small" color="primary" />
                            )}
                            {alert.resolved && (
                              <Chip label="Resolved" size="small" color="success" />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {alert.message}
                          </Typography>
                          <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                            {alert.deviceId && (
                              <Typography variant="caption" color="text.secondary">
                                Device: {getDeviceName(alert.deviceId)}
                              </Typography>
                            )}
                            <Typography variant="caption" color="text.secondary">
                              {format(new Date(alert.timestamp), 'MMM d, h:mm a')}
                            </Typography>
                          </Stack>
                        </Box>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, alert.id)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Stack>
        </Grid>
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedAlert && !alerts.find(a => a.id === selectedAlert)?.read && (
          <MenuItem onClick={() => markAsRead(selectedAlert!)}>
            Mark as Read
          </MenuItem>
        )}
        {selectedAlert && !alerts.find(a => a.id === selectedAlert)?.resolved && (
          <MenuItem onClick={() => resolveAlert(selectedAlert!)}>
            Mark as Resolved
          </MenuItem>
        )}
        <MenuItem onClick={() => deleteAlert(selectedAlert!)} sx={{ color: 'error.main' }}>
          Delete Alert
        </MenuItem>
      </Menu>
    </Container>
  );
}