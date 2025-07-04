import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { auditLog } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { data: devices, error } = await supabase
      .from('devices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(devices);
  } catch (error) {
    console.error('Failed to fetch devices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch devices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const deviceData = await request.json();
    
    // Validate required fields
    if (!deviceData.name || !deviceData.type || !deviceData.ip_address || !deviceData.mac_address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate device type
    const validTypes = ['plus_2pm', 'motion_2'];
    if (!validTypes.includes(deviceData.type)) {
      return NextResponse.json(
        { error: 'Invalid device type' },
        { status: 400 }
      );
    }
    
    // Create device
    const { data: device, error } = await supabase
      .from('devices')
      .insert({
        ...deviceData,
        user_id: user.id
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Log audit event
    await auditLog.deviceCreate(user.id, device.id, {
      name: device.name,
      type: device.type,
      ip_address: device.ip_address
    });
    
    return NextResponse.json(device, { status: 201 });
  } catch (error) {
    console.error('Failed to create device:', error);
    return NextResponse.json(
      { error: 'Failed to create device' },
      { status: 500 }
    );
  }
}