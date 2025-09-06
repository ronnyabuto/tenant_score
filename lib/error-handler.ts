// Centralized error handling utilities
export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  DUPLICATE_ENTRY = "DUPLICATE_ENTRY",
  EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  FILE_UPLOAD_ERROR = "FILE_UPLOAD_ERROR",
  RATE_LIMIT_ERROR = "RATE_LIMIT_ERROR",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export interface AppError {
  code: ErrorCode
  message: string
  details?: any
  statusCode: number
  timestamp: string
  requestId?: string
}

export class TenantScoreError extends Error {
  public readonly code: ErrorCode
  public readonly statusCode: number
  public readonly details?: any
  public readonly timestamp: string
  public readonly requestId?: string

  constructor(code: ErrorCode, message: string, statusCode = 500, details?: any, requestId?: string) {
    super(message)
    this.name = "TenantScoreError"
    this.code = code
    this.statusCode = statusCode
    this.details = details
    this.timestamp = new Date().toISOString()
    this.requestId = requestId
  }

  toJSON(): AppError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      requestId: this.requestId,
    }
  }
}

// Error factory functions
export const createValidationError = (message: string, details?: any): TenantScoreError => {
  return new TenantScoreError(ErrorCode.VALIDATION_ERROR, message, 400, details)
}

export const createAuthenticationError = (message = "Authentication required"): TenantScoreError => {
  return new TenantScoreError(ErrorCode.AUTHENTICATION_ERROR, message, 401)
}

export const createAuthorizationError = (message = "Insufficient permissions"): TenantScoreError => {
  return new TenantScoreError(ErrorCode.AUTHORIZATION_ERROR, message, 403)
}

export const createNotFoundError = (resource: string): TenantScoreError => {
  return new TenantScoreError(ErrorCode.NOT_FOUND, `${resource} not found`, 404)
}

export const createDuplicateError = (resource: string): TenantScoreError => {
  return new TenantScoreError(ErrorCode.DUPLICATE_ENTRY, `${resource} already exists`, 409)
}

export const createExternalServiceError = (service: string, details?: any): TenantScoreError => {
  return new TenantScoreError(ErrorCode.EXTERNAL_SERVICE_ERROR, `External service error: ${service}`, 502, details)
}

// Error response formatter
export const formatErrorResponse = (error: unknown, requestId?: string): AppError => {
  if (error instanceof TenantScoreError) {
    return error.toJSON()
  }

  if (error instanceof Error) {
    return {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: error.message || "An unexpected error occurred",
      statusCode: 500,
      timestamp: new Date().toISOString(),
      requestId,
    }
  }

  return {
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    message: "An unexpected error occurred",
    statusCode: 500,
    timestamp: new Date().toISOString(),
    requestId,
  }
}

// User-friendly error messages
export const getUserFriendlyMessage = (error: AppError): string => {
  switch (error.code) {
    case ErrorCode.VALIDATION_ERROR:
      return "Please check your input and try again."

    case ErrorCode.AUTHENTICATION_ERROR:
      return "Please log in to continue."

    case ErrorCode.AUTHORIZATION_ERROR:
      return "You don't have permission to perform this action."

    case ErrorCode.NOT_FOUND:
      return "The requested information could not be found."

    case ErrorCode.DUPLICATE_ENTRY:
      return "This information already exists in our system."

    case ErrorCode.EXTERNAL_SERVICE_ERROR:
      return "We're experiencing connectivity issues. Please try again later."

    case ErrorCode.DATABASE_ERROR:
      return "We're experiencing technical difficulties. Please try again later."

    case ErrorCode.FILE_UPLOAD_ERROR:
      return "File upload failed. Please check your file and try again."

    case ErrorCode.RATE_LIMIT_ERROR:
      return "Too many requests. Please wait a moment and try again."

    default:
      return "Something went wrong. Please try again later."
  }
}

// Logging utility
export const logError = (error: unknown, context?: Record<string, any>): void => {
  const timestamp = new Date().toISOString()
  const errorInfo = {
    timestamp,
    error:
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : error,
    context,
  }

  // In production, send to logging service (e.g., Sentry, LogRocket)
  console.error("TenantScore Error:", JSON.stringify(errorInfo, null, 2))
}
