import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// In a production environment, you would fetch these from a feature flag service
// like LaunchDarkly, Split.io, or your own database
const defaultFlags = [
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

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const userId = request.headers.get('X-User-Id') || user?.id;
    const userGroups = request.headers.get('X-User-Groups')?.split(',') || [];
    
    // In production, you would:
    // 1. Fetch user-specific overrides from database
    // 2. Check user group memberships
    // 3. Apply rollout rules
    // 4. Return personalized flags
    
    // For now, return default flags with some basic logic
    const personalizedFlags = defaultFlags.map(flag => {
      const personalizedFlag = { ...flag };
      
      // Check if user is in target groups
      if (flag.targetGroups?.length) {
        const isInTargetGroup = flag.targetGroups.some(group => 
          userGroups.includes(group)
        );
        if (!isInTargetGroup && !flag.enabled) {
          personalizedFlag.enabled = false;
        }
      }
      
      // Apply rollout percentage (simplified)
      if (flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100) {
        // Use consistent hashing based on userId for consistent experience
        if (userId) {
          const hash = userId.split('').reduce((acc, char) => {
            return ((acc << 5) - acc) + char.charCodeAt(0);
          }, 0);
          const userPercentage = Math.abs(hash) % 100;
          personalizedFlag.enabled = personalizedFlag.enabled && (userPercentage < flag.rolloutPercentage);
        }
      }
      
      return personalizedFlag;
    });
    
    return NextResponse.json(personalizedFlags);
  } catch (error) {
    console.error('Failed to fetch feature flags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feature flags' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user has admin privileges
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    if (userRole?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    
    const updates = await request.json();
    
    // In production, you would update the feature flags in your database
    // For now, we'll just validate and return success
    if (!updates.key || !updates.updates) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    // Validate flag exists
    const flagExists = defaultFlags.some(flag => flag.key === updates.key);
    if (!flagExists) {
      return NextResponse.json(
        { error: 'Feature flag not found' },
        { status: 404 }
      );
    }
    
    // Here you would update the flag in your database
    // await supabase.from('feature_flags').update(updates.updates).eq('key', updates.key);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update feature flag:', error);
    return NextResponse.json(
      { error: 'Failed to update feature flag' },
      { status: 500 }
    );
  }
}