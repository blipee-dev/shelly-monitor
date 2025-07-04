import { DeviceType } from '@/types/device';

// Device type display names
export const DEVICE_TYPE_NAMES: Record<DeviceType, string> = {
  plus2pm: 'Shelly Plus 2PM',
  plus1pm: 'Shelly Plus 1PM',
  dimmer2: 'Shelly Dimmer 2',
  motion2: 'Shelly Motion 2',
  blu_motion: 'Shelly BLU Motion',
};

// Device type descriptions
export const DEVICE_TYPE_DESCRIPTIONS: Record<DeviceType, string> = {
  plus2pm: '2-channel smart switch with power monitoring',
  plus1pm: '1-channel smart switch with power monitoring',
  dimmer2: 'Smart dimmer with power monitoring',
  motion2: 'WiFi motion sensor with temperature and light',
  blu_motion: 'Bluetooth motion sensor with humidity',
};

// Device capabilities
export const DEVICE_CAPABILITIES: Record<DeviceType, string[]> = {
  plus2pm: ['relay', 'power_monitoring', 'temperature', 'multi_channel'],
  plus1pm: ['relay', 'power_monitoring', 'temperature'],
  dimmer2: ['dimming', 'power_monitoring', 'temperature'],
  motion2: ['motion_detection', 'light_sensor', 'temperature', 'battery', 'vibration'],
  blu_motion: ['motion_detection', 'light_sensor', 'temperature', 'humidity', 'battery', 'bluetooth'],
};

// Device icons (Material Icons)
export const DEVICE_TYPE_ICONS: Record<DeviceType, string> = {
  plus2pm: 'power',
  plus1pm: 'power',
  dimmer2: 'light_mode',
  motion2: 'sensors',
  blu_motion: 'bluetooth',
};

// Status colors
export const STATUS_COLORS = {
  online: '#4caf50',
  offline: '#9e9e9e',
  error: '#f44336',
} as const;

// Default polling intervals (ms)
export const POLLING_INTERVALS = {
  status: 30000, // 30 seconds
  data: 60000, // 1 minute
  energy: 300000, // 5 minutes
} as const;

// Device HTTP endpoints
export const DEVICE_ENDPOINTS = {
  status: '/status',
  relay: '/relay',
  light: '/light',
  settings: '/settings',
  reboot: '/reboot',
} as const;