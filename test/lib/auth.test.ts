import { describe, it, expect, vi, beforeEach } from "vitest"
import { authService } from "@/lib/auth/auth-service"
import { mockDatabase } from "../mocks/database"

describe("Authentication Service", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("login", () => {
    it("should authenticate user with valid credentials", async () => {
      const mockUser = {
        id: "1",
        nationalId: "12345678",
        tenantScoreId: "TS123",
        fullName: "John Doe",
        userType: "tenant" as const,
        email: "john@example.com",
        kycStatus: "verified" as const,
        isVerified: true,
      }

      mockDatabase.queryOne = vi.fn().mockResolvedValue(mockUser)

      const result = await authService.login("12345678", "123456")

      expect(result.success).toBe(true)
      expect(result.user).toEqual(mockUser)
      expect(mockDatabase.queryOne).toHaveBeenCalledWith(expect.stringContaining("SELECT u.* FROM users u"), [
        "12345678",
      ])
    })

    it("should fail with invalid credentials", async () => {
      mockDatabase.queryOne = vi.fn().mockResolvedValue(null)

      const result = await authService.login("invalid", "123456")

      expect(result.success).toBe(false)
      expect(result.error).toBe("Invalid credentials")
    })
  })

  describe("signup", () => {
    it("should create new user successfully", async () => {
      const signupData = {
        nationalId: "87654321",
        fullName: "Jane Doe",
        userType: "tenant" as const,
        email: "jane@example.com",
        phoneNumber: "+254712345678",
        idDocumentType: "national_id" as const,
      }

      mockDatabase.queryOne = vi
        .fn()
        .mockResolvedValueOnce(null) // User doesn't exist
        .mockResolvedValueOnce({ id: "2", ...signupData }) // Created user

      const result = await authService.signup(signupData)

      expect(result.success).toBe(true)
      expect(result.user).toBeDefined()
    })
  })
})
