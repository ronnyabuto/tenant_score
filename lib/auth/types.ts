export interface User {
  id: string
  nationalId: string
  tenantScoreId: string
  fullName: string
  userType: "tenant" | "landlord" | "admin"
  idDocumentType: "national_id" | "passport"
  idDocumentUrl?: string
  selfieUrl?: string
  kycStatus: "pending" | "verified" | "rejected"
  email?: string
  isVerified: boolean
  phoneNumbers: PhoneNumber[]
  createdAt: string
  lastActive: string
}

export interface PhoneNumber {
  id: string
  phoneNumber: string
  isPrimary: boolean
  isVerified: boolean
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface SignUpData {
  nationalId: string
  fullName: string
  userType: "tenant" | "landlord" | "admin"
  idDocumentType: "national_id" | "passport"
  phoneNumber: string
  idDocumentFile?: File
  selfieFile?: File
  email?: string
}

export interface TenantLookupResult {
  tenantScoreId: string
  score: number
  name: string
  kycStatus: string
}

export type UserType = "tenant" | "landlord" | "admin"
