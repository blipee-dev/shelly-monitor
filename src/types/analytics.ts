// Analytics types for Blipee OS

export interface DeviceMetrics {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  totalEnergy: number; // kWh
  currentPower: number; // W
  avgPower: number; // W
  uptime: number; // hours
  lastUpdated: string;
}

export interface EnergyStats {
  period: 'hour' | 'day' | 'week' | 'month' | 'year';
  totalConsumption: number; // kWh
  totalCost: number; // currency
  avgDailyConsumption: number; // kWh
  peakHour: number; // 0-23
  devices: DeviceMetrics[];
}

export interface MotionStats {
  totalEvents: number;
  avgEventsPerDay: number;
  peakHour: number; // 0-23
  heatmapData: HeatmapPoint[];
}

export interface HeatmapPoint {
  hour: number;
  day: number; // 0-6 (Mon-Sun)
  value: number;
}

export interface DashboardStats {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  totalPowerConsumption: number; // W
  totalEnergyToday: number; // kWh
  estimatedMonthlyCost: number;
  recentEvents: RecentEvent[];
}

export interface RecentEvent {
  id: string;
  type: 'device_online' | 'device_offline' | 'motion_detected' | 'high_power' | 'error';
  deviceId: string;
  deviceName: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error';
}

export interface AIInsight {
  id: string;
  type: 'saving' | 'pattern' | 'anomaly' | 'maintenance' | 'optimization';
  title: string;
  description: string;
  impact?: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface EnergyChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

// OpenAI Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    deviceId?: string;
    action?: string;
    result?: any;
  };
}

export interface ChatContext {
  devices: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    location?: string;
  }>;
  recentMetrics: DeviceMetrics[];
  userPreferences?: {
    language: string;
    timezone: string;
    currency: string;
  };
}