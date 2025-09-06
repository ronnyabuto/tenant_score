import type { User } from "@/lib/auth/types"

export const MOCK_USERS: Record<string, User> = {
  tenant: {
    id: "user_1",
    nationalId: "mock_encrypted_12345678",
    tenantScoreId: "TS001234567890ABCDEF",
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
    nationalId: "mock_encrypted_87654321",
    tenantScoreId: "TS00ADMIN789ABCDEF123",
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
    nationalId: "mock_encrypted_11223344",
    tenantScoreId: "TS00LANDLORD123456789",
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
  const randomId = Math.random().toString(36).substr(2, 9)
  return {
    id: randomId,
    nationalId: `mock_encrypted_${userData.nationalId}`,
    tenantScoreId: `TS00${randomId.toUpperCase()}`,
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
