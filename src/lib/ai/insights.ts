import { getAIService } from './service';
import { AIMessage } from './types';
import { DeviceMetrics, AIInsight } from '@/types/analytics';
import { Device } from '@/types/device';

export class InsightsGenerator {
  private aiService = getAIService();

  async generateDailyInsights(
    devices: Device[],
    metrics: DeviceMetrics[],
    userId: string
  ): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    try {
      // Analyze energy consumption patterns
      const energyInsights = await this.analyzeEnergyConsumption(metrics);
      insights.push(...energyInsights);

      // Detect anomalies
      const anomalies = await this.detectAnomalies(devices, metrics);
      insights.push(...anomalies);

      // Generate optimization suggestions
      const optimizations = await this.generateOptimizations(devices, metrics);
      insights.push(...optimizations);

      // Predictive maintenance
      const maintenance = await this.predictMaintenance(devices);
      insights.push(...maintenance);

    } catch (error) {
      console.error('Failed to generate insights:', error);
    }

    return insights;
  }

  private async analyzeEnergyConsumption(metrics: DeviceMetrics[]): Promise<AIInsight[]> {
    const totalEnergy = metrics.reduce((sum, m) => sum + m.totalEnergy, 0);
    const avgPower = metrics.reduce((sum, m) => sum + m.avgPower, 0) / metrics.length;

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are an energy efficiency expert analyzing IoT device consumption data.',
      },
      {
        role: 'user',
        content: `Analyze this energy consumption data and provide 2-3 actionable insights:
Total energy today: ${totalEnergy.toFixed(2)} kWh
Average power: ${avgPower.toFixed(0)} W
Number of devices: ${metrics.length}
Top consumers: ${metrics
          .sort((a, b) => b.totalEnergy - a.totalEnergy)
          .slice(0, 3)
          .map(m => `${m.deviceName}: ${m.totalEnergy.toFixed(2)} kWh`)
          .join(', ')}`,
      },
    ];

    try {
      const response = await this.aiService.chat(messages);
      
      // Parse AI response into structured insights
      const insights: AIInsight[] = [];
      const lines = response.content.split('\n').filter(line => line.trim());
      
      lines.forEach((line, index) => {
        if (line.includes('save') || line.includes('reduce')) {
          insights.push({
            id: crypto.randomUUID(),
            type: 'saving',
            title: 'Energy Saving Opportunity',
            description: line.trim(),
            actionable: true,
            priority: 'high',
            createdAt: new Date().toISOString(),
          });
        } else if (line.includes('peak') || line.includes('high')) {
          insights.push({
            id: crypto.randomUUID(),
            type: 'pattern',
            title: 'Usage Pattern Detected',
            description: line.trim(),
            actionable: true,
            priority: 'medium',
            createdAt: new Date().toISOString(),
          });
        }
      });

      return insights.slice(0, 3);
    } catch (error) {
      console.error('Failed to analyze energy consumption:', error);
      return [];
    }
  }

  private async detectAnomalies(
    devices: Device[],
    metrics: DeviceMetrics[]
  ): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    // Check for devices with unusually high consumption
    metrics.forEach(metric => {
      if (metric.currentPower > metric.avgPower * 2) {
        insights.push({
          id: crypto.randomUUID(),
          type: 'anomaly',
          title: 'Unusual Power Consumption',
          description: `${metric.deviceName} is consuming ${metric.currentPower}W, which is significantly higher than its average of ${metric.avgPower}W.`,
          impact: 'High energy costs',
          actionable: true,
          priority: 'high',
          createdAt: new Date().toISOString(),
        });
      }
    });

    // Check for devices that have been on too long
    devices.forEach(device => {
      if (device.status === 'online' && device.data?.uptime && device.data.uptime > 24 * 60 * 60) {
        insights.push({
          id: crypto.randomUUID(),
          type: 'pattern',
          title: 'Device Running Continuously',
          description: `${device.name} has been running for over 24 hours continuously. Consider setting up an automation to turn it off when not needed.`,
          actionable: true,
          priority: 'medium',
          createdAt: new Date().toISOString(),
        });
      }
    });

    return insights;
  }

  private async generateOptimizations(
    devices: Device[],
    metrics: DeviceMetrics[]
  ): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    // Group devices by location
    const devicesByLocation = devices.reduce((acc, device) => {
      const location = device.location || 'Unknown';
      if (!acc[location]) acc[location] = [];
      acc[location].push(device);
      return acc;
    }, {} as Record<string, Device[]>);

    // Suggest grouping for automation
    Object.entries(devicesByLocation).forEach(([location, locationDevices]) => {
      if (locationDevices.length > 2) {
        insights.push({
          id: crypto.randomUUID(),
          type: 'optimization',
          title: 'Automation Opportunity',
          description: `You have ${locationDevices.length} devices in ${location}. Consider creating a group to control them together for convenience and energy savings.`,
          actionable: true,
          priority: 'low',
          createdAt: new Date().toISOString(),
        });
      }
    });

    // Suggest schedule-based automation
    const alwaysOnDevices = devices.filter(d => 
      d.status === 'online' && 
      d.type !== 'motion2' && 
      d.type !== 'blu_motion'
    );

    if (alwaysOnDevices.length > 0) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'optimization',
        title: 'Schedule-Based Control',
        description: `${alwaysOnDevices.length} devices are always on. Setting up schedules could reduce energy consumption by 20-30% without affecting comfort.`,
        impact: 'Potential 20-30% energy savings',
        actionable: true,
        priority: 'high',
        createdAt: new Date().toISOString(),
      });
    }

    return insights;
  }

  private async predictMaintenance(devices: Device[]): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    devices.forEach(device => {
      // Check device temperature if available
      if (device.data?.temperature && device.data.temperature > 70) {
        insights.push({
          id: crypto.randomUUID(),
          type: 'maintenance',
          title: 'High Temperature Warning',
          description: `${device.name} is running at ${device.data.temperature}°C. High temperatures can reduce device lifespan. Ensure proper ventilation.`,
          impact: 'Device longevity',
          actionable: true,
          priority: 'high',
          createdAt: new Date().toISOString(),
        });
      }

      // Check for devices needing firmware updates (mock)
      if (Math.random() > 0.8) {
        insights.push({
          id: crypto.randomUUID(),
          type: 'maintenance',
          title: 'Firmware Update Available',
          description: `A firmware update is available for ${device.name}. Updates often include performance improvements and bug fixes.`,
          actionable: true,
          priority: 'low',
          createdAt: new Date().toISOString(),
        });
      }
    });

    return insights;
  }

  async generateRealtimeInsight(event: any): Promise<AIInsight | null> {
    // Generate insights based on real-time events
    try {
      if (event.type === 'high_power') {
        return {
          id: crypto.randomUUID(),
          type: 'anomaly',
          title: 'High Power Alert',
          description: `Power consumption has exceeded normal levels. Current: ${event.value}W. Consider checking if all devices are functioning properly.`,
          impact: 'Increased energy costs',
          actionable: true,
          priority: 'high',
          createdAt: new Date().toISOString(),
        };
      }

      if (event.type === 'motion_pattern') {
        return {
          id: crypto.randomUUID(),
          type: 'pattern',
          title: 'Activity Pattern Detected',
          description: `Regular motion detected in ${event.location}. This pattern could be used to optimize lighting schedules.`,
          actionable: true,
          priority: 'medium',
          createdAt: new Date().toISOString(),
        };
      }
    } catch (error) {
      console.error('Failed to generate real-time insight:', error);
    }

    return null;
  }
}