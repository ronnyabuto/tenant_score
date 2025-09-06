import { authService } from "./auth/auth-service"
import { userService } from "./auth/user-service"

export * from "./auth/types"
export * from "./auth/auth-service"
export * from "./auth/user-service"
export * from "./auth/mock-data"

// Legacy exports for backward compatibility
export { authService } from "./auth/auth-service"
export { userService } from "./auth/user-service"

// Re-export commonly used functions for convenience
export {
  authenticateUser,
  generateToken,
  verifyToken,
  createUser,
  hashPassword,
  getAllUsers,
  updateUserStatus,
  lookupTenant,
  getUserByTenantScoreId,
} from "./auth/auth-service"

// Legacy function wrappers for backward compatibility
export async function authenticateUser(nationalId: string, password: string) {
  return authService.authenticateUser(nationalId, password)
}

export function generateToken(userId: string) {
  return authService.generateToken(userId)
}

export async function verifyToken(token: string) {
  return authService.verifyToken(token)
}

export async function createUser(userData: {
  nationalId: string
  encryptedId: string
  fullName: string // Changed from name to fullName
  phoneNumber: string
  password: string
  userType: "tenant" | "landlord" | "admin"
  idDocument?: File
}) {
  return userService.createUser(userData)
}

export async function getAllUsers() {
  return userService.getAllUsers()
}

export async function updateUserStatus(userId: string, status: string, reason: string, adminId: string) {
  return userService.updateUserStatus(userId, status, reason, adminId)
}

export async function lookupTenant(tenantScoreId?: string, phoneNumber?: string) {
  return userService.lookupTenant(tenantScoreId, phoneNumber)
}

export async function getUserByTenantScoreId(tenantScoreId: string) {
  return userService.getUserByTenantScoreId(tenantScoreId)
}
