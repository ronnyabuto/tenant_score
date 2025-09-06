import { describe, it, expect, vi } from "vitest"
import { POST } from "@/app/api/auth/login/route"
import { mockDatabase } from "../../mocks/database"

describe("/api/auth/login", () => {
  it("should return user data for valid login", async () => {
    const mockUser = {
      id: "1",
      nationalId: "12345678",
      fullName: "John Doe",
      userType: "tenant",
      kycStatus: "verified",
    }

    mockDatabase.queryOne = vi.fn().mockResolvedValue(mockUser)

    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nationalId: "12345678",
        phoneNumber: "+254712345678",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.user).toEqual(mockUser)
  })

  it("should return error for invalid credentials", async () => {
    mockDatabase.queryOne = vi.fn().mockResolvedValue(null)

    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nationalId: "invalid",
        phoneNumber: "+254712345678",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error).toBe("Invalid credentials")
  })
})
