import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { globalRateLimit, authRateLimit, apiRateLimit, controlRateLimit } from '@/lib/api/rate-limiter';
import { auditLog } from '@/lib/audit';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/health',
  '/_next',
  '/favicon.ico',
];

// Define API routes that require special handling
const apiRoutes = ['/api'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply global rate limiting
  const globalLimitResponse = await globalRateLimit(request);
  if (globalLimitResponse) {
    // Log rate limit exceeded
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.ip;
    await auditLog.rateLimitExceeded(undefined, pathname, ipAddress || undefined);
    return globalLimitResponse;
  }

  // Apply specific rate limits based on path
  if (pathname.startsWith('/api/auth')) {
    const authLimitResponse = await authRateLimit(request);
    if (authLimitResponse) {
      const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.ip;
      await auditLog.rateLimitExceeded(undefined, pathname, ipAddress || undefined);
      return authLimitResponse;
    }
  } else if (pathname.includes('/control')) {
    const controlLimitResponse = await controlRateLimit(request);
    if (controlLimitResponse) {
      const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.ip;
      await auditLog.rateLimitExceeded(undefined, pathname, ipAddress || undefined);
      return controlLimitResponse;
    }
  } else if (pathname.startsWith('/api')) {
    const apiLimitResponse = await apiRateLimit(request);
    if (apiLimitResponse) {
      const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.ip;
      await auditLog.rateLimitExceeded(undefined, pathname, ipAddress || undefined);
      return apiLimitResponse;
    }
  }

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for authentication token
  const token = request.cookies.get('auth-token');
  
  // Redirect to login if no token on protected routes
  if (!token && !pathname.startsWith('/api')) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For API routes, return 401 if no token
  if (!token && pathname.startsWith('/api')) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Add security headers
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  
  // CORS headers for API routes
  if (pathname.startsWith('/api')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};