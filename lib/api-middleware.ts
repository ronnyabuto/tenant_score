// API middleware for error handling and validation
import { type NextRequest, NextResponse } from "next/server"
import { TenantScoreError, formatErrorResponse, logError } from "./error-handler"
import { T } from "some-module" // Placeholder import for T, replace with actual import if needed

export type ApiHandler = (request: NextRequest, context?: any) => Promise<NextResponse>

// Wrapper for API route handlers with error handling
export const withErrorHandling = (handler: ApiHandler): ApiHandler => {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    const requestId = Math.random().toString(36).substr(2, 9)

    try {
      // Add request ID to headers for tracking
      const response = await handler(request, context)
      response.headers.set("X-Request-ID", requestId)
      return response
    } catch (error) {
      // Log the error
      logError(error, {
        requestId,
        method: request.method,
        url: request.url,
        userAgent: request.headers.get("user-agent"),
      })

      // Format error response
      const errorResponse = formatErrorResponse(error, requestId)

      return NextResponse.json(errorResponse, {
        status: errorResponse.statusCode,
        headers: {
          "X-Request-ID": requestId,
          "Content-Type": "application/json",
        },
      })
    }
  }
}

// Rate limiting middleware
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export const withRateLimit = (
  handler: ApiHandler,
  options: { maxRequests: number; windowMs: number } = { maxRequests: 100, windowMs: 60000 },
): ApiHandler => {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const now = Date.now()

    // Clean up old entries
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < now) {
        rateLimitMap.delete(key)
      }
    }

    // Check current rate limit
    const current = rateLimitMap.get(clientIp)
    if (current && current.resetTime > now) {
      if (current.count >= options.maxRequests) {
        throw new TenantScoreError("RATE_LIMIT_ERROR" as any, "Too many requests", 429, {
          retryAfter: Math.ceil((current.resetTime - now) / 1000),
        })
      }
      current.count++
    } else {
      rateLimitMap.set(clientIp, { count: 1, resetTime: now + options.windowMs })
    }

    return handler(request, context)
  }
}

// Request validation middleware
export const withValidation = <T>(
  handler: ApiHandler,
  schema: z.ZodSchema<T>,
  validateBody: boolean = true
): ApiHandler => {\
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {\
    try {\
      if (validateBody && (request.method === "POST" || request.method === "PUT" || request.method === "PATCH")) {\
        const body = await request.json()
        const result = schema.safeParse(body)
        
        if (!result.success) {\
          const errors: Record<string, string> = {}
          result.error.errors.forEach((error) => {\
            const path = error.path.join(".")
            errors[path] = error.message
          })
          
          throw new TenantScoreError(
            "VALIDATION_ERROR" as any,
            "Validation failed",
            400,
            { errors }
          )
        }
        
        // Add validated data to request context
        ;(request as any).validatedData = result.data
      }
      
      return handler(request, context)
    } catch (error) {\
      if (error instanceof SyntaxError) {\
        throw new TenantScoreError(
          "VALIDATION_ERROR" as any,
          "Invalid JSON in request body",
          400
        )
      }
      throw error
    }
  }
}

// Combine multiple middleware
export const withMiddleware = (handler: ApiHandler, ...middlewares: ((handler: ApiHandler) => ApiHandler)[]): ApiHandler => {\
  return middlewares.reduce((acc, middleware) => middleware(acc), handler)\
}
