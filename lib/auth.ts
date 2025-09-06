import { authService } from "./auth/auth-service"
import { userService } from "./auth/user-service"

export * from "./auth/types"
export * from "./auth/mock-data"

// Export services
export { authService } from "./auth/auth-service"
export { userService } from "./auth/user-service"

// Export specific functions from auth service
export {
  authenticateUser,
  generateToken,
  verifyToken,
  hashPassword
} from "./auth/auth-service"

// Export specific functions from user service
export {
  createUser,
  getAllUsers,
  updateUserStatus,
  lookupTenant,
  getUserByTenantScoreId
} from "./auth/user-service"
