import { encryptData, generateTenantScoreId } from "../encryption"
import type { User } from "@/lib/auth/types"

export const MOCK_USERS: Record<string, User> = {
  tenant: {
    id: "user_1",
    nationalId: encryptData("12345678"),
    tenantScoreId: generateTenantScoreId("12345678"),
    fullName: "John Doe",
    userType: "tenant",
    idDocumentType: "national_id",
    kycStatus: "verified",
    isVerified: true,
    phoneNumbers: [
      {
        id: "phone_1",
        phoneNumber: "254712345678",
        isPrimary: true,
        isVerified: true,
      },
    ],
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
  admin: {
    id: "admin_1",
    nationalId: encryptData("87654321"),
    tenantScoreId: generateTenantScoreId("87654321"),
    fullName: "System Administrator",
    userType: "admin",
    idDocumentType: "national_id",
    kycStatus: "verified",
    isVerified: true,
    phoneNumbers: [
      {
        id: "phone_admin",
        phoneNumber: "254700000000",
        isPrimary: true,
        isVerified: true,
      },
    ],
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
  landlord: {
    id: "landlord_1",
    nationalId: encryptData("11223344"),
    tenantScoreId: generateTenantScoreId("11223344"),
    fullName: "John Mwangi",
    userType: "landlord",
    idDocumentType: "national_id",
    kycStatus: "verified",
    isVerified: true,
    phoneNumbers: [
      {
        id: "phone_landlord",
        phoneNumber: "254712345678",
        isPrimary: true,
        isVerified: true,
      },
    ],
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
}

export const mockUsers = Object.values(MOCK_USERS)

export function createMockUser(userData: {
  nationalId: string
  fullName: string
  phoneNumber: string
  userType: "tenant" | "landlord" | "admin"
  idDocumentType: "national_id" | "passport"
}): User {
  return {
    id: Math.random().toString(36).substr(2, 9),
    nationalId: encryptData(userData.nationalId),
    tenantScoreId: generateTenantScoreId(userData.nationalId),
    fullName: userData.fullName,
    userType: userData.userType,
    idDocumentType: userData.idDocumentType,
    kycStatus: "pending",
    isVerified: false,
    phoneNumbers: [
      {
        id: Math.random().toString(36).substr(2, 9),
        phoneNumber: userData.phoneNumber,
        isPrimary: true,
        isVerified: false,
      },
    ],
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  }
}
