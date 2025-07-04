// AI Provider types and interfaces

export interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
  name?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
}

export interface AIFunction {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface AIResponse {
  content: string;
  functionCall?: {
    name: string;
    arguments: Record<string, any>;
  };
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIProviderConfig {
  apiKey: string;
  baseURL?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIProvider {
  name: string;
  chat(messages: AIMessage[], functions?: AIFunction[]): Promise<AIResponse>;
  streamChat?(messages: AIMessage[], functions?: AIFunction[]): AsyncGenerator<string>;
  estimateCost?(tokens: number): number;
}

export type AIProviderType = 'deepseek' | 'openai' | 'anthropic';

// Device control functions for AI
export const DEVICE_FUNCTIONS: AIFunction[] = [
  {
    name: 'control_device',
    description: 'Control a Shelly device (turn on/off, adjust brightness)',
    parameters: {
      type: 'object',
      properties: {
        device_name: {
          type: 'string',
          description: 'The name of the device to control',
        },
        action: {
          type: 'string',
          enum: ['on', 'off', 'toggle', 'brightness'],
          description: 'The action to perform',
        },
        value: {
          type: 'number',
          description: 'Value for brightness (0-100)',
        },
      },
      required: ['device_name', 'action'],
    },
  },
  {
    name: 'get_device_status',
    description: 'Get the current status of a device',
    parameters: {
      type: 'object',
      properties: {
        device_name: {
          type: 'string',
          description: 'The name of the device',
        },
      },
      required: ['device_name'],
    },
  },
  {
    name: 'get_energy_consumption',
    description: 'Get energy consumption data',
    parameters: {
      type: 'object',
      properties: {
        period: {
          type: 'string',
          enum: ['today', 'week', 'month', 'year'],
          description: 'Time period for the data',
        },
        device_name: {
          type: 'string',
          description: 'Optional: specific device name',
        },
      },
      required: ['period'],
    },
  },
  {
    name: 'create_automation',
    description: 'Create an automation rule',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the automation',
        },
        trigger: {
          type: 'string',
          description: 'When to trigger (e.g., "at 10pm", "when motion detected")',
        },
        action: {
          type: 'string',
          description: 'What to do (e.g., "turn off all lights")',
        },
      },
      required: ['name', 'trigger', 'action'],
    },
  },
  {
    name: 'manage_automation',
    description: 'Enable, disable, or delete an existing automation',
    parameters: {
      type: 'object',
      properties: {
        automation_name: {
          type: 'string',
          description: 'Name of the automation to manage',
        },
        action: {
          type: 'string',
          enum: ['enable', 'disable', 'delete'],
          description: 'Action to perform on the automation',
        },
      },
      required: ['automation_name', 'action'],
    },
  },
  {
    name: 'list_automations',
    description: 'List all automations or filter by status',
    parameters: {
      type: 'object',
      properties: {
        filter: {
          type: 'string',
          enum: ['all', 'enabled', 'disabled'],
          description: 'Filter automations by status',
        },
      },
      required: [],
    },
  },
  {
    name: 'create_scene',
    description: 'Create a scene with multiple device actions',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the scene (e.g., "Movie Night", "Good Morning")',
        },
        description: {
          type: 'string',
          description: 'What this scene does',
        },
        actions: {
          type: 'array',
          description: 'List of actions like "turn off living room lights, dim TV backlights to 20%"',
          items: {
            type: 'string',
          },
        },
      },
      required: ['name', 'actions'],
    },
  },
  {
    name: 'activate_scene',
    description: 'Activate a saved scene',
    parameters: {
      type: 'object',
      properties: {
        scene_name: {
          type: 'string',
          description: 'Name of the scene to activate',
        },
      },
      required: ['scene_name'],
    },
  },
  {
    name: 'list_scenes',
    description: 'List all available scenes',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
];