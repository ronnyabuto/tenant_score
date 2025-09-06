// SMS Service - Handles all SMS communications with tenants

export interface SMSMessage {
  id: string
  recipient: string
  message: string
  type: "payment_reminder" | "payment_confirmation" | "overdue_notice" | "general" | "maintenance"
  sentAt: string
  status: "pending" | "sent" | "delivered" | "failed"
  deliveredAt?: string
  failureReason?: string
  gatewayId?: string
  cost?: number
}

// In-memory storage for demo (replace with database in production)
let smsHistory: SMSMessage[] = []

/**
 * Send SMS message to tenant
 */
export async function sendSMS(phoneNumber: string, message: string, type: SMSMessage['type'] = "general"): Promise<boolean> {
  try {
    // In production, integrate with SMS gateway like Africa's Talking or Twilio
    // For demo, we'll simulate the SMS sending
    
    const smsRecord: SMSMessage = {
      id: generateSMSId(),
      recipient: phoneNumber,
      message: message,
      type: type,
      sentAt: new Date().toISOString(),
      status: "pending",
      cost: calculateSMSCost(message)
    }
    
    // Store in history
    smsHistory.push(smsRecord)
    
    // Simulate SMS gateway API call
    const gatewayResult = await simulateSMSGateway(phoneNumber, message)
    
    if (gatewayResult.success) {
      smsRecord.status = "sent"
      smsRecord.gatewayId = gatewayResult.id
      
      // Simulate delivery status update after a delay
      setTimeout(async () => {
        await updateMessageDeliveryStatus(smsRecord.id, Math.random() > 0.1 ? "delivered" : "failed")
      }, 2000 + Math.random() * 3000) // Random delay 2-5 seconds
      
      console.log(`📱 SMS sent to ${phoneNumber}: ${message.substring(0, 50)}...`)
      return true
    } else {
      smsRecord.status = "failed"
      smsRecord.failureReason = gatewayResult.error || "Gateway error"
      return false
    }
    
  } catch (error) {
    console.error(`Failed to send SMS to ${phoneNumber}:`, error)
    return false
  }
}

/**
 * Send payment reminder SMS to tenant
 */
export async function sendPaymentReminderSMS(phoneNumber: string, unitNumber: string, amount: number, daysUntilDue: number): Promise<boolean> {
  let message: string
  
  if (daysUntilDue > 0) {
    message = `🏠 Rent Reminder\nUnit: ${unitNumber}\nAmount: KES ${amount.toLocaleString()}\nDue in: ${daysUntilDue} days\nPaybill: 174379\nAccount: ${unitNumber}\n\nSunset Apartments`
  } else if (daysUntilDue === 0) {
    message = `🏠 Rent Due Today\nUnit: ${unitNumber}\nAmount: KES ${amount.toLocaleString()}\nPaybill: 174379\nAccount: ${unitNumber}\n\nPlease pay today to avoid late fees.\nSunset Apartments`
  } else {
    const daysOverdue = Math.abs(daysUntilDue)
    message = `🚨 RENT OVERDUE\nUnit: ${unitNumber}\nAmount: KES ${amount.toLocaleString()}\nOverdue by: ${daysOverdue} days\nPaybill: 174379\nAccount: ${unitNumber}\n\nPlease pay immediately.\nSunset Apartments`
  }
  
  return await sendSMS(phoneNumber, message, "payment_reminder")
}

/**
 * Send overdue notice SMS
 */
export async function sendOverdueNoticeSMS(phoneNumber: string, unitNumber: string, amount: number, daysOverdue: number): Promise<boolean> {
  const message = `🚨 FINAL NOTICE\nUnit: ${unitNumber}\nRent: KES ${amount.toLocaleString()}\nOverdue: ${daysOverdue} days\n\nImmediate payment required to avoid further action.\nContact: 0712345678\nSunset Apartments`
  
  return await sendSMS(phoneNumber, message, "overdue_notice")
}

/**
 * Send bulk message to all tenants
 */
export async function sendBulkMessage(message: string, type: SMSMessage['type'] = "general"): Promise<{
  sent: number
  failed: number
  results: { phone: string; success: boolean }[]
}> {
  const { APARTMENT_UNITS } = await import("../mock/building-data")
  const results: { phone: string; success: boolean }[] = []
  let sent = 0
  let failed = 0
  
  // Get all tenant phone numbers
  const tenantPhones = APARTMENT_UNITS
    .filter(unit => unit.tenant)
    .map(unit => unit.tenant!.phone)
  
  // Send to each tenant
  for (const phone of tenantPhones) {
    try {
      const success = await sendSMS(phone, message, type)
      results.push({ phone, success })
      
      if (success) {
        sent++
      } else {
        failed++
      }
      
      // Add small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      results.push({ phone, success: false })
      failed++
    }
  }
  
  console.log(`📢 Bulk SMS sent: ${sent} successful, ${failed} failed`)
  
  return { sent, failed, results }
}

/**
 * Get SMS history for a specific tenant
 */
export async function getTenantSMSHistory(phoneNumber: string): Promise<SMSMessage[]> {
  return smsHistory
    .filter(sms => sms.recipient === phoneNumber)
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
}

/**
 * Get all SMS history with filtering
 */
export async function getSMSHistory(type?: SMSMessage['type'], limit?: number): Promise<SMSMessage[]> {
  let filtered = smsHistory
  
  if (type) {
    filtered = filtered.filter(sms => sms.type === type)
  }
  
  filtered = filtered.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
  
  if (limit) {
    filtered = filtered.slice(0, limit)
  }
  
  return filtered
}

/**
 * Get SMS statistics
 */
