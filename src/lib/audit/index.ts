import { createClient } from '@/lib/supabase/server';

export enum AuditEventType {
  // Authentication events
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_SIGNUP = 'USER_SIGNUP',
  PASSWORD_RESET = 'PASSWORD_RESET',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  
  // Device events
  DEVICE_CREATE = 'DEVICE_CREATE',
  DEVICE_UPDATE = 'DEVICE_UPDATE',
  DEVICE_DELETE = 'DEVICE_DELETE',
  DEVICE_CONTROL = 'DEVICE_CONTROL',
  DEVICE_STATUS_CHANGE = 'DEVICE_STATUS_CHANGE',
  
  // Alert events
  ALERT_CREATE = 'ALERT_CREATE',
  ALERT_ACKNOWLEDGE = 'ALERT_ACKNOWLEDGE',
  ALERT_RESOLVE = 'ALERT_RESOLVE',
  
  // Settings events
  SETTINGS_UPDATE = 'SETTINGS_UPDATE',
  FEATURE_FLAG_CHANGE = 'FEATURE_FLAG_CHANGE',
  
  // Data events
  DATA_EXPORT = 'DATA_EXPORT',
  DATA_IMPORT = 'DATA_IMPORT',
  
  // Security events
  PERMISSION_GRANT = 'PERMISSION_GRANT',
  PERMISSION_REVOKE = 'PERMISSION_REVOKE',
  API_KEY_CREATE = 'API_KEY_CREATE',
  API_KEY_REVOKE = 'API_KEY_REVOKE',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  
  // System events
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}

export enum AuditEventSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export interface AuditEvent {
  id?: string;
  event_type: AuditEventType;
  severity: AuditEventSeverity;
  user_id?: string;
  resource_type?: string;
  resource_id?: string;
  action: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

export interface AuditLogOptions {
  skipDatabase?: boolean;
  skipMetrics?: boolean;
  sensitive?: boolean;
}

class AuditLogger {
  private static instance: AuditLogger;
  private queue: AuditEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private maxQueueSize = 100;
  private flushIntervalMs = 5000;

  private constructor() {
    this.startFlushInterval();
  }

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  private startFlushInterval() {
    this.flushInterval = setInterval(() => {
      this.flush();
    }, this.flushIntervalMs);
  }

  private async flush() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('audit_logs')
        .insert(events);

      if (error) {
        console.error('Failed to write audit logs:', error);
        // Re-queue events on failure (with limit to prevent memory issues)
        if (this.queue.length < this.maxQueueSize * 2) {
          this.queue.unshift(...events.slice(0, this.maxQueueSize));
        }
      }
    } catch (error) {
      console.error('Failed to flush audit logs:', error);
    }
  }

  async log(event: AuditEvent, options: AuditLogOptions = {}) {
    try {
      // Add timestamp if not provided
      if (!event.timestamp) {
        event.timestamp = new Date();
      }

      // Sanitize sensitive data if needed
      if (options.sensitive) {
        event = this.sanitizeEvent(event);
      }

      // Add to metrics if enabled
      if (!options.skipMetrics) {
        this.recordMetrics(event);
      }

      // Skip database write if requested (e.g., for high-frequency events)
      if (options.skipDatabase) {
        console.log('Audit event (skip DB):', event);
        return;
      }

      // Add to queue
      this.queue.push(event);

      // Flush immediately if queue is full
      if (this.queue.length >= this.maxQueueSize) {
        await this.flush();
      }
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }

  private sanitizeEvent(event: AuditEvent): AuditEvent {
    const sanitized = { ...event };
    
    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
    
    if (sanitized.details) {
      sanitized.details = this.sanitizeObject(sanitized.details, sensitiveFields);
    }
    
    if (sanitized.metadata) {
      sanitized.metadata = this.sanitizeObject(sanitized.metadata, sensitiveFields);
    }
    
    return sanitized;
  }

  private sanitizeObject(obj: Record<string, any>, sensitiveFields: string[]): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = sensitiveFields.some(field => lowerKey.includes(field));
      
      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value, sensitiveFields);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  private recordMetrics(event: AuditEvent) {
    // In a real implementation, you would send metrics to Prometheus
    // For now, we'll just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Audit metric:', {
        event_type: event.event_type,
        severity: event.severity,
        user_id: event.user_id
      });
    }
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    this.flush();
  }
}

