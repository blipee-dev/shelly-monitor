import { 
  Automation, 
  AutomationTrigger, 
  AutomationAction, 
  TriggerType,
  ActionType,
  ParsedAutomationIntent 
} from '@/types/automation';
import { Device } from '@/types/device';

export class AutomationParser {
  /**
   * Parse natural language automation request into structured automation
   */
  static parseAutomationRequest(
    prompt: string,
    devices: Device[]
  ): ParsedAutomationIntent {
    const lowerPrompt = prompt.toLowerCase();
    
    // Determine intent
    if (lowerPrompt.includes('create') || lowerPrompt.includes('add') || lowerPrompt.includes('make')) {
      return this.parseCreateIntent(prompt, devices);
    } else if (lowerPrompt.includes('disable') || lowerPrompt.includes('turn off automation')) {
      return this.parseManageIntent(prompt, 'disable');
    } else if (lowerPrompt.includes('enable') || lowerPrompt.includes('turn on automation')) {
      return this.parseManageIntent(prompt, 'enable');
    } else if (lowerPrompt.includes('delete') || lowerPrompt.includes('remove')) {
      return this.parseManageIntent(prompt, 'delete');
    } else if (lowerPrompt.includes('list') || lowerPrompt.includes('show')) {
      return this.parseListIntent(prompt);
    }
    
    // Default to create if no clear intent
    return this.parseCreateIntent(prompt, devices);
  }

  private static parseCreateIntent(prompt: string, devices: Device[]): ParsedAutomationIntent {
    const triggers = this.parseTriggers(prompt);
    const actions = this.parseActions(prompt, devices);
    const name = this.generateAutomationName(triggers, actions);

    return {
      type: 'create',
      automation: {
        name,
        description: `Created from: "${prompt}"`,
        enabled: true,
        triggers,
        actions,
        metadata: {
          createdBy: 'ai',
          aiPrompt: prompt,
        },
      },
    };
  }

