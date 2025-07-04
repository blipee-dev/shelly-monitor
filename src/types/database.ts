export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          name: string | null
          role: 'user' | 'admin' | 'viewer'
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'super_admin'
          is_active?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'super_admin'
          is_active?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      devices: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'plus_2pm' | 'motion_2'
          ip_address: string
          mac_address: string
          firmware_version: string | null
          auth_enabled: boolean
          username: string | null
          password: string | null
          last_seen: string | null
          online: boolean
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'plus_2pm' | 'motion_2'
          ip_address: string
          mac_address: string
          firmware_version?: string | null
          auth_enabled?: boolean
          username?: string | null
          password?: string | null
          last_seen?: string | null
          online?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'plus_2pm' | 'motion_2'
          ip_address?: string
          mac_address?: string
          firmware_version?: string | null
          auth_enabled?: boolean
          username?: string | null
          password?: string | null
          last_seen?: string | null
          online?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      device_status: {
        Row: {
          device_id: string
          online: boolean
          data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          device_id: string
          online?: boolean
          data: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          device_id?: string
          online?: boolean
          data?: Json
          created_at?: string
          updated_at?: string
        }
      }
      power_readings: {
        Row: {
          id: string
          device_id: string
          channel: number
          timestamp: string
          power: number | null
          voltage: number | null
          current: number | null
          energy: number | null
          power_factor: number | null
          temperature: number | null
        }
        Insert: {
          id?: string
          device_id: string
          channel: number
          timestamp?: string
          power?: number | null
          voltage?: number | null
          current?: number | null
          energy?: number | null
          power_factor?: number | null
          temperature?: number | null
        }
        Update: {
          id?: string
          device_id?: string
          channel?: number
          timestamp?: string
          power?: number | null
          voltage?: number | null
          current?: number | null
          energy?: number | null
          power_factor?: number | null
          temperature?: number | null
        }
      }
      motion_events: {
        Row: {
          id: string
          device_id: string
          timestamp: string
          motion_detected: boolean
          lux: number | null
          temperature: number | null
          battery_percent: number | null
          vibration_detected: boolean
        }
        Insert: {
          id?: string
          device_id: string
          timestamp?: string
          motion_detected?: boolean
          lux?: number | null
          temperature?: number | null
          battery_percent?: number | null
          vibration_detected?: boolean
        }
        Update: {
          id?: string
          device_id?: string
          timestamp?: string
          motion_detected?: boolean
          lux?: number | null
          temperature?: number | null
          battery_percent?: number | null
          vibration_detected?: boolean
        }
      }
      alerts: {
        Row: {
          id: string
          user_id: string
          device_id: string | null
          type: string
          severity: 'info' | 'warning' | 'critical'
          title: string
          message: string
          data: Json | null
          is_read: boolean
          is_resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          device_id?: string | null
          type: string
          severity?: 'info' | 'warning' | 'critical'
          title: string
          message: string
          data?: Json | null
          is_read?: boolean
          is_resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          device_id?: string | null
          type?: string
          severity?: 'info' | 'warning' | 'critical'
          title?: string
          message?: string
          data?: Json | null
          is_read?: boolean
          is_resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      alert_rules: {
        Row: {
          id: string
          user_id: string
          device_id: string | null
          name: string
          type: string
          condition: Json
          actions: Json
          is_active: boolean
          last_triggered: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          device_id?: string | null
          name: string
          type: string
          condition: Json
          actions: Json
          is_active?: boolean
          last_triggered?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          device_id?: string | null
          name?: string
          type?: string
          condition?: Json
          actions?: Json
          is_active?: boolean
          last_triggered?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          user_id: string
          theme: 'light' | 'dark' | 'system'
          language: string
          timezone: string
          notifications_email: boolean
          notifications_push: boolean
          notifications_sms: boolean
          data_retention_days: number
          temperature_unit: 'celsius' | 'fahrenheit'
          date_format: string
          time_format: '12h' | '24h'
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          theme?: 'light' | 'dark' | 'system'
          language?: string
          timezone?: string
          notifications_email?: boolean
          notifications_push?: boolean
          notifications_sms?: boolean
          data_retention_days?: number
          temperature_unit?: 'celsius' | 'fahrenheit'
          date_format?: string
          time_format?: '12h' | '24h'
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          theme?: 'light' | 'dark' | 'system'
          language?: string
          timezone?: string
          notifications_email?: boolean
          notifications_push?: boolean
          notifications_sms?: boolean
          data_retention_days?: number
          temperature_unit?: 'celsius' | 'fahrenheit'
          date_format?: string
          time_format?: '12h' | '24h'
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          user_id: string
          name: string
          key_hash: string
          key_preview: string
          permissions: Json
          expires_at: string | null
          last_used_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          key_hash: string
          key_preview: string
          permissions?: Json
          expires_at?: string | null
          last_used_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          key_hash?: string
          key_preview?: string
          permissions?: Json
          expires_at?: string | null
          last_used_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          event_type: string
          severity: 'info' | 'warning' | 'error' | 'critical'
          user_id: string | null
          resource_type: string | null
          resource_id: string | null
          action: string
          details: Json | null
          ip_address: string | null
          user_agent: string | null
          session_id: string | null
          timestamp: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          event_type: string
          severity?: 'info' | 'warning' | 'error' | 'critical'
          user_id?: string | null
          resource_type?: string | null
          resource_id?: string | null
          action: string
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          timestamp?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          event_type?: string
          severity?: 'info' | 'warning' | 'error' | 'critical'
          user_id?: string | null
          resource_type?: string | null
          resource_id?: string | null
          action?: string
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          timestamp?: string
          metadata?: Json | null
        }
      }
      user_roles: {
        Row: {
          user_id: string
          role: 'user' | 'admin' | 'super_admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          role?: 'user' | 'admin' | 'super_admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          role?: 'user' | 'admin' | 'super_admin'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      device_power_summary: {
        Row: {
          device_id: string | null
          device_name: string | null
          channel: number | null
          avg_power: number | null
          max_power: number | null
          min_power: number | null
          total_energy: number | null
          reading_count: number | null
          first_reading: string | null
          last_reading: string | null
        }
      }
      user_device_count: {
        Row: {
          user_id: string | null
          total_devices: number | null
          online_devices: number | null
          offline_devices: number | null
          plus_2pm_count: number | null
          motion_2_count: number | null
        }
      }
    }
    Functions: {
      cleanup_old_data: {
        Args: Record<PropertyKey, never>
        Returns: void
      }
      get_device_power_stats: {
        Args: {
          p_device_id: string
          p_start_date: string
          p_end_date: string
        }
        Returns: {
          channel: number
          avg_power: number
          max_power: number
          min_power: number
          total_energy: number
        }[]
      }
      update_device_status: {
        Args: {
          p_device_id: string
          p_online: boolean
          p_data: Json
        }
        Returns: void
      }
    }
    Enums: {
      device_type: 'plus_2pm' | 'motion_2'
      user_role: 'user' | 'admin' | 'super_admin'
      alert_severity: 'info' | 'warning' | 'critical'
      theme_mode: 'light' | 'dark' | 'system'
      temperature_unit: 'celsius' | 'fahrenheit'
      time_format: '12h' | '24h'
    }
  }
}