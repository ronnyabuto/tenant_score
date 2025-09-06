export * from "./middleware"
export * from "./validation"
export * from "./responses"

// Common API constants
export const API_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  RATE_LIMIT: {
    DEFAULT: { requests: 100, windowMs: 60000 }, // 100 requests per minute
    AUTH: { requests: 10, windowMs: 60000 }, // 10 auth attempts per minute
    UPLOAD: { requests: 5, windowMs: 60000 }, // 5 uploads per minute
  },
}
