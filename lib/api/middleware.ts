import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "../auth"
import type { User } from "@/lib/auth/types"

export interface ApiError {
  code: string
  message: string
  details?: any
  statusCode: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
  timestamp: string
  requestId: string
}

export class ApiErrorHandler {
  static createError(code: string, message: string, statusCode: number, details?: any): ApiError {
    return { code, message, statusCode, details }
  }

  static validation(message: string, details?: any): ApiError {
    return this.createError("VALIDATION_ERROR", message, 400, details)
  }

  static unauthorized(message = "Authorization required"): ApiError {
    return this.createError("UNAUTHORIZED", message, 401)
  }

  static forbidden(message = "Access denied"): ApiError {
    return this.createError("FORBIDDEN", message, 403)
  }

  static notFound(message = "Resource not found"): ApiError {
    return this.createError("NOT_FOUND", message, 404)
  }

  static internal(message = "Internal server error"): ApiError {
    return this.createError("INTERNAL_ERROR", message, 500)
  }

  static external(message = "External service error"): ApiError {
    return this.createError("EXTERNAL_ERROR", message, 502)
  }
}

export class ApiResponseBuilder {
  static success<T>(data: T, requestId: string): NextResponse {
    const response: ApiResponse<T> = {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      requestId,
    }
    return NextResponse.json(response)
  }

  static error(error: ApiError, requestId: string): NextResponse {
    const response: ApiResponse = {
      success: false,
      error,
      timestamp: new Date().toISOString(),
      requestId,
    }

    // Log error for monitoring
    console.error(`API Error [${requestId}]:`, {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
    })

    return NextResponse.json(response, { status: error.statusCode })
  }
}

export interface AuthContext {
  user: User
  token: string
}

export interface RequestContext {
  requestId: string
  startTime: number
  ip: string
  userAgent: string
}

export class ApiMiddleware {
  static generateRequestId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  }

  static createContext(request: NextRequest): RequestContext {
    return {
      requestId: this.generateRequestId(),
      startTime: Date.now(),
      ip: request.ip || request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    }
  }

  static async authenticate(request: NextRequest, context: RequestContext): Promise<AuthContext> {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      throw ApiErrorHandler.unauthorized("Authorization token required")
    }

    const user = await verifyToken(token)
    if (!user) {
      throw ApiErrorHandler.unauthorized("Invalid or expired token")
    }

    return { user, token }
  }

  static authorize(auth: AuthContext, requiredRole: "admin" | "landlord" | "tenant" | "any"): void {
    if (requiredRole === "any") return

    if (auth.user.userType !== requiredRole) {
      throw ApiErrorHandler.forbidden(`${requiredRole} access required`)
    }
  }

  static validateRequest(data: any, requiredFields: string[]): void {
    const missing = requiredFields.filter((field) => !data[field])

    if (missing.length > 0) {
      throw ApiErrorHandler.validation(`Missing required fields: ${missing.join(", ")}`, { missingFields: missing })
    }
  }

  static validatePhoneNumber(phoneNumber: string): void {
    if (!phoneNumber.match(/^254[0-9]{9}$/)) {
      throw ApiErrorHandler.validation("Invalid phone number format. Use 254XXXXXXXXX", {
        format: "254XXXXXXXXX",
        provided: phoneNumber,
      })
    }
  }

  static validateFileUpload(file: File, maxSize = 5 * 1024 * 1024, allowedTypes = ["image/jpeg", "image/png"]): void {
    if (file.size > maxSize) {
      throw ApiErrorHandler.validation(`File size exceeds limit of ${maxSize / (1024 * 1024)}MB`, {
        maxSize,
        actualSize: file.size,
      })
    }

    if (!allowedTypes.includes(file.type)) {
      throw ApiErrorHandler.validation(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`, {
        allowedTypes,
        actualType: file.type,
      })
    }
  }

  static logRequest(context: RequestContext, method: string, path: string): void {
    console.log(`API Request [${context.requestId}]: ${method} ${path}`, {
      ip: context.ip,
      userAgent: context.userAgent,
      timestamp: new Date().toISOString(),
    })
  }

  static logResponse(context: RequestContext, statusCode: number): void {
    const duration = Date.now() - context.startTime
    console.log(`API Response [${context.requestId}]: ${statusCode} (${duration}ms)`)
  }
}

// Higher-order function for wrapping API handlers
export function withApiMiddleware<T = any>(
  handler: (request: NextRequest, context: RequestContext, auth?: AuthContext) => Promise<T>,
  options: {
    requireAuth?: boolean
    requiredRole?: "admin" | "landlord" | "tenant" | "any"
    validateBody?: string[]
  } = {},
) {
  return async (request: NextRequest, routeParams?: any) => {
    const context = ApiMiddleware.createContext(request)

    try {
      ApiMiddleware.logRequest(context, request.method, request.url)

      let auth: AuthContext | undefined

      // Handle authentication if required
      if (options.requireAuth) {
        auth = await ApiMiddleware.authenticate(request, context)

        if (options.requiredRole) {
          ApiMiddleware.authorize(auth, options.requiredRole)
        }
      }

      // Validate request body if specified
      if (options.validateBody && options.validateBody.length > 0) {
        const body = await request.json()
        ApiMiddleware.validateRequest(body, options.validateBody)

        // Re-create request with parsed body for handler
        const newRequest = new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: JSON.stringify(body),
        })

        // Add parsed body to request for easy access
        ;(newRequest as any).parsedBody = body

        const result = await handler(newRequest as NextRequest, context, auth)
        ApiMiddleware.logResponse(context, 200)
        return ApiResponseBuilder.success(result, context.requestId)
      }

      const result = await handler(request, context, auth)
      ApiMiddleware.logResponse(context, 200)
      return ApiResponseBuilder.success(result, context.requestId)
    } catch (error) {
      if (error instanceof Error && "statusCode" in error) {
        const apiError = error as ApiError
        ApiMiddleware.logResponse(context, apiError.statusCode)
        return ApiResponseBuilder.error(apiError, context.requestId)
      }

      // Handle unexpected errors
      const internalError = ApiErrorHandler.internal("An unexpected error occurred")
      ApiMiddleware.logResponse(context, 500)
      return ApiResponseBuilder.error(internalError, context.requestId)
    }
  }
}

// Rate limiting utilities
export class RateLimiter {
  private static requests = new Map<string, { count: number; resetTime: number }>()

  static isRateLimited(identifier: string, maxRequests = 100, windowMs = 60000): boolean {
    const now = Date.now()
    const record = this.requests.get(identifier)

    if (!record || now > record.resetTime) {
      this.requests.set(identifier, { count: 1, resetTime: now + windowMs })
      return false
    }

    if (record.count >= maxRequests) {
      return true
    }

    record.count++
    return false
  }

  static getRemainingRequests(identifier: string, maxRequests = 100): number {
    const record = this.requests.get(identifier)
    if (!record || Date.now() > record.resetTime) {
      return maxRequests
    }
    return Math.max(0, maxRequests - record.count)
  }
}
