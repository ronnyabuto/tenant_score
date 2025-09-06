import { vi } from "vitest"
import type { DatabaseConnection } from "@/lib/database/connection"

export const mockDatabase: DatabaseConnection = {
  query: vi.fn().mockResolvedValue([]),
  queryOne: vi.fn().mockResolvedValue(null),
  execute: vi.fn().mockResolvedValue(undefined),
}

// Mock the database connection
vi.mock("@/lib/database/connection", () => ({
  createDatabaseConnection: () => mockDatabase,
  db: mockDatabase,
}))
