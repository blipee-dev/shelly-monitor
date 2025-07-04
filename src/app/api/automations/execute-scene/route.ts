import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Scene, AutomationAction } from '@/types/automation';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sceneId } = await request.json();
    
    if (!sceneId) {
      return NextResponse.json({ error: 'Scene ID is required' }, { status: 400 });
    }

    // Fetch scene
    const { data: scene, error } = await supabase
      .from('scenes')
      .select('*')
      .eq('id', sceneId)
      .eq('user_id', user.id)
      .single();

    if (error || !scene) {
      return NextResponse.json({ error: 'Scene not found' }, { status: 404 });
    }

    // Execute scene actions
    const executedActions: any[] = [];
    const startTime = Date.now();
    let status: 'success' | 'failed' | 'partial' = 'success';

    for (const action of scene.actions as AutomationAction[]) {
      try {
        const result = await executeSceneAction(action, user.id);
        executedActions.push({
          actionId: action.id,
          status: 'success',
          result,
        });
        
        // Add delay if specified
        if (action.delay) {
          await new Promise(resolve => setTimeout(resolve, action.delay! * 1000));
        }
      } catch (error) {
        executedActions.push({
          actionId: action.id,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        status = executedActions.some(a => a.status === 'success') ? 'partial' : 'failed';
      }
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: status !== 'failed',
      sceneName: scene.name,
      executedActions,
      duration,
      status,
    });
  } catch (error) {
    console.error('Scene execution error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Scene execution failed' },
      { status: 500 }
    );
  }
}

async function executeSceneAction(action: AutomationAction, userId: string): Promise<any> {
  switch (action.type) {
    case 'device_control':
      // In a real implementation, this would call the Shelly device API
      console.log('Executing device control:', action.config);
      
      // Simulate device control
      // In production, you would:
      // 1. Fetch device from database
      // 2. Call Shelly HTTP API
      // 3. Update device state in database
      
      if (action.config.deviceIds && action.config.deviceIds.length > 0) {
        // Group action
        const results = [];
        for (const deviceId of action.config.deviceIds) {
          results.push({
            deviceId,
            action: action.config.action,
            value: action.config.value,
            timestamp: new Date().toISOString(),
          });
        }
        return results;
      } else {
        // Single device action
        return {
          deviceId: action.config.deviceId,
          action: action.config.action,
          value: action.config.value,
          timestamp: new Date().toISOString(),
        };
      }

    case 'wait':
      await new Promise(resolve => setTimeout(resolve, (action.config.duration || 0) * 1000));
      return { waited: action.config.duration };

    default:
      console.warn(`Unsupported action type in scene: ${action.type}`);
      return { skipped: true };
  }
}