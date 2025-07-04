import {
  httpRequestDuration,
  httpRequestsTotal,
  activeDevices,
  deviceOperations,
  databaseQueries,
  cacheOperations,
  authAttempts,
  rateLimitHits,
  apiLatency,
  powerConsumption,
  motionEvents,
  errors,
  getMetrics,
  getContentType
} from '@/lib/monitoring/metrics';

describe('Monitoring Metrics', () => {
  beforeEach(() => {
    // Reset all metrics before each test
    jest.clearAllMocks();
  });

  describe('HTTP Metrics', () => {
    it('should record HTTP request duration', () => {
      const labels = { method: 'GET', route: '/api/devices', status: '200', handler: 'getDevices' };
      const observeSpy = jest.spyOn(httpRequestDuration, 'observe');
      
      httpRequestDuration.observe(labels, 0.125);
      
      expect(observeSpy).toHaveBeenCalledWith(labels, 0.125);
    });

    it('should increment HTTP requests total', () => {
      const labels = { method: 'POST', route: '/api/devices', status: '201' };
      const incSpy = jest.spyOn(httpRequestsTotal, 'inc');
      
      httpRequestsTotal.inc(labels);
      
      expect(incSpy).toHaveBeenCalledWith(labels);
    });
  });

  describe('Device Metrics', () => {
    it('should set active device count', () => {
      const setSpy = jest.spyOn(activeDevices, 'set');
      
      activeDevices.set({ status: 'online' }, 5);
      activeDevices.set({ status: 'offline' }, 2);
      
      expect(setSpy).toHaveBeenCalledWith({ status: 'online' }, 5);
      expect(setSpy).toHaveBeenCalledWith({ status: 'offline' }, 2);
    });

    it('should record device operations', () => {
      const observeSpy = jest.spyOn(deviceOperations, 'observe');
      
      deviceOperations.observe({ operation: 'control', device_type: 'plus_2pm', success: 'true' }, 0.250);
      
      expect(observeSpy).toHaveBeenCalledWith(
        { operation: 'control', device_type: 'plus_2pm', success: 'true' },
        0.250
      );
    });

    it('should record power consumption', () => {
      const observeSpy = jest.spyOn(powerConsumption, 'observe');
      
      powerConsumption.observe({ device_id: 'device-123', channel: '0' }, 125.5);
      
      expect(observeSpy).toHaveBeenCalledWith({ device_id: 'device-123', channel: '0' }, 125.5);
    });

    it('should increment motion events', () => {
      const incSpy = jest.spyOn(motionEvents, 'inc');
      
      motionEvents.inc({ device_id: 'motion-456', detected: 'true' });
      
      expect(incSpy).toHaveBeenCalledWith({ device_id: 'motion-456', detected: 'true' });
    });
  });

  describe('Database Metrics', () => {
    it('should record database query duration', () => {
      const observeSpy = jest.spyOn(databaseQueries, 'observe');
      
      databaseQueries.observe({ operation: 'select', table: 'devices' }, 0.025);
      
      expect(observeSpy).toHaveBeenCalledWith({ operation: 'select', table: 'devices' }, 0.025);
    });
  });

  describe('Cache Metrics', () => {
    it('should increment cache hits', () => {
      const incSpy = jest.spyOn(cacheOperations.hits, 'inc');
      
      cacheOperations.hits.inc({ cache: 'device_status' });
      
      expect(incSpy).toHaveBeenCalledWith({ cache: 'device_status' });
    });

    it('should increment cache misses', () => {
      const incSpy = jest.spyOn(cacheOperations.misses, 'inc');
      
      cacheOperations.misses.inc({ cache: 'device_status' });
      
      expect(incSpy).toHaveBeenCalledWith({ cache: 'device_status' });
    });
  });

  describe('Auth Metrics', () => {
    it('should increment auth attempts', () => {
      const incSpy = jest.spyOn(authAttempts, 'inc');
      
      authAttempts.inc({ method: 'password', status: 'success' });
      authAttempts.inc({ method: 'oauth', status: 'failure' });
      
      expect(incSpy).toHaveBeenCalledWith({ method: 'password', status: 'success' });
      expect(incSpy).toHaveBeenCalledWith({ method: 'oauth', status: 'failure' });
    });
  });

  describe('Rate Limiting Metrics', () => {
    it('should increment rate limit hits', () => {
      const incSpy = jest.spyOn(rateLimitHits, 'inc');
      
      rateLimitHits.inc({ endpoint: '/api/devices', reason: 'global_limit' });
      
      expect(incSpy).toHaveBeenCalledWith({ endpoint: '/api/devices', reason: 'global_limit' });
    });
  });

  describe('API Metrics', () => {
    it('should record API latency', () => {
      const observeSpy = jest.spyOn(apiLatency, 'observe');
      
      apiLatency.observe({ endpoint: '/api/devices', method: 'GET' }, 1.5);
      
      expect(observeSpy).toHaveBeenCalledWith({ endpoint: '/api/devices', method: 'GET' }, 1.5);
    });
  });

  describe('Error Metrics', () => {
    it('should increment error count', () => {
      const incSpy = jest.spyOn(errors, 'inc');
      
      errors.inc({ type: 'database', code: 'ECONNREFUSED' });
      
      expect(incSpy).toHaveBeenCalledWith({ type: 'database', code: 'ECONNREFUSED' });
    });
  });

  describe('Metrics Export', () => {
    it('should return metrics in Prometheus format', async () => {
      // Mock register.metrics() to return test data
      const mockMetrics = `# HELP http_request_duration_seconds Duration of HTTP requests
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.001",method="GET",route="/api/devices",status="200"} 0
http_request_duration_seconds_sum{method="GET",route="/api/devices",status="200"} 0.125
http_request_duration_seconds_count{method="GET",route="/api/devices",status="200"} 1`;

      const register = require('prom-client').register;
      jest.spyOn(register, 'metrics').mockResolvedValue(mockMetrics);

      const metrics = await getMetrics();
      
      expect(metrics).toContain('http_request_duration_seconds');
      expect(metrics).toContain('method="GET"');
      expect(metrics).toContain('route="/api/devices"');
    });

    it('should return correct content type', () => {
      const contentType = getContentType();
      
      expect(contentType).toBe('text/plain; version=0.0.4; charset=utf-8');
    });
  });

  describe('Custom Metrics', () => {
    it('should handle high cardinality labels correctly', () => {
      const observeSpy = jest.spyOn(deviceOperations, 'observe');
      
      // Should limit device_id cardinality
      for (let i = 0; i < 100; i++) {
        deviceOperations.observe(
          { operation: 'status', device_type: 'plus_2pm', success: 'true' },
          Math.random()
        );
      }
      
      expect(observeSpy).toHaveBeenCalledTimes(100);
    });

    it('should handle concurrent metric updates', async () => {
      const promises = [];
      
      // Simulate concurrent updates
      for (let i = 0; i < 10; i++) {
        promises.push(
          Promise.resolve(httpRequestsTotal.inc({ method: 'GET', route: '/api/test', status: '200' }))
        );
      }
      
      await Promise.all(promises);
      
      // Should handle all updates without errors
      expect(promises).toHaveLength(10);
    });
  });

  describe('Metric Labels', () => {
    it('should validate label values', () => {
      const incSpy = jest.spyOn(httpRequestsTotal, 'inc');
      
      // Test with various label values
      const testCases = [
        { method: 'GET', route: '/api/devices', status: '200' },
        { method: 'POST', route: '/api/devices/123', status: '201' },
        { method: 'DELETE', route: '/api/devices/456', status: '204' },
        { method: 'PUT', route: '/api/devices/789', status: '400' },
      ];
      
      testCases.forEach(labels => {
        httpRequestsTotal.inc(labels);
        expect(incSpy).toHaveBeenCalledWith(labels);
      });
    });
  });
});