import { NextRequest, NextResponse } from 'next/server';
import { RateLimiter, withRateLimit } from '@/lib/api/rate-limiter';

// Mock NextRequest
function createMockRequest(pathname: string): NextRequest {
  return {
    nextUrl: { pathname },
    headers: new Headers({
      'x-forwarded-for': '127.0.0.1'
    })
  } as unknown as NextRequest;
}

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter();
  });

  afterEach(() => {
    rateLimiter.destroy();
  });

  describe('limit', () => {
    it('should allow requests within limit', async () => {
      const config = {
        windowMs: 60000,
        max: 5
      };
      
      const limiter = rateLimiter.limit(config);
      const req = createMockRequest('/api/test');
      
      // Make 5 requests (within limit)
      for (let i = 0; i < 5; i++) {
        const response = await limiter(req);
        expect(response).toBeNull();
      }
    });

    it('should block requests exceeding limit', async () => {
      const config = {
        windowMs: 60000,
        max: 2
      };
      
      const limiter = rateLimiter.limit(config);
      const req = createMockRequest('/api/test');
      
      // Make 2 requests (within limit)
      for (let i = 0; i < 2; i++) {
        const response = await limiter(req);
        expect(response).toBeNull();
      }
      
      // Make 3rd request (should be blocked)
      const response = await limiter(req);
      expect(response).toBeInstanceOf(NextResponse);
      expect(response?.status).toBe(429);
    });

    it('should reset after window expires', async () => {
      jest.useFakeTimers();
      
      const config = {
        windowMs: 1000, // 1 second window
        max: 1
      };
      
      const limiter = rateLimiter.limit(config);
      const req = createMockRequest('/api/test');
      
      // First request should pass
      let response = await limiter(req);
      expect(response).toBeNull();
      
      // Second request should be blocked
      response = await limiter(req);
      expect(response?.status).toBe(429);
      
      // Advance time past window
      jest.advanceTimersByTime(1100);
      
      // Request should pass again
      response = await limiter(req);
      expect(response).toBeNull();
      
      jest.useRealTimers();
    });

    it('should skip rate limiting when configured', async () => {
      const config = {
        windowMs: 60000,
        max: 1,
        skip: (req: NextRequest) => req.nextUrl.pathname === '/api/health'
      };
      
      const limiter = rateLimiter.limit(config);
      const healthReq = createMockRequest('/api/health');
      const normalReq = createMockRequest('/api/test');
      
      // Health check should always pass
      for (let i = 0; i < 5; i++) {
        const response = await limiter(healthReq);
        expect(response).toBeNull();
      }
      
      // Normal request should be limited
      let response = await limiter(normalReq);
      expect(response).toBeNull();
      
      response = await limiter(normalReq);
      expect(response?.status).toBe(429);
    });

    it('should use custom key generator', async () => {
      const config = {
        windowMs: 60000,
        max: 2,
        keyGenerator: (req: NextRequest) => req.nextUrl.pathname
      };
      
      const limiter = rateLimiter.limit(config);
      const req1 = createMockRequest('/api/test1');
      const req2 = createMockRequest('/api/test2');
      
      // Different paths should have separate limits
      for (let i = 0; i < 2; i++) {
        let response = await limiter(req1);
        expect(response).toBeNull();
        
        response = await limiter(req2);
        expect(response).toBeNull();
      }
      
      // Both should now be limited
      let response = await limiter(req1);
      expect(response?.status).toBe(429);
      
      response = await limiter(req2);
      expect(response?.status).toBe(429);
    });
  });

  describe('withRateLimit', () => {
    it('should execute handler when within limit', async () => {
      const config = {
        windowMs: 60000,
        max: 5
      };
      
      const req = createMockRequest('/api/test');
      const handler = jest.fn().mockResolvedValue(new NextResponse('Success'));
      
      const response = await withRateLimit(req, config, handler);
      
      expect(handler).toHaveBeenCalled();
      expect(await response.text()).toBe('Success');
    });

    it('should return rate limit response when exceeded', async () => {
      const config = {
        windowMs: 60000,
        max: 1
      };
      
      const req = createMockRequest('/api/test');
      const handler = jest.fn().mockResolvedValue(new NextResponse('Success'));
      
      // First request should succeed
      await withRateLimit(req, config, handler);
      expect(handler).toHaveBeenCalledTimes(1);
      
      // Second request should be rate limited
      const response = await withRateLimit(req, config, handler);
      expect(handler).toHaveBeenCalledTimes(1); // Not called again
      expect(response.status).toBe(429);
    });
  });

  describe('rate limit headers', () => {
    it('should include rate limit headers in responses', async () => {
      const config = {
        windowMs: 60000,
        max: 5
      };
      
      const limiter = rateLimiter.limit(config);
      const req = createMockRequest('/api/test');
      
      // Make a request
      const response = await limiter(req);
      
      // Should return NextResponse.next() with headers
      expect(response).toBeInstanceOf(NextResponse);
      expect(response?.headers.get('X-RateLimit-Limit')).toBe('5');
      expect(response?.headers.get('X-RateLimit-Remaining')).toBe('4');
      expect(response?.headers.get('X-RateLimit-Reset')).toBeTruthy();
    });

    it('should include retry-after header when rate limited', async () => {
      const config = {
        windowMs: 60000,
        max: 1
      };
      
      const limiter = rateLimiter.limit(config);
      const req = createMockRequest('/api/test');
      
      // Exhaust limit
      await limiter(req);
      
      // Get rate limited response
      const response = await limiter(req);
      
      expect(response?.status).toBe(429);
      expect(response?.headers.get('Retry-After')).toBeTruthy();
      expect(parseInt(response?.headers.get('Retry-After') || '0')).toBeGreaterThan(0);
    });
  });
});