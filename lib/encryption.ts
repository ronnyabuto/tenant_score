// Client-safe encryption utilities (placeholders for browser environment)
// Real encryption functions are in encryption-server.ts

export function encryptData(text: string): string {
  throw new Error("Encryption not available in browser environment. Use server-side encryption instead.")
}

export function decryptData(encryptedData: string): string {
  throw new Error("Decryption not available in browser environment. Use server-side encryption instead.")
}

export function generateTenantScoreId(nationalId: string): string {
  // Simple client-safe version for mock data
  const simple_hash = btoa(nationalId + "tenantscore-salt").replace(/[^a-zA-Z0-9]/g, '').substring(0, 20).toUpperCase()
  return `TS00${simple_hash}`
}

export function hashSensitiveData(data: string): string {
  throw new Error("Hashing not available in browser environment. Use server-side encryption instead.")
}

export function encryptSensitiveData(data: string): string {
  throw new Error("Encryption not available in browser environment. Use server-side encryption instead.")
}
