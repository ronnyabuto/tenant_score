import "@testing-library/jest-dom"
import { vi } from "vitest"

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}))

// Mock environment variables
process.env.ENCRYPTION_KEY = "test-encryption-key-32-characters"
process.env.TENANT_SCORE_SALT = "test-salt"
process.env.MPESA_CONSUMER_KEY = "test-consumer-key"
process.env.MPESA_CONSUMER_SECRET = "test-consumer-secret"
