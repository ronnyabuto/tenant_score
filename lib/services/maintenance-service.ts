export interface MaintenanceRequest {
  id: string
  tenantId: string
  tenantName: string
  unitNumber: string
  phoneNumber: string
  title: string
  description: string
  category: "plumbing" | "electrical" | "appliances" | "structural" | "cleaning" | "other"
  priority: "low" | "normal" | "urgent"
  status: "submitted" | "acknowledged" | "in_progress" | "completed" | "cancelled"
  photos: string[]
  submittedAt: string
  acknowledgedAt?: string
  startedAt?: string
  completedAt?: string
  assignedContractor?: {
    id: string
    name: string
    phone: string
    specialties: string[]
  }
  estimatedCost?: number
  actualCost?: number
  adminNotes?: string
  tenantRating?: number
  createdAt: string
  updatedAt: string
}

export interface Contractor {
  id: string
  name: string
  phone: string
  email?: string
  specialties: string[]
  hourlyRate: number
  isActive: boolean
  rating: number
  completedJobs: number
  createdAt: string
}

export interface MaintenanceCategory {
  id: string
  name: string
  icon: string
  averageCost: number
  typicalTimeframe: string
  description: string
}

let maintenanceRequests: MaintenanceRequest[] = [
  {
    id: "MR_001",
    tenantId: "0712345678",
    tenantName: "John Doe",
    unitNumber: "1A",
    phoneNumber: "0712345678",
    title: "Kitchen Sink Leak",
    description: "The kitchen sink has been leaking from the faucet for 2 days. Water drips continuously.",
    category: "plumbing",
    priority: "normal",
    status: "in_progress",
    photos: ["/maintenance/kitchen-leak-1.jpg", "/maintenance/kitchen-leak-2.jpg"],
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    acknowledgedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    assignedContractor: {
      id: "CONT_001",
      name: "Mike's Plumbing",
      phone: "0701234567",
      specialties: ["plumbing", "pipes"]
    },
    estimatedCost: 3500,
    adminNotes: "Contractor scheduled for today morning",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "MR_002",
    tenantId: "0723456789",
    tenantName: "Jane Smith",
    unitNumber: "2B",
    phoneNumber: "0723456789",
    title: "Bathroom Light Not Working",
    description: "The main bathroom light bulb went out and replacement doesn't work either.",
    category: "electrical",
    priority: "low",
    status: "acknowledged",
    photos: ["/maintenance/bathroom-light.jpg"],
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    acknowledgedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    estimatedCost: 1500,
    adminNotes: "Will schedule electrician this week",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
]

let contractors: Contractor[] = [
  {
    id: "CONT_001",
    name: "Mike's Plumbing",
    phone: "0701234567",
    email: "mike@plumbing.co.ke",
    specialties: ["plumbing", "pipes", "water_heating"],
    hourlyRate: 1500,
    isActive: true,
    rating: 4.8,
    completedJobs: 45,
    createdAt: new Date().toISOString()
  },
  {
    id: "CONT_002",
    name: "PowerFix Electricals",
    phone: "0712345670",
    email: "info@powerfix.co.ke",
    specialties: ["electrical", "wiring", "appliances"],
    hourlyRate: 2000,
    isActive: true,
    rating: 4.9,
    completedJobs: 67,
    createdAt: new Date().toISOString()
  },
  {
    id: "CONT_003",
    name: "HandyMan Services",
    phone: "0734567890",
    specialties: ["general", "painting", "cleaning", "structural"],
    hourlyRate: 1200,
    isActive: true,
    rating: 4.5,
    completedJobs: 32,
    createdAt: new Date().toISOString()
  }
]

const maintenanceCategories: MaintenanceCategory[] = [
  {
    id: "plumbing",
    name: "Plumbing",
    icon: "wrench",
    averageCost: 3500,
    typicalTimeframe: "1-2 days",
    description: "Water pipes, sinks, toilets, showers"
  },
  {
    id: "electrical",
    name: "Electrical",
    icon: "lightning",
    averageCost: 2500,
    typicalTimeframe: "Same day",
    description: "Lights, switches, outlets, wiring"
  },
  {
    id: "appliances",
    name: "Appliances",
    icon: "home",
    averageCost: 4000,
    typicalTimeframe: "1-3 days",
    description: "Refrigerator, stove, water heater"
  },
  {
    id: "structural",
    name: "Structural",
    icon: "building",
    averageCost: 8000,
    typicalTimeframe: "3-7 days",
    description: "Walls, doors, windows, flooring"
  },
  {
    id: "cleaning",
    name: "Cleaning",
    icon: "broom",
    averageCost: 1500,
    typicalTimeframe: "Same day",
    description: "Deep cleaning, pest control"
  },
  {
    id: "other",
    name: "Other",
    icon: "hammer",
    averageCost: 2000,
    typicalTimeframe: "1-2 days",
    description: "General maintenance and repairs"
  }
]

export async function getMaintenanceRequests(
  status?: MaintenanceRequest['status'],
  priority?: MaintenanceRequest['priority'],
  category?: MaintenanceRequest['category'],
  limit?: number
): Promise<MaintenanceRequest[]> {
  let filtered = [...maintenanceRequests]
  
  if (status) {
    filtered = filtered.filter(req => req.status === status)
  }
  
  if (priority) {
    filtered = filtered.filter(req => req.priority === priority)
  }
  
  if (category) {
    filtered = filtered.filter(req => req.category === category)
  }
  
  filtered = filtered.sort((a, b) => {
    const priorityOrder = { urgent: 3, normal: 2, low: 1 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  })
  
  if (limit) {
    filtered = filtered.slice(0, limit)
  }
  
  return filtered
}

export async function createMaintenanceRequest(
  requestData: Omit<MaintenanceRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'submittedAt'>
): Promise<MaintenanceRequest> {
  const newRequest: MaintenanceRequest = {
    ...requestData,
    id: generateRequestId(),
    status: "submitted",
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  maintenanceRequests.push(newRequest)
  
  await sendMaintenanceNotification(newRequest, "new_request")
  
  
  return newRequest
}

export async function updateMaintenanceRequest(
  requestId: string,
  updates: Partial<MaintenanceRequest>
): Promise<MaintenanceRequest | null> {
  const requestIndex = maintenanceRequests.findIndex(req => req.id === requestId)
  if (requestIndex === -1) return null
  
  const request = maintenanceRequests[requestIndex]
  const oldStatus = request.status
  
  const now = new Date().toISOString()
  if (updates.status) {
    switch (updates.status) {
      case "acknowledged":
        updates.acknowledgedAt = now
        break
      case "in_progress":
        updates.startedAt = now
        break
      case "completed":
        updates.completedAt = now
        break
    }
  }
  
  updates.updatedAt = now
  
  maintenanceRequests[requestIndex] = { ...request, ...updates }
  const updatedRequest = maintenanceRequests[requestIndex]
  
  if (updates.status && updates.status !== oldStatus) {
    await sendMaintenanceNotification(updatedRequest, "status_update")
  }
  
  
  return updatedRequest
}

export async function getTenantMaintenanceRequests(tenantId: string): Promise<MaintenanceRequest[]> {
  return maintenanceRequests
    .filter(req => req.tenantId === tenantId)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
}

export async function getMaintenanceCategories(): Promise<MaintenanceCategory[]> {
  return maintenanceCategories
}

export async function getContractors(specialty?: string): Promise<Contractor[]> {
  let filtered = contractors.filter(c => c.isActive)
  
  if (specialty) {
    filtered = filtered.filter(c => c.specialties.includes(specialty))
  }
  
  return filtered.sort((a, b) => b.rating - a.rating)
}

export async function assignContractor(
  requestId: string,
  contractorId: string,
  estimatedCost?: number
): Promise<MaintenanceRequest | null> {
  const contractor = contractors.find(c => c.id === contractorId)
  if (!contractor) return null
  
  const updates: Partial<MaintenanceRequest> = {
    assignedContractor: {
      id: contractor.id,
      name: contractor.name,
      phone: contractor.phone,
      specialties: contractor.specialties
    },
    status: "acknowledged"
  }
  
  if (estimatedCost) {
    updates.estimatedCost = estimatedCost
  }
  
  return await updateMaintenanceRequest(requestId, updates)
}

export async function getMaintenanceStatistics(): Promise<{
  total: number
  byStatus: Record<MaintenanceRequest['status'], number>
  byPriority: Record<MaintenanceRequest['priority'], number>
  byCategory: Record<MaintenanceRequest['category'], number>
  avgResolutionTime: number
  totalCosts: number
  avgCostPerRequest: number
}> {
  const byStatus: Record<MaintenanceRequest['status'], number> = {
    submitted: 0,
    acknowledged: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0
  }
  
  const byPriority: Record<MaintenanceRequest['priority'], number> = {
    low: 0,
    normal: 0,
    urgent: 0
  }
  
  const byCategory: Record<MaintenanceRequest['category'], number> = {
    plumbing: 0,
    electrical: 0,
    appliances: 0,
    structural: 0,
    cleaning: 0,
    other: 0
  }
  
  let totalResolutionTime = 0
  let completedCount = 0
  let totalCosts = 0
  
  maintenanceRequests.forEach(req => {
    byStatus[req.status]++
    byPriority[req.priority]++
    byCategory[req.category]++
    
    if (req.actualCost) {
      totalCosts += req.actualCost
    }
    
    if (req.status === "completed" && req.submittedAt && req.completedAt) {
      const resolutionTime = new Date(req.completedAt).getTime() - new Date(req.submittedAt).getTime()
      totalResolutionTime += resolutionTime
      completedCount++
    }
  })
  
  const avgResolutionTime = completedCount > 0 ? totalResolutionTime / completedCount / (1000 * 60 * 60) : 0
  const avgCostPerRequest = maintenanceRequests.length > 0 ? totalCosts / maintenanceRequests.length : 0
  
  return {
    total: maintenanceRequests.length,
    byStatus,
    byPriority,
    byCategory,
    avgResolutionTime,
    totalCosts,
    avgCostPerRequest
  }
}

async function sendMaintenanceNotification(
  request: MaintenanceRequest,
  type: "new_request" | "status_update"
): Promise<void> {
  const { sendSMS } = await import("./sms-service")
  
  let message: string
  
  if (type === "new_request") {
    message = `NEW MAINTENANCE REQUEST\nUnit: ${request.unitNumber}\nTenant: ${request.tenantName}\nIssue: ${request.title}\nPriority: ${request.priority.toUpperCase()}\n\nView details in admin panel.`
    await sendSMS("0712345678", message, "maintenance")
  } else {
    const statusMessages = {
      acknowledged: "We've received your maintenance request and will schedule a repair soon.",
      in_progress: "Your maintenance request is now being worked on by our contractor.",
      completed: "Your maintenance request has been completed. Please confirm if resolved.",
      cancelled: "Your maintenance request has been cancelled. Contact us if you have questions."
    }
    
    message = `MAINTENANCE UPDATE\nUnit: ${request.unitNumber}\nIssue: ${request.title}\nStatus: ${request.status.toUpperCase()}\n\n${statusMessages[request.status] || ""}\n\nSunset Apartments`
    await sendSMS(request.phoneNumber, message, "maintenance")
  }
}

function generateRequestId(): string {
  return `MR_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
}