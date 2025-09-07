import { logger } from './logger';

/**
 * Error types for consistent error handling
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NETWORK = 'NETWORK',
  DATABASE = 'DATABASE',
  PAYMENT = 'PAYMENT',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Standard error response interface
 */
export interface ErrorResponse {
  success: false;
  error: {
    type: ErrorType;
    message: string;
    code?: string;
    details?: any;
    severity: ErrorSeverity;
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Error context for better debugging
 */
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  url?: string;
  userAgent?: string;
  timestamp: string;
}

/**
 * Base error class for application errors
 */
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly severity: ErrorSeverity;
  public readonly code?: string;
  public readonly details?: any;
  public readonly context?: ErrorContext;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    code?: string,
    details?: any,
    context?: ErrorContext,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.code = code;
    this.details = details;
    this.context = context;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  /**
   * Convert error to standard error response
   */
  toResponse(): ErrorResponse {
    return {
      success: false,
      error: {
        type: this.type,
        message: this.message,
        code: this.code,
        details: this.details,
        severity: this.severity,
        timestamp: this.context?.timestamp || new Date().toISOString(),
        requestId: this.context?.requestId,
      },
    };
  }

  /**
   * Log error with context
   */
  log(): void {
    const logData = {
      type: this.type,
      severity: this.severity,
      code: this.code,
      message: this.message,
      details: this.details,
      context: this.context,
      stack: this.stack,
    };

    switch (this.severity) {
      case ErrorSeverity.CRITICAL:
        logger.error(`[CRITICAL] ${this.message}`, logData);
        break;
      case ErrorSeverity.HIGH:
        logger.error(`[HIGH] ${this.message}`, logData);
        break;
      case ErrorSeverity.MEDIUM:
        logger.warn(`[MEDIUM] ${this.message}`, logData);
        break;
      case ErrorSeverity.LOW:
        logger.info(`[LOW] ${this.message}`, logData);
        break;
    }
  }
}

/**
 * Specific error classes for different error types
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: any, context?: ErrorContext) {
    super(message, ErrorType.VALIDATION, ErrorSeverity.LOW, 'VALIDATION_ERROR', details, context);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, ErrorType.AUTHENTICATION, ErrorSeverity.HIGH, 'AUTH_ERROR', undefined, context);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, ErrorType.AUTHORIZATION, ErrorSeverity.HIGH, 'FORBIDDEN', undefined, context);
  }
}

export class NetworkError extends AppError {
  constructor(message: string, details?: any, context?: ErrorContext) {
    super(message, ErrorType.NETWORK, ErrorSeverity.MEDIUM, 'NETWORK_ERROR', details, context);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: any, context?: ErrorContext) {
    super(message, ErrorType.DATABASE, ErrorSeverity.HIGH, 'DB_ERROR', details, context);
  }
}

export class PaymentError extends AppError {
  constructor(message: string, details?: any, context?: ErrorContext) {
    super(message, ErrorType.PAYMENT, ErrorSeverity.HIGH, 'PAYMENT_ERROR', details, context);
  }
}

/**
 * Error handler utility functions
 */
export class ErrorHandler {
  /**
   * Handle async operations with error catching
   */
  static async handleAsync<T>(
    operation: () => Promise<T>,
    context?: ErrorContext,
    fallback?: T
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const appError = this.normalizeError(error, context);
      appError.log();
      
      if (fallback !== undefined) {
        return fallback;
      }
      
      throw appError;
    }
  }

  /**
   * Handle sync operations with error catching
   */
  static handleSync<T>(
    operation: () => T,
    context?: ErrorContext,
    fallback?: T
  ): T {
    try {
      return operation();
    } catch (error) {
      const appError = this.normalizeError(error, context);
      appError.log();
      
      if (fallback !== undefined) {
        return fallback;
      }
      
      throw appError;
    }
  }

  /**
   * Normalize any error to AppError
   */
  static normalizeError(error: unknown, context?: ErrorContext): AppError {
    if (error instanceof AppError) {
      // If context is provided, merge it with existing context
      if (context) {
        const mergedContext = { ...error.context, ...context };
        return new AppError(
          error.message,
          error.type,
          error.severity,
          error.code,
          mergedContext
        );
      }
      return error;
    }

    if (error instanceof Error) {
      return new AppError(
        error.message,
        ErrorType.UNKNOWN,
        ErrorSeverity.MEDIUM,
        'UNKNOWN_ERROR',
        context
      );
    }

    if (typeof error === 'string') {
      return new AppError(
        error,
        ErrorType.UNKNOWN,
        ErrorSeverity.MEDIUM,
        'UNKNOWN_ERROR',
        context
      );
    }

    return new AppError(
      'An unknown error occurred',
      ErrorType.UNKNOWN,
      ErrorSeverity.MEDIUM,
      'UNKNOWN_ERROR',
      context
    );
  }

  /**
   * Create user-friendly error messages
   */
  static getUserFriendlyMessage(error: AppError): string {
    switch (error.type) {
      case ErrorType.VALIDATION:
        return 'Please check your input and try again.';
      case ErrorType.AUTHENTICATION:
        return 'Please sign in to continue.';
      case ErrorType.AUTHORIZATION:
        return 'You don\'t have permission to perform this action.';
      case ErrorType.NETWORK:
        return 'Network error. Please check your connection and try again.';
      case ErrorType.DATABASE:
        return 'Service temporarily unavailable. Please try again later.';
      case ErrorType.PAYMENT:
        return 'Payment error. Please check your payment details and try again.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }

  /**
   * Check if error should be reported to monitoring service
   */
  static shouldReport(error: AppError): boolean {
    return error.severity === ErrorSeverity.HIGH || error.severity === ErrorSeverity.CRITICAL;
  }

  /**
   * Generate request ID for error tracking
   */
  static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * React hook for error handling in components
 */
export const useErrorHandler = () => {
  const handleError = (error: unknown, context?: ErrorContext) => {
    const appError = ErrorHandler.normalizeError(error, context);
    appError.log();
    return appError;
  };

  const handleAsync = <T>(
    operation: () => Promise<T>,
    context?: ErrorContext,
    fallback?: T
  ): Promise<T> => {
    return ErrorHandler.handleAsync(operation, context, fallback);
  };

  return { handleError, handleAsync };
};

/**
 * Higher-order function for wrapping async operations
 */
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: ErrorContext
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError = ErrorHandler.normalizeError(error, context);
      appError.log();
      throw appError;
    }
  };
};

export default ErrorHandler;
