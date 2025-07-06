'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
} from '@mui/material';
import {
  Dashboard,
  DeviceHub,
  Analytics,
  SmartToy,
  Settings,
} from '@mui/icons-material';
import { useDeviceStore } from '@/lib/stores/deviceStore';

const navigationItems = [
  {
    label: 'Dashboard',
    value: '/dashboard',
    icon: Dashboard,
  },
  {
    label: 'Devices',
    value: '/devices',
    icon: DeviceHub,
  },
  {
    label: 'Analytics',
    value: '/analytics',
    icon: Analytics,
  },
  {
    label: 'Automations',
    value: '/automations',
    icon: SmartToy,
  },
  {
    label: 'Settings',
    value: '/settings',
    icon: Settings,
  },
];

export function MobileNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { devices } = useDeviceStore();
  
  const offlineDevices = devices.filter(d => d.status !== 'online').length;

  const handleNavigation = (event: React.SyntheticEvent, newValue: string) => {
    router.push(newValue);
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: 'block', sm: 'none' },
        zIndex: 1100,
      }}
      elevation={3}
    >
      <BottomNavigation
        value={pathname}
        onChange={handleNavigation}
        showLabels
      >
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const showBadge = item.value === '/devices' && offlineDevices > 0;
          
          return (
            <BottomNavigationAction
              key={item.value}
              label={item.label}
              value={item.value}
              icon={
                showBadge ? (
                  <Badge badgeContent={offlineDevices} color="error">
                    <Icon />
                  </Badge>
                ) : (
                  <Icon />
                )
              }
              sx={{
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              }}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
}