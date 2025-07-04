import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    database?: {
      status: 'ok' | 'error';
      latency?: number;
      error?: string;
    };
    cache?: {
      status: 'ok' | 'error';
      latency?: number;
      error?: string;
    };
    external?: {
      status: 'ok' | 'error';
      latency?: number;
      error?: string;
    };
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

async function checkDatabase(): Promise<{ status: 'ok' | 'error'; latency?: number; error?: string }> {
  const start = Date.now();
  try {
    // TODO: Implement actual database check
    // const { data, error } = await supabase.from('devices').select('count').single();
    const latency = Date.now() - start;
    return { status: 'ok', latency };
  } catch (error) {
    return { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function checkCache(): Promise<{ status: 'ok' | 'error'; latency?: number; error?: string }> {
  const start = Date.now();
  try {
    // TODO: Implement actual cache check (Redis/memory cache)
    const latency = Date.now() - start;
    return { status: 'ok', latency };
  } catch (error) {
    return { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function checkExternalServices(): Promise<{ status: 'ok' | 'error'; latency?: number; error?: string }> {
  const start = Date.now();
  try {
    // TODO: Check if we can reach Shelly devices
    const latency = Date.now() - start;
    return { status: 'ok', latency };
  } catch (error) {
    return { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function GET(request: Request) {
  const headersList = headers();
  const startTime = process.hrtime();
  
  // Check if this is a simple liveness check
  const isLiveness = new URL(request.url).searchParams.get('type') === 'liveness';
  
  if (isLiveness) {
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  }
  
  // Perform comprehensive health checks
  const [dbCheck, cacheCheck, externalCheck] = await Promise.allSettled([
    checkDatabase(),
    checkCache(),
    checkExternalServices(),
  ]);
  
  const memory = process.memoryUsage();
  const memoryUsage = {
    used: Math.round(memory.heapUsed / 1024 / 1024),
    total: Math.round(memory.heapTotal / 1024 / 1024),
    percentage: Math.round((memory.heapUsed / memory.heapTotal) * 100),
  };
  
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: dbCheck.status === 'fulfilled' ? dbCheck.value : { status: 'error', error: 'Check failed' },
      cache: cacheCheck.status === 'fulfilled' ? cacheCheck.value : { status: 'error', error: 'Check failed' },
      external: externalCheck.status === 'fulfilled' ? externalCheck.value : { status: 'error', error: 'Check failed' },
    },
    memory: memoryUsage,
  };
  
  // Determine overall health status
  const failedChecks = Object.values(health.checks).filter(check => check?.status === 'error').length;
  if (failedChecks > 1) {
    health.status = 'unhealthy';
  } else if (failedChecks === 1) {
    health.status = 'degraded';
  }
  
  // Set appropriate status code
  const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;
  
  return NextResponse.json(health, { 
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Health-Status': health.status,
    }
  });
}

// Ready check endpoint
export async function POST(request: Request) {
  try {
    // Check if all required services are ready
    const dbCheck = await checkDatabase();
    const cacheCheck = await checkCache();
    
    if (dbCheck.status === 'ok' && cacheCheck.status === 'ok') {
      return NextResponse.json(
        { 
          status: 'ready',
          checks: {
            database: 'ok',
            cache: 'ok',
          }
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          status: 'not ready',
          checks: {
            database: dbCheck.status,
            cache: cacheCheck.status,
          }
        },
        { status: 503 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 503 }
    );
  }
}