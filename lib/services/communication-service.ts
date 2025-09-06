// Communication Service - Advanced tenant communication management

import { SMSMessage, sendSMS, getSMSHistory } from "./sms-service"

export interface CommunicationTemplate {
  id: string
  name: string
  type: "payment_reminder" | "overdue_notice" | "general" | "maintenance" | "lease_renewal"
  subject: string
  message: string
  variables: string[] // e.g., ['unitNumber', 'tenantName', 'amount']
  isActive: boolean
  createdAt: string
  lastUsed?: string
  usageCount: number
}

export interface TenantCommunication {
  tenantId: string
  tenantName: string
  phoneNumber: string
  unitNumber: string
  totalMessages: number
  lastContact: string
  messageHistory: SMSMessage[]
  preferences: {
    reminderDays: number[] // Days before due to send reminders
    language: "en" | "sw" // English or Swahili
    optOut: boolean
  }
  communicationScore: number // 0-100 based on responsiveness
}

export interface BulkCampaign {
  id: string
  name: string
  templateId: string
  targetCriteria: {
    unitStatus?: ("occupied" | "vacant")[]
    rentStatus?: ("paid" | "pending" | "overdue")[]
    floors?: number[]
    specificUnits?: string[]
  }
  scheduledAt?: string
  sentAt?: string
  status: "draft" | "scheduled" | "sending" | "completed" | "failed"
  results: {
    targeted: number
    sent: number
    delivered: number
    failed: number
    totalCost: number
  }
  createdBy: string
  createdAt: string
}

// In-memory storage for demo (replace with database)
let communicationTemplates: CommunicationTemplate[] = [
  {
    id: "template_1",
    name: "Rent Reminder - Friendly",
    type: "payment_reminder",
    subject: "Rent Reminder",
    message: "🏠 Hi {{tenantName}}!\n\nFriendly reminder that your rent for Unit {{unitNumber}} (KES {{amount}}) is due {{daysUntilDue}}.\n\nPaybill: 174379\nAccount: {{unitNumber}}\n\nThank you!\nSunset Apartments\n📞 {{managerPhone}}",
    variables: ["tenantName", "unitNumber", "amount", "daysUntilDue", "managerPhone"],
    isActive: true,
    createdAt: new Date().toISOString(),
    usageCount: 0
  },
  {
    id: "template_2", 
    name: "Overdue Notice - Urgent",
    type: "overdue_notice",
    subject: "URGENT: Rent Overdue",
    message: "🚨 URGENT NOTICE\n\nHello {{tenantName}},\n\nYour rent for Unit {{unitNumber}} is now {{daysOverdue}} days overdue.\n\nAmount: KES {{amount}}\nPaybill: 174379\nAccount: {{unitNumber}}\n\nImmediate payment required to avoid further action.\n\nContact: {{managerPhone}}\nSunset Apartments",
    variables: ["tenantName", "unitNumber", "daysOverdue", "amount", "managerPhone"],
    isActive: true,
    createdAt: new Date().toISOString(),
    usageCount: 0
  },
  {
    id: "template_3",
    name: "Maintenance Notice",
    type: "maintenance", 
    subject: "Maintenance Notice",
    message: "🔧 MAINTENANCE NOTICE\n\nDear {{tenantName}},\n\nScheduled maintenance in your building:\n\n📅 Date: {{maintenanceDate}}\n⏰ Time: {{maintenanceTime}}\n🏠 Area: {{maintenanceArea}}\n\nPlease ensure access if needed.\n\nSunset Apartments\n📞 {{managerPhone}}",
    variables: ["tenantName", "maintenanceDate", "maintenanceTime", "maintenanceArea", "managerPhone"],
    isActive: true,
    createdAt: new Date().toISOString(),
    usageCount: 0
  }
]

let bulkCampaigns: BulkCampaign[] = []

/**
 * Get all communication templates
 */
export async function getCommunicationTemplates(type?: CommunicationTemplate['type']): Promise<CommunicationTemplate[]> {
  let filtered = communicationTemplates.filter(t => t.isActive)
  
  if (type) {
    filtered = filtered.filter(t => t.type === type)
  }
  
  return filtered.sort((a, b) => b.usageCount - a.usageCount)
}

/**
 * Create new communication template
 */
export async function createCommunicationTemplate(template: Omit<CommunicationTemplate, 'id' | 'createdAt' | 'usageCount'>): Promise<CommunicationTemplate> {
  const newTemplate: CommunicationTemplate = {
    ...template,
    id: `template_${Date.now()}`,
    createdAt: new Date().toISOString(),
    usageCount: 0
  }
  
  communicationTemplates.push(newTemplate)
  return newTemplate
}

