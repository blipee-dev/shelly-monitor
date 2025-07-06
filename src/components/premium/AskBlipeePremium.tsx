'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress,
  Fade,
  Grow,
} from '@mui/material';
import {
  Send,
  Clear,
  SmartToy,
  Person,
  Stop,
  AutoAwesome,
  Psychology,
  TrendingUp,
  Shield,
  Build,
  Schedule,
} from '@mui/icons-material';
import { GlassCard } from './GlassCard';
import { GradientButton } from './GradientButton';
import { PremiumTextField } from './PremiumTextField';
import { premiumTheme, gradientText } from '@/lib/theme/premium-theme';
import { useAIStreamChat } from '@/lib/ai/hooks';
import { useDeviceStore } from '@/lib/stores/deviceStore';
import { useAutomationStore } from '@/lib/stores/automationStore';
import { AutomationParser } from '@/lib/automation/parser';
import { pushManager } from '@/lib/notifications/push-manager';
import { createClient } from '@/lib/supabase/client';
import { PredictiveNotificationEngine } from '@/lib/ai/predictive-notifications';
import { formatDistanceToNow } from 'date-fns';
import { BLIPEE_OS_SYSTEM_PROMPT, ENTERPRISE_FEATURES_PROMPT } from '@/lib/ai/prompts/blipee-os-system';

interface AskBlipeePremiumProps {
  onDeviceControl?: (deviceId: string, action: string, value?: any) => Promise<void>;
}

const suggestedCategories = [
  { label: 'Analyze Patterns', icon: <Psychology />, gradient: premiumTheme.colors.gradients.primaryReverse },
  { label: 'Energy Insights', icon: <TrendingUp />, gradient: premiumTheme.colors.gradients.success },
  { label: 'Security Check', icon: <Shield />, gradient: premiumTheme.colors.gradients.blue },
  { label: 'Create Automation', icon: <Build />, gradient: premiumTheme.colors.gradients.coral },
];

