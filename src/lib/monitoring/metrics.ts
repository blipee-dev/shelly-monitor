import { register, Counter, Histogram, Gauge, Summary } from 'prom-client';

// HTTP request metrics
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status', 'handler'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5]
});

export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

// Device operation metrics
export const deviceOperations = new Counter({
  name: 'device_operations_total',
  help: 'Total number of device operations',
  labelNames: ['operation', 'device_type', 'status']
});

export const deviceResponseTime = new Histogram({
  name: 'device_response_time_seconds',
  help: 'Response time for device operations',
  labelNames: ['device_type', 'operation'],
  buckets: [0.1, 0.25, 0.5, 1, 2.5, 5, 10]
});

// Active devices gauge
export const activeDevices = new Gauge({
  name: 'active_devices',
  help: 'Number of active devices',
  labelNames: ['type', 'status']
});

// WebSocket connections
export const websocketConnections = new Gauge({
  name: 'websocket_connections',
  help: 'Number of active WebSocket connections'
});

// Database metrics
export const databaseQueryDuration = new Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries',
  labelNames: ['operation', 'table'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1]
});

export const databaseConnectionPool = new Gauge({
  name: 'database_connection_pool_size',
  help: 'Database connection pool metrics',
  labelNames: ['state'] // active, idle, waiting
});

// Cache metrics
export const cacheHits = new Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['cache_name']
});

export const cacheMisses = new Counter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses',
  labelNames: ['cache_name']
});

// Business metrics
export const powerConsumption = new Gauge({
  name: 'power_consumption_watts',
  help: 'Current power consumption in watts',
  labelNames: ['device_id', 'channel']
});

export const motionEvents = new Counter({
  name: 'motion_events_total',
  help: 'Total number of motion events',
  labelNames: ['device_id']
});

export const alertsTriggered = new Counter({
  name: 'alerts_triggered_total',
  help: 'Total number of alerts triggered',
  labelNames: ['alert_type', 'device_type']
});

// Error metrics
export const errorCount = new Counter({
  name: 'errors_total',
  help: 'Total number of errors',
  labelNames: ['type', 'code', 'handler']
});

// API metrics
export const apiCallsTotal = new Counter({
  name: 'api_calls_total',
  help: 'Total number of API calls',
  labelNames: ['endpoint', 'method', 'status', 'user_role']
});

export const apiLatency = new Summary({
  name: 'api_latency_seconds',
  help: 'API endpoint latency',
  labelNames: ['endpoint', 'method'],
  percentiles: [0.5, 0.9, 0.95, 0.99]
});

// Rate limiting metrics
export const rateLimitHits = new Counter({
  name: 'rate_limit_hits_total',
  help: 'Number of rate limit hits',
  labelNames: ['limiter', 'ip']
});

// Authentication metrics
export const authAttempts = new Counter({
  name: 'auth_attempts_total',
  help: 'Authentication attempts',
  labelNames: ['type', 'status'] // type: login/register, status: success/failure
});

export const activeSessions = new Gauge({
  name: 'active_sessions',
  help: 'Number of active user sessions'
});

// System metrics (automatically collected by prom-client)
import { collectDefaultMetrics } from 'prom-client';
collectDefaultMetrics({ prefix: 'shellymonitor_' });

// Helper functions for metric collection
export function recordHttpRequest(
  method: string,
  route: string,
  status: number,
  duration: number,
  handler?: string
) {
  httpRequestsTotal.labels(method, route, status.toString()).inc();
  httpRequestDuration.labels(method, route, status.toString(), handler || 'unknown').observe(duration);
}

export function recordDeviceOperation(
  operation: string,
  deviceType: string,
  status: 'success' | 'failure',
  duration?: number
) {
  deviceOperations.labels(operation, deviceType, status).inc();
  if (duration) {
    deviceResponseTime.labels(deviceType, operation).observe(duration);
  }
}

export function recordDatabaseQuery(
  operation: string,
  table: string,
  duration: number
) {
  databaseQueryDuration.labels(operation, table).observe(duration);
}

export function recordCacheOperation(cacheName: string, hit: boolean) {
  if (hit) {
    cacheHits.labels(cacheName).inc();
  } else {
    cacheMisses.labels(cacheName).inc();
  }
}

export function recordError(type: string, code: string, handler: string) {
  errorCount.labels(type, code, handler).inc();
}

export function recordApiCall(
  endpoint: string,
  method: string,
  status: number,
  userRole: string,
  latency: number
) {
  apiCallsTotal.labels(endpoint, method, status.toString(), userRole).inc();
  apiLatency.labels(endpoint, method).observe(latency);
}

export function recordAuthAttempt(type: 'login' | 'register', success: boolean) {
  authAttempts.labels(type, success ? 'success' : 'failure').inc();
}

export function recordRateLimit(limiter: string, ip: string) {
  rateLimitHits.labels(limiter, ip).inc();
}

// Export metrics for Prometheus endpoint
export function getMetrics(): Promise<string> {
  return register.metrics();
}

export function getContentType(): string {
  return register.contentType;
}