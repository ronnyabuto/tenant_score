// M-Pesa Integration for TenantScore
// Handles payment notifications and verification

export interface MpesaTransaction {
  TransactionType: string
  TransID: string
  TransTime: string
  TransAmount: number
  BusinessShortCode: string
  BillRefNumber: string
  InvoiceNumber?: string
  OrgAccountBalance?: number
  ThirdPartyTransID?: string
  MSISDN: string
  FirstName?: string
  MiddleName?: string
  LastName?: string
}

export interface PaymentNotification {
  id: string
  transactionId: string
  phoneNumber: string
  amount: number
  transactionTime: string
  billRefNumber: string
  status: "pending" | "verified" | "failed"
  tenantId?: string
  propertyId?: string
  createdAt: string
}

// Mock M-Pesa configuration (replace with actual credentials)
const MPESA_CONFIG = {
  shortCode: "174379", // Paybill number
  consumerKey: process.env.MPESA_CONSUMER_KEY || "mock_consumer_key",
  consumerSecret: process.env.MPESA_CONSUMER_SECRET || "mock_consumer_secret",
  passkey: process.env.MPESA_PASSKEY || "mock_passkey",
  callbackUrl: process.env.MPESA_CALLBACK_URL || "https://your-app.vercel.app/api/mpesa/callback",
}

/**
 * Process M-Pesa payment notification
 */
export async function processMpesaPayment(transaction: MpesaTransaction): Promise<PaymentNotification> {
  // Extract phone number (remove country code if present)
  const phoneNumber = transaction.MSISDN.startsWith("254")
    ? transaction.MSISDN
    : `254${transaction.MSISDN.substring(1)}`

  // Create payment notification record
  const paymentNotification: PaymentNotification = {
    id: generateId(),
    transactionId: transaction.TransID,
    phoneNumber,
    amount: transaction.TransAmount,
    transactionTime: transaction.TransTime,
    billRefNumber: transaction.BillRefNumber,
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  // Try to match payment to tenant and unit
  const matchResult = await matchPaymentToTenant(paymentNotification)

  if (matchResult.success) {
    paymentNotification.tenantId = matchResult.tenantId
    paymentNotification.status = "verified"

    // Update unit rent status automatically
    await updateUnitRentStatus(matchResult.unitId!, paymentNotification)
    
    // Send confirmation SMS to tenant
    await sendPaymentConfirmationSMS(matchResult.tenantId!, paymentNotification.amount, matchResult.unitNumber!)
  }

  return paymentNotification
}

/**
 * Match payment to tenant and apartment unit
 */
async function matchPaymentToTenant(payment: PaymentNotification): Promise<{
  success: boolean
  unitId?: string
  tenantId?: string
  unitNumber?: string
  reason?: string
}> {
  // Import apartment units data
  const { APARTMENT_UNITS } = await import("./mock/building-data")
  
  // Find unit by tenant phone number
  const unit = APARTMENT_UNITS.find(
    (u) => u.tenant && u.tenant.phone === payment.phoneNumber
  )

  if (!unit || !unit.tenant) {
    return { success: false, reason: "Tenant not found in building" }
  }

  // Verify payment amount matches expected rent
  const amountTolerance = 1000 // Allow KES 1000 tolerance for transaction fees
  if (Math.abs(payment.amount - unit.rent.amount) > amountTolerance) {
    return {
      success: false,
      reason: `Amount mismatch: Expected ${unit.rent.amount}, got ${payment.amount}`,
    }
  }

  return {
    success: true,
    unitId: unit.id,
    tenantId: unit.tenant.phone, // Using phone as tenant ID for now
    unitNumber: unit.unitNumber,
  }
}

/**
 * Update unit rent status when payment is received
 */
async function updateUnitRentStatus(unitId: string, payment: PaymentNotification): Promise<void> {
  try {
    // Calculate payment timing
    const paymentDate = new Date(payment.transactionTime)
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const dueDate = new Date(currentYear, currentMonth, 1) // 1st of current month
    
    const daysFromDue = Math.floor((paymentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
    
    // In real implementation, update database
    // For now, we'll update our mock data structure
    const { updateUnitPaymentStatus } = await import("./services/payment-service")
    
    await updateUnitPaymentStatus(unitId, {
      status: "paid",
      lastPaymentDate: payment.transactionTime,
      transactionId: payment.transactionId,
      amount: payment.amount,
      daysFromDue: daysFromDue
    })
    
    console.log(`✅ Unit ${unitId} rent marked as paid: KES ${payment.amount}, ${daysFromDue > 0 ? `${daysFromDue} days late` : 'on time'}`)
  } catch (error) {
    console.error(`Failed to update unit ${unitId} status:`, error)
  }
}

/**
 * Send payment confirmation SMS to tenant
 */
async function sendPaymentConfirmationSMS(tenantPhone: string, amount: number, unitNumber: string): Promise<void> {
  try {
    const message = `✅ Payment Confirmed!\nRent: KES ${amount.toLocaleString()}\nUnit: ${unitNumber}\nDate: ${new Date().toLocaleDateString()}\nThank you! - Sunset Apartments`
    
    // In real implementation, use SMS service like Africa's Talking
    const { sendSMS } = await import("./services/sms-service")
    await sendSMS(tenantPhone, message)
    
    console.log(`📱 Payment confirmation SMS sent to ${tenantPhone}`)
  } catch (error) {
    console.error(`Failed to send confirmation SMS to ${tenantPhone}:`, error)
  }
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Validate M-Pesa webhook signature (security)
 */
export function validateMpesaSignature(payload: string, signature: string): boolean {
  // In real implementation, validate using M-Pesa public key
  // For demo purposes, always return true
  return true
}

/**
 * Format phone number for M-Pesa
 */
export function formatPhoneNumber(phone: string): string {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, "")

  // Handle different formats
  if (cleaned.startsWith("254")) {
    return cleaned
  } else if (cleaned.startsWith("0")) {
    return `254${cleaned.substring(1)}`
  } else if (cleaned.length === 9) {
    return `254${cleaned}`
  }

  return cleaned
}

/**
 * Mock payment verification for demo
 */
export async function verifyPayment(transactionId: string): Promise<{
  success: boolean
  transaction?: MpesaTransaction
  error?: string
}> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock successful verification
  const mockTransaction: MpesaTransaction = {
    TransactionType: "Pay Bill",
    TransID: transactionId,
    TransTime: new Date().toISOString(),
    TransAmount: 45000,
    BusinessShortCode: MPESA_CONFIG.shortCode,
    BillRefNumber: "RENT001",
    MSISDN: "254734567890",
    FirstName: "Peter",
    LastName: "Kiprotich",
  }

  return {
    success: true,
    transaction: mockTransaction,
  }
}
