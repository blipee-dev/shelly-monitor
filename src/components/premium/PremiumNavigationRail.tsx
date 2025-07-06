'use client';

import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useThemeMode } from './PremiumThemeProvider';

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  badge?: number | string;
  onClick?: () => void;
}

export interface PremiumNavigationRailProps {
  items: NavigationItem[];
  activeId?: string;
  expanded?: boolean;
  onItemClick?: (id: string) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function PremiumNavigationRail({
  items,
  activeId,
  expanded = false,
  onItemClick,
  header,
  footer,
}: PremiumNavigationRailProps) {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const width = expanded ? 256 : 80;

  // Glass effect configuration based on theme mode
  const glassConfig = mode === 'dark' ? {
    background: 'rgba(18, 18, 18, 0.6)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px) saturate(180%)',
  } : {
    background: 'rgba(255, 255, 255, 0.7)',
    borderColor: 'rgba(0, 0, 0, 0.08)',
    backdropFilter: 'blur(20px) saturate(180%)',
  };

  return (
    <Box
      sx={{
        width: isMobile ? '100%' : width,
        height: isMobile ? 'auto' : '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: glassConfig.background,
        backdropFilter: glassConfig.backdropFilter,
        WebkitBackdropFilter: glassConfig.backdropFilter,
        borderRight: `1px solid ${glassConfig.borderColor}`,
        borderRadius: 0,
        padding: 0,
        transition: 'width 0.3s cubic-bezier(0.2, 0, 0, 1)',
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: mode === 'dark' 
            ? 'radial-gradient(circle at 20% 50%, rgba(103, 80, 164, 0.05) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 50%, rgba(94, 53, 177, 0.03) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      {header && (
        <Box 
          sx={{ 
            p: 2, 
            borderBottom: `1px solid ${glassConfig.borderColor}`,
            background: mode === 'dark'
              ? 'rgba(255, 255, 255, 0.03)'
              : 'rgba(0, 0, 0, 0.02)',
          }}
        >
          {header}
        </Box>
      )}
      
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {items.map((item, index) => {
          const isActive = activeId === item.id;
          
          const content = (
            <ListItem disablePadding>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{ width: '100%' }}
              >
                <ListItemButton
                  selected={isActive}
                  onClick={() => {
                    item.onClick?.();
                    onItemClick?.(item.id);
                  }}
                  sx={{
                    borderRadius: 2,
                    height: 56,
                    px: expanded ? 2 : 3,
                    justifyContent: expanded ? 'flex-start' : 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: 'transparent',
                    transition: 'all 0.3s ease',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: isActive
                        ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                        : 'transparent',
                      opacity: isActive ? 0.15 : 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: isActive ? 0 : '-100%',
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(90deg, transparent 0%, ${alpha(theme.palette.primary.main, 0.1)} 50%, transparent 100%)`,
                      transform: 'translateY(-50%)',
                      transition: 'left 0.5s ease',
                    },
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      '&::after': {
                        left: '100%',
                      },
                    },
                    '& .MuiListItemIcon-root': {
                      minWidth: expanded ? 56 : 'auto',
                      color: isActive 
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                      transition: 'color 0.3s ease',
                    },
                  }}
                >
                  <ListItemIcon>
                    {item.badge ? (
                      <Badge 
                        badgeContent={item.badge} 
                        color="error"
                        max={99}
                        sx={{
                          '& .MuiBadge-badge': {
                            background: 'linear-gradient(135deg, #F44336 0%, #E91E63 100%)',
                            color: 'white',
                            fontWeight: 600,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: 24,
                            filter: isActive ? 'drop-shadow(0 2px 4px rgba(103, 80, 164, 0.3))' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {item.icon}
                        </Box>
                      </Badge>
                    ) : (
                      <Box
                        sx={{
                          fontSize: 24,
                          filter: isActive ? 'drop-shadow(0 2px 4px rgba(103, 80, 164, 0.3))' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {item.icon}
                      </Box>
                    )}
                  </ListItemIcon>
                  {expanded && (
                    <ListItemText 
                      primary={item.label}
                      primaryTypographyProps={{
                        variant: 'labelLarge',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                        sx: {
                          transition: 'all 0.3s ease',
                        }
                      }}
                    />
                  )}
                  {isActive && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 4,
                        height: 32,
                        borderRadius: '0 2px 2px 0',
                        background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, 0.6)}`,
                      }}
                    />
                  )}
                </ListItemButton>
              </motion.div>
            </ListItem>
          );

          return expanded ? (
            <React.Fragment key={item.id}>{content}</React.Fragment>
          ) : (
            <Tooltip 
              key={item.id} 
              title={item.label} 
              placement="right"
              arrow
              componentsProps={{
                tooltip: {
                  sx: {
                    background: mode === 'dark' 
                      ? 'rgba(18, 18, 18, 0.95)' 
                      : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${glassConfig.borderColor}`,
                    color: theme.palette.text.primary,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    py: 1,
                    px: 1.5,
                  },
                },
                arrow: {
                  sx: {
                    color: mode === 'dark' 
                      ? 'rgba(18, 18, 18, 0.95)' 
                      : 'rgba(255, 255, 255, 0.95)',
                    '&::before': {
                      border: `1px solid ${glassConfig.borderColor}`,
                    },
                  },
                },
              }}
            >
              {content}
            </Tooltip>
          );
        })}
      </List>
      
      {footer && (
        <Box 
          sx={{ 
            p: 2, 
            borderTop: `1px solid ${glassConfig.borderColor}`,
            background: mode === 'dark'
              ? 'rgba(255, 255, 255, 0.03)'
              : 'rgba(0, 0, 0, 0.02)',
          }}
        >
          {footer}
        </Box>
      )}
    </Box>
  );
}