// Export singleton instance
export const auditLogger = AuditLogger.getInstance();

// Convenience functions for common audit events
export const auditLog = {
  // Authentication
  userLogin: (userId: string, ipAddress?: string, metadata?: Record<string, any>) => {
    return auditLogger.log({
      event_type: AuditEventType.USER_LOGIN,
      severity: AuditEventSeverity.INFO,
      user_id: userId,
      action: 'User logged in',
      ip_address: ipAddress,
      metadata
    });
  },

  userLogout: (userId: string) => {
    return auditLogger.log({
      event_type: AuditEventType.USER_LOGOUT,
      severity: AuditEventSeverity.INFO,
      user_id: userId,
      action: 'User logged out'
    });
  },

  // Device operations
  deviceCreate: (userId: string, deviceId: string, deviceData: any) => {
    return auditLogger.log({
      event_type: AuditEventType.DEVICE_CREATE,
      severity: AuditEventSeverity.INFO,
      user_id: userId,
      resource_type: 'device',
      resource_id: deviceId,
      action: 'Device created',
      details: deviceData
    });
  },

  deviceUpdate: (userId: string, deviceId: string, changes: any) => {
    return auditLogger.log({
      event_type: AuditEventType.DEVICE_UPDATE,
      severity: AuditEventSeverity.INFO,
      user_id: userId,
      resource_type: 'device',
      resource_id: deviceId,
      action: 'Device updated',
      details: { changes }
    });
  },

  deviceDelete: (userId: string, deviceId: string, deviceName?: string) => {
    return auditLogger.log({
      event_type: AuditEventType.DEVICE_DELETE,
      severity: AuditEventSeverity.WARNING,
      user_id: userId,
      resource_type: 'device',
      resource_id: deviceId,
      action: 'Device deleted',
      details: { device_name: deviceName }
    });
  },

  deviceControl: (userId: string, deviceId: string, action: string, details?: any) => {
    return auditLogger.log({
      event_type: AuditEventType.DEVICE_CONTROL,
      severity: AuditEventSeverity.INFO,
      user_id: userId,
      resource_type: 'device',
      resource_id: deviceId,
      action: `Device control: ${action}`,
      details
    }, { skipDatabase: true }); // Skip DB for high-frequency events
  },

  // Security events
  suspiciousActivity: (userId?: string, activity: string, details?: any) => {
    return auditLogger.log({
      event_type: AuditEventType.SUSPICIOUS_ACTIVITY,
      severity: AuditEventSeverity.WARNING,
      user_id: userId,
      action: activity,
      details
    });
  },

  rateLimitExceeded: (userId?: string, endpoint: string, ipAddress?: string) => {
    return auditLogger.log({
      event_type: AuditEventType.RATE_LIMIT_EXCEEDED,
      severity: AuditEventSeverity.WARNING,
      user_id: userId,
      action: 'Rate limit exceeded',
      details: { endpoint },
      ip_address: ipAddress
    });
  },

  // System events
  systemError: (error: Error, context?: any) => {
    return auditLogger.log({
      event_type: AuditEventType.SYSTEM_ERROR,
      severity: AuditEventSeverity.ERROR,
      action: 'System error occurred',
      details: {
        error_message: error.message,
        error_stack: error.stack,
        context
      }
    });
  }
};

// Middleware for Express/Next.js to automatically log API requests
export function auditMiddleware(request: Request, eventType?: AuditEventType) {
  return async (userId?: string) => {
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname;
    
    await auditLogger.log({
      event_type: eventType || AuditEventType.SYSTEM_ERROR,
      severity: AuditEventSeverity.INFO,
      user_id: userId,
      action: `${method} ${path}`,
      details: {
        method,
        path,
        query: Object.fromEntries(url.searchParams)
      },
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      user_agent: request.headers.get('user-agent') || undefined
    });
  };
}