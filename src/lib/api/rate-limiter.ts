import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (req: NextRequest) => string;
  skip?: (req: NextRequest) => boolean;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      Object.keys(this.store).forEach(key => {
        if (this.store[key].resetTime < now) {
          delete this.store[key];
        }
      });
    }, 60000);
  }

  limit(config: RateLimitConfig): (req: NextRequest) => Promise<NextResponse | null> {
    return async (req: NextRequest) => {
      // Skip rate limiting if configured
      if (config.skip && config.skip(req)) {
        return null;
      }

      // Generate key for rate limiting
      const key = config.keyGenerator ? config.keyGenerator(req) : this.getDefaultKey(req);
      
      const now = Date.now();
      const windowStart = now - config.windowMs;

      // Get or create entry
      if (!this.store[key] || this.store[key].resetTime < now) {
        this.store[key] = {
          count: 1,
          resetTime: now + config.windowMs
        };
      } else {
        this.store[key].count++;
      }

      // Check if limit exceeded
      if (this.store[key].count > config.max) {
        const retryAfter = Math.ceil((this.store[key].resetTime - now) / 1000);
        
        return NextResponse.json(
          {
            error: {
              code: 'RATE_LIMITED',
              message: config.message || 'Too many requests, please try again later.',
              retryAfter
            }
          },
          {
            status: 429,
            headers: {
              'Retry-After': retryAfter.toString(),
              'X-RateLimit-Limit': config.max.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': new Date(this.store[key].resetTime).toISOString()
            }
          }
        );
      }

      // Add rate limit headers to successful responses
      const remaining = config.max - this.store[key].count;
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', config.max.toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      response.headers.set('X-RateLimit-Reset', new Date(this.store[key].resetTime).toISOString());

      return null;
    };
  }

  private getDefaultKey(req: NextRequest): string {
    // Try to get IP from various headers
    const headersList = headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';
    
    // Combine IP with path for more granular limiting
    return `${ip}:${req.nextUrl.pathname}`;
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Create singleton instance
export const rateLimiter = new RateLimiter();

// Pre-configured rate limiters
export const globalRateLimit = rateLimiter.limit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: 'Global rate limit exceeded'
});

export const authRateLimit = rateLimiter.limit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many authentication attempts'
});

export const apiRateLimit = rateLimiter.limit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  message: 'API rate limit exceeded'
});

export const controlRateLimit = rateLimiter.limit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
  message: 'Device control rate limit exceeded'
});

// Helper function to apply rate limiting in API routes
export async function withRateLimit(
  req: NextRequest,
  config: RateLimitConfig,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const limiter = rateLimiter.limit(config);
  const rateLimitResponse = await limiter(req);
  
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  
  return handler();
}