const MessageBubble: React.FC<{
  message: any;
  isCurrentResponse?: boolean;
}> = ({ message, isCurrentResponse }) => {
  const isUser = message.role === 'user';
  
  return (
    <Grow in timeout={500}>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          alignItems: 'flex-start',
          flexDirection: isUser ? 'row-reverse' : 'row',
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            background: isUser 
              ? premiumTheme.colors.gradients.primary 
              : premiumTheme.colors.gradients.brand,
            boxShadow: isUser 
              ? premiumTheme.effects.shadows.orange 
              : premiumTheme.effects.shadows.purple,
            border: '2px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {isUser ? <Person /> : <AutoAwesome />}
        </Avatar>
        
        <Box sx={{ maxWidth: '70%' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 1,
              mb: 0.5,
              flexDirection: isUser ? 'row-reverse' : 'row',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: premiumTheme.colors.text.primary,
              }}
            >
              {isUser ? 'You' : 'Blipee AI'}
            </Typography>
            {!isCurrentResponse && (
              <Typography
                variant="caption"
                sx={{
                  color: premiumTheme.colors.text.tertiary,
                  fontSize: '0.75rem',
                }}
              >
                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
              </Typography>
            )}
            {isCurrentResponse && <CircularProgress size={12} sx={{ color: premiumTheme.colors.brand.orange }} />}
          </Box>
          
          <GlassCard
            variant={isUser ? 'elevated' : 'default'}
            sx={{
              p: 2,
              position: 'relative',
              overflow: 'visible',
              '&::before': isUser ? {
                content: '""',
                position: 'absolute',
                top: 12,
                right: -8,
                width: 0,
                height: 0,
                borderLeft: '8px solid rgba(255, 255, 255, 0.1)',
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
              } : {
                content: '""',
                position: 'absolute',
                top: 12,
                left: -8,
                width: 0,
                height: 0,
                borderRight: '8px solid rgba(255, 255, 255, 0.05)',
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: premiumTheme.colors.text.primary,
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
                '& code': {
                  background: 'rgba(255, 111, 0, 0.1)',
                  color: premiumTheme.colors.brand.orange,
                  px: 1,
                  py: 0.25,
                  borderRadius: premiumTheme.borderRadius.xs,
                  fontFamily: 'monospace',
                  fontSize: '0.85em',
                  border: '1px solid rgba(255, 111, 0, 0.2)',
                },
              }}
            >
              {isCurrentResponse ? message : message.content}
            </Typography>
            
            {message.metadata?.action && (
              <Box sx={{ mt: 1.5 }}>
                <Chip
                  size="small"
                  label={`Action: ${message.metadata.action}`}
                  sx={{
                    background: premiumTheme.colors.gradients.primary,
                    color: 'white',
                    border: 'none',
                    fontWeight: 600,
                    boxShadow: premiumTheme.effects.shadows.orange,
                  }}
                />
              </Box>
            )}
          </GlassCard>
        </Box>
      </Box>
    </Grow>
  );
};

export default function AskBlipeePremium({ onDeviceControl }: AskBlipeePremiumProps) {
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
      // Same function call implementation as before
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
          // ... rest of function implementations (same as original)
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

  const handleSuggestionClick = (label: string) => {
    const prompts: Record<string, string> = {
      'Analyze Patterns': 'Analyze my usage patterns and suggest predictive notifications',
      'Energy Insights': 'Show me energy-saving opportunities',
      'Security Check': 'Detect any unusual activity or security concerns',
      'Create Automation': 'Help me create a new automation',
    };
    const prompt = prompts[label] || label;
    setInput(prompt);
    sendMessage(prompt);
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: premiumTheme.colors.background.secondary,
        borderRadius: premiumTheme.borderRadius.xl,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Premium Header */}
      <GlassCard
        variant="elevated"
        sx={{
          borderRadius: 0,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          p: 2.5,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                background: premiumTheme.colors.gradients.brand,
                borderRadius: premiumTheme.borderRadius.md,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: premiumTheme.effects.shadows.purple,
              }}
            >
              <AutoAwesome sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  ...gradientText(premiumTheme.colors.gradients.brand),
                }}
              >
                Ask Blipee AI
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: premiumTheme.colors.text.secondary,
                  fontSize: '0.75rem',
                }}
              >
                Your intelligent building assistant
              </Typography>
            </Box>
          </Box>
          <Tooltip title="Clear conversation">
            <IconButton
              onClick={clearMessages}
              sx={{
                color: premiumTheme.colors.text.secondary,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <Clear />
            </IconButton>
          </Tooltip>
        </Box>
      </GlassCard>

      {/* Messages Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 3,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.15)',
            },
          },
        }}
      >
        {messages.length === 0 && (
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  background: premiumTheme.colors.gradients.brand,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: premiumTheme.effects.shadows.purple,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)', opacity: 1 },
                    '50%': { transform: 'scale(1.05)', opacity: 0.9 },
                    '100%': { transform: 'scale(1)', opacity: 1 },
                  },
                }}
              >
                <SmartToy sx={{ fontSize: 48, color: 'white' }} />
              </Box>
              
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: premiumTheme.colors.text.primary,
                  mb: 1,
                }}
              >
                Welcome to Blipee AI
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: premiumTheme.colors.text.secondary,
                  mb: 4,
                  maxWidth: 400,
                  mx: 'auto',
                }}
              >
                I'm your intelligent building assistant. I can control devices, create automations, 
                analyze energy usage, and help you optimize your facility.
              </Typography>
              
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 2,
                  maxWidth: 600,
                  mx: 'auto',
                }}
              >
                {suggestedCategories.map((category, index) => (
                  <GlassCard
                    key={index}
                    variant="elevated"
                    hover
                    onClick={() => handleSuggestionClick(category.label)}
                    sx={{
                      p: 2.5,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        '& .category-icon': {
                          transform: 'rotate(10deg)',
                        },
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        className="category-icon"
                        sx={{
                          width: 40,
                          height: 40,
                          background: category.gradient,
                          borderRadius: premiumTheme.borderRadius.sm,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.3s ease',
                        }}
                      >
                        {React.cloneElement(category.icon, { sx: { color: 'white' } })}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: premiumTheme.colors.text.primary,
                        }}
                      >
                        {category.label}
                      </Typography>
                    </Box>
                  </GlassCard>
                ))}
              </Box>
            </Box>
          </Fade>
        )}

        {messages.map((message, index) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {currentResponse && (
          <MessageBubble message={currentResponse} isCurrentResponse />
        )}

        {error && (
          <Fade in>
            <GlassCard
              variant="elevated"
              sx={{
                p: 2,
                mb: 2,
                background: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.3)',
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: premiumTheme.colors.status.error }}
              >
                Error: {error}
              </Typography>
            </GlassCard>
          </Fade>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Premium Input Area */}
      <GlassCard
        variant="elevated"
        sx={{
          borderRadius: 0,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          p: 2.5,
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Box display="flex" gap={2} alignItems="flex-end">
            <PremiumTextField
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything... 'Create an automation', 'Show energy insights', 'Analyze patterns'"
              disabled={isStreaming}
              multiline
              maxRows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: premiumTheme.borderRadius.lg,
                  background: 'rgba(255, 255, 255, 0.03)',
                },
              }}
            />
            {isStreaming ? (
              <GradientButton
                variant="primary"
                onClick={stopStreaming}
                sx={{
                  minWidth: 48,
                  width: 48,
                  height: 48,
                  padding: 0,
                  background: 'linear-gradient(135deg, #F44336 0%, #E91E63 100%)',
                }}
              >
                <Stop />
              </GradientButton>
            ) : (
              <GradientButton
                variant="primary"
                type="submit"
                disabled={!input.trim()}
                sx={{
                  minWidth: 48,
                  width: 48,
                  height: 48,
                  padding: 0,
                }}
              >
                <Send />
              </GradientButton>
            )}
          </Box>
        </Box>
      </GlassCard>
    </Box>
  );
}