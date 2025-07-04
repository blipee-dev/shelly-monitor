import { createClient } from '@/lib/supabase/client';
import { 
  Device, 
  DeviceGroup, 
  DeviceFormData,
  DeviceListResponse,
  DeviceDetailResponse,
  DeviceData,
  ControlCommand,
  RelayControlCommand,
  DimmerControlCommand
} from '@/types/device';
import { buildDeviceUrl } from '@/lib/devices/utils';

const supabase = createClient();

// Device CRUD operations
export const deviceApi = {
  // List devices with filters
  async list(filters?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    group_id?: string;
    search?: string;
  }): Promise<DeviceListResponse> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    let query = supabase
      .from('devices')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.group_id) {
      query = query.eq('group_id', filters.group_id);
    }
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,ip_address.ilike.%${filters.search}%`);
    }
    
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    return {
      devices: data || [],
      total: count || 0,
      page,
      limit,
    };
  },
  
  // Get single device with latest data
  async get(id: string): Promise<DeviceDetailResponse> {
    // Get device info
    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .select('*')
      .eq('id', id)
      .single();
    
    if (deviceError) throw deviceError;
    
    // Get latest device data
    const { data: latestData, error: dataError } = await supabase
      .from('device_data')
      .select('*')
      .eq('device_id', id)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();
    
    if (dataError && dataError.code !== 'PGRST116') throw dataError;
    
    // Get recent data points (last 24 hours)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    
    const { data: recentData, error: recentError } = await supabase
      .from('device_data')
      .select('timestamp, data')
      .eq('device_id', id)
      .gte('timestamp', twentyFourHoursAgo.toISOString())
      .order('timestamp', { ascending: false })
      .limit(100);
    
    if (recentError) throw recentError;
    
    return {
      device,
      data: latestData?.data || {},
      recent_data: recentData || [],
    };
  },
  
  // Create new device
  async create(data: DeviceFormData): Promise<Device> {
    const { data: device, error } = await supabase
      .from('devices')
      .insert({
        ...data,
        status: 'offline',
        firmware_version: 'unknown',
        last_seen: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return device;
  },
  
  // Update device
  async update(id: string, data: Partial<DeviceFormData>): Promise<Device> {
    const { data: device, error } = await supabase
      .from('devices')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return device;
  },
  
  // Delete device
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
  
  // Control device (send commands)
  async control(command: ControlCommand): Promise<any> {
    if ('relay_id' in command) {
      return deviceApi.controlRelay(command as RelayControlCommand);
    } else {
      return deviceApi.controlDimmer(command as DimmerControlCommand);
    }
  },
  
  // Control relay device
  async controlRelay(command: RelayControlCommand): Promise<any> {
    const { device_id, relay_id, action } = command;
    
    // Get device info
    const { data: device, error } = await supabase
      .from('devices')
      .select('ip_address')
      .eq('id', device_id)
      .single();
    
    if (error) throw error;
    
    // Send HTTP request to device
    const url = buildDeviceUrl(device, `/relay/${relay_id}`);
    const params = new URLSearchParams({ turn: action });
    
    const response = await fetch(`${url}?${params}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Device control failed: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Control dimmer device
  async controlDimmer(command: DimmerControlCommand): Promise<any> {
    const { device_id, action, brightness } = command;
    
    // Get device info
    const { data: device, error } = await supabase
      .from('devices')
      .select('ip_address')
      .eq('id', device_id)
      .single();
    
    if (error) throw error;
    
    // Send HTTP request to device
    const url = buildDeviceUrl(device, '/light/0');
    const params: any = {};
    
    if (action === 'brightness' && brightness !== undefined) {
      params.brightness = brightness;
      params.turn = 'on';
    } else {
      params.turn = action;
    }
    
    const response = await fetch(`${url}?${new URLSearchParams(params)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Device control failed: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Get device status from device
  async fetchStatus(deviceId: string): Promise<any> {
    const { data: device, error } = await supabase
      .from('devices')
      .select('ip_address')
      .eq('id', deviceId)
      .single();
    
    if (error) throw error;
    
    const url = buildDeviceUrl(device, '/status');
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch device status: ${response.statusText}`);
    }
    
    return response.json();
  },
};

// Device Group operations
export const deviceGroupApi = {
  // List groups
  async list(): Promise<DeviceGroup[]> {
    const { data, error } = await supabase
      .from('device_groups')
      .select('*, device_count:devices(count)')
      .order('name');
    
    if (error) throw error;
    
    return data.map(group => ({
      ...group,
      device_count: group.device_count?.[0]?.count || 0,
    }));
  },
  
  // Create group
  async create(data: { name: string; description?: string }): Promise<DeviceGroup> {
    const { data: group, error } = await supabase
      .from('device_groups')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return group;
  },
  
  // Update group
  async update(id: string, data: { name?: string; description?: string }): Promise<DeviceGroup> {
    const { data: group, error } = await supabase
      .from('device_groups')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return group;
  },
  
  // Delete group
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('device_groups')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};