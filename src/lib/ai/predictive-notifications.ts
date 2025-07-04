import { Device } from '@/types/device';
import { Automation } from '@/types/automation';
import { createClient } from '@/lib/supabase/client';

export interface PredictiveNotification {
  type: 'prediction' | 'anomaly' | 'pattern' | 'optimization';
  title: string;
  message: string;
  confidence: number; // 0-1 confidence score
  trigger: {
    type: 'time' | 'event' | 'threshold' | 'pattern';
    condition: string;
  };
  suggestedAction?: {
    type: string;
    description: string;
  };
}

export class PredictiveNotificationEngine {
  /**
   * Analyze device usage patterns and suggest predictive notifications
   */
  static async analyzePatternsAndSuggest(
    devices: Device[],
    automations: Automation[],
    userId: string
  ): Promise<PredictiveNotification[]> {
    const suggestions: PredictiveNotification[] = [];
    const supabase = createClient();

    try {
      // Get historical device data (last 30 days)
      const { data: deviceLogs } = await supabase
        .from('device_telemetry')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: false });

      // Analyze patterns
      if (deviceLogs && deviceLogs.length > 0) {
        // 1. Detect regular usage patterns
        const usagePatterns = this.detectUsagePatterns(deviceLogs);
        suggestions.push(...this.createPatternNotifications(usagePatterns));

        // 2. Detect anomalies
        const anomalies = this.detectAnomalies(deviceLogs);
        suggestions.push(...this.createAnomalyNotifications(anomalies));

        // 3. Energy optimization opportunities
        const optimizations = this.detectOptimizationOpportunities(deviceLogs, devices);
        suggestions.push(...this.createOptimizationNotifications(optimizations));

        // 4. Predictive maintenance
        const maintenanceNeeds = this.predictMaintenanceNeeds(devices, deviceLogs);
        suggestions.push(...this.createMaintenanceNotifications(maintenanceNeeds));
      }

