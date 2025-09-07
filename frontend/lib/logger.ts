/**
 * Production-ready logging utility
 * Replaces console.log statements with proper logging levels
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

interface LogConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
}

class Logger {
  private config: LogConfig;

  constructor() {
    this.config = {
      level: process.env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.DEBUG,
      enableConsole: process.env.NODE_ENV !== 'production',
      enableRemote: process.env.NODE_ENV === 'production',
      remoteEndpoint: process.env.LOG_ENDPOINT
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}]`;
    
    if (data) {
      return `${prefix} ${message} ${JSON.stringify(data, null, 2)}`;
    }
    
    return `${prefix} ${message}`;
  }

  private async sendToRemote(level: string, message: string, data?: any) {
    if (!this.config.enableRemote || !this.config.remoteEndpoint) {
      return;
    }

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level,
          message,
          data,
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV,
        }),
      });
    } catch (error) {
      // Fallback to console if remote logging fails
      if (this.config.enableConsole) {
        console.error('Failed to send log to remote:', error);
      }
    }
  }

  debug(message: string, data?: any) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const formattedMessage = this.formatMessage('DEBUG', message, data);
      
      if (this.config.enableConsole) {
        console.debug(formattedMessage);
      }
      
      this.sendToRemote('DEBUG', message, data);
    }
  }

  info(message: string, data?: any) {
    if (this.shouldLog(LogLevel.INFO)) {
      const formattedMessage = this.formatMessage('INFO', message, data);
      
      if (this.config.enableConsole) {
        console.info(formattedMessage);
      }
      
      this.sendToRemote('INFO', message, data);
    }
  }

  warn(message: string, data?: any) {
    if (this.shouldLog(LogLevel.WARN)) {
      const formattedMessage = this.formatMessage('WARN', message, data);
      
      if (this.config.enableConsole) {
        console.warn(formattedMessage);
      }
      
      this.sendToRemote('WARN', message, data);
    }
  }

  error(message: string, data?: any) {
    if (this.shouldLog(LogLevel.ERROR)) {
      const formattedMessage = this.formatMessage('ERROR', message, data);
      
      if (this.config.enableConsole) {
        console.error(formattedMessage);
      }
      
      this.sendToRemote('ERROR', message, data);
    }
  }

  // Specialized logging methods for common use cases
  payment(message: string, data?: any) {
    this.info(`[PAYMENT] ${message}`, data);
  }

  auth(message: string, data?: any) {
    this.info(`[AUTH] ${message}`, data);
  }

  database(message: string, data?: any) {
    this.info(`[DATABASE] ${message}`, data);
  }

  api(message: string, data?: any) {
    this.info(`[API] ${message}`, data);
  }

  // Configure logger
  configure(config: Partial<LogConfig>) {
    this.config = { ...this.config, ...config };
  }
}

// Export singleton instance
export const logger = new Logger();

// Export individual methods for convenience
export const { debug, info, warn, error, payment, auth, database, api } = logger;
