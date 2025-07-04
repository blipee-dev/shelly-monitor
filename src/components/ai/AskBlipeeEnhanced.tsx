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
import { formatDistanceToNow } from 'date-fns';

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
    systemPrompt: `You are Blipee, an AI assistant for the Shelly Monitor IoT platform. 
You help users control and monitor their Shelly smart devices. You have access to the following:

DEVICES (${devices.length} total):
${devices.map(d => `- ${d.name} (${d.type}): ${d.status}`).join('\n')}

AUTOMATIONS (${automations.length} total):
${automations.slice(0, 5).map(a => `- ${a.name}: ${a.enabled ? 'Enabled' : 'Disabled'}`).join('\n')}
${automations.length > 5 ? `... and ${automations.length - 5} more` : ''}

SCENES (${scenes.length} total):
${scenes.map(s => `- ${s.name}`).join('\n')}

You can help with:
- Controlling devices (turn on/off, adjust brightness)
- Creating automations (e.g., "Turn off lights at 10 PM")
- Managing automations (enable, disable, delete)
- Creating and activating scenes
- Checking device status and energy consumption
- Analyzing energy usage patterns
- Providing insights and recommendations

Be friendly, concise, and helpful. Use device names when referring to specific devices.
When creating automations, be clear about what will happen and when.`,
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
    "What's my current energy usage?",
    "Turn off all lights at 10 PM",
    "Create a movie night scene",
    "Show me my automations",
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