      // 5. Behavior-based predictions
      const behaviorPredictions = this.predictUserBehavior(devices, automations);
      suggestions.push(...behaviorPredictions);

    } catch (error) {
      console.error('Error analyzing patterns:', error);
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Detect regular usage patterns (e.g., lights always on at 6 PM)
   */
  private static detectUsagePatterns(logs: any[]): any[] {
    const patterns: any[] = [];
    const deviceTimeMap = new Map<string, Map<number, number>>();

    // Group by device and hour
    logs.forEach(log => {
      const hour = new Date(log.timestamp).getHours();
      const deviceId = log.device_id;
      
      if (!deviceTimeMap.has(deviceId)) {
        deviceTimeMap.set(deviceId, new Map());
      }
      
      const hourMap = deviceTimeMap.get(deviceId)!;
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
    });

    // Find consistent patterns (>80% occurrence at specific times)
    deviceTimeMap.forEach((hourMap, deviceId) => {
      const totalDays = 30;
      hourMap.forEach((count, hour) => {
        const percentage = count / totalDays;
        if (percentage > 0.8) {
          patterns.push({
            deviceId,
            hour,
            confidence: percentage,
            type: 'regular_usage'
          });
        }
      });
    });

    return patterns;
  }

  /**
   * Create notifications from detected patterns
   */
  private static createPatternNotifications(patterns: any[]): PredictiveNotification[] {
    return patterns.map(pattern => ({
      type: 'pattern',
      title: 'Predictable Usage Pattern Detected',
      message: `Your device is typically active at ${pattern.hour}:00. Would you like to create an automation for this?`,
      confidence: pattern.confidence,
      trigger: {
        type: 'time',
        condition: `daily at ${pattern.hour}:00`
      },
      suggestedAction: {
        type: 'create_automation',
        description: `Turn on device automatically at ${pattern.hour}:00`
      }
    }));
  }

  /**
   * Detect anomalies in usage
   */
  private static detectAnomalies(logs: any[]): any[] {
    const anomalies: any[] = [];
    
    // Simple anomaly detection: unusual activity times
    const nightTimeLogs = logs.filter(log => {
      const hour = new Date(log.timestamp).getHours();
      return hour >= 2 && hour <= 5; // 2 AM - 5 AM
    });

    if (nightTimeLogs.length > 5) {
      anomalies.push({
        type: 'unusual_activity',
        confidence: 0.9,
        description: 'Unusual nighttime activity detected'
      });
    }

    // Detect devices that haven't been used in a while
    const deviceLastUsed = new Map<string, Date>();
    logs.forEach(log => {
      const currentDate = new Date(log.timestamp);
      const existing = deviceLastUsed.get(log.device_id);
      if (!existing || currentDate > existing) {
        deviceLastUsed.set(log.device_id, currentDate);
      }
    });

    const now = new Date();
    deviceLastUsed.forEach((lastUsed, deviceId) => {
      const daysSinceUse = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceUse > 7) {
        anomalies.push({
          type: 'inactive_device',
          deviceId,
          daysSinceUse,
          confidence: 0.8
        });
      }
    });

    return anomalies;
  }

  /**
   * Create notifications from anomalies
   */
  private static createAnomalyNotifications(anomalies: any[]): PredictiveNotification[] {
    return anomalies.map(anomaly => {
      if (anomaly.type === 'unusual_activity') {
        return {
          type: 'anomaly',
          title: 'Unusual Activity Detected',
          message: 'We noticed devices being used during unusual hours (2-5 AM). Would you like to set up security alerts?',
          confidence: anomaly.confidence,
          trigger: {
            type: 'event',
            condition: 'activity between 2 AM and 5 AM'
          },
          suggestedAction: {
            type: 'enable_security_alerts',
            description: 'Enable notifications for nighttime activity'
          }
        };
      } else {
        return {
          type: 'anomaly',
          title: 'Inactive Device',
          message: `This device hasn't been used in ${Math.floor(anomaly.daysSinceUse)} days. Is it still needed?`,
          confidence: anomaly.confidence,
          trigger: {
            type: 'pattern',
            condition: 'no activity for 7+ days'
          }
        };
      }
    });
  }

  /**
   * Detect energy optimization opportunities
   */
  private static detectOptimizationOpportunities(logs: any[], devices: Device[]): any[] {
    const opportunities: any[] = [];

    // Detect devices left on for extended periods
    const deviceOnDurations = new Map<string, number[]>();
    
    // Group consecutive "on" states
    logs.forEach((log, index) => {
      if (log.data?.switch0?.output === true) {
        const deviceId = log.device_id;
        if (!deviceOnDurations.has(deviceId)) {
          deviceOnDurations.set(deviceId, []);
        }
        
        // Calculate duration until next "off" state
        let duration = 0;
        for (let i = index + 1; i < logs.length; i++) {
          if (logs[i].device_id === deviceId && logs[i].data?.switch0?.output === false) {
            duration = new Date(log.timestamp).getTime() - new Date(logs[i].timestamp).getTime();
            break;
          }
        }
        
        if (duration > 4 * 60 * 60 * 1000) { // More than 4 hours
          deviceOnDurations.get(deviceId)!.push(duration);
        }
      }
    });

    deviceOnDurations.forEach((durations, deviceId) => {
      if (durations.length > 3) { // Happens frequently
        opportunities.push({
          type: 'long_duration',
          deviceId,
          averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
          frequency: durations.length,
          confidence: 0.85
        });
      }
    });

    return opportunities;
  }

  /**
   * Create optimization notifications
   */
  private static createOptimizationNotifications(opportunities: any[]): PredictiveNotification[] {
    return opportunities.map(opp => ({
      type: 'optimization',
      title: 'Energy Saving Opportunity',
      message: `This device is often left on for ${Math.round(opp.averageDuration / (60 * 60 * 1000))} hours. Would you like to set an auto-off timer?`,
      confidence: opp.confidence,
      trigger: {
        type: 'threshold',
        condition: `device on for more than 4 hours`
      },
      suggestedAction: {
        type: 'create_auto_off',
        description: 'Create automation to turn off after 4 hours'
      }
    }));
  }

  /**
   * Predict maintenance needs
   */
  private static predictMaintenanceNeeds(devices: Device[], logs: any[]): any[] {
    const maintenanceNeeds: any[] = [];

    devices.forEach(device => {
      // Check device uptime
      const deviceLogs = logs.filter(log => log.device_id === device.id);
      if (deviceLogs.length > 0) {
        const firstLog = new Date(deviceLogs[deviceLogs.length - 1].timestamp);
        const daysSinceInstall = (Date.now() - firstLog.getTime()) / (1000 * 60 * 60 * 24);
        
        // Suggest firmware check after 90 days
        if (daysSinceInstall > 90) {
          maintenanceNeeds.push({
            type: 'firmware_check',
            deviceId: device.id,
            deviceName: device.name,
            daysSinceInstall,
            confidence: 0.7
          });
        }
      }
    });

    return maintenanceNeeds;
  }

  /**
   * Create maintenance notifications
   */
  private static createMaintenanceNotifications(needs: any[]): PredictiveNotification[] {
    return needs.map(need => ({
      type: 'prediction',
      title: 'Maintenance Reminder',
      message: `${need.deviceName} has been running for ${Math.floor(need.daysSinceInstall)} days. Time to check for firmware updates?`,
      confidence: need.confidence,
      trigger: {
        type: 'time',
        condition: 'quarterly maintenance check'
      },
      suggestedAction: {
        type: 'check_firmware',
        description: 'Check for device firmware updates'
      }
    }));
  }

  /**
   * Predict user behavior based on current setup
   */
  private static predictUserBehavior(devices: Device[], automations: Automation[]): PredictiveNotification[] {
    const predictions: PredictiveNotification[] = [];

    // Predict based on device types
    const hasMotionSensor = devices.some(d => d.type === 'motion');
    const hasLights = devices.some(d => d.type === 'plus2pm' || d.type === 'dimmer2');
    const hasNoAutomations = automations.length === 0;

    if (hasMotionSensor && hasLights && hasNoAutomations) {
      predictions.push({
        type: 'prediction',
        title: 'Smart Automation Suggestion',
        message: 'You have motion sensors and lights but no automations. Would you like me to set up motion-activated lighting?',
        confidence: 0.95,
        trigger: {
          type: 'pattern',
          condition: 'motion sensor + lights without automation'
        },
        suggestedAction: {
          type: 'create_motion_automation',
          description: 'Create motion-activated lighting automation'
        }
      });
    }

    // Predict energy monitoring interest
    const totalDevices = devices.filter(d => d.type === 'plus2pm' || d.type === 'plus1pm').length;
    if (totalDevices > 3) {
      predictions.push({
        type: 'prediction',
        title: 'Energy Monitoring Suggestion',
        message: 'With multiple power-monitoring devices, would you like daily energy reports to track consumption?',
        confidence: 0.8,
        trigger: {
          type: 'pattern',
          condition: 'multiple power-monitoring devices'
        },
        suggestedAction: {
          type: 'enable_energy_reports',
          description: 'Enable daily energy consumption reports'
        }
      });
    }

    return predictions;
  }
}