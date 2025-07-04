'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Drawer,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  DeviceHub as DevicesIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Help as HelpIcon,
  Schedule as AutomationIcon,
} from '@mui/icons-material';
import { NavigationRail, NavigationItem } from '@/components/ui';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useAuth } from '@/lib/auth/hooks';
import { useTranslation } from '@/lib/i18n';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationCount] = useState(3); // TODO: Get from real data

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: t('navigation.dashboard'),
      icon: <DashboardIcon />,
      onClick: () => router.push('/dashboard'),
    },
    {
      id: 'devices',
      label: t('navigation.devices'),
      icon: <DevicesIcon />,
      onClick: () => router.push('/devices'),
    },
    {
      id: 'analytics',
      label: t('navigation.analytics'),
      icon: <AnalyticsIcon />,
      onClick: () => router.push('/analytics'),
    },
    {
      id: 'automations',
      label: t('navigation.automations'),
      icon: <AutomationIcon />,
      onClick: () => router.push('/automations'),
    },
    {
      id: 'alerts',
      label: t('navigation.alerts'),
      icon: <NotificationsIcon />,
      badge: notificationCount,
      onClick: () => router.push('/alerts'),
    },
    {
      id: 'settings',
      label: t('navigation.settings'),
      icon: <SettingsIcon />,
      onClick: () => router.push('/settings'),
    },
  ];

  const getActiveNavId = () => {
    const path = pathname.split('/')[1];
    return path || 'dashboard';
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    handleProfileMenuClose();
    await signOut();
  };

  const drawer = (
    <NavigationRail
      items={navigationItems}
      activeId={getActiveNavId()}
      expanded={!isMobile}
      header={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: theme.palette.primary.container,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="titleMedium"
              sx={{ 
                color: theme.palette.primary.onContainer,
                fontWeight: 600,
              }}
            >
              SM
            </Typography>
          </Box>
          {!isMobile && (
            <Typography variant="titleLarge">
              Shelly Monitor
            </Typography>
          )}
        </Box>
      }
      footer={
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <ThemeToggle size={isMobile ? 'small' : 'medium'} />
        </Box>
      }
    />
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="titleLarge" sx={{ flexGrow: 1 }}>
              {navigationItems.find(item => item.id === getActiveNavId())?.label}
            </Typography>
            <IconButton onClick={handleProfileMenuOpen}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: theme.palette.primary.main,
                }}
              >
                {user?.email?.[0].toUpperCase()}
              </Avatar>
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Navigation */}
      <Box
        component="nav"
        sx={{
          width: { md: 256 },
          flexShrink: { md: 0 },
        }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{
              keepMounted: true, // Better mobile performance
            }}
            sx={{
              '& .MuiDrawer-paper': {
                width: 256,
                boxSizing: 'border-box',
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Box
            sx={{
              position: 'fixed',
              height: '100vh',
              width: 256,
            }}
          >
            {drawer}
          </Box>
        )}
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 256px)` },
          mt: { xs: 8, md: 0 }, // Account for mobile app bar
        }}
      >
        {/* Desktop Header */}
        {!isMobile && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mb: 3,
            }}
          >
            <IconButton onClick={handleProfileMenuOpen}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: theme.palette.primary.main,
                }}
              >
                {user?.email?.[0].toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>
        )}

        {children}
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="labelLarge">{user?.user_metadata?.name || 'User'}</Typography>
          <Typography variant="bodySmall" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => router.push('/settings/profile')}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('navigation.profile')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => router.push('/help')}>
          <ListItemIcon>
            <HelpIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('navigation.help')}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('common.logout')}</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}