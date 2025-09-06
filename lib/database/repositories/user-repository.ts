import { db } from "../connection"
import type { User, UserType } from "@/lib/auth/types"

export class UserRepository {
  async findByNationalId(nationalId: string): Promise<User | null> {
    return await db.queryOne<User>("SELECT * FROM users WHERE national_id = $1", [nationalId])
  }

  async findByTenantScoreId(tenantScoreId: string): Promise<User | null> {
    return await db.queryOne<User>("SELECT * FROM users WHERE tenant_score_id = $1", [tenantScoreId])
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return await db.queryOne<User>(
      `SELECT u.* FROM users u 
       JOIN user_phone_numbers p ON u.id = p.user_id 
       WHERE p.phone_number = $1`,
      [phoneNumber],
    )
  }

  async create(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const user = await db.queryOne<User>(
      `INSERT INTO users (national_id, tenant_score_id, full_name, user_type, email, 
                         id_document_type, kyc_status, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        userData.nationalId,
        userData.tenantScoreId,
        userData.fullName,
        userData.userType,
        userData.email,
        userData.idDocumentType,
        userData.kycStatus || "pending",
        userData.isVerified || false,
      ],
    )
    return user!
  }

  async updateKycStatus(userId: string, status: "pending" | "verified" | "rejected"): Promise<void> {
    await db.execute("UPDATE users SET kyc_status = $1, updated_at = NOW() WHERE id = $2", [status, userId])
  }

  async findByUserType(userType: UserType): Promise<User[]> {
    return await db.query<User>("SELECT * FROM users WHERE user_type = $1", [userType])
  }
}
