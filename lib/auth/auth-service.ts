import { generateTenantScoreId } from "../encryption-server"
import type { User, SignUpData, TenantLookupResult } from "./types"
import { MOCK_USERS, MOCK_VERIFICATION_CODE, createMockUser } from "./mock-data"

export class AuthService {
  async authenticateUser(nationalId: string, password: string): Promise<User | null> {
    // Mock authentication - replace with actual database query
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (nationalId === "12345678" && password === "password") {
      return MOCK_USERS.tenant
    }

    return null
  }

  generateToken(userId: string): string {
    // Mock token generation - use proper JWT in production
    return Buffer.from(JSON.stringify({ userId, exp: Date.now() + 86400000 })).toString("base64")
  }

  async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = JSON.parse(Buffer.from(token, "base64").toString())
      if (decoded.exp < Date.now()) return null

      // Mock user lookup - replace with database query
      return MOCK_USERS.tenant
    } catch {
      return null
    }
  }

  async hashPassword(password: string): Promise<string> {
    // Mock password hashing - use bcrypt in production
    return Buffer.from(password).toString("base64")
  }

  async signUp(data: SignUpData): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user: User = {
      ...createMockUser({
        nationalId: data.nationalId,
        name: data.fullName,
        phoneNumber: data.phoneNumber,
        userType: data.userType,
        idDocumentType: data.idDocumentType,
      }),
      idDocumentUrl: data.idDocumentFile ? URL.createObjectURL(data.idDocumentFile) : undefined,
      selfieUrl: data.selfieFile ? URL.createObjectURL(data.selfieFile) : undefined,
      email: data.email,
    }

    localStorage.setItem("tenantscore_user", JSON.stringify(user))
    return user
  }

  async signIn(identifier: string, identifierType: "national_id" | "tenant_score_id" | "phone"): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    let mockUser: User
    if (identifier === "254700000000" && identifierType === "phone") {
      mockUser = MOCK_USERS.admin
    } else {
      mockUser = {
        ...MOCK_USERS.tenant,
        phoneNumbers: [
          {
            id: "phone_2",
            phoneNumber: identifier,
            isPrimary: true,
            isVerified: true,
          },
        ],
      }
    }

    localStorage.setItem("tenantscore_user", JSON.stringify(mockUser))
    return mockUser
  }

  async signOut(): Promise<void> {
    localStorage.removeItem("tenantscore_user")
  }

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const stored = localStorage.getItem("tenantscore_user")
    return stored ? JSON.parse(stored) : null
  }

  async verifyPhone(phoneNumber: string, code: string): Promise<boolean> {
    // Simulate SMS verification
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return code === MOCK_VERIFICATION_CODE
  }

  async sendOTP(phoneNumber: string): Promise<void> {
    // Simulate sending OTP
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  async lookupTenant(
    identifier: string,
    identifierType: "national_id" | "tenant_score_id" | "phone",
  ): Promise<TenantLookupResult | null> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock tenant data (in real implementation, this would query the database)
    return {
      tenantScoreId: generateTenantScoreId("87654321"),
      score: 750,
      name: "John D.", // Partially masked for privacy
      kycStatus: "verified",
    }
  }
}

export const authService = new AuthService()

export const authenticateUser = (nationalId: string, password: string) => 
  authService.authenticateUser(nationalId, password)

export const generateToken = (userId: string) => 
  authService.generateToken(userId)

export const verifyToken = (token: string) => 
  authService.verifyToken(token)

export const hashPassword = (password: string) => 
  authService.hashPassword(password)
