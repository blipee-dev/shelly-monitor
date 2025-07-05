// Automation types for Blipee OS

export type TriggerType = 
  | 'time'           // Specific time of day
  | 'schedule'       // Recurring schedule (daily, weekly, etc.)
  | 'device_state'   // Device state change (on/off, motion detected)
  | 'sensor_value'   // Sensor threshold (temperature, power, etc.)
  | 'sunset'         // Relative to sunset
  | 'sunrise'        // Relative to sunrise
  | 'manual'         // Triggered by user or AI
  | 'scene';         // Part of a scene

export type ActionType =
  | 'device_control' // Turn device on/off, set brightness
  | 'scene_activate' // Activate a scene
  | 'notification'   // Send notification
  | 'wait'          // Wait for duration
  | 'conditional';   // If-then-else logic

export type ConditionOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'greater_than' 
  | 'less_than' 
  | 'contains' 
  | 'between';

export interface AutomationTrigger {
  id: string;
  type: TriggerType;
  config: {
    // For time triggers
    time?: string; // HH:MM format
    timezone?: string;
    
    // For schedule triggers
    schedule?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      days?: number[]; // 0-6 for weekly, 1-31 for monthly
      time: string; // HH:MM
    };
    
    // For device state triggers
    deviceId?: string;
    state?: string;
    
    // For sensor triggers
    sensorType?: 'temperature' | 'power' | 'motion' | 'luminance';
    operator?: ConditionOperator;
    value?: number;
    
    // For sun-based triggers
    offset?: number; // minutes before/after sunrise/sunset
  };
}

export interface AutomationCondition {
  id: string;
  type: 'device_state' | 'time_range' | 'sensor_value' | 'day_of_week';
  deviceId?: string;
  operator: ConditionOperator;
  value: any;
  combineWith?: 'AND' | 'OR'; // How to combine with next condition
}

export interface AutomationAction {
  id: string;
  type: ActionType;
  config: {
    // For device control
    deviceId?: string;
    deviceIds?: string[]; // For group actions
    action?: string; // 'on', 'off', 'toggle', 'brightness'
    value?: any;
    
    // For scene activation
    sceneId?: string;
    
    // For notifications
    message?: string;
    channels?: ('email' | 'push' | 'sms')[];
    
    // For wait
    duration?: number; // seconds
    
    // For conditional
    condition?: AutomationCondition;
    thenActions?: AutomationAction[];
    elseActions?: AutomationAction[];
  };
  delay?: number; // Delay in seconds before executing this action
}

export interface Automation {
  id: string;
  userId: string;
  name: string;
  description?: string;
  enabled: boolean;
  triggers: AutomationTrigger[];
  conditions?: AutomationCondition[];
  actions: AutomationAction[];
  lastTriggered?: string;
  nextTrigger?: string;
  metadata?: {
    createdBy?: 'user' | 'ai' | 'system';
    aiPrompt?: string; // Original AI prompt that created this
    tags?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Scene {
  id: string;
  userId: string;
  name: string;
  description?: string;
  icon?: string;
  actions: AutomationAction[];
  isFavorite: boolean;
  metadata?: {
    createdBy?: 'user' | 'ai' | 'system';
    aiPrompt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AutomationLog {
  id: string;
  automationId: string;
  automationName: string;
  triggeredBy: string;
  status: 'success' | 'failed' | 'partial';
  executedActions: {
    actionId: string;
    status: 'success' | 'failed' | 'skipped';
    error?: string;
  }[];
  duration: number; // milliseconds
  timestamp: string;
}

// Helper types for AI integration
export interface AutomationRequest {
  prompt: string;
  context?: {
    devices?: Array<{ id: string; name: string; type: string }>;
    existingAutomations?: Array<{ id: string; name: string }>;
    userPreferences?: any;
  };
}

export interface ParsedAutomationIntent {
  type: 'create' | 'modify' | 'delete' | 'list' | 'enable' | 'disable';
  automation?: Partial<Automation>;
  scene?: Partial<Scene>;
  targetId?: string; // For modify/delete operations
  query?: {
    filter?: string;
    enabled?: boolean;
  };
}