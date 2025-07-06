'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
  Alert,
  Collapse,
} from '@mui/material';
import {
  Close,
  InstallMobile,
  PhoneIphone,
  Laptop,
  Add,
} from '@mui/icons-material';
import { logger } from '@/lib/utils/logger';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') {
      return;
    }
    
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay or based on user engagement
      const hasSeenPrompt = typeof window !== 'undefined' ? localStorage.getItem('pwa-prompt-seen') : null;
      if (!hasSeenPrompt) {
        setTimeout(() => setShowPrompt(true), 10000); // Show after 10 seconds
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('pwa-installed', 'true');
      }
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        setShowIOSInstructions(true);
      }
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        logger.info('User accepted the install prompt');
      } else {
        logger.info('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
      localStorage.setItem('pwa-prompt-seen', 'true');
    } catch (error) {
      logger.error('Error showing install prompt:', error);
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-seen', 'true');
  };

  if (isInstalled || (!deferredPrompt && !isIOS)) {
    return null;
  }

  return (
    <>
      <Dialog
        open={showPrompt}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <InstallMobile color="primary" />
              <Typography variant="h6">Install Blipee OS</Typography>
            </Box>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" paragraph>
            Install Blipee OS on your device for a better experience:
          </Typography>
          
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2" gutterBottom>
              Access your devices with one tap from your home screen
            </Typography>
            <Typography component="li" variant="body2" gutterBottom>
              Receive push notifications for device alerts
            </Typography>
            <Typography component="li" variant="body2" gutterBottom>
              Work offline with cached data
            </Typography>
            <Typography component="li" variant="body2" gutterBottom>
              Faster loading and smoother performance
            </Typography>
          </Box>

          <Collapse in={showIOSInstructions}>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                <strong>To install on iOS:</strong>
              </Typography>
              <Box component="ol" sx={{ pl: 2, mb: 0 }}>
                <Typography component="li" variant="body2">
                  Tap the Share button <Add fontSize="small" /> in Safari
                </Typography>
                <Typography component="li" variant="body2">
                  Scroll down and tap "Add to Home Screen"
                </Typography>
                <Typography component="li" variant="body2">
                  Tap "Add" to install
                </Typography>
              </Box>
            </Alert>
          </Collapse>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Not Now
          </Button>
          <Button
            onClick={handleInstall}
            variant="contained"
            startIcon={<PhoneIphone />}
          >
            Install App
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating install button for returning users */}
      {!showPrompt && !isInstalled && (
        <Box
          sx={{
            position: 'fixed',
            bottom: { xs: 80, sm: 24 },
            right: 24,
            zIndex: 1000,
          }}
        >
          <Button
            variant="contained"
            size="small"
            startIcon={<InstallMobile />}
            onClick={() => setShowPrompt(true)}
            sx={{
              borderRadius: 6,
              boxShadow: 3,
            }}
          >
            Install App
          </Button>
        </Box>
      )}
    </>
  );
}