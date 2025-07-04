import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth/hooks';
import { deviceRealtimeManager } from '@/lib/realtime/deviceSubscription';
import { DeviceUpdateEvent } from '@/types/device';

interface UseDeviceRealtimeOptions {
  onUpdate?: (event: DeviceUpdateEvent) => void;
  deviceId?: string;
}

export function useDeviceRealtime(options: UseDeviceRealtimeOptions = {}) {
  const { user } = useAuth();
  const { onUpdate, deviceId } = options;
  const updateHandlerRef = useRef(onUpdate);

  // Keep handler ref updated
  useEffect(() => {
    updateHandlerRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (!user) return;

    // Subscribe to all devices for the user
    deviceRealtimeManager.subscribeToDevices(user.id);

    // Subscribe to specific device if provided
    if (deviceId) {
      deviceRealtimeManager.subscribeToDevice(deviceId);
    }

    // Set up event listeners
    const handleDataUpdate = (event: CustomEvent<DeviceUpdateEvent>) => {
      if (updateHandlerRef.current) {
        updateHandlerRef.current(event.detail);
      }
    };

    const handleStatusUpdate = (event: CustomEvent<DeviceUpdateEvent>) => {
      if (updateHandlerRef.current) {
        updateHandlerRef.current(event.detail);
      }
    };

    window.addEventListener('device-data-update', handleDataUpdate as EventListener);
    window.addEventListener('device-status-update', handleStatusUpdate as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('device-data-update', handleDataUpdate as EventListener);
      window.removeEventListener('device-status-update', handleStatusUpdate as EventListener);
      
      if (deviceId) {
        deviceRealtimeManager.unsubscribeFromDevice(deviceId);
      }
    };
  }, [user, deviceId]);

  // Cleanup all subscriptions on unmount
  useEffect(() => {
    return () => {
      deviceRealtimeManager.unsubscribeFromDevices();
    };
  }, []);
}