/**
 * Send message using template with variable substitution
 */
export async function sendTemplatedMessage(
  templateId: string,
  phoneNumber: string,
  variables: Record<string, string>
): Promise<boolean> {
  const template = communicationTemplates.find(t => t.id === templateId)
  if (!template) {
    throw new Error("Template not found")
  }
  
  // Replace variables in message
  let message = template.message
  Object.entries(variables).forEach(([key, value]) => {
    message = message.replace(new RegExp(`{{${key}}}`, 'g'), value)
  })
  
  // Send SMS
  const success = await sendSMS(phoneNumber, message, template.type)
  
  if (success) {
    // Update template usage
    template.usageCount++
    template.lastUsed = new Date().toISOString()
  }
  
  return success
}

/**
 * Get tenant communication profile
 */
export async function getTenantCommunication(phoneNumber: string): Promise<TenantCommunication | null> {
  const { APARTMENT_UNITS } = await import("../mock/building-data")
  
  // Find tenant
  const unit = APARTMENT_UNITS.find(u => u.tenant && u.tenant.phone === phoneNumber)
  if (!unit || !unit.tenant) return null
  
  // Get SMS history for this tenant
  const messageHistory = await getSMSHistory()
  const tenantMessages = messageHistory.filter(msg => msg.recipient === phoneNumber)
  
  // Calculate communication score based on message frequency and rent payment behavior
  const communicationScore = calculateCommunicationScore(unit, tenantMessages)
  
  return {
    tenantId: phoneNumber,
    tenantName: unit.tenant.name,
    phoneNumber: phoneNumber,
    unitNumber: unit.unitNumber,
    totalMessages: tenantMessages.length,
    lastContact: tenantMessages.length > 0 ? tenantMessages[0].sentAt : "Never",
    messageHistory: tenantMessages,
    preferences: {
      reminderDays: [7, 3, 1], // Default reminder schedule
      language: "en",
      optOut: false
    },
    communicationScore
  }
}

/**
 * Get all tenant communication profiles
 */
export async function getAllTenantCommunications(): Promise<TenantCommunication[]> {
  const { APARTMENT_UNITS } = await import("../mock/building-data")
  const profiles: TenantCommunication[] = []
  
  for (const unit of APARTMENT_UNITS) {
    if (unit.tenant) {
      const profile = await getTenantCommunication(unit.tenant.phone)
      if (profile) {
        profiles.push(profile)
      }
    }
  }
  
  return profiles.sort((a, b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime())
}

/**
 * Create and execute bulk campaign
 */
export async function createBulkCampaign(campaign: Omit<BulkCampaign, 'id' | 'createdAt' | 'results' | 'status'>): Promise<BulkCampaign> {
  const { APARTMENT_UNITS } = await import("../mock/building-data")
  
  // Create campaign
  const newCampaign: BulkCampaign = {
    ...campaign,
    id: `campaign_${Date.now()}`,
    status: "draft",
    results: {
      targeted: 0,
      sent: 0, 
      delivered: 0,
      failed: 0,
      totalCost: 0
    },
    createdAt: new Date().toISOString()
  }
  
  // Get target list based on criteria
  let targetUnits = APARTMENT_UNITS.filter(unit => unit.tenant)
  
  // Apply filters
  if (campaign.targetCriteria.unitStatus) {
    targetUnits = targetUnits.filter(unit => 
      unit.tenant ? campaign.targetCriteria.unitStatus?.includes("occupied") : 
      campaign.targetCriteria.unitStatus?.includes("vacant")
    )
  }
  
  if (campaign.targetCriteria.rentStatus) {
    targetUnits = targetUnits.filter(unit => 
      campaign.targetCriteria.rentStatus?.includes(unit.rent.status as any)
    )
  }
  
  if (campaign.targetCriteria.floors) {
    targetUnits = targetUnits.filter(unit =>
      campaign.targetCriteria.floors?.includes(unit.floor)
    )
  }
  
  if (campaign.targetCriteria.specificUnits) {
    targetUnits = targetUnits.filter(unit =>
      campaign.targetCriteria.specificUnits?.includes(unit.unitNumber)
    )
  }
  
  newCampaign.results.targeted = targetUnits.length
  
  // If scheduled for later, save and return
  if (campaign.scheduledAt && new Date(campaign.scheduledAt) > new Date()) {
    newCampaign.status = "scheduled"
    bulkCampaigns.push(newCampaign)
    return newCampaign
  }
  
  // Execute immediately
  newCampaign.status = "sending"
  newCampaign.sentAt = new Date().toISOString()
  
  // Send to all targets
  const template = communicationTemplates.find(t => t.id === campaign.templateId)
  if (!template) {
    newCampaign.status = "failed"
    bulkCampaigns.push(newCampaign)
    return newCampaign
  }
  
  for (const unit of targetUnits) {
    if (!unit.tenant) continue
    
    try {
      // Prepare variables for this tenant
      const variables = {
        tenantName: unit.tenant.name,
        unitNumber: unit.unitNumber,
        amount: unit.rent.amount.toString(),
        managerPhone: "0712345678",
        daysOverdue: unit.rent.status === "overdue" ? "5" : "0",
        daysUntilDue: unit.rent.status === "pending" ? "in 3 days" : "today"
      }
      
      const success = await sendTemplatedMessage(template.id, unit.tenant.phone, variables)
      
      if (success) {
        newCampaign.results.sent++
        newCampaign.results.delivered++ // Assume delivered for demo
        newCampaign.results.totalCost += 1.5 // KES 1.50 per SMS
      } else {
        newCampaign.results.failed++
      }
      
      // Add delay between messages to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 200))
      
    } catch (error) {
      newCampaign.results.failed++
      console.error(`Failed to send to ${unit.tenant.phone}:`, error)
    }
  }
  
  newCampaign.status = "completed"
  bulkCampaigns.push(newCampaign)
  
  console.log(`📢 Bulk campaign completed: ${newCampaign.results.sent}/${newCampaign.results.targeted} sent, Cost: KES ${newCampaign.results.totalCost}`)
  
  return newCampaign
}

/**
 * Get bulk campaigns with filtering
 */
export async function getBulkCampaigns(status?: BulkCampaign['status'], limit?: number): Promise<BulkCampaign[]> {
  let filtered = bulkCampaigns
  
  if (status) {
    filtered = filtered.filter(c => c.status === status)
  }
  
  filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  
  if (limit) {
    filtered = filtered.slice(0, limit)
  }
  
  return filtered
}

/**
 * Get communication analytics
 */
export async function getCommunicationAnalytics(): Promise<{
  totalMessages: number
  thisMonth: number
  deliveryRate: number
  totalCost: number
  topTemplates: { name: string; usage: number }[]
  responseRate: number
  tenantEngagement: {
    high: number    // Responsive tenants
    medium: number  // Moderately responsive
    low: number     // Poor communication
  }
}> {
  const allMessages = await getSMSHistory()
  const templates = await getCommunicationTemplates()
  
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const thisMonthMessages = allMessages.filter(msg => {
    const msgDate = new Date(msg.sentAt)
    return msgDate.getMonth() === currentMonth && msgDate.getFullYear() === currentYear
  }).length
  
  const deliveredMessages = allMessages.filter(msg => msg.status === "delivered").length
  const deliveryRate = allMessages.length > 0 ? (deliveredMessages / allMessages.length) * 100 : 0
  
  const totalCost = allMessages.reduce((sum, msg) => sum + (msg.cost || 0), 0)
  
  const topTemplates = templates
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 5)
    .map(t => ({ name: t.name, usage: t.usageCount }))
  
  // Get tenant engagement levels
  const tenantProfiles = await getAllTenantCommunications()
  let high = 0, medium = 0, low = 0
  
  tenantProfiles.forEach(profile => {
    if (profile.communicationScore >= 80) high++
    else if (profile.communicationScore >= 50) medium++
    else low++
  })
  
  return {
    totalMessages: allMessages.length,
    thisMonth: thisMonthMessages,
    deliveryRate: Math.round(deliveryRate),
    totalCost: Math.round(totalCost),
    topTemplates,
    responseRate: 85, // Mock response rate
    tenantEngagement: { high, medium, low }
  }
}

// Helper function to calculate communication score
function calculateCommunicationScore(unit: any, messages: SMSMessage[]): number {
  let score = 50 // Base score
  
  // Boost score for on-time rent payments
  if (unit.rent.status === "paid") score += 30
  else if (unit.rent.status === "overdue") score -= 20
  
  // Adjust based on communication frequency
  const recentMessages = messages.filter(msg => 
    new Date(msg.sentAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
  )
  
  if (recentMessages.length === 0) score += 10 // No recent issues
  else if (recentMessages.length > 5) score -= 15 // High maintenance tenant
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score))
}