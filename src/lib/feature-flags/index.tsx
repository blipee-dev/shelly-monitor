'use client';

import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage?: number;
  targetUsers?: string[];
  targetGroups?: string[];
  metadata?: Record<string, any>;
}

export interface FeatureFlagsState {
  flags: Record<string, FeatureFlag>;
  userContext: {
    userId?: string;
    userGroups?: string[];
    attributes?: Record<string, any>;
  };
  setUserContext: (context: FeatureFlagsState['userContext']) => void;
  isEnabled: (flagKey: string) => boolean;
  getFlag: (flagKey: string) => FeatureFlag | undefined;
  updateFlag: (flagKey: string, updates: Partial<FeatureFlag>) => void;
  setFlags: (flags: FeatureFlag[]) => void;
}

// Default feature flags
const defaultFlags: FeatureFlag[] = [
  {
    key: 'ADVANCED_ANALYTICS',
    name: 'Advanced Analytics',
    description: 'Enable advanced analytics dashboard with detailed charts and insights',
    enabled: true
  },
  {
    key: 'DEVICE_GROUPING',
    name: 'Device Grouping',
    description: 'Allow users to organize devices into custom groups',
    enabled: true
  },
  {
    key: 'AUTOMATED_SCHEDULES',
    name: 'Automated Schedules',
    description: 'Enable scheduling for device control',
    enabled: true
  },
  {
    key: 'ENERGY_INSIGHTS',
    name: 'Energy Insights',
    description: 'Show detailed energy consumption insights and recommendations',
    enabled: true
  },
  {
    key: 'VOICE_CONTROL',
    name: 'Voice Control',
    description: 'Enable voice control integration',
    enabled: false,
    rolloutPercentage: 0
  },
  {
    key: 'BETA_FEATURES',
    name: 'Beta Features',
    description: 'Access to beta features and experimental functionality',
    enabled: false,
    targetGroups: ['beta_testers']
  },
  {
    key: 'EXPORT_DATA',
    name: 'Export Data',
    description: 'Allow users to export device data in various formats',
    enabled: true
  },
  {
    key: 'WEBHOOKS',
    name: 'Webhooks',
    description: 'Enable webhook integrations for external services',
    enabled: false,
    rolloutPercentage: 50
  },
  {
    key: 'MULTI_TENANT',
    name: 'Multi-Tenant Support',
    description: 'Enable multi-tenant functionality for enterprise users',
    enabled: false,
    targetGroups: ['enterprise']
  },
  {
    key: 'DARK_MODE',
    name: 'Dark Mode',
    description: 'Enable dark mode theme option',
    enabled: true
  }
];

// Helper function to check if a user should see a feature based on rollout
function shouldShowFeatureBasedOnRollout(
  flag: FeatureFlag,
  userId?: string
): boolean {
  if (!flag.rolloutPercentage || flag.rolloutPercentage >= 100) {
    return true;
  }
  
  if (flag.rolloutPercentage <= 0) {
    return false;
  }
  
  // Use consistent hashing based on userId to ensure consistent experience
  if (userId) {
    const hash = userId.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    return (Math.abs(hash) % 100) < flag.rolloutPercentage;
  }
  
  // Random rollout if no userId
  return Math.random() * 100 < flag.rolloutPercentage;
}

export const useFeatureFlags = create<FeatureFlagsState>()(
  persist(
    (set, get) => ({
      flags: defaultFlags.reduce((acc, flag) => {
        acc[flag.key] = flag;
        return acc;
      }, {} as Record<string, FeatureFlag>),
      
      userContext: {},
      
      setUserContext: (context) => set({ userContext: context }),
      
      isEnabled: (flagKey: string) => {
        const { flags, userContext } = get();
        const flag = flags[flagKey];
        
        if (!flag) {
          console.warn(`Feature flag "${flagKey}" not found`);
          return false;
        }
        
        // If globally disabled, return false
        if (!flag.enabled) {
          return false;
        }
        
        // Check target users
        if (flag.targetUsers?.length && userContext.userId) {
          if (flag.targetUsers.includes(userContext.userId)) {
            return true;
          }
        }
        
        // Check target groups
        if (flag.targetGroups?.length && userContext.userGroups?.length) {
          const hasTargetGroup = flag.targetGroups.some(group => 
            userContext.userGroups?.includes(group)
          );
          if (hasTargetGroup) {
            return true;
          }
        }
        
        // Check rollout percentage
        if (flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100) {
          return shouldShowFeatureBasedOnRollout(flag, userContext.userId);
        }
        
        return true;
      },
      
      getFlag: (flagKey: string) => {
        const { flags } = get();
        return flags[flagKey];
      },
      
      updateFlag: (flagKey: string, updates: Partial<FeatureFlag>) => {
        set((state) => ({
          flags: {
            ...state.flags,
            [flagKey]: {
              ...state.flags[flagKey],
              ...updates
            }
          }
        }));
      },
      
      setFlags: (newFlags: FeatureFlag[]) => {
        const flagsMap = newFlags.reduce((acc, flag) => {
          acc[flag.key] = flag;
          return acc;
        }, {} as Record<string, FeatureFlag>);
        
        set({ flags: flagsMap });
      }
    }),
    {
      name: 'feature-flags-storage',
      partialize: (state) => ({ flags: state.flags })
    }
  )
);

// React hook for using feature flags
export function useFeatureFlag(flagKey: string): boolean {
  return useFeatureFlags((state) => state.isEnabled(flagKey));
}

// HOC for conditionally rendering components based on feature flags
export function withFeatureFlag<P extends object>(
  flagKey: string,
  Component: React.ComponentType<P>,
  FallbackComponent?: React.ComponentType<P>
) {
  return function FeatureFlaggedComponent(props: P) {
    const isEnabled = useFeatureFlag(flagKey);
    
    if (isEnabled) {
      return <Component {...props} />;
    }
    
    if (FallbackComponent) {
      return <FallbackComponent {...props} />;
    }
    
    return null;
  };
}

// Component for conditionally rendering children based on feature flags
export function FeatureFlagGate({
  flag,
  children,
  fallback
}: {
  flag: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const isEnabled = useFeatureFlag(flag);
  
  if (isEnabled) {
    return <>{children}</>;
  }
  
  return <>{fallback}</> || null;
}

// Provider component to initialize feature flags
export function FeatureFlagProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Initialize flags with default user context on mount
    // The actual user context will be set when the user authenticates
    initializeFeatureFlags();
  }, []);
  
  return <>{children}</>;
}

// Initialize feature flags from remote config (if available)
export async function initializeFeatureFlags(userId?: string, userGroups?: string[]) {
  try {
    // In a real application, you would fetch flags from a remote service
    // For now, we'll use the default flags
    const response = await fetch('/api/feature-flags', {
      headers: {
        'X-User-Id': userId || '',
        'X-User-Groups': userGroups?.join(',') || ''
      }
    });
    
    if (response.ok) {
      const remoteFlags = await response.json();
      useFeatureFlags.getState().setFlags(remoteFlags);
    }
  } catch (error) {
    console.error('Failed to fetch feature flags:', error);
    // Fall back to default flags
  }
  
  // Set user context
  useFeatureFlags.getState().setUserContext({
    userId,
    userGroups
  });
}

