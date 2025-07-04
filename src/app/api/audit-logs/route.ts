import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '0');
    const limit = parseInt(searchParams.get('limit') || '25');
    const eventType = searchParams.get('eventType');
    const severity = searchParams.get('severity');
    const userId = searchParams.get('userId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const searchTerm = searchParams.get('searchTerm');
    
    // Build query
    let query = supabase
      .from('audit_logs')
      .select('*, users!user_id(email)', { count: 'exact' });
    
    // Apply filters
    if (eventType) {
      query = query.eq('event_type', eventType);
    }
    
    if (severity) {
      query = query.eq('severity', severity);
    }
    
    if (userId) {
      query = query.or(`user_id.eq.${userId},users.email.ilike.%${userId}%`);
    }
    
    if (dateFrom) {
      query = query.gte('timestamp', dateFrom);
    }
    
    if (dateTo) {
      query = query.lte('timestamp', dateTo);
    }
    
    if (searchTerm) {
      query = query.or(`action.ilike.%${searchTerm}%,details::text.ilike.%${searchTerm}%`);
    }
    
    // Apply pagination and ordering
    query = query
      .order('timestamp', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);
    
    const { data: logs, error, count } = await query;
    
    if (error) {
      throw error;
    }
    
    // Format response
    const formattedLogs = logs?.map(log => ({
      ...log,
      user_email: log.users?.email
    })) || [];
    
    return NextResponse.json({
      logs: formattedLogs,
      total: count || 0,
      page,
      limit
    });
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const auditEvent = await request.json();
    
    // Add server-side information
    const enrichedEvent = {
      ...auditEvent,
      user_id: user?.id || auditEvent.user_id,
      ip_address: request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  request.ip,
      user_agent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('audit_logs')
      .insert(enrichedEvent);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    return NextResponse.json(
      { error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}