import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Device, DeviceUpdateEvent } from '@/types/device';
import { useDeviceStore } from '@/lib/stores/deviceStore';

const supabase = createClient();

export class DeviceRealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  private deviceChannel: RealtimeChannel | null = null;

  // Subscribe to all device updates for a user
  subscribeToDevices(userId: string) {
    // Clean up existing subscription
    this.unsubscribeFromDevices();

    // Create channel for device table changes
    this.deviceChannel = supabase
      .channel(`devices:user:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          this.handleDeviceChange(payload);
        }
      )
      .subscribe();

    return this.deviceChannel;
  }

  // Subscribe to specific device data updates
  subscribeToDevice(deviceId: string) {
    // Don't create duplicate subscriptions
    if (this.channels.has(deviceId)) {
      return this.channels.get(deviceId);
    }

    const channel = supabase
      .channel(`device:${deviceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'device_data',
          filter: `device_id=eq.${deviceId}`,
        },
        (payload) => {
          this.handleDeviceDataUpdate(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'devices',
          filter: `id=eq.${deviceId}`,
        },
        (payload) => {
          this.handleDeviceStatusUpdate(payload);
        }
      )
      .subscribe();

    this.channels.set(deviceId, channel);
    return channel;
  }

  // Unsubscribe from specific device
  unsubscribeFromDevice(deviceId: string) {
    const channel = this.channels.get(deviceId);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(deviceId);
    }
  }

  // Unsubscribe from all devices
  unsubscribeFromDevices() {
    if (this.deviceChannel) {
      supabase.removeChannel(this.deviceChannel);
      this.deviceChannel = null;
    }

    // Clean up all device-specific channels
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }

  private handleDeviceChange(payload: any) {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    const store = useDeviceStore.getState();

    switch (eventType) {
      case 'INSERT':
        store.addDevice(newRecord as Device);
        break;
      case 'UPDATE':
        store.updateDevice(newRecord.id, newRecord as Partial<Device>);
        break;
      case 'DELETE':
        store.removeDevice(oldRecord.id);
        break;
    }
  }

  private handleDeviceDataUpdate(payload: any) {
    const { new: newRecord } = payload;
    const store = useDeviceStore.getState();

    // Update device data in store
    store.setDeviceData(newRecord.device_id, newRecord.data);

    // Emit custom event for components to listen to
    window.dispatchEvent(
      new CustomEvent('device-data-update', {
        detail: {
          device_id: newRecord.device_id,
          type: 'data',
          data: newRecord.data,
          timestamp: newRecord.timestamp,
        } as DeviceUpdateEvent,
      })
    );
  }

  private handleDeviceStatusUpdate(payload: any) {
    const { new: newRecord } = payload;
    const store = useDeviceStore.getState();

    // Update device status in store
    store.updateDevice(newRecord.id, {
      status: newRecord.status,
      last_seen: newRecord.last_seen,
    });

    // Emit custom event
    window.dispatchEvent(
      new CustomEvent('device-status-update', {
        detail: {
          device_id: newRecord.id,
          type: 'status',
          data: {
            status: newRecord.status,
            last_seen: newRecord.last_seen,
          },
          timestamp: new Date().toISOString(),
        } as DeviceUpdateEvent,
      })
    );
  }
}

// Singleton instance
export const deviceRealtimeManager = new DeviceRealtimeManager();