export async function getSMSStatistics(): Promise<{
  today: number
  thisMonth: number
  totalCost: number
  deliveryRate: number
  messageTypes: Record<SMSMessage['type'], number>
}> {
  const today = new Date().toDateString()
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  
  const todayMessages = smsHistory.filter(sms => 
    new Date(sms.sentAt).toDateString() === today
  ).length
  
  const thisMonthMessages = smsHistory.filter(sms => {
    const smsDate = new Date(sms.sentAt)
    return smsDate.getMonth() === thisMonth && smsDate.getFullYear() === thisYear
  }).length
  
  const totalCost = smsHistory.reduce((sum, sms) => sum + (sms.cost || 0), 0)
  
  const deliveredMessages = smsHistory.filter(sms => sms.status === "delivered").length
  const deliveryRate = smsHistory.length > 0 ? (deliveredMessages / smsHistory.length) * 100 : 0
  
  const messageTypes: Record<SMSMessage['type'], number> = {
    payment_reminder: 0,
    payment_confirmation: 0,
    overdue_notice: 0,
    general: 0,
    maintenance: 0
  }
  
  smsHistory.forEach(sms => {
    messageTypes[sms.type]++
  })
  
  return {
    today: todayMessages,
    thisMonth: thisMonthMessages,
    totalCost,
    deliveryRate,
    messageTypes
  }
}

/**
 * Schedule automatic rent reminders
 */
export async function scheduleRentReminders(): Promise<void> {
  const { APARTMENT_UNITS } = await import("../mock/building-data")
  const currentDate = new Date()
  
  // Send reminders to tenants with pending rent
  for (const unit of APARTMENT_UNITS) {
    if (unit.tenant && unit.rent.status === "pending" && unit.rent.dueDate) {
      const dueDate = new Date(unit.rent.dueDate)
      const daysUntilDue = Math.ceil((dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
      
      // Send reminders at: 7 days before, 3 days before, 1 day before, on due date, and overdue
      if ([7, 3, 1, 0].includes(daysUntilDue) || daysUntilDue < 0) {
        await sendPaymentReminderSMS(
          unit.tenant.phone,
          unit.unitNumber,
          unit.rent.amount,
          daysUntilDue
        )
      }
    }
  }
}

// Helper functions
function generateSMSId(): string {
  return `SMS_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
}

function calculateSMSCost(message: string): number {
  // SMS cost calculation (typical rates in Kenya: KES 1-2 per SMS)
  const smsLength = 160 // Standard SMS length
  const smsCount = Math.ceil(message.length / smsLength)
  return smsCount * 1.5 // KES 1.50 per SMS
}

/**
 * Update delivery status of an SMS message
 */
export async function updateMessageDeliveryStatus(
  messageId: string, 
  status: "delivered" | "failed", 
  failureReason?: string
): Promise<boolean> {
  const message = smsHistory.find(sms => sms.id === messageId)
  if (!message) {
    console.error(`SMS message ${messageId} not found`)
    return false
  }
  
  message.status = status
  if (status === "delivered") {
    message.deliveredAt = new Date().toISOString()
  } else if (status === "failed") {
    message.failureReason = failureReason || "Delivery failed"
  }
  
  console.log(`📬 SMS ${messageId} status updated: ${status}`)
  return true
}

/**
 * Get real-time SMS delivery statistics
 */
export async function getDeliveryStats(): Promise<{
  pending: number
  sent: number
  delivered: number
  failed: number
  deliveryRate: number
  avgDeliveryTime: number
}> {
  const stats = {
    pending: smsHistory.filter(sms => sms.status === "pending").length,
    sent: smsHistory.filter(sms => sms.status === "sent").length,
    delivered: smsHistory.filter(sms => sms.status === "delivered").length,
    failed: smsHistory.filter(sms => sms.status === "failed").length,
    deliveryRate: 0,
    avgDeliveryTime: 0
  }
  
  const totalProcessed = stats.sent + stats.delivered + stats.failed
  if (totalProcessed > 0) {
    stats.deliveryRate = (stats.delivered / totalProcessed) * 100
  }
  
  // Calculate average delivery time for delivered messages
  const deliveredWithTimes = smsHistory.filter(sms => 
    sms.status === "delivered" && sms.deliveredAt
  )
  
  if (deliveredWithTimes.length > 0) {
    const totalDeliveryTime = deliveredWithTimes.reduce((sum, sms) => {
      const sentTime = new Date(sms.sentAt).getTime()
      const deliveredTime = new Date(sms.deliveredAt!).getTime()
      return sum + (deliveredTime - sentTime)
    }, 0)
    
    stats.avgDeliveryTime = totalDeliveryTime / deliveredWithTimes.length / 1000 // Convert to seconds
  }
  
  return stats
}

/**
 * Get messages by status with real-time updates
 */
export async function getMessagesByStatus(status: SMSMessage['status']): Promise<SMSMessage[]> {
  return smsHistory
    .filter(sms => sms.status === status)
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
}

async function simulateSMSGateway(phoneNumber: string, message: string): Promise<{
  success: boolean
  id?: string
  error?: string
}> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
  
  // Simulate occasional failures (5% failure rate)
  if (Math.random() < 0.05) {
    return {
      success: false,
      error: "Invalid phone number format"
    }
  }
  
  // In production, this would be:
  // const response = await fetch('https://api.africastalking.com/version1/messaging', {
  //   method: 'POST',
  //   headers: { 
  //     'apiKey': process.env.AFRICASTALKING_API_KEY,
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   },
  //   body: new URLSearchParams({
  //     username: process.env.AFRICASTALKING_USERNAME,
  //     to: phoneNumber,
  //     message: message
  //   })
  // })
  
  const gatewayId = `GT_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
  console.log(`🌍 SMS Gateway: Message ${gatewayId} sent to ${phoneNumber}`)
  
  return {
    success: true,
    id: gatewayId
  }
}