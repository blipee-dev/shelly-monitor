import { Device } from '@/types/device';
import { Automation, Scene } from '@/types/automation';
import { createClient } from '@/lib/supabase/client';

export interface ExportData {
  version: string;
  timestamp: string;
  data: {
    devices: Device[];
    automations: Automation[];
    scenes: Scene[];
    settings?: Record<string, any>;
  };
  metadata: {
    deviceCount: number;
    automationCount: number;
    sceneCount: number;
    exportedBy?: string;
  };
}

export interface ExportOptions {
  includeDevices?: boolean;
  includeAutomations?: boolean;
  includeScenes?: boolean;
  includeSettings?: boolean;
  includeHistory?: boolean;
  format?: 'json' | 'csv';
}

export class ExportManager {
  private static readonly EXPORT_VERSION = '1.0.0';

  static async exportData(options: ExportOptions = {}): Promise<ExportData> {
    const {
      includeDevices = true,
      includeAutomations = true,
      includeScenes = true,
      includeSettings = true,
    } = options;

    const exportData: ExportData = {
      version: this.EXPORT_VERSION,
      timestamp: new Date().toISOString(),
      data: {
        devices: [],
        automations: [],
        scenes: [],
        settings: {},
      },
      metadata: {
        deviceCount: 0,
        automationCount: 0,
        sceneCount: 0,
      },
    };

    try {
      // Get current user
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        exportData.metadata.exportedBy = user.email || user.id;
      }

      // Export devices
      if (includeDevices) {
        const { data: devices, error } = await supabase
          .from('devices')
          .select('*')
          .order('name');

        if (!error && devices) {
          exportData.data.devices = devices;
          exportData.metadata.deviceCount = devices.length;
        }
      }

      // Export automations
      if (includeAutomations) {
        const { data: automations, error } = await supabase
          .from('automations')
          .select('*')
          .order('name');

        if (!error && automations) {
          exportData.data.automations = automations;
          exportData.metadata.automationCount = automations.length;
        }
      }

      // Export scenes
      if (includeScenes) {
        const { data: scenes, error } = await supabase
          .from('scenes')
          .select('*')
          .order('name');

        if (!error && scenes) {
          exportData.data.scenes = scenes;
          exportData.metadata.sceneCount = scenes.length;
        }
      }

      // Export user settings
      if (includeSettings) {
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('*')
          .single();

        if (preferences) {
          exportData.data.settings = preferences;
        }
      }

      return exportData;
    } catch (error) {
      console.error('Export failed:', error);
      throw new Error('Failed to export data');
    }
  }

  static async exportToFile(options: ExportOptions = {}): Promise<void> {
    const data = await this.exportData(options);
    const format = options.format || 'json';

    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      filename = `shelly-monitor-export-${new Date().toISOString().split('T')[0]}.json`;
    } else {
      // CSV export (simplified - only devices for now)
      content = this.convertToCSV(data.data.devices);
      mimeType = 'text/csv';
      filename = `shelly-monitor-devices-${new Date().toISOString().split('T')[0]}.csv`;
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private static convertToCSV(devices: Device[]): string {
    if (devices.length === 0) return '';

    // Define columns
    const columns = [
      'name',
      'type',
      'ip_address',
      'mac_address',
      'firmware_version',
      'location',
      'room',
      'enabled',
      'created_at',
      'last_seen',
    ];

    // Create header row
    const header = columns.join(',');

    // Create data rows
    const rows = devices.map(device => {
      return columns.map(col => {
        const value = device[col as keyof Device];
        // Escape values containing commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',');
    });

    return [header, ...rows].join('\n');
  }

  static validateExportData(data: any): data is ExportData {
    return (
      data &&
      typeof data === 'object' &&
      data.version &&
      data.timestamp &&
      data.data &&
      typeof data.data === 'object' &&
      Array.isArray(data.data.devices) &&
      Array.isArray(data.data.automations) &&
      Array.isArray(data.data.scenes)
    );
  }
}