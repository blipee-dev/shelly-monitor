import { ExportData } from './export-manager';
import { Device } from '@/types/device';
import { Automation, Scene } from '@/types/automation';

export interface MigrationResult {
  success: boolean;
  version: string;
  changes: string[];
  errors: string[];
}

export class MigrationTools {
  // Version migration map
  private static migrations: Record<string, (data: any) => any> = {
    '0.1.0': MigrationTools.migrateFrom010,
    '0.2.0': MigrationTools.migrateFrom020,
    '0.3.0': MigrationTools.migrateFrom030,
  };

  static async migrateData(data: any): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      version: data.version || '0.1.0',
      changes: [],
      errors: [],
    };

    try {
      let currentData = data;
      let currentVersion = data.version || '0.1.0';

      // Get all versions that need migration
      const versions = Object.keys(this.migrations).sort();
      const targetVersion = '1.0.0';

      // Apply migrations in order
      for (const version of versions) {
        if (this.compareVersions(currentVersion, version) < 0 &&
            this.compareVersions(version, targetVersion) <= 0) {
          try {
            console.log(`Migrating from ${currentVersion} to ${version}`);
            currentData = this.migrations[version](currentData);
            currentVersion = version;
            result.changes.push(`Migrated to version ${version}`);
          } catch (error) {
            result.errors.push(`Failed to migrate to ${version}: ${(error as Error).message}`);
            return result;
          }
        }
      }

      // Final migration to current version
      if (currentVersion !== targetVersion) {
        currentData = this.migrateToLatest(currentData);
        result.changes.push(`Migrated to version ${targetVersion}`);
      }

      result.version = targetVersion;
      result.success = true;
      return result;
    } catch (error) {
      result.errors.push(`Migration failed: ${(error as Error).message}`);
      return result;
    }
  }

  private static compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;
      if (p1 < p2) return -1;
      if (p1 > p2) return 1;
    }
    return 0;
  }

  // Migration from v0.1.0 (basic structure)
  private static migrateFrom010(data: any): any {
    const migrated = {
      version: '0.2.0',
      timestamp: data.timestamp || new Date().toISOString(),
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

    // Migrate devices
    if (data.devices) {
      migrated.data.devices = data.devices.map((device: any) => ({
        ...device,
        id: device.id || crypto.randomUUID(),
        enabled: device.enabled !== undefined ? device.enabled : true,
        groups: device.groups || [],
        metadata: device.metadata || {},
      }));
      migrated.metadata.deviceCount = migrated.data.devices.length;
    }

    return migrated;
  }

  // Migration from v0.2.0 (added automations)
  private static migrateFrom020(data: any): any {
    const migrated = { ...data, version: '0.3.0' };

    // Ensure automations have proper structure
    if (migrated.data.automations) {
      migrated.data.automations = migrated.data.automations.map((automation: any) => ({
        ...automation,
        enabled: automation.enabled !== undefined ? automation.enabled : true,
        lastTriggered: automation.lastTriggered || null,
        nextTrigger: automation.nextTrigger || null,
        triggers: automation.triggers || [],
        conditions: automation.conditions || [],
        actions: automation.actions || [],
      }));
    }

    return migrated;
  }

  // Migration from v0.3.0 (added scenes)
  private static migrateFrom030(data: any): any {
    const migrated = { ...data, version: '0.4.0' };

    // Ensure scenes have proper structure
    if (migrated.data.scenes) {
      migrated.data.scenes = migrated.data.scenes.map((scene: any) => ({
        ...scene,
        id: scene.id || crypto.randomUUID(),
        icon: scene.icon || 'home',
        color: scene.color || '#2196f3',
        isFavorite: scene.isFavorite || false,
        actions: scene.actions || [],
      }));
    }

    return migrated;
  }

  // Final migration to latest version
  private static migrateToLatest(data: any): ExportData {
    return {
      version: '1.0.0',
      timestamp: data.timestamp || new Date().toISOString(),
      data: {
        devices: this.sanitizeDevices(data.data?.devices || []),
        automations: this.sanitizeAutomations(data.data?.automations || []),
        scenes: this.sanitizeScenes(data.data?.scenes || []),
        settings: data.data?.settings || {},
      },
      metadata: {
        deviceCount: data.data?.devices?.length || 0,
        automationCount: data.data?.automations?.length || 0,
        sceneCount: data.data?.scenes?.length || 0,
        exportedBy: data.metadata?.exportedBy,
      },
    };
  }

  private static sanitizeDevices(devices: any[]): Device[] {
    return devices.map(device => ({
      id: device.id || crypto.randomUUID(),
      name: device.name || 'Unnamed Device',
      type: device.type || 'unknown',
      ip_address: device.ip_address || '',
      mac_address: device.mac_address || '',
      firmware_version: device.firmware_version || '',
      enabled: device.enabled !== undefined ? device.enabled : true,
      location: device.location || '',
      room: device.room || '',
      groups: Array.isArray(device.groups) ? device.groups : [],
      metadata: device.metadata || {},
      credentials: device.credentials,
      user_id: device.user_id,
      created_at: device.created_at || new Date().toISOString(),
      updated_at: device.updated_at || new Date().toISOString(),
      last_seen: device.last_seen,
    }));
  }

  private static sanitizeAutomations(automations: any[]): Automation[] {
    return automations.map(automation => ({
      id: automation.id || crypto.randomUUID(),
      name: automation.name || 'Unnamed Automation',
      description: automation.description || '',
      enabled: automation.enabled !== undefined ? automation.enabled : true,
      triggers: Array.isArray(automation.triggers) ? automation.triggers : [],
      conditions: Array.isArray(automation.conditions) ? automation.conditions : [],
      actions: Array.isArray(automation.actions) ? automation.actions : [],
      user_id: automation.user_id,
      created_at: automation.created_at || new Date().toISOString(),
      updated_at: automation.updated_at || new Date().toISOString(),
      last_triggered: automation.last_triggered,
      next_trigger: automation.next_trigger,
    }));
  }

  private static sanitizeScenes(scenes: any[]): Scene[] {
    return scenes.map(scene => ({
      id: scene.id || crypto.randomUUID(),
      name: scene.name || 'Unnamed Scene',
      description: scene.description || '',
      icon: scene.icon || 'home',
      color: scene.color || '#2196f3',
      actions: Array.isArray(scene.actions) ? scene.actions : [],
      isFavorite: scene.isFavorite || false,
      user_id: scene.user_id,
      created_at: scene.created_at || new Date().toISOString(),
      updated_at: scene.updated_at || new Date().toISOString(),
      last_activated: scene.last_activated,
    }));
  }

  // Validate migrated data
  static validateMigratedData(data: ExportData): string[] {
    const errors: string[] = [];

    // Check version
    if (!data.version) {
      errors.push('Missing version information');
    }

    // Check timestamp
    if (!data.timestamp) {
      errors.push('Missing timestamp');
    }

    // Validate devices
    if (!Array.isArray(data.data.devices)) {
      errors.push('Invalid devices array');
    } else {
      data.data.devices.forEach((device, index) => {
        if (!device.id) errors.push(`Device ${index}: missing ID`);
        if (!device.name) errors.push(`Device ${index}: missing name`);
        if (!device.type) errors.push(`Device ${index}: missing type`);
      });
    }

    // Validate automations
    if (!Array.isArray(data.data.automations)) {
      errors.push('Invalid automations array');
    } else {
      data.data.automations.forEach((automation, index) => {
        if (!automation.id) errors.push(`Automation ${index}: missing ID`);
        if (!automation.name) errors.push(`Automation ${index}: missing name`);
        if (!Array.isArray(automation.triggers)) {
          errors.push(`Automation ${index}: invalid triggers`);
        }
        if (!Array.isArray(automation.actions)) {
          errors.push(`Automation ${index}: invalid actions`);
        }
      });
    }

    // Validate scenes
    if (!Array.isArray(data.data.scenes)) {
      errors.push('Invalid scenes array');
    } else {
      data.data.scenes.forEach((scene, index) => {
        if (!scene.id) errors.push(`Scene ${index}: missing ID`);
        if (!scene.name) errors.push(`Scene ${index}: missing name`);
        if (!Array.isArray(scene.actions)) {
          errors.push(`Scene ${index}: invalid actions`);
        }
      });
    }

    return errors;
  }
}