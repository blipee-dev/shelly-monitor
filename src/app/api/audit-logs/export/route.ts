import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

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
    
    // Parse filters from request body
    const filters = await request.json();
    
    // Build query
    let query = supabase
      .from('audit_logs')
      .select('*, users!user_id(email)');
    
    // Apply filters
    if (filters.eventType) {
      query = query.eq('event_type', filters.eventType);
    }
    
    if (filters.severity) {
      query = query.eq('severity', filters.severity);
    }
    
    if (filters.userId) {
      query = query.or(`user_id.eq.${filters.userId},users.email.ilike.%${filters.userId}%`);
    }
    
    if (filters.dateFrom) {
      query = query.gte('timestamp', filters.dateFrom);
    }
    
    if (filters.dateTo) {
      query = query.lte('timestamp', filters.dateTo);
    }
    
    if (filters.searchTerm) {
      query = query.or(`action.ilike.%${filters.searchTerm}%,details::text.ilike.%${filters.searchTerm}%`);
    }
    
    // Order by timestamp
    query = query.order('timestamp', { ascending: false });
    
    const { data: logs, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Convert to CSV
    const csv = convertToCSV(logs || []);
    
    // Return CSV file
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="audit-logs-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.csv"`
      }
    });
  } catch (error) {
    console.error('Failed to export audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to export audit logs' },
      { status: 500 }
    );
  }
}

function convertToCSV(logs: any[]): string {
  if (logs.length === 0) {
    return '';
  }
  
  // Define CSV headers
  const headers = [
    'Timestamp',
    'Event Type',
    'Severity',
    'User ID',
    'User Email',
    'Action',
    'Resource Type',
    'Resource ID',
    'IP Address',
    'User Agent',
    'Details'
  ];
  
  // Create CSV rows
  const rows = logs.map(log => [
    format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
    log.event_type,
    log.severity,
    log.user_id || '',
    log.users?.email || '',
    log.action,
    log.resource_type || '',
    log.resource_id || '',
    log.ip_address || '',
    log.user_agent || '',
    JSON.stringify(log.details || {})
  ]);
  
  // Escape CSV values
  const escapeCSV = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };
  
  // Build CSV string
  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n');
  
  return csvContent;
}