  private static parseTriggers(prompt: string): AutomationTrigger[] {
    const triggers: AutomationTrigger[] = [];
    const lowerPrompt = prompt.toLowerCase();

    // Time-based triggers
    const timeMatch = lowerPrompt.match(/at (\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      const ampm = timeMatch[3];
      
      if (ampm === 'pm' && hour < 12) hour += 12;
      if (ampm === 'am' && hour === 12) hour = 0;
      
      triggers.push({
        id: crypto.randomUUID(),
        type: 'time',
        config: {
          time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        },
      });
    }

    // Schedule triggers
    if (lowerPrompt.includes('every day') || lowerPrompt.includes('daily')) {
      const timeMatch = lowerPrompt.match(/(?:at|@)\s*(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
      if (timeMatch) {
        let hour = parseInt(timeMatch[1]);
        const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        const ampm = timeMatch[3];
        
        if (ampm === 'pm' && hour < 12) hour += 12;
        if (ampm === 'am' && hour === 12) hour = 0;
        
        triggers.push({
          id: crypto.randomUUID(),
          type: 'schedule',
          config: {
            schedule: {
              frequency: 'daily',
              time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
            },
          },
        });
      }
    }

    // Motion triggers
    if (lowerPrompt.includes('motion') && lowerPrompt.includes('detected')) {
      triggers.push({
        id: crypto.randomUUID(),
        type: 'device_state',
        config: {
          state: 'motion_detected',
          sensorType: 'motion',
        },
      });
    }

    // Sunset/sunrise triggers
    if (lowerPrompt.includes('sunset')) {
      const offsetMatch = lowerPrompt.match(/(\d+)\s*minutes?\s*(before|after)\s*sunset/i);
      const offset = offsetMatch ? 
        parseInt(offsetMatch[1]) * (offsetMatch[2] === 'before' ? -1 : 1) : 0;
      
      triggers.push({
        id: crypto.randomUUID(),
        type: 'sunset',
        config: { offset },
      });
    }

    if (lowerPrompt.includes('sunrise')) {
      const offsetMatch = lowerPrompt.match(/(\d+)\s*minutes?\s*(before|after)\s*sunrise/i);
      const offset = offsetMatch ? 
        parseInt(offsetMatch[1]) * (offsetMatch[2] === 'before' ? -1 : 1) : 0;
      
      triggers.push({
        id: crypto.randomUUID(),
        type: 'sunrise',
        config: { offset },
      });
    }

    // If no triggers found, default to manual
    if (triggers.length === 0) {
      triggers.push({
        id: crypto.randomUUID(),
        type: 'manual',
        config: {},
      });
    }

    return triggers;
  }

  private static parseActions(prompt: string, devices: Device[]): AutomationAction[] {
    const actions: AutomationAction[] = [];
    const lowerPrompt = prompt.toLowerCase();

    // Parse device actions
    const deviceNames = devices.map(d => d.name.toLowerCase());
    
    // Turn on/off actions
    if (lowerPrompt.includes('turn on') || lowerPrompt.includes('switch on')) {
      const targetDevices = this.findTargetDevices(prompt, devices, 'on');
      targetDevices.forEach(deviceId => {
        actions.push({
          id: crypto.randomUUID(),
          type: 'device_control',
          config: {
            deviceId,
            action: 'on',
          },
        });
      });
    }

    if (lowerPrompt.includes('turn off') || lowerPrompt.includes('switch off')) {
      const targetDevices = this.findTargetDevices(prompt, devices, 'off');
      targetDevices.forEach(deviceId => {
        actions.push({
          id: crypto.randomUUID(),
          type: 'device_control',
          config: {
            deviceId,
            action: 'off',
          },
        });
      });
    }

    // Brightness actions
    const brightnessMatch = lowerPrompt.match(/(?:dim|brightness|set)\s+.*?\s+(?:to\s+)?(\d+)%?/i);
    if (brightnessMatch) {
      const brightness = parseInt(brightnessMatch[1]);
      const targetDevices = this.findTargetDevices(prompt, devices, 'brightness');
      targetDevices.forEach(deviceId => {
        actions.push({
          id: crypto.randomUUID(),
          type: 'device_control',
          config: {
            deviceId,
            action: 'brightness',
            value: brightness,
          },
        });
      });
    }

    // All devices actions
    if (lowerPrompt.includes('all')) {
      if (lowerPrompt.includes('lights')) {
        const lightDevices = devices.filter(d => 
          d.type === 'plus2pm' || d.type === 'plus1pm' || d.type === 'dimmer2'
        );
        const action = lowerPrompt.includes('off') ? 'off' : 'on';
        
        actions.push({
          id: crypto.randomUUID(),
          type: 'device_control',
          config: {
            deviceIds: lightDevices.map(d => d.id),
            action,
          },
        });
      }
    }

    return actions;
  }

  private static findTargetDevices(prompt: string, devices: Device[], action: string): string[] {
    const lowerPrompt = prompt.toLowerCase();
    const targetDevices: string[] = [];

    // Check for specific device names
    devices.forEach(device => {
      if (lowerPrompt.includes(device.name.toLowerCase())) {
        targetDevices.push(device.id);
      }
    });

    // Check for location-based targeting
    const locations = [...new Set(devices.map(d => d.location).filter(Boolean))];
    locations.forEach(location => {
      if (location && lowerPrompt.includes(location.toLowerCase())) {
        const locationDevices = devices.filter(d => d.location === location);
        targetDevices.push(...locationDevices.map(d => d.id));
      }
    });

    // Check for type-based targeting
    if (lowerPrompt.includes('lights') || lowerPrompt.includes('light')) {
      const lights = devices.filter(d => 
        d.type === 'plus2pm' || d.type === 'plus1pm' || d.type === 'dimmer2'
      );
      if (targetDevices.length === 0) {
        targetDevices.push(...lights.map(d => d.id));
      }
    }

    if (lowerPrompt.includes('motion') && lowerPrompt.includes('sensor')) {
      const motionSensors = devices.filter(d => 
        d.type === 'motion2' || d.type === 'blu_motion'
      );
      targetDevices.push(...motionSensors.map(d => d.id));
    }

    return [...new Set(targetDevices)]; // Remove duplicates
  }

  private static generateAutomationName(
    triggers: AutomationTrigger[],
    actions: AutomationAction[]
  ): string {
    const triggerPart = triggers[0]?.type === 'time' ? 
      `${triggers[0].config.time} Daily` :
      triggers[0]?.type === 'motion' ?
      'Motion Activated' :
      'Custom';
      
    const actionPart = actions.some(a => a.config?.action === 'off') ?
      'Turn Off' : 'Turn On';
      
    return `${triggerPart} ${actionPart}`;
  }

  private static parseManageIntent(prompt: string, action: 'enable' | 'disable' | 'delete'): ParsedAutomationIntent {
    // Extract automation name from prompt
    const nameMatch = prompt.match(/["']([^"']+)["']/) || 
                     prompt.match(/automation\s+(?:called\s+|named\s+)?(\w+)/i);
    
    return {
      type: action === 'delete' ? 'delete' : 'modify',
      targetId: nameMatch ? nameMatch[1] : undefined,
      query: {
        filter: nameMatch ? nameMatch[1] : undefined,
      },
    };
  }

  private static parseListIntent(prompt: string): ParsedAutomationIntent {
    const lowerPrompt = prompt.toLowerCase();
    
    return {
      type: 'list',
      query: {
        enabled: lowerPrompt.includes('enabled') ? true : 
                lowerPrompt.includes('disabled') ? false : undefined,
      },
    };
  }

  /**
   * Parse scene creation from natural language
   */
  static parseSceneRequest(prompt: string, devices: Device[]): ParsedAutomationIntent {
    const actions = this.parseActions(prompt, devices);
    
    // Extract scene name
    const nameMatch = prompt.match(/scene\s+(?:called\s+|named\s+)?["']?([^"']+)["']?/i) ||
                     prompt.match(/["']([^"']+)["']\s+scene/i);
    
    const name = nameMatch ? nameMatch[1] : this.generateSceneName(prompt);
    
    return {
      type: 'create',
      scene: {
        name,
        description: `Created from: "${prompt}"`,
        actions,
        metadata: {
          createdBy: 'ai',
          aiPrompt: prompt,
        },
      },
    };
  }

  private static generateSceneName(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('movie') || lowerPrompt.includes('tv')) {
      return 'Movie Night';
    } else if (lowerPrompt.includes('morning') || lowerPrompt.includes('wake')) {
      return 'Good Morning';
    } else if (lowerPrompt.includes('night') || lowerPrompt.includes('sleep') || lowerPrompt.includes('bed')) {
      return 'Bedtime';
    } else if (lowerPrompt.includes('away') || lowerPrompt.includes('leave')) {
      return 'Away Mode';
    } else if (lowerPrompt.includes('dinner') || lowerPrompt.includes('dining')) {
      return 'Dinner Time';
    }
    
    return 'Custom Scene';
  }
}