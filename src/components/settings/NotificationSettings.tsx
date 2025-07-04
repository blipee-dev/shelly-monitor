'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Box,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  NotificationsOff,
  PhoneIphone,
  Email,
  Sms,
} from '@mui/icons-material';
import { pushManager } from '@/lib/notifications/push-manager';
import { useAuth } from '@/lib/auth/hooks';
import { createClient } from '@/lib/supabase/client';

interface NotificationPreferences {
  push_enabled: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
  device_offline: boolean;
  device_online: boolean;
  automation_triggered: boolean;
  energy_threshold: boolean;
  security_alerts: boolean;
  maintenance_reminders: boolean;
}

export function NotificationSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    push_enabled: false,
    email_enabled: true,
    sms_enabled: false,
    device_offline: true,
    device_online: false,
    automation_triggered: true,
    energy_threshold: true,
    security_alerts: true,
    maintenance_reminders: false,
  });

  useEffect(() => {
    loadPreferences();
    checkPushPermission();
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('notification_preferences')
        .eq('user_id', user.id)
        .single();

      if (data?.notification_preferences) {
        setPreferences(data.notification_preferences);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPushPermission = async () => {
    if ('Notification' in window) {
      setPushPermission(Notification.permission);
    }
  };

  const handlePushToggle = async () => {
    if (!preferences.push_enabled) {
      // Enable push notifications
      try {
        const permission = await pushManager.requestPermission();
        setPushPermission(permission);
        
        if (permission === 'granted') {
          setPreferences(prev => ({ ...prev, push_enabled: true }));
          await savePreferences({ ...preferences, push_enabled: true });
        }
      } catch (error) {
        console.error('Failed to enable push notifications:', error);
      }
    } else {
      // Disable push notifications
      try {
        await pushManager.unsubscribe();
        setPreferences(prev => ({ ...prev, push_enabled: false }));
        await savePreferences({ ...preferences, push_enabled: false });
      } catch (error) {
        console.error('Failed to disable push notifications:', error);
      }
    }
  };

  const handlePreferenceChange = (key: keyof NotificationPreferences) => async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPreferences = {
      ...preferences,
      [key]: event.target.checked,
    };
    setPreferences(newPreferences);
    await savePreferences(newPreferences);
  };

  const savePreferences = async (newPreferences: NotificationPreferences) => {
    if (!user) return;

    setSaving(true);
    const supabase = createClient();
    
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          notification_preferences: newPreferences,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const sendTestNotification = async () => {
    try {
      await pushManager.sendTestNotification();
    } catch (error) {
      console.error('Failed to send test notification:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Notification Settings
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Notification Channels
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText
                primary="Push Notifications"
                secondary={
                  pushPermission === 'denied' 
                    ? 'Browser notifications are blocked. Enable them in your browser settings.'
                    : 'Receive instant alerts on this device'
                }
              />
              <ListItemSecondaryAction>
                <Box display="flex" alignItems="center" gap={1}>
                  {pushPermission === 'granted' && preferences.push_enabled && (
                    <Chip
                      icon={<NotificationsActive />}
                      label="Active"
                      color="success"
                      size="small"
                    />
                  )}
                  <Switch
                    checked={preferences.push_enabled}
                    onChange={handlePushToggle}
                    disabled={pushPermission === 'denied' || saving}
                  />
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
            
            <Divider />
            
            <ListItem>
              <ListItemText
                primary="Email Notifications"
                secondary="Receive notifications via email"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={preferences.email_enabled}
                  onChange={handlePreferenceChange('email_enabled')}
                  disabled={saving}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <Divider />
            
            <ListItem>
              <ListItemText
                primary="SMS Notifications"
                secondary="Receive critical alerts via SMS (requires phone number)"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={preferences.sms_enabled}
                  onChange={handlePreferenceChange('sms_enabled')}
                  disabled={saving}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Notification Types
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText
                primary="Device Goes Offline"
                secondary="Alert when a device loses connection"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={preferences.device_offline}
                  onChange={handlePreferenceChange('device_offline')}
                  disabled={saving}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <Divider />
            
            <ListItem>
              <ListItemText
                primary="Device Comes Online"
                secondary="Alert when a device reconnects"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={preferences.device_online}
                  onChange={handlePreferenceChange('device_online')}
                  disabled={saving}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <Divider />
            
            <ListItem>
              <ListItemText
                primary="Automation Triggered"
                secondary="Notify when automations run"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={preferences.automation_triggered}
                  onChange={handlePreferenceChange('automation_triggered')}
                  disabled={saving}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <Divider />
            
            <ListItem>
              <ListItemText
                primary="Energy Threshold Alerts"
                secondary="Alert when energy usage exceeds limits"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={preferences.energy_threshold}
                  onChange={handlePreferenceChange('energy_threshold')}
                  disabled={saving}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <Divider />
            
            <ListItem>
              <ListItemText
                primary="Security Alerts"
                secondary="Important security notifications"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={preferences.security_alerts}
                  onChange={handlePreferenceChange('security_alerts')}
                  disabled={saving}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <Divider />
            
            <ListItem>
              <ListItemText
                primary="Maintenance Reminders"
                secondary="Device maintenance and update reminders"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={preferences.maintenance_reminders}
                  onChange={handlePreferenceChange('maintenance_reminders')}
                  disabled={saving}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {preferences.push_enabled && pushPermission === 'granted' && (
        <Box mt={3}>
          <Button
            variant="outlined"
            startIcon={<Notifications />}
            onClick={sendTestNotification}
          >
            Send Test Notification
          </Button>
        </Box>
      )}

      {saving && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Saving preferences...
        </Alert>
      )}
    </Box>
  );
}