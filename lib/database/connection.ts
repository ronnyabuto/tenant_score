import { mockUsers, mockPayments, mockProperties, mockScores } from "../mock"

// Database abstraction layer that works with mock data now, real DB later
export interface DatabaseConnection {
  query<T = any>(sql: string, params?: any[]): Promise<T[]>
  queryOne<T = any>(sql: string, params?: any[]): Promise<T | null>
  execute(sql: string, params?: any[]): Promise<void>
}

// Mock database implementation
class MockDatabase implements DatabaseConnection {
  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    // Simple mock query parser - in production, use real SQL
    if (sql.includes("SELECT * FROM users")) {
      return mockUsers as T[]
    }
    if (sql.includes("SELECT * FROM rent_payments")) {
      return mockPayments as T[]
    }
    if (sql.includes("SELECT * FROM properties")) {
      return mockProperties as T[]
    }
    if (sql.includes("SELECT * FROM tenant_scores")) {
      return mockScores as T[]
    }
    return []
  }

  async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const results = await this.query<T>(sql, params)
    return results[0] || null
  }

  async execute(sql: string, params?: any[]): Promise<void> {
    // Mock execute - in production, run actual SQL
    console.log("Mock execute:", sql, params)
  }
}

// Database connection factory
export function createDatabaseConnection(): DatabaseConnection {
  // In production, check for DATABASE_URL and create real connection
  // For now, return mock implementation
  return new MockDatabase()
}

export const db = createDatabaseConnection()
