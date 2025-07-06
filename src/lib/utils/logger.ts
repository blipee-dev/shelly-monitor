/**
 * Logger utility for consistent logging throughout the application
 * In production, only warnings and errors are logged
 * In development, all log levels are shown
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;

  private formatMessage(level: string, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  debug(message: string, ...args: any[]) {
    if (this.logLevel <= LogLevel.DEBUG) {
      console.log(this.formatMessage('DEBUG', message), ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (this.logLevel <= LogLevel.INFO) {
      console.log(this.formatMessage('INFO', message), ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    if (this.logLevel <= LogLevel.WARN) {
      console.warn(this.formatMessage('WARN', message), ...args);
    }
  }

  error(message: string, error?: Error | unknown, ...args: any[]) {
    if (this.logLevel <= LogLevel.ERROR) {
      console.error(this.formatMessage('ERROR', message), error, ...args);
    }
  }

  // Group related logs
  group(label: string) {
    if (this.isDevelopment && console.group) {
      console.group(label);
    }
  }

  groupEnd() {
    if (this.isDevelopment && console.groupEnd) {
      console.groupEnd();
    }
  }

  // Table logging for development
  table(data: any) {
    if (this.isDevelopment && console.table) {
      console.table(data);
    }
  }

  // Performance timing
  time(label: string) {
    if (this.isDevelopment && console.time) {
      console.time(label);
    }
  }

  timeEnd(label: string) {
    if (this.isDevelopment && console.timeEnd) {
      console.timeEnd(label);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export for backwards compatibility
export default logger;