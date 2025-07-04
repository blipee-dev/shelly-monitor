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
} from '@mui/material';
import { Surface } from './Surface';

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  badge?: number | string;
  onClick?: () => void;
}

export interface NavigationRailProps {
  items: NavigationItem[];
  activeId?: string;
  expanded?: boolean;
  onItemClick?: (id: string) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function NavigationRail({
  items,
  activeId,
  expanded = false,
  onItemClick,
  header,
  footer,
}: NavigationRailProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const width = expanded ? 256 : 80;

  return (
    <Surface
      level={1}
      sx={{
        width: isMobile ? '100%' : width,
        height: isMobile ? 'auto' : '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        borderRight: `1px solid ${theme.palette.outlineVariant}`,
        padding: 0,
        transition: 'width 0.3s cubic-bezier(0.2, 0, 0, 1)',
        overflow: 'hidden',
      }}
    >
      {header && (
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.outlineVariant}` }}>
          {header}
        </Box>
      )}
      
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {items.map((item) => {
          const isActive = activeId === item.id;
          const content = (
            <ListItem disablePadding>
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
                  backgroundColor: isActive 
                    ? theme.palette.primary.container 
                    : 'transparent',
                  color: isActive 
                    ? theme.palette.primary.onContainer 
                    : theme.palette.onSurfaceVariant,
                  '&:hover': {
                    backgroundColor: isActive
                      ? theme.palette.primary.container
                      : theme.palette.action.hover,
                  },
                  '& .MuiListItemIcon-root': {
                    minWidth: expanded ? 56 : 'auto',
                    color: isActive 
                      ? theme.palette.primary.onContainer 
                      : theme.palette.onSurfaceVariant,
                  },
                }}
              >
                <ListItemIcon>
                  {item.badge ? (
                    <Badge 
                      badgeContent={item.badge} 
                      color="error"
                      max={99}
                    >
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                {expanded && (
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      variant: 'labelLarge',
                      fontWeight: isActive ? 600 : 500,
                    }}
                  />
                )}
              </ListItemButton>
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
            >
              {content}
            </Tooltip>
          );
        })}
      </List>
      
      {footer && (
        <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.outlineVariant}` }}>
          {footer}
        </Box>
      )}
    </Surface>
  );
}