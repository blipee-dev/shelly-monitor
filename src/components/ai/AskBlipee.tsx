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
import { formatDistanceToNow } from 'date-fns';

interface AskBlipeeProps {
  onDeviceControl?: (deviceId: string, action: string, value?: any) => Promise<void>;
}

export default function AskBlipee({ onDeviceControl }: AskBlipeeProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { devices } = useDeviceStore();

  const {
    messages,
    isStreaming,
    error,
    currentResponse,
    sendMessage,
    clearMessages,
    stopStreaming,
  } = useAIStreamChat({
    systemPrompt: `You are Blipee, an AI assistant for the Blipee OS IoT platform. 
You help users control and monitor their Shelly smart devices. You have access to the following devices:
${devices.map(d => `- ${d.name} (${d.type}): ${d.status}`).join('\n')}

You can help with:
- Controlling devices (turn on/off, adjust brightness)
- Checking device status and energy consumption
- Creating automation rules
- Analyzing energy usage patterns
- Providing insights and recommendations

Be friendly, concise, and helpful. Use device names when referring to specific devices.`,
    enableDeviceFunctions: true,
    onFunctionCall: async (name, args) => {
      if (name === 'control_device' && onDeviceControl) {
        const device = devices.find(d => 
          d.name.toLowerCase() === args.device_name.toLowerCase()
        );
        if (device) {
          await onDeviceControl(device.id, args.action, args.value);
          return { success: true, message: `${args.action} ${device.name}` };
        }
        return { success: false, message: 'Device not found' };
      }
      // Handle other functions...
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
    "Turn off all lights",
    "Show me today's activity",
    "Create a bedtime automation",
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
              I can help you control devices, check energy usage, and create automations.
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
            placeholder="Ask me anything about your devices..."
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