import { ExportManager, ExportData } from './export-manager';
import { supabase } from '@/lib/supabase/client';

export interface BackupSchedule {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // HH:MM format
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
  retentionDays: number;
}

export interface BackupRecord {
  id: string;
  scheduleId?: string;
  timestamp: string;
  size: number;
  status: 'success' | 'failed' | 'in_progress';
  error?: string;
  downloadUrl?: string;
  expiresAt?: string;
}

export class BackupService {
  private static readonly MAX_BACKUPS = 50;
  private static readonly DEFAULT_RETENTION_DAYS = 30;

  static async createBackup(
    manual: boolean = true,
    scheduleId?: string
  ): Promise<BackupRecord> {
    const record: BackupRecord = {
      id: crypto.randomUUID(),
      scheduleId,
      timestamp: new Date().toISOString(),
      size: 0,
      status: 'in_progress',
    };

    try {
      // Create backup record
      const { error: recordError } = await supabase
        .from('backup_records')
        .insert(record);

      if (recordError) throw recordError;

      // Export all data
      const exportData = await ExportManager.exportData({
        includeDevices: true,
        includeAutomations: true,
        includeScenes: true,
        includeSettings: true,
        includeHistory: true,
      });

      // Calculate size
      const jsonString = JSON.stringify(exportData);
      record.size = new Blob([jsonString]).size;

      // Store backup in Supabase Storage
      const fileName = `backup-${record.timestamp.replace(/[:.]/g, '-')}.json`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('backups')
        .upload(fileName, jsonString, {
          contentType: 'application/json',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get download URL (valid for 1 year)
      const { data: urlData } = supabase.storage
        .from('backups')
        .createSignedUrl(fileName, 365 * 24 * 60 * 60);

      record.downloadUrl = urlData?.signedUrl;
      record.status = 'success';
      record.expiresAt = new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString();

      // Update record
      await supabase
        .from('backup_records')
        .update({
          size: record.size,
          status: record.status,
          downloadUrl: record.downloadUrl,
          expiresAt: record.expiresAt,
        })
        .eq('id', record.id);

      // Clean up old backups
      await this.cleanupOldBackups();

      return record;
    } catch (error) {
      // Update record with error
      record.status = 'failed';
      record.error = (error as Error).message;

      await supabase
        .from('backup_records')
        .update({
          status: record.status,
          error: record.error,
        })
        .eq('id', record.id);

      throw error;
    }
  }

  static async getBackups(): Promise<BackupRecord[]> {
    const { data, error } = await supabase
      .from('backup_records')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(this.MAX_BACKUPS);

    if (error) throw error;
    return data || [];
  }

  static async getSchedules(): Promise<BackupSchedule[]> {
    const { data, error } = await supabase
      .from('backup_schedules')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  static async createSchedule(
    schedule: Omit<BackupSchedule, 'id' | 'lastRun' | 'nextRun'>
  ): Promise<BackupSchedule> {
    const newSchedule: BackupSchedule = {
      ...schedule,
      id: crypto.randomUUID(),
      nextRun: this.calculateNextRun(schedule),
    };

    const { error } = await supabase
      .from('backup_schedules')
      .insert(newSchedule);

    if (error) throw error;
    return newSchedule;
  }

  static async updateSchedule(
    id: string,
    updates: Partial<BackupSchedule>
  ): Promise<void> {
    // Recalculate next run if schedule changed
    if (updates.frequency || updates.time || updates.dayOfWeek || updates.dayOfMonth) {
      updates.nextRun = this.calculateNextRun({ ...updates } as BackupSchedule);
    }

    const { error } = await supabase
      .from('backup_schedules')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  }

  static async deleteSchedule(id: string): Promise<void> {
    const { error } = await supabase
      .from('backup_schedules')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async deleteBackup(id: string): Promise<void> {
    // Get backup record
    const { data: backup, error: fetchError } = await supabase
      .from('backup_records')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Delete from storage
    if (backup.downloadUrl) {
      const fileName = backup.downloadUrl.split('/').pop()?.split('?')[0];
      if (fileName) {
        await supabase.storage.from('backups').remove([fileName]);
      }
    }

    // Delete record
    const { error } = await supabase
      .from('backup_records')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async restoreBackup(backupId: string): Promise<void> {
    const { data: backup, error } = await supabase
      .from('backup_records')
      .select('*')
      .eq('id', backupId)
      .single();

    if (error || !backup) throw new Error('Backup not found');

    // Download backup data
    if (!backup.downloadUrl) throw new Error('Backup file not available');

    const response = await fetch(backup.downloadUrl);
    if (!response.ok) throw new Error('Failed to download backup');

    const data: ExportData = await response.json();

    // Import the data
    const { ImportManager } = await import('./import-manager');
    const result = await ImportManager.importData(data, {
      overwriteExisting: true,
      importDevices: true,
      importAutomations: true,
      importScenes: true,
      importSettings: true,
    });

    if (!result.success) {
      throw new Error(`Restore failed: ${result.errors.join(', ')}`);
    }
  }

  private static calculateNextRun(schedule: BackupSchedule): string {
    const now = new Date();
    const [hours, minutes] = schedule.time.split(':').map(Number);
    
    let nextRun = new Date();
    nextRun.setHours(hours, minutes, 0, 0);

    // If time has passed today, start from tomorrow
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    switch (schedule.frequency) {
      case 'daily':
        // Already set correctly
        break;

      case 'weekly':
        // Find next occurrence of the specified day
        const targetDay = schedule.dayOfWeek || 0;
        while (nextRun.getDay() !== targetDay) {
          nextRun.setDate(nextRun.getDate() + 1);
        }
        break;

      case 'monthly':
        // Set to specified day of month
        const targetDate = schedule.dayOfMonth || 1;
        nextRun.setDate(targetDate);
        
        // If date has passed this month, move to next month
        if (nextRun <= now) {
          nextRun.setMonth(nextRun.getMonth() + 1);
        }
        break;
    }

    return nextRun.toISOString();
  }

  private static async cleanupOldBackups(): Promise<void> {
    try {
      // Get all backups
      const { data: backups } = await supabase
        .from('backup_records')
        .select('*')
        .order('timestamp', { ascending: false });

      if (!backups) return;

      // Keep only the most recent MAX_BACKUPS
      const toDelete = backups.slice(this.MAX_BACKUPS);

      for (const backup of toDelete) {
        await this.deleteBackup(backup.id);
      }

      // Also delete expired backups
      const now = new Date();
      const expiredBackups = backups.filter(
        b => b.expiresAt && new Date(b.expiresAt) < now
      );

      for (const backup of expiredBackups) {
        await this.deleteBackup(backup.id);
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }

  static async runScheduledBackups(): Promise<void> {
    const schedules = await this.getSchedules();
    const now = new Date();

    for (const schedule of schedules) {
      if (!schedule.enabled || !schedule.nextRun) continue;

      const nextRun = new Date(schedule.nextRun);
      if (nextRun <= now) {
        try {
          // Create backup
          await this.createBackup(false, schedule.id);

          // Update schedule
          await this.updateSchedule(schedule.id, {
            lastRun: now.toISOString(),
            nextRun: this.calculateNextRun(schedule),
          });
        } catch (error) {
          console.error(`Scheduled backup failed for ${schedule.name}:`, error);
        }
      }
    }
  }
}