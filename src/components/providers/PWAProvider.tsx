'use client';

import React, { useEffect } from 'react';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { pushManager } from '@/lib/notifications/push-manager';

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          
          // Initialize push notifications
          pushManager.initialize();
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Handle app installed event
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      // Track installation analytics
    });

    // Detect if running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
    
    if (isStandalone) {
      document.documentElement.classList.add('pwa-standalone');
    }

    // Handle online/offline events
    const handleOnline = () => {
      console.log('App is online');
      document.documentElement.classList.remove('app-offline');
    };

    const handleOffline = () => {
      console.log('App is offline');
      document.documentElement.classList.add('app-offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial state
    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {children}
      <InstallPrompt />
    </>
  );
}