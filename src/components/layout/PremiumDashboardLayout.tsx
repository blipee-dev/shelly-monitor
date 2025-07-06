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
  alpha,
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
import { PremiumNavigationRail } from '@/components/premium';
import { ThemeModeToggle } from '@/components/premium';
import { useAuth } from '@/lib/auth/hooks';
import { useTranslation } from '@/lib/i18n';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import AskBlipeeEnhanced from '@/components/ai/AskBlipeeEnhanced';
import { motion } from 'framer-motion';
import { useThemeMode } from '@/components/premium/PremiumThemeProvider';
import type { NavigationItem } from '@/components/premium/PremiumNavigationRail';

interface PremiumDashboardLayoutProps {
  children: React.ReactNode;
}

export function PremiumDashboardLayout({ children }: PremiumDashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const { mode } = useThemeMode();
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

  const glassConfig = mode === 'dark' ? {
    background: 'rgba(18, 18, 18, 0.6)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  } : {
    background: 'rgba(255, 255, 255, 0.7)',
    borderColor: 'rgba(0, 0, 0, 0.08)',
  };

  const drawer = (
    <PremiumNavigationRail
      items={navigationItems}
      activeId={getActiveNavId()}
      expanded={!isMobile}
      header={
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                  animation: 'shine 3s ease-in-out infinite',
                },
                '@keyframes shine': {
                  '0%': { left: '-100%' },
                  '100%': { left: '100%' },
                },
              }}
            >
              <Typography
                variant="titleMedium"
                sx={{ 
                  color: '#fff',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                BO
              </Typography>
            </Box>
            {!isMobile && (
              <Typography 
                variant="titleLarge"
                sx={{
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Blipee OS
              </Typography>
            )}
          </Box>
        </motion.div>
      }
      footer={
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <ThemeModeToggle />
        </Box>
      }
    />
  );

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh',
        background: mode === 'dark' 
          ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
          : 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
      }}
    >
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            background: glassConfig.background,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${glassConfig.borderColor}`,
            boxShadow: 'none',
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
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
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
              keepMounted: true,
            }}
            sx={{
              '& .MuiDrawer-paper': {
                width: 256,
                boxSizing: 'border-box',
                background: 'transparent',
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
          mt: { xs: 8, md: 0 },
          mb: { xs: 8, sm: 0 },
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            background: mode === 'dark'
              ? 'radial-gradient(circle at 100% 0%, rgba(103, 80, 164, 0.05) 0%, transparent 50%)'
              : 'radial-gradient(circle at 100% 0%, rgba(94, 53, 177, 0.03) 0%, transparent 50%)',
            pointerEvents: 'none',
            zIndex: 0,
          },
        }}
      >
        {/* Desktop Header */}
        {!isMobile && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mb: 3,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <IconButton 
                onClick={handleProfileMenuOpen}
                sx={{
                  background: glassConfig.background,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: `1px solid ${glassConfig.borderColor}`,
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  }}
                >
                  {user?.email?.[0].toUpperCase()}
                </Avatar>
              </IconButton>
            </motion.div>
          </Box>
        )}

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {children}
        </Box>
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
        PaperProps={{
          sx: {
            background: glassConfig.background,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${glassConfig.borderColor}`,
            mt: 1,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="labelLarge">{user?.user_metadata?.name || 'User'}</Typography>
          <Typography variant="bodySmall" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: glassConfig.borderColor }} />
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
        <Divider sx={{ borderColor: glassConfig.borderColor }} />
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('common.logout')}</ListItemText>
        </MenuItem>
      </Menu>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
      
      {/* AI Chat Assistant */}
      <AskBlipeeEnhanced />
    </Box>
  );
}