import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { 
  Device, 
  DeviceGroup, 
  DeviceFilters,
  DeviceData,
  DeviceUpdateEvent 
} from '@/types/device';
import { createClient } from '@/lib/supabase/client';

interface DeviceState {
  // Devices
  devices: Device[];
  selectedDevice: Device | null;
  deviceData: Record<string, DeviceData>; // device_id -> latest data
  
  // Groups
  groups: DeviceGroup[];
  selectedGroup: DeviceGroup | null;
  
  // UI State
  filters: DeviceFilters;
  isLoading: boolean;
  error: string | null;
  
  // Actions - Devices
  fetchDevices: () => Promise<void>;
  setDevices: (devices: Device[]) => void;
  addDevice: (device: Device) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  removeDevice: (id: string) => void;
  selectDevice: (device: Device | null) => void;
  
  // Actions - Device Data
  setDeviceData: (deviceId: string, data: DeviceData) => void;
  updateDeviceData: (deviceId: string, data: Partial<DeviceData>) => void;
  
  // Actions - Groups
  setGroups: (groups: DeviceGroup[]) => void;
  addGroup: (group: DeviceGroup) => void;
  updateGroup: (id: string, updates: Partial<DeviceGroup>) => void;
  removeGroup: (id: string) => void;
  selectGroup: (group: DeviceGroup | null) => void;
  
  // Actions - Filters
  setFilters: (filters: DeviceFilters) => void;
  clearFilters: () => void;
  
  // Actions - UI State
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Real-time updates
  handleDeviceUpdate: (event: DeviceUpdateEvent) => void;
  
  // Computed
  getFilteredDevices: () => Device[];
  getDevicesByGroup: (groupId: string) => Device[];
  getOnlineDevices: () => Device[];
  getOfflineDevices: () => Device[];
}

export const useDeviceStore = create<DeviceState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      devices: [],
      selectedDevice: null,
      deviceData: {},
      groups: [],
      selectedGroup: null,
      filters: {},
      isLoading: false,
      error: null,
      
      // Device actions
      fetchDevices: async () => {
        const supabase = createClient();
        set({ isLoading: true, error: null });
        
        try {
          const { data: devices, error } = await supabase
            .from('devices')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          set({ devices: devices || [], isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch devices',
            isLoading: false 
          });
        }
      },
      
      setDevices: (devices) => set({ devices }),
      
      addDevice: (device) => 
        set((state) => ({ devices: [...state.devices, device] })),
      
      updateDevice: (id, updates) =>
        set((state) => ({
          devices: state.devices.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          ),
          selectedDevice:
            state.selectedDevice?.id === id
              ? { ...state.selectedDevice, ...updates }
              : state.selectedDevice,
        })),
      
      removeDevice: (id) =>
        set((state) => ({
          devices: state.devices.filter((d) => d.id !== id),
          selectedDevice:
            state.selectedDevice?.id === id ? null : state.selectedDevice,
        })),
      
      selectDevice: (device) => set({ selectedDevice: device }),
      
      // Device data actions
      setDeviceData: (deviceId, data) =>
        set((state) => ({
          deviceData: { ...state.deviceData, [deviceId]: data },
        })),
      
      updateDeviceData: (deviceId, data) =>
        set((state) => ({
          deviceData: {
            ...state.deviceData,
            [deviceId]: { ...state.deviceData[deviceId], ...data },
          },
        })),
      
      // Group actions
      setGroups: (groups) => set({ groups }),
      
      addGroup: (group) =>
        set((state) => ({ groups: [...state.groups, group] })),
      
      updateGroup: (id, updates) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
          selectedGroup:
            state.selectedGroup?.id === id
              ? { ...state.selectedGroup, ...updates }
              : state.selectedGroup,
        })),
      
      removeGroup: (id) =>
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== id),
          selectedGroup:
            state.selectedGroup?.id === id ? null : state.selectedGroup,
        })),
      
      selectGroup: (group) => set({ selectedGroup: group }),
      
      // Filter actions
      setFilters: (filters) => set({ filters }),
      clearFilters: () => set({ filters: {} }),
      
      // UI state actions
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      // Real-time update handler
      handleDeviceUpdate: (event) => {
        const { device_id, type, data } = event;
        
        if (type === 'status' || type === 'config') {
          get().updateDevice(device_id, data as Partial<Device>);
        } else if (type === 'data') {
          get().setDeviceData(device_id, data as DeviceData);
        }
      },
      
      // Computed getters
      getFilteredDevices: () => {
        const { devices, filters } = get();
        let filtered = [...devices];
        
        if (filters.status) {
          filtered = filtered.filter((d) => d.status === filters.status);
        }
        
        if (filters.type) {
          filtered = filtered.filter((d) => d.type === filters.type);
        }
        
        if (filters.group_id) {
          filtered = filtered.filter((d) => d.group_id === filters.group_id);
        }
        
        if (filters.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter(
            (d) =>
              d.name.toLowerCase().includes(search) ||
              d.ip_address.includes(search) ||
              d.mac_address.toLowerCase().includes(search) ||
              d.location?.toLowerCase().includes(search)
          );
        }
        
        return filtered;
      },
      
      getDevicesByGroup: (groupId) => {
        const { devices } = get();
        return devices.filter((d) => d.group_id === groupId);
      },
      
      getOnlineDevices: () => {
        const { devices } = get();
        return devices.filter((d) => d.status === 'online');
      },
      
      getOfflineDevices: () => {
        const { devices } = get();
        return devices.filter((d) => d.status === 'offline');
      },
    })),
    {
      name: 'device-store',
    }
  )
);