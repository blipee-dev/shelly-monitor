import { ExportData, ExportManager } from './export-manager';
import { createClient } from '@/lib/supabase/client';
import { Device } from '@/types/device';
import { Automation, Scene } from '@/types/automation';

export interface ImportOptions {
  overwriteExisting?: boolean;
  importDevices?: boolean;
  importAutomations?: boolean;
  importScenes?: boolean;
  importSettings?: boolean;
  dryRun?: boolean; // Preview what will be imported
}

export interface ImportResult {
  success: boolean;
  imported: {
    devices: number;
    automations: number;
    scenes: number;
    settings: boolean;
  };
  errors: string[];
  warnings: string[];
}

export interface ImportPreview {
  devices: {
    new: Device[];
    existing: Device[];
    conflicts: Array<{ existing: Device; imported: Device }>;
  };
  automations: {
    new: Automation[];
    existing: Automation[];
  };
  scenes: {
    new: Scene[];
    existing: Scene[];
  };
}

export class ImportManager {
  static async importData(
    data: ExportData,
    options: ImportOptions = {}
  ): Promise<ImportResult> {
    const {
      overwriteExisting = false,
      importDevices = true,
      importAutomations = true,
      importScenes = true,
      importSettings = true,
      dryRun = false,
    } = options;

    const result: ImportResult = {
      success: false,
      imported: {
        devices: 0,
        automations: 0,
        scenes: 0,
        settings: false,
      },
      errors: [],
      warnings: [],
    };

    try {
      // Validate data format
      if (!ExportManager.validateExportData(data)) {
        result.errors.push('Invalid export data format');
        return result;
      }

      // Check version compatibility
      if (data.version !== '1.0.0') {
        result.warnings.push(`Export version ${data.version} may not be fully compatible`);
      }

      // Get current user
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        result.errors.push('User not authenticated');
        return result;
      }

      // Import devices
      if (importDevices && data.data.devices.length > 0) {
        const deviceResult = await this.importDevices(
          data.data.devices,
          user.id,
          overwriteExisting,
          dryRun
        );
        result.imported.devices = deviceResult.imported;
        result.errors.push(...deviceResult.errors);
        result.warnings.push(...deviceResult.warnings);
      }

      // Import automations
      if (importAutomations && data.data.automations.length > 0) {
        const automationResult = await this.importAutomations(
          data.data.automations,
          user.id,
          overwriteExisting,
          dryRun
        );
        result.imported.automations = automationResult.imported;
        result.errors.push(...automationResult.errors);
      }

      // Import scenes
      if (importScenes && data.data.scenes.length > 0) {
        const sceneResult = await this.importScenes(
          data.data.scenes,
          user.id,
          overwriteExisting,
          dryRun
        );
        result.imported.scenes = sceneResult.imported;
        result.errors.push(...sceneResult.errors);
      }

      // Import settings
      if (importSettings && data.data.settings && !dryRun) {
        const settingsResult = await this.importSettings(
          data.data.settings,
          user.id
        );
        result.imported.settings = settingsResult.success;
        if (!settingsResult.success) {
          result.errors.push('Failed to import settings');
        }
      }

      result.success = result.errors.length === 0;
      return result;
    } catch (error) {
      console.error('Import failed:', error);
      result.errors.push('Import failed: ' + (error as Error).message);
      return result;
    }
  }

  static async previewImport(data: ExportData): Promise<ImportPreview> {
    const preview: ImportPreview = {
      devices: { new: [], existing: [], conflicts: [] },
      automations: { new: [], existing: [] },
      scenes: { new: [], existing: [] },
    };

    try {
      // Get existing data
      const supabase = createClient();
      const [
        { data: existingDevices },
        { data: existingAutomations },
        { data: existingScenes },
      ] = await Promise.all([
        supabase.from('devices').select('*'),
        supabase.from('automations').select('*'),
        supabase.from('scenes').select('*'),
      ]);

      // Analyze devices
      if (data.data.devices) {
        for (const device of data.data.devices) {
          const existing = existingDevices?.find(
            d => d.mac_address === device.mac_address
          );
          if (existing) {
            preview.devices.existing.push(device);
            if (this.hasDeviceChanges(existing, device)) {
              preview.devices.conflicts.push({ existing, imported: device });
            }
          } else {
            preview.devices.new.push(device);
          }
        }
      }

      // Analyze automations
      if (data.data.automations) {
        for (const automation of data.data.automations) {
          const existing = existingAutomations?.find(
            a => a.name === automation.name
          );
          if (existing) {
            preview.automations.existing.push(automation);
          } else {
            preview.automations.new.push(automation);
          }
        }
      }

      // Analyze scenes
      if (data.data.scenes) {
        for (const scene of data.data.scenes) {
          const existing = existingScenes?.find(s => s.name === scene.name);
          if (existing) {
            preview.scenes.existing.push(scene);
          } else {
            preview.scenes.new.push(scene);
          }
        }
      }

      return preview;
    } catch (error) {
      console.error('Preview failed:', error);
      throw error;
    }
  }

  private static async importDevices(
    devices: Device[],
    userId: string,
    overwrite: boolean,
    dryRun: boolean
  ): Promise<{ imported: number; errors: string[]; warnings: string[] }> {
    let imported = 0;
    const errors: string[] = [];
    const warnings: string[] = [];
    const supabase = createClient();

    for (const device of devices) {
      try {
        // Check if device exists
        const { data: existing } = await supabase
          .from('devices')
          .select('*')
          .eq('mac_address', device.mac_address)
          .single();

        if (existing) {
          if (overwrite && !dryRun) {
            // Update existing device
            const { error } = await supabase
              .from('devices')
              .update({
                ...device,
                user_id: userId,
                updated_at: new Date().toISOString(),
              })
              .eq('id', existing.id);

            if (error) {
              errors.push(`Failed to update device ${device.name}: ${error.message}`);
            } else {
              imported++;
              warnings.push(`Updated existing device: ${device.name}`);
            }
          } else {
            warnings.push(`Skipped existing device: ${device.name}`);
          }
        } else if (!dryRun) {
          // Insert new device
          const { error } = await supabase.from('devices').insert({
            ...device,
            id: undefined, // Let database generate new ID
            user_id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

          if (error) {
            errors.push(`Failed to import device ${device.name}: ${error.message}`);
          } else {
            imported++;
          }
        } else {
          imported++; // Count for dry run
        }
      } catch (error) {
        errors.push(`Error processing device ${device.name}: ${(error as Error).message}`);
      }
    }

    return { imported, errors, warnings };
  }

  private static async importAutomations(
    automations: Automation[],
    userId: string,
    overwrite: boolean,
    dryRun: boolean
  ): Promise<{ imported: number; errors: string[] }> {
    let imported = 0;
    const errors: string[] = [];
    const supabase = createClient();

    for (const automation of automations) {
      try {
        // Check if automation exists
        const { data: existing } = await supabase
          .from('automations')
          .select('*')
          .eq('name', automation.name)
          .eq('user_id', userId)
          .single();

        if (existing && !overwrite) {
          continue; // Skip existing
        }

        if (!dryRun) {
          if (existing) {
            // Update
            const { error } = await supabase
              .from('automations')
              .update({
                ...automation,
                user_id: userId,
                updated_at: new Date().toISOString(),
              })
              .eq('id', existing.id);

            if (error) {
              errors.push(`Failed to update automation ${automation.name}: ${error.message}`);
            } else {
              imported++;
            }
          } else {
            // Insert
            const { error } = await supabase.from('automations').insert({
              ...automation,
              id: undefined,
              user_id: userId,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

            if (error) {
              errors.push(`Failed to import automation ${automation.name}: ${error.message}`);
            } else {
              imported++;
            }
          }
        } else {
          imported++; // Count for dry run
        }
      } catch (error) {
        errors.push(`Error processing automation ${automation.name}: ${(error as Error).message}`);
      }
    }

    return { imported, errors };
  }

  private static async importScenes(
    scenes: Scene[],
    userId: string,
    overwrite: boolean,
    dryRun: boolean
  ): Promise<{ imported: number; errors: string[] }> {
    let imported = 0;
    const errors: string[] = [];
    const supabase = createClient();

    for (const scene of scenes) {
      try {
        // Check if scene exists
        const { data: existing } = await supabase
          .from('scenes')
          .select('*')
          .eq('name', scene.name)
          .eq('user_id', userId)
          .single();

        if (existing && !overwrite) {
          continue; // Skip existing
        }

        if (!dryRun) {
          if (existing) {
            // Update
            const { error } = await supabase
              .from('scenes')
              .update({
                ...scene,
                user_id: userId,
                updated_at: new Date().toISOString(),
              })
              .eq('id', existing.id);

            if (error) {
              errors.push(`Failed to update scene ${scene.name}: ${error.message}`);
            } else {
              imported++;
            }
          } else {
            // Insert
            const { error } = await supabase.from('scenes').insert({
              ...scene,
              id: undefined,
              user_id: userId,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

            if (error) {
              errors.push(`Failed to import scene ${scene.name}: ${error.message}`);
            } else {
              imported++;
            }
          }
        } else {
          imported++; // Count for dry run
        }
      } catch (error) {
        errors.push(`Error processing scene ${scene.name}: ${(error as Error).message}`);
      }
    }

    return { imported, errors };
  }

  private static async importSettings(
    settings: Record<string, any>,
    userId: string
  ): Promise<{ success: boolean }> {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          ...settings,
          user_id: userId,
          updated_at: new Date().toISOString(),
        });

      return { success: !error };
    } catch (error) {
      console.error('Failed to import settings:', error);
      return { success: false };
    }
  }

  private static hasDeviceChanges(existing: Device, imported: Device): boolean {
    const fieldsToCheck = ['name', 'ip_address', 'location', 'room', 'enabled'];
    return fieldsToCheck.some(
      field => existing[field as keyof Device] !== imported[field as keyof Device]
    );
  }

  static async importFromFile(file: File, options: ImportOptions = {}): Promise<ImportResult> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!ExportManager.validateExportData(data)) {
        return {
          success: false,
          imported: { devices: 0, automations: 0, scenes: 0, settings: false },
          errors: ['Invalid file format'],
          warnings: [],
        };
      }

      return this.importData(data, options);
    } catch (error) {
      return {
        success: false,
        imported: { devices: 0, automations: 0, scenes: 0, settings: false },
        errors: ['Failed to read file: ' + (error as Error).message],
        warnings: [],
      };
    }
  }
}