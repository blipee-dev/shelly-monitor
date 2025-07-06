import { Device, DeviceData } from './device';

// Extended device interface with status data
export interface DeviceWithStatus extends Device {
  device_status?: {
    online: boolean;
    data?: DeviceData;
    last_updated?: string;
  };
}