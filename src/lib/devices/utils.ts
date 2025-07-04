import { 
  Device, 
  DeviceType, 
  DeviceData,
  Plus2PMData,
  Plus1PMData,
  Dimmer2Data,
  Motion2Data,
  BluMotionData,
} from '@/types/device';

// Type guards for device data
export function isPlus2PMData(data: DeviceData): data is Plus2PMData {
  return 'relays' in data && Array.isArray(data.relays);
}

export function isPlus1PMData(data: DeviceData): data is Plus1PMData {
  return 'relay' in data && !Array.isArray(data.relay);
}

export function isDimmer2Data(data: DeviceData): data is Dimmer2Data {
  return 'brightness' in data && 'state' in data;
}

export function isMotion2Data(data: DeviceData): data is Motion2Data {
  return 'motion' in data && 'lux' in data && !('humidity' in data);
}

export function isBluMotionData(data: DeviceData): data is BluMotionData {
  return 'motion' in data && 'humidity' in data && 'rssi' in data;
}

// Get device data type based on device type
export function getDeviceDataType(type: DeviceType): string {
  switch (type) {
    case 'plus2pm':
      return 'Plus2PMData';
    case 'plus1pm':
      return 'Plus1PMData';
    case 'dimmer2':
      return 'Dimmer2Data';
    case 'motion2':
      return 'Motion2Data';
    case 'blu_motion':
      return 'BluMotionData';
    default:
      return 'unknown';
  }
}

// Check if device has power monitoring
export function hasPowerMonitoring(type: DeviceType): boolean {
  return ['plus2pm', 'plus1pm', 'dimmer2'].includes(type);
}

// Check if device has battery
export function hasBattery(type: DeviceType): boolean {
  return ['motion2', 'blu_motion'].includes(type);
}

// Check if device can be controlled
export function isControllable(type: DeviceType): boolean {
  return ['plus2pm', 'plus1pm', 'dimmer2'].includes(type);
}

// Check if device has motion detection
export function hasMotionDetection(type: DeviceType): boolean {
  return ['motion2', 'blu_motion'].includes(type);
}

// Format device uptime
export function formatUptime(lastSeen: string): string {
  const now = new Date();
  const last = new Date(lastSeen);
  const diff = now.getTime() - last.getTime();
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

// Format power value
export function formatPower(watts: number): string {
  if (watts < 1) return `${(watts * 1000).toFixed(0)} mW`;
  if (watts < 1000) return `${watts.toFixed(1)} W`;
  return `${(watts / 1000).toFixed(2)} kW`;
}

// Format energy value
export function formatEnergy(wh: number): string {
  if (wh < 1) return `${(wh * 1000).toFixed(0)} mWh`;
  if (wh < 1000) return `${wh.toFixed(1)} Wh`;
  return `${(wh / 1000).toFixed(2)} kWh`;
}

// Format temperature
export function formatTemperature(celsius: number): string {
  return `${celsius.toFixed(1)}°C`;
}

// Format battery percentage
export function formatBattery(percentage: number): string {
  return `${percentage}%`;
}

// Get battery status
export function getBatteryStatus(percentage: number): 'full' | 'good' | 'low' | 'critical' {
  if (percentage >= 80) return 'full';
  if (percentage >= 50) return 'good';
  if (percentage >= 20) return 'low';
  return 'critical';
}

// Get temperature status
export function getTemperatureStatus(celsius: number): 'normal' | 'warning' | 'critical' {
  if (celsius < 60) return 'normal';
  if (celsius < 80) return 'warning';
  return 'critical';
}

// Build device API URL
export function buildDeviceUrl(device: Device, endpoint: string): string {
  return `http://${device.ip_address}${endpoint}`;
}

// Get device icon name based on type and state
export function getDeviceIcon(type: DeviceType, data?: DeviceData): string {
  switch (type) {
    case 'plus2pm':
    case 'plus1pm':
      return 'power';
    case 'dimmer2':
      if (data && isDimmer2Data(data)) {
        return data.state === 'on' ? 'light_mode' : 'light_mode_outlined';
      }
      return 'light_mode';
    case 'motion2':
      if (data && isMotion2Data(data)) {
        return data.motion ? 'directions_walk' : 'sensors';
      }
      return 'sensors';
    case 'blu_motion':
      return 'bluetooth';
    default:
      return 'device_unknown';
  }
}