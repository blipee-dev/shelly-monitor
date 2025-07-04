import { NextRequest, NextResponse } from 'next/server';
import { getMetrics, getContentType } from '@/lib/monitoring/metrics';

export async function GET(request: NextRequest) {
  // Check for authorization (you might want to use a different auth method for metrics)
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.METRICS_AUTH_TOKEN;
  
  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const metrics = await getMetrics();
    
    return new NextResponse(metrics, {
      status: 200,
      headers: {
        'Content-Type': getContentType(),
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to collect metrics' },
      { status: 500 }
    );
  }
}