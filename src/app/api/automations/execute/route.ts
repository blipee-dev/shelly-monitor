import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Automation, AutomationAction } from '@/types/automation';
import { logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { automationId } = await request.json();
    
    if (!automationId) {
      return NextResponse.json({ error: 'Automation ID is required' }, { status: 400 });
    }

    // Fetch automation
    const { data: automation, error } = await supabase
      .from('automations')
      .select('*')
      .eq('id', automationId)
      .eq('user_id', user.id)
      .single();

    if (error || !automation) {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 });
    }

    // Execute actions
    const executedActions: any[] = [];
    const startTime = Date.now();
    let status: 'success' | 'failed' | 'partial' = 'success';
    let errorMessage: string | undefined;

    for (const action of automation.actions as AutomationAction[]) {
      try {
        const result = await executeAction(action, user.id);
        executedActions.push({
          actionId: action.id,
          status: 'success',
          result,
        });
      } catch (error) {
        executedActions.push({
          actionId: action.id,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        status = executedActions.some(a => a.status === 'success') ? 'partial' : 'failed';
        errorMessage = error instanceof Error ? error.message : 'Execution failed';
      }
    }

    const duration = Date.now() - startTime;

    // Log execution
    await supabase.rpc('log_automation_execution', {
      p_automation_id: automationId,
      p_automation_name: automation.name,
      p_user_id: user.id,
      p_triggered_by: 'manual',
      p_status: status,
      p_executed_actions: executedActions,
      p_duration: duration,
      p_error_message: errorMessage,
    });

    return NextResponse.json({
      success: status !== 'failed',
      executedActions,
      duration,
      status,
    });
  } catch (error) {
    logger.error('Automation execution error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Execution failed' },
      { status: 500 }
    );
  }
}

async function executeAction(action: AutomationAction, userId: string): Promise<any> {
  switch (action.type) {
    case 'device_control':
      // In a real implementation, this would call the Shelly device API
      // For now, we'll simulate the action
      logger.debug('Executing device control:', action.config);
      
      // You would implement actual device control here
      // Example: await controlDevice(action.config.deviceId, action.config.action, action.config.value);
      
      return { 
        deviceId: action.config.deviceId,
        action: action.config.action,
        value: action.config.value,
        timestamp: new Date().toISOString(),
      };

    case 'scene_activate':
      // Recursively execute scene actions
      const response = await fetch('/api/automations/execute-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sceneId: action.config.sceneId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to activate scene');
      }
      
      return await response.json();

    case 'wait':
      // Wait for specified duration
      await new Promise(resolve => setTimeout(resolve, (action.config.duration || 0) * 1000));
      return { waited: action.config.duration };

    case 'notification':
      // In a real implementation, this would send notifications
      logger.info('Sending notification:', action.config.message);
      return { message: action.config.message, sent: true };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}