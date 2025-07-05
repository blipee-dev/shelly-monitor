'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Paper,
  TextField,
  IconButton,
  Typography,
  Box,
  Avatar,
  Divider,
  CircularProgress,
  Chip,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Send,
  Clear,
  SmartToy,
  Person,
  Stop,
  AutoAwesome,
} from '@mui/icons-material';
import { useAIStreamChat } from '@/lib/ai/hooks';
import { useDeviceStore } from '@/lib/stores/deviceStore';
import { useAutomationStore } from '@/lib/stores/automationStore';
import { AutomationParser } from '@/lib/automation/parser';
import { pushManager } from '@/lib/notifications/push-manager';
import { createClient } from '@/lib/supabase/client';
import { PredictiveNotificationEngine } from '@/lib/ai/predictive-notifications';
import { formatDistanceToNow } from 'date-fns';
import { BLIPEE_OS_SYSTEM_PROMPT, ENTERPRISE_FEATURES_PROMPT } from '@/lib/ai/prompts/blipee-os-system';

interface AskBlipeeEnhancedProps {
  onDeviceControl?: (deviceId: string, action: string, value?: any) => Promise<void>;
}

export default function AskBlipeeEnhanced({ onDeviceControl }: AskBlipeeEnhancedProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { devices } = useDeviceStore();
  const { 
    automations, 
    scenes, 
    createAutomation, 
    createScene, 
    toggleAutomation,
    deleteAutomation,
    activateScene,
    fetchAutomations,
    fetchScenes,
  } = useAutomationStore();

  // Fetch automations and scenes on mount
  useEffect(() => {
    fetchAutomations();
    fetchScenes();
  }, [fetchAutomations, fetchScenes]);

  const {
    messages,
    isStreaming,
    error,
    currentResponse,
    sendMessage,
    clearMessages,
    stopStreaming,
  } = useAIStreamChat({
    systemPrompt: `${BLIPEE_OS_SYSTEM_PROMPT}

${ENTERPRISE_FEATURES_PROMPT}

CURRENT SYSTEM STATE:

DEVICES (${devices.length} total):
${devices.map(d => `- ${d.name} (${d.type}): ${d.status}`).join('\n')}

AUTOMATIONS (${automations.length} total):
${automations.slice(0, 5).map(a => `- ${a.name}: ${a.enabled ? 'Enabled' : 'Disabled'}`).join('\n')}
${automations.length > 5 ? `... and ${automations.length - 5} more` : ''}

SCENES (${scenes.length} total):
${scenes.map(s => `- ${s.name}`).join('\n')}

Current user is authenticated and has full access to all features.`,
    enableDeviceFunctions: true,
    onFunctionCall: async (name, args) => {
      try {
        switch (name) {
          case 'control_device': {
            if (onDeviceControl) {
              const device = devices.find(d => 
                d.name.toLowerCase() === args.device_name.toLowerCase()
              );
              if (device) {
                await onDeviceControl(device.id, args.action, args.value);
                return { success: true, message: `${args.action} ${device.name}` };
              }
              return { success: false, message: 'Device not found' };
            }
            break;
          }

          case 'create_automation': {
            // Parse the automation from natural language
            const intent = AutomationParser.parseAutomationRequest(
              `${args.trigger} ${args.action}`,
              devices
            );
            
            if (intent.type === 'create' && intent.automation) {
              const automation = await createAutomation({
                ...intent.automation,
                name: args.name,
                userId: '', // Will be set by the store
              });
              return { 
                success: true, 
                message: `Created automation "${automation.name}"`,
                automation,
              };
            }
            break;
          }

          case 'manage_automation': {
            const automation = automations.find(a => 
              a.name.toLowerCase() === args.automation_name.toLowerCase()
            );
            
            if (automation) {
              switch (args.action) {
                case 'enable':
                  await toggleAutomation(automation.id, true);
                  return { success: true, message: `Enabled "${automation.name}"` };
                case 'disable':
                  await toggleAutomation(automation.id, false);
                  return { success: true, message: `Disabled "${automation.name}"` };
                case 'delete':
                  await deleteAutomation(automation.id);
                  return { success: true, message: `Deleted "${automation.name}"` };
              }
            }
            return { success: false, message: 'Automation not found' };
          }

          case 'list_automations': {
            const filtered = args.filter ? 
              automations.filter(a => 
                args.filter === 'enabled' ? a.enabled : 
                args.filter === 'disabled' ? !a.enabled : true
              ) : automations;
            
            return { 
              success: true, 
              automations: filtered.map(a => ({
                name: a.name,
                enabled: a.enabled,
                description: a.description,
              })),
            };
          }

          case 'create_scene': {
            const intent = AutomationParser.parseSceneRequest(
              args.actions.join(', '),
              devices
            );
            
            if (intent.scene) {
              const scene = await createScene({
                ...intent.scene,
                name: args.name,
                description: args.description,
                userId: '', // Will be set by the store
              });
              return { 
                success: true, 
                message: `Created scene "${scene.name}"`,
                scene,
              };
            }
            break;
          }

          case 'activate_scene': {
            const scene = scenes.find(s => 
              s.name.toLowerCase() === args.scene_name.toLowerCase()
            );
            
            if (scene) {
              await activateScene(scene.id);
              return { success: true, message: `Activated scene "${scene.name}"` };
            }
            return { success: false, message: 'Scene not found' };
          }

          case 'list_scenes': {
            return { 
              success: true, 
              scenes: scenes.map(s => ({
                name: s.name,
                description: s.description,
                isFavorite: s.isFavorite,
              })),
            };
          }

          case 'get_device_status': {
            const device = devices.find(d => 
              d.name.toLowerCase() === args.device_name.toLowerCase()
            );
            if (device) {
              return { 
                success: true, 
                device: {
                  name: device.name,
                  status: device.status,
                  type: device.type,
                  data: device.data,
                },
              };
            }
            return { success: false, message: 'Device not found' };
          }

          case 'get_energy_consumption': {
            // Mock implementation - would connect to real analytics
            const totalPower = devices.reduce((sum, device) => {
              if (device.status === 'online' && device.data) {
                const power = device.data.switch0?.apower || 0;
                return sum + power;
              }
              return sum;
            }, 0);
            
            return {
              success: true,
              period: args.period,
              totalPower: `${totalPower}W`,
              estimatedDailyCost: `€${((totalPower * 24 / 1000) * 0.15).toFixed(2)}`,
            };
          }

          case 'manage_notifications': {
            try {
              const supabase = createClient();
              const { data: { user } } = await supabase.auth.getUser();
              
              if (!user) {
                return { success: false, message: 'Please sign in to manage notifications' };
              }

              switch (args.action) {
                case 'enable':
                  if (args.type === 'push') {
                    const permission = await pushManager.requestPermission();
                    return { 
                      success: permission === 'granted', 
                      message: permission === 'granted' 
                        ? 'Push notifications enabled' 
                        : 'Push notification permission denied' 
                    };
                  }
                  // Update preferences in database
                  await supabase
                    .from('user_preferences')
                    .upsert({
                      user_id: user.id,
                      notification_preferences: {
                        [`${args.type}_enabled`]: true,
                      },
                    });
                  return { success: true, message: `${args.type} notifications enabled` };

                case 'disable':
                  if (args.type === 'push') {
                    await pushManager.unsubscribe();
                  }
                  await supabase
                    .from('user_preferences')
                    .upsert({
                      user_id: user.id,
                      notification_preferences: {
                        [`${args.type}_enabled`]: false,
                      },
                    });
                  return { success: true, message: `${args.type} notifications disabled` };

                case 'test':
                  await pushManager.sendTestNotification();
                  return { success: true, message: 'Test notification sent' };

                case 'status':
                  const state = await pushManager.getPermissionState();
                  return { 
                    success: true, 
                    status: {
                      permission: state.permission,
                      isSupported: state.isSupported,
                      hasSubscription: !!state.subscription,
                    },
                  };
              }
            } catch (error) {
              return { 
                success: false, 
                message: `Failed to manage notifications: ${error instanceof Error ? error.message : 'Unknown error'}` 
              };
            }
            break;
          }

          case 'install_app': {
            const platform = args.platform || 'auto';
            const instructions = {
              ios: 'To install on iOS: Open this site in Safari, tap the Share button, then "Add to Home Screen"',
              android: 'To install on Android: Tap the menu (⋮) in Chrome, then "Add to Home screen"',
              desktop: 'To install on desktop: Look for the install icon in your browser\'s address bar',
              auto: 'I can help you install the app. Which device are you using? iOS, Android, or Desktop?',
            };
            
            // Trigger install prompt if available
            if (platform === 'auto' && window.matchMedia('(display-mode: browser)').matches) {
              // The install prompt is handled by the InstallPrompt component
              return { 
                success: true, 
                message: 'Look for the "Install App" button that just appeared!',
                showInstallPrompt: true,
              };
            }
            
            return { 
              success: true, 
              message: instructions[platform as keyof typeof instructions] || instructions.auto,
            };
          }

          case 'check_pwa_status': {
            const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                              (window.navigator as any).standalone === true;
            const isOnline = navigator.onLine;
            const notificationState = await pushManager.getPermissionState();
            
            return {
              success: true,
              status: {
                installed: isInstalled,
                online: isOnline,
                notifications: {
                  supported: notificationState.isSupported,
                  permission: notificationState.permission,
                  enabled: notificationState.permission === 'granted',
                },
              },
              message: `App ${isInstalled ? 'is' : 'is not'} installed. ${isOnline ? 'Online' : 'Offline'} mode. Notifications ${notificationState.permission === 'granted' ? 'enabled' : 'disabled'}.`,
            };
          }

          case 'sync_offline_data': {
            if (!navigator.onLine) {
              return { success: false, message: 'Cannot sync while offline' };
            }
            
            // Trigger background sync
            if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
              const registration = await navigator.serviceWorker.ready;
              await (registration as any).sync.register('sync-device-actions');
              return { success: true, message: 'Offline data sync initiated' };
            }
            
            return { success: false, message: 'Background sync not supported' };
          }

          case 'send_notification': {
            try {
              const notificationState = await pushManager.getPermissionState();
              
              if (notificationState.permission !== 'granted') {
                return { 
                  success: false, 
                  message: 'Push notifications are not enabled. Would you like me to enable them first?' 
                };
              }

              // Send via service worker for push notification
              if (args.channel === 'push' || args.channel === 'both' || !args.channel) {
                const registration = await navigator.serviceWorker.ready;
                await registration.showNotification(args.title, {
                  body: args.message,
                  icon: '/icons/icon-192x192.png',
                  badge: '/icons/icon-72x72.png',
                  tag: `custom-${Date.now()}`,
                  data: {
                    type: args.type || 'info',
                    timestamp: new Date().toISOString(),
                  },
                });
              }

              // Queue email notification if requested
              if (args.channel === 'email' || args.channel === 'both') {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                
                if (user) {
                  await supabase.from('notification_queue').insert({
                    user_id: user.id,
                    type: args.type || 'info',
                    channel: 'email',
                    title: args.title,
                    body: args.message,
                  });
                }
              }

              return { 
                success: true, 
                message: `Notification sent${args.channel === 'both' ? ' via push and email' : ''}!` 
              };
            } catch (error) {
              return { 
                success: false, 
                message: `Failed to send notification: ${error instanceof Error ? error.message : 'Unknown error'}` 
              };
            }
          }

          case 'suggest_notifications': {
            const suggestions = [];
            const category = args.category || 'all';

            // Energy suggestions
            if (category === 'energy' || category === 'all') {
              suggestions.push({
                title: 'High Energy Alert',
                description: 'Get notified when any device exceeds 1000W power consumption',
                type: 'energy_threshold',
              });
              suggestions.push({
                title: 'Daily Energy Report',
                description: 'Receive a summary of your energy usage every evening at 8 PM',
                type: 'energy_report',
              });
            }

            // Security suggestions
            if (category === 'security' || category === 'all') {
              suggestions.push({
                title: 'Device Offline Alert',
                description: 'Instant notification when any device loses connection',
                type: 'device_offline',
              });
              suggestions.push({
                title: 'Unusual Activity',
                description: 'Alert when devices are activated at unusual times',
                type: 'security_alert',
              });
            }

            // Maintenance suggestions
            if (category === 'maintenance' || category === 'all') {
              suggestions.push({
                title: 'Weekly Device Check',
                description: 'Reminder to check device firmware updates every Sunday',
                type: 'maintenance_reminder',
              });
              suggestions.push({
                title: 'Low Battery Warning',
                description: 'Alert when battery-powered devices drop below 20%',
                type: 'battery_low',
              });
            }

            // Automation suggestions based on current devices
            if ((category === 'automation' || category === 'all') && devices.length > 0) {
              const hasMotionSensor = devices.some(d => d.type === 'motion');
              const hasLights = devices.some(d => d.type === 'plus2pm' || d.type === 'dimmer2');
              
              if (hasMotionSensor && hasLights) {
                suggestions.push({
                  title: 'Motion Alert',
                  description: 'Notify when motion is detected while you\'re away',
                  type: 'motion_alert',
                });
              }
              
              suggestions.push({
                title: 'Automation Success',
                description: 'Confirm when scheduled automations run successfully',
                type: 'automation_triggered',
              });
            }

            return {
              success: true,
              suggestions,
              message: `Here are some notification suggestions${category !== 'all' ? ` for ${category}` : ''}. Would you like me to enable any of these?`,
            };
          }

          case 'schedule_notification': {
            try {
              const supabase = createClient();
              const { data: { user } } = await supabase.auth.getUser();
              
              if (!user) {
                return { success: false, message: 'Please sign in to schedule notifications' };
              }

              // Parse schedule time
              const now = new Date();
              let scheduledTime: Date;
              let cronExpression: string | null = null;

              // Simple parsing - in production, use a proper NLP date parser
              if (args.schedule_time.includes('minutes')) {
                const minutes = parseInt(args.schedule_time.match(/\d+/)?.[0] || '30');
                scheduledTime = new Date(now.getTime() + minutes * 60000);
              } else if (args.schedule_time.includes('tomorrow')) {
                scheduledTime = new Date(now);
                scheduledTime.setDate(scheduledTime.getDate() + 1);
                scheduledTime.setHours(9, 0, 0, 0); // Default to 9 AM
              } else if (args.recurring && args.schedule_time.includes('every')) {
                // Handle recurring notifications
                if (args.schedule_time.includes('Monday')) {
                  cronExpression = '0 9 * * 1'; // Every Monday at 9 AM
                } else if (args.schedule_time.includes('day')) {
                  cronExpression = '0 9 * * *'; // Every day at 9 AM
                }
                scheduledTime = new Date(); // Set to now, cron will handle timing
              } else {
                scheduledTime = new Date(now.getTime() + 3600000); // Default to 1 hour
              }

              // Store scheduled notification
              await supabase.from('scheduled_notifications').insert({
                user_id: user.id,
                title: args.title,
                message: args.message,
                scheduled_time: scheduledTime.toISOString(),
                cron_expression: cronExpression,
                is_recurring: args.recurring || false,
                status: 'pending',
              });

              return {
                success: true,
                message: `Notification scheduled for ${scheduledTime.toLocaleString()}${args.recurring ? ' (recurring)' : ''}`,
              };
            } catch (error) {
              return {
                success: false,
                message: `Failed to schedule notification: ${error instanceof Error ? error.message : 'Unknown error'}`,
              };
            }
          }

          case 'analyze_predictive_notifications': {
            try {
              const supabase = createClient();
              const { data: { user } } = await supabase.auth.getUser();
              
              if (!user) {
                return { success: false, message: 'Please sign in to analyze patterns' };
              }

              // Analyze patterns using the predictive engine
              const predictions = await PredictiveNotificationEngine.analyzePatternsAndSuggest(
                devices,
                automations,
                user.id
              );

              // Filter by focus area if specified
              let filteredPredictions = predictions;
              if (args.focus && args.focus !== 'all') {
                filteredPredictions = predictions.filter(p => {
                  switch (args.focus) {
                    case 'patterns': return p.type === 'pattern';
                    case 'anomalies': return p.type === 'anomaly';
                    case 'energy': return p.type === 'optimization';
                    case 'maintenance': return p.trigger.type === 'time' && p.title.includes('Maintenance');
                    case 'behavior': return p.type === 'prediction';
                    default: return true;
                  }
                });
              }

              // Auto-enable top suggestions if requested
              if (args.enable_suggested && filteredPredictions.length > 0) {
                const topPredictions = filteredPredictions.slice(0, 3);
                
                for (const prediction of topPredictions) {
                  // Create notification based on prediction
                  if (prediction.trigger.type === 'time') {
                    await supabase.from('scheduled_notifications').insert({
                      user_id: user.id,
                      title: prediction.title,
                      message: prediction.message,
                      scheduled_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
                      is_recurring: prediction.trigger.condition.includes('daily'),
                    });
                  } else {
                    // Enable the relevant notification type
                    await supabase
                      .from('user_preferences')
                      .upsert({
                        user_id: user.id,
                        notification_preferences: {
                          [`${prediction.type}_alerts`]: true,
                        },
                      });
                  }
                }
              }

              return {
                success: true,
                predictions: filteredPredictions.map(p => ({
                  title: p.title,
                  message: p.message,
                  confidence: `${Math.round(p.confidence * 100)}%`,
                  trigger: p.trigger.condition,
                  action: p.suggestedAction?.description,
                })),
                message: filteredPredictions.length > 0 
                  ? `Found ${filteredPredictions.length} predictive notification opportunities based on your usage patterns!`
                  : 'No significant patterns detected yet. Keep using your devices and I\'ll learn your habits!',
              };
            } catch (error) {
              return {
                success: false,
                message: `Failed to analyze patterns: ${error instanceof Error ? error.message : 'Unknown error'}`,
              };
            }
          }
        }
      } catch (error) {
        console.error(`Function ${name} failed:`, error);
        return { 
          success: false, 
          message: `Failed to ${name}: ${error instanceof Error ? error.message : 'Unknown error'}` 
        };
      }
      
      return { success: false, message: 'Function not implemented' };
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isStreaming) {
      sendMessage(input);
      setInput('');
    }
  };

  const suggestedQuestions = [
    "Analyze my usage patterns",
    "What predictive notifications do you suggest?",
    "Detect any unusual activity",
    "Show me energy-saving opportunities",
  ];

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        border: 1,
        borderColor: 'divider',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
              <AutoAwesome fontSize="small" />
            </Avatar>
            <Typography variant="h6">Ask Blipee</Typography>
          </Box>
          <Tooltip title="Clear conversation">
            <IconButton size="small" onClick={clearMessages}>
              <Clear />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Messages */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {messages.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <SmartToy sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Hi! I'm Blipee, your smart home assistant.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              I can control devices, create automations, manage scenes, and analyze your energy usage.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {suggestedQuestions.map((question, index) => (
                <Chip
                  key={index}
                  label={question}
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setInput(question);
                    sendMessage(question);
                  }}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>
        )}

        {messages.map((message, index) => (
          <Box key={message.id} sx={{ mb: 2 }}>
            <Box display="flex" gap={1} alignItems="flex-start">
              <Avatar sx={{ 
                bgcolor: message.role === 'user' ? 'grey.300' : 'primary.main',
                width: 32,
                height: 32,
              }}>
                {message.role === 'user' ? <Person /> : <SmartToy />}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="baseline" gap={1} mb={0.5}>
                  <Typography variant="subtitle2">
                    {message.role === 'user' ? 'You' : 'Blipee'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                  </Typography>
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    '& code': {
                      bgcolor: 'grey.100',
                      px: 0.5,
                      py: 0.25,
                      borderRadius: 0.5,
                      fontFamily: 'monospace',
                      fontSize: '0.85em',
                    }
                  }}
                >
                  {message.content}
                </Typography>
                {message.metadata?.action && (
                  <Chip
                    size="small"
                    label={`Action: ${message.metadata.action}`}
                    color="primary"
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        ))}

        {/* Current streaming response */}
        {currentResponse && (
          <Box sx={{ mb: 2 }}>
            <Box display="flex" gap={1} alignItems="flex-start">
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                <SmartToy />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="baseline" gap={1} mb={0.5}>
                  <Typography variant="subtitle2">Blipee</Typography>
                  <CircularProgress size={12} />
                </Box>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {currentResponse}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography variant="body2" color="error.dark">
              Error: {error}
            </Typography>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      {/* Input */}
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        <Box display="flex" gap={1}>
          <TextField
            fullWidth
            size="small"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Try: 'Create an automation to turn off lights at bedtime' or 'Activate movie night'"
            disabled={isStreaming}
            multiline
            maxRows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />
          {isStreaming ? (
            <IconButton 
              color="error" 
              onClick={stopStreaming}
              sx={{ bgcolor: 'error.light' }}
            >
              <Stop />
            </IconButton>
          ) : (
            <IconButton 
              type="submit" 
              color="primary" 
              disabled={!input.trim()}
              sx={{ bgcolor: 'primary.light' }}
            >
              <Send />
            </IconButton>
          )}
        </Box>
      </Box>
    </Paper>
  );
}