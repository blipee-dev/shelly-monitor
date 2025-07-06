import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ExportManager } from '@/lib/backup/export-manager';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const includeDevices = searchParams.get('devices') !== 'false';
    const includeAutomations = searchParams.get('automations') !== 'false';
    const includeScenes = searchParams.get('scenes') !== 'false';
    const includeSettings = searchParams.get('settings') !== 'false';

    // Export data
    const exportData = await ExportManager.exportData({
      includeDevices,
      includeAutomations,
      includeScenes,
      includeSettings,
      format: format as 'json' | 'csv',
    });

    if (format === 'csv') {
      // Return CSV for devices only
      const csv = ExportManager['convertToCSV'](exportData.data.devices);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="shelly-devices-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // Return JSON
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="shelly-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    console.error('Export failed:', error);
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    );
  }
}