import crypto from "crypto"

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-32-character-secret-key-here"
const ALGORITHM = "aes-256-gcm"

export function encryptData(text: string): string {
  const iv = crypto.randomBytes(16)
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32)
  const cipher = crypto.createCipherGCM(ALGORITHM, key, iv)

  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  const authTag = cipher.getAuthTag()

  return iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted
}

export function decryptData(encryptedData: string): string {
  const parts = encryptedData.split(":")
  const iv = Buffer.from(parts[0], "hex")
  const authTag = Buffer.from(parts[1], "hex")
  const encrypted = parts[2]

  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32)
  const decipher = crypto.createDecipherGCM(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}

export function generateTenantScoreId(nationalId: string): string {
  // Create a pseudonymized ID using SHA-256 hash with salt
  const salt = process.env.TENANT_SCORE_SALT || "tenantscore-salt-2024"
  return crypto
    .createHash("sha256")
    .update(nationalId + salt)
    .digest("hex")
}

export function hashSensitiveData(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex")
}

export function encryptSensitiveData(data: string): string {
  return encryptData(data)
}
