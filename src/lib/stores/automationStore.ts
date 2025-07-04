import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { Automation, Scene, AutomationLog } from '@/types/automation';
import { createClient } from '@/lib/supabase/client';

interface AutomationState {
  // State
  automations: Automation[];
  scenes: Scene[];
  logs: AutomationLog[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAutomations: () => Promise<void>;
  fetchScenes: () => Promise<void>;
  fetchLogs: (automationId?: string) => Promise<void>;
  
  createAutomation: (automation: Omit<Automation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Automation>;
  updateAutomation: (id: string, updates: Partial<Automation>) => Promise<void>;
  deleteAutomation: (id: string) => Promise<void>;
  toggleAutomation: (id: string, enabled: boolean) => Promise<void>;
  
  createScene: (scene: Omit<Scene, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Scene>;
  updateScene: (id: string, updates: Partial<Scene>) => Promise<void>;
  deleteScene: (id: string) => Promise<void>;
  activateScene: (id: string) => Promise<void>;
  
  executeAutomation: (id: string) => Promise<void>;
  
  // Subscriptions
  subscribeToAutomations: () => () => void;
  subscribeToLogs: () => () => void;
}

export const useAutomationStore = create<AutomationState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      automations: [],
      scenes: [],
      logs: [],
      isLoading: false,
      error: null,

      // Fetch automations
      fetchAutomations: async () => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('automations')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          set({ automations: data || [], isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch automations', isLoading: false });
        }
      },

      // Fetch scenes
      fetchScenes: async () => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('scenes')
            .select('*')
            .order('is_favorite', { ascending: false })
            .order('name');

          if (error) throw error;
          set({ scenes: data || [], isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch scenes', isLoading: false });
        }
      },

      // Fetch logs
      fetchLogs: async (automationId?: string) => {
        try {
          const supabase = createClient();
          let query = supabase
            .from('automation_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

          if (automationId) {
            query = query.eq('automation_id', automationId);
          }

          const { data, error } = await query;
          if (error) throw error;
          set({ logs: data || [] });
        } catch (error) {
          console.error('Failed to fetch logs:', error);
        }
      },

      // Create automation
      createAutomation: async (automation) => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const { data, error } = await supabase
            .from('automations')
            .insert({
              ...automation,
              user_id: user.id,
            })
            .select()
            .single();

          if (error) throw error;
          
          set(state => ({
            automations: [data, ...state.automations],
            isLoading: false,
          }));
          
          return data;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to create automation', isLoading: false });
          throw error;
        }
      },

      // Update automation
      updateAutomation: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();
          const { error } = await supabase
            .from('automations')
            .update(updates)
            .eq('id', id);

          if (error) throw error;
          
          set(state => ({
            automations: state.automations.map(a => 
              a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update automation', isLoading: false });
          throw error;
        }
      },

      // Delete automation
      deleteAutomation: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();
          const { error } = await supabase
            .from('automations')
            .delete()
            .eq('id', id);

          if (error) throw error;
          
          set(state => ({
            automations: state.automations.filter(a => a.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete automation', isLoading: false });
          throw error;
        }
      },

      // Toggle automation
      toggleAutomation: async (id, enabled) => {
        await get().updateAutomation(id, { enabled });
      },

      // Create scene
      createScene: async (scene) => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const { data, error } = await supabase
            .from('scenes')
            .insert({
              ...scene,
              user_id: user.id,
            })
            .select()
            .single();

          if (error) throw error;
          
          set(state => ({
            scenes: [data, ...state.scenes],
            isLoading: false,
          }));
          
          return data;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to create scene', isLoading: false });
          throw error;
        }
      },

      // Update scene
      updateScene: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();
          const { error } = await supabase
            .from('scenes')
            .update(updates)
            .eq('id', id);

          if (error) throw error;
          
          set(state => ({
            scenes: state.scenes.map(s => 
              s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update scene', isLoading: false });
          throw error;
        }
      },

      // Delete scene
      deleteScene: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();
          const { error } = await supabase
            .from('scenes')
            .delete()
            .eq('id', id);

          if (error) throw error;
          
          set(state => ({
            scenes: state.scenes.filter(s => s.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete scene', isLoading: false });
          throw error;
        }
      },

      // Activate scene
      activateScene: async (id) => {
        const scene = get().scenes.find(s => s.id === id);
        if (!scene) throw new Error('Scene not found');

        // Execute scene actions via API
        const response = await fetch('/api/automations/execute-scene', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sceneId: id }),
        });

        if (!response.ok) {
          throw new Error('Failed to activate scene');
        }
      },

      // Execute automation manually
      executeAutomation: async (id) => {
        const automation = get().automations.find(a => a.id === id);
        if (!automation) throw new Error('Automation not found');

        // Execute automation via API
        const response = await fetch('/api/automations/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ automationId: id }),
        });

        if (!response.ok) {
          throw new Error('Failed to execute automation');
        }
      },

      // Subscribe to real-time updates
      subscribeToAutomations: () => {
        const supabase = createClient();
        const subscription = supabase
          .channel('automations')
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'automations' },
            (payload) => {
              if (payload.eventType === 'INSERT') {
                set(state => ({
                  automations: [payload.new as Automation, ...state.automations],
                }));
              } else if (payload.eventType === 'UPDATE') {
                set(state => ({
                  automations: state.automations.map(a =>
                    a.id === payload.new.id ? payload.new as Automation : a
                  ),
                }));
              } else if (payload.eventType === 'DELETE') {
                set(state => ({
                  automations: state.automations.filter(a => a.id !== payload.old.id),
                }));
              }
            }
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      },

      // Subscribe to logs
      subscribeToLogs: () => {
        const supabase = createClient();
        const subscription = supabase
          .channel('automation_logs')
          .on('postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'automation_logs' },
            (payload) => {
              set(state => ({
                logs: [payload.new as AutomationLog, ...state.logs].slice(0, 100),
              }));
            }
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      },
    }))
  )
);