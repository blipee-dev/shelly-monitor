import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { auditLog } from '@/lib/audit';
import axios from 'axios';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { channel, state } = await request.json();
    
    // Fetch device
    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();
    
    if (deviceError || !device) {
      return NextResponse.json(
        { error: 'Device not found' },
        { status: 404 }
      );
    }
    
    // Control device based on type
    if (device.type === 'plus_2pm') {
      const url = `http://${device.ip_address}/relay/${channel}`;
      const shellyParams = { turn: state ? 'on' : 'off' };
      
      try {
        const response = await axios.post(url, null, {
          params: shellyParams,
          auth: device.auth_enabled ? {
            username: device.username,
            password: device.password
          } : undefined,
          timeout: 5000
        });
        
        // Log successful control
        await auditLog.deviceControl(user.id, device.id, `Switch ${channel} turned ${state ? 'on' : 'off'}`, {
          channel,
          state,
          response: response.data
        });
        
        // Update device status in database
        await supabase
          .from('device_status')
          .upsert({
            device_id: device.id,
            online: true,
            data: response.data,
            updated_at: new Date()
          });
        
        return NextResponse.json({
          success: true,
          data: response.data
        });
      } catch (error: any) {
        // Log failed control attempt
        await auditLog.deviceControl(user.id, device.id, `Failed to control switch ${channel}`, {
          channel,
          state,
          error: error.message
        });
        
        return NextResponse.json(
          { error: 'Failed to control device', details: error.message },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Control not supported for this device type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Failed to control device:', error);
    return NextResponse.json(
      { error: 'Failed to control device' },
      { status: 500 }
    );
  }
}