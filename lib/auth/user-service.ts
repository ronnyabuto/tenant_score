import type { User } from "./types"
import { MOCK_USERS, createMockUser } from "./mock-data"

export class UserService {
  async createUser(userData: {
    nationalId: string
    encryptedId: string
    fullName: string // Changed from name to fullName for consistency
    phoneNumber: string
    password: string
    userType: "tenant" | "landlord" | "admin"
    idDocument?: File
  }): Promise<User> {
    // Mock user creation - replace with database insert
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return createMockUser({
      nationalId: userData.nationalId,
      fullName: userData.fullName, // Updated to use fullName
      phoneNumber: userData.phoneNumber,
      userType: userData.userType,
      idDocumentType: "national_id",
    })
  }

  async getAllUsers(): Promise<User[]> {
    // Mock user list - replace with database query
    await new Promise((resolve) => setTimeout(resolve, 500))
    return Object.values(MOCK_USERS)
  }

  async getUserById(userId: string): Promise<User | null> {
    // Mock user lookup - replace with database query
    await new Promise((resolve) => setTimeout(resolve, 500))
    return Object.values(MOCK_USERS).find((user) => user.id === userId) || null
  }

  async getUserByTenantScoreId(tenantScoreId: string): Promise<User | null> {
    // Mock user lookup - replace with database query
    await new Promise((resolve) => setTimeout(resolve, 500))
    return Object.values(MOCK_USERS).find((user) => user.tenantScoreId === tenantScoreId) || null
  }

  async updateUserStatus(userId: string, status: string, reason: string, adminId: string): Promise<void> {
    // Mock status update - replace with database update
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log(`User ${userId} status updated to ${status} by ${adminId}: ${reason}`)
  }

  async lookupTenant(tenantScoreId?: string, phoneNumber?: string): Promise<User | null> {
    // Mock tenant lookup - replace with database query
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (tenantScoreId) {
      return await this.getUserByTenantScoreId(tenantScoreId)
    }

    if (phoneNumber) {
      return (
        Object.values(MOCK_USERS).find((user) =>
          user.phoneNumbers.some((phone) => phone.phoneNumber === phoneNumber),
        ) || null
      )
    }

    return null
  }

  async addPhoneNumber(userId: string, phoneNumber: string): Promise<void> {
    // Mock phone number addition - replace with database update
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}

export const userService = new UserService()

export const createUser = (userData: {
  nationalId: string
  encryptedId: string
  fullName: string
  phoneNumber: string
  password: string
  userType: "tenant" | "landlord" | "admin"
  idDocument?: File
}) => userService.createUser(userData)

export const getAllUsers = () => userService.getAllUsers()

export const updateUserStatus = (userId: string, status: string, reason: string, adminId: string) => 
  userService.updateUserStatus(userId, status, reason, adminId)

export const lookupTenant = (tenantScoreId?: string, phoneNumber?: string) => 
  userService.lookupTenant(tenantScoreId, phoneNumber)

export const getUserByTenantScoreId = (tenantScoreId: string) => 
  userService.getUserByTenantScoreId(tenantScoreId)
