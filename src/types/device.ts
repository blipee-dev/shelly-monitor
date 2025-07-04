// Device types for Shelly Monitor

export type DeviceType = 'plus2pm' | 'plus1pm' | 'motion2' | 'dimmer2' | 'blu_motion';
export type DeviceStatus = 'online' | 'offline' | 'error';
export type RelayState = 'on' | 'off';
export type DimmerState = 'on' | 'off';

// Base device interface
export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  ip_address: string;
  mac_address: string;
  firmware_version: string;
  status: DeviceStatus;
  last_seen: string;
  location: string | null;
  group_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Device group
export interface DeviceGroup {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  device_count?: number;
}

// Relay for Plus 2PM
export interface Relay {
  id: number; // 0 or 1 for Plus 2PM
  state: RelayState;
  power: number; // Current power in watts
  energy: number; // Total energy in wh
  voltage: number;
  current: number;
  temperature: number;
}

// Plus 2PM specific data (2 relays with power monitoring)
export interface Plus2PMData {
  relays: Relay[];
  total_power: number;
  temperature: number;
  overpower: boolean;
  overtemperature: boolean;
}

// Plus 1PM specific data (1 relay with power monitoring)
export interface Plus1PMData {
  relay: Relay;
  temperature: number;
  overpower: boolean;
  overtemperature: boolean;
}

// Dimmer 2 specific data
export interface Dimmer2Data {
  state: DimmerState;
  brightness: number; // 0-100%
  power: number; // Current power in watts
  energy: number; // Total energy in wh
  voltage: number;
  current: number;
  temperature: number;
  overpower: boolean;
  overtemperature: boolean;
}

// Motion 2 specific data (WiFi motion sensor)
export interface Motion2Data {
  motion: boolean;
  lux: number;
  battery: number;
  temperature: number;
  vibration: boolean;
}

// BLU Motion specific data (Bluetooth motion sensor)
export interface BluMotionData {
  motion: boolean;
  lux: number;
  battery: number;
  temperature: number;
  humidity: number;
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  rssi: number; // Bluetooth signal strength
}

// Union type for all device data types
export type DeviceData = Plus2PMData | Plus1PMData | Dimmer2Data | Motion2Data | BluMotionData;

// Device with type-specific data
export interface DeviceWithData<T = DeviceData> extends Device {
  data: T;
}

// Control commands
export interface RelayControlCommand {
  device_id: string;
  relay_id: number;
  action: 'on' | 'off' | 'toggle';
}

export interface DimmerControlCommand {
  device_id: string;
  action: 'on' | 'off' | 'toggle' | 'brightness';
  brightness?: number; // 0-100 for brightness action
}

export type ControlCommand = RelayControlCommand | DimmerControlCommand;

// Real-time update event
export interface DeviceUpdateEvent {
  device_id: string;
  type: 'status' | 'data' | 'config';
  data: Partial<Device> | DeviceData;
  timestamp: string;
}

// API responses
export interface DeviceListResponse {
  devices: Device[];
  total: number;
  page: number;
  limit: number;
}

export interface DeviceDetailResponse {
  device: Device;
  data: DeviceData;
  recent_data?: Array<{
    timestamp: string;
    data: DeviceData;
  }>;
}

// Form data for creating/updating devices
export interface DeviceFormData {
  name: string;
  type: DeviceType;
  ip_address: string;
  mac_address: string;
  location?: string;
  group_id?: string;
}

// Filters for device list
export interface DeviceFilters {
  status?: DeviceStatus;
  type?: DeviceType;
  group_id?: string;
  search?: string;
}