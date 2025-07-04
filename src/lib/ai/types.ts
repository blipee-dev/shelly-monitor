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
];