export interface PropertyInspection {
  id: string
  unitId: string
  unitNumber: string
  tenantId?: string
  tenantName?: string
  inspectionType: "move_in" | "move_out" | "routine" | "maintenance" | "emergency"
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  scheduledDate: string
  completedDate?: string
  inspectorName: string
  inspectorId: string
  purpose: string
  
  checklist: {
    category: string
    items: Array<{
      id: string
      description: string
      condition: "excellent" | "good" | "fair" | "poor" | "damaged" | "not_applicable"
      notes?: string
      photos?: string[]
      requiresAttention: boolean
    }>
  }[]
  
  overall: {
    overallCondition: "excellent" | "good" | "fair" | "poor"
    moveInReady: boolean
    estimatedRepairCost?: number
    keyIssues: string[]
    recommendations: string[]
  }
  
  signatures: {
    inspector: {
      signed: boolean
      signedAt?: string
      signatureImage?: string
    }
    tenant?: {
      signed: boolean
      signedAt?: string
      signatureImage?: string
    }
    landlord?: {
      signed: boolean
      signedAt?: string
      signatureImage?: string
    }
  }
  
  followUpRequired: boolean
  followUpItems?: Array<{
    description: string
    priority: "low" | "medium" | "high"
    estimatedCost?: number
    targetDate?: string
  }>
  
  photos: {
    general: string[]
    issues: string[]
    before?: string[]
    after?: string[]
  }
  
  report: {
    summary: string
    detailsGenerated: boolean
    reportUrl?: string
  }
  
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface InspectionTemplate {
  id: string
  name: string
  description: string
  inspectionType: PropertyInspection['inspectionType']
  categories: Array<{
    category: string
    items: Array<{
      id: string
      description: string
      isRequired: boolean
      photoRequired: boolean
    }>
  }>
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface Inspector {
  id: string
  name: string
  email: string
  phone: string
  certifications: string[]
  specialties: string[]
  isActive: boolean
  completedInspections: number
  averageRating: number
  createdAt: string
}

let propertyInspections: PropertyInspection[] = [
  {
    id: "INSP_001",
    unitId: "unit_1a",
    unitNumber: "1A",
    tenantId: "0712345678",
    tenantName: "John Doe",
    inspectionType: "move_in",
    status: "completed",
    scheduledDate: "2024-01-01T10:00:00Z",
    completedDate: "2024-01-01T11:30:00Z",
    inspectorName: "Sarah Wilson",
    inspectorId: "INSP_SW001",
    purpose: "Pre-occupancy inspection for new tenant",
    
    checklist: [
      {
        category: "Living Room",
        items: [
          {
            id: "lr_walls",
            description: "Walls and paint condition",
            condition: "good",
            notes: "Minor scuff marks on south wall",
            photos: ["/inspections/1a_living_walls.jpg"],
            requiresAttention: false
          },
          {
            id: "lr_flooring",
            description: "Flooring condition",
            condition: "excellent",
            requiresAttention: false
          },
          {
            id: "lr_windows",
            description: "Windows and frames",
            condition: "good",
            requiresAttention: false
          }
        ]
      },
      {
        category: "Kitchen",
        items: [
          {
            id: "k_appliances",
            description: "All appliances functioning",
            condition: "good",
            notes: "Refrigerator door seal needs attention",
            requiresAttention: true
          },
          {
            id: "k_plumbing",
            description: "Plumbing and fixtures",
            condition: "excellent",
            requiresAttention: false
          },
          {
            id: "k_counters",
            description: "Countertops and cabinets",
            condition: "good",
            requiresAttention: false
          }
        ]
      }
    ],
    
    overall: {
      overallCondition: "good",
      moveInReady: true,
      estimatedRepairCost: 2500,
      keyIssues: ["Refrigerator door seal", "Minor wall scuffs"],
      recommendations: ["Schedule appliance maintenance", "Touch up paint before next tenant"]
    },
    
    signatures: {
      inspector: {
        signed: true,
        signedAt: "2024-01-01T11:30:00Z",
        signatureImage: "/signatures/inspector_sw.png"
      },
      tenant: {
        signed: true,
        signedAt: "2024-01-01T11:45:00Z",
        signatureImage: "/signatures/tenant_jd.png"
      }
    },
    
    followUpRequired: true,
    followUpItems: [
      {
        description: "Replace refrigerator door seal",
        priority: "medium",
        estimatedCost: 1500,
        targetDate: "2024-01-15"
      },
      {
        description: "Touch up wall paint in living room",
        priority: "low",
        estimatedCost: 1000,
        targetDate: "2024-01-31"
      }
    ],
    
    photos: {
      general: ["/inspections/1a_overview1.jpg", "/inspections/1a_overview2.jpg"],
      issues: ["/inspections/1a_fridge_seal.jpg", "/inspections/1a_wall_scuffs.jpg"],
      before: []
    },
    
    report: {
      summary: "Unit is in good overall condition and ready for occupancy with minor maintenance items.",
      detailsGenerated: true,
      reportUrl: "/reports/inspection_1a_20240101.pdf"
    },
    
    createdAt: "2023-12-28T09:00:00Z",
    updatedAt: "2024-01-01T11:45:00Z",
    createdBy: "admin"
  },
  {
    id: "INSP_002",
    unitId: "unit_2b",
    unitNumber: "2B",
    inspectionType: "routine",
    status: "scheduled",
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    inspectorName: "Mike Thompson",
    inspectorId: "INSP_MT002",
    purpose: "6-month routine inspection",
    
    checklist: [],
    
    overall: {
      overallCondition: "good",
      moveInReady: true,
      keyIssues: [],
      recommendations: []
    },
    
    signatures: {
      inspector: { signed: false }
    },
    
    followUpRequired: false,
    
    photos: {
      general: [],
      issues: []
    },
    
    report: {
      summary: "",
      detailsGenerated: false
    },
    
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "admin"
  }
]

let inspectors: Inspector[] = [
  {
    id: "INSP_SW001",
    name: "Sarah Wilson",
    email: "sarah@inspections.co.ke",
    phone: "0711223344",
    certifications: ["Certified Property Inspector", "Mold Assessment"],
    specialties: ["Residential", "Move-in/Move-out", "Routine"],
    isActive: true,
    completedInspections: 156,
    averageRating: 4.8,
    createdAt: "2023-01-15T00:00:00Z"
  },
  {
    id: "INSP_MT002",
    name: "Mike Thompson",
    email: "mike@inspections.co.ke", 
    phone: "0722334455",
    certifications: ["Property Inspector", "HVAC Systems"],
    specialties: ["Maintenance", "HVAC", "Emergency"],
    isActive: true,
    completedInspections: 89,
    averageRating: 4.6,
    createdAt: "2023-03-22T00:00:00Z"
  }
]

let inspectionTemplates: InspectionTemplate[] = [
  {
    id: "TMPL_MOVEIN",
    name: "Move-In Inspection",
    description: "Comprehensive move-in inspection checklist",
    inspectionType: "move_in",
    categories: [
      {
        category: "Living Room",
        items: [
          { id: "lr_walls", description: "Walls and paint condition", isRequired: true, photoRequired: true },
          { id: "lr_flooring", description: "Flooring condition", isRequired: true, photoRequired: true },
          { id: "lr_windows", description: "Windows and frames", isRequired: true, photoRequired: false },
          { id: "lr_lighting", description: "Light fixtures and switches", isRequired: true, photoRequired: false },
          { id: "lr_outlets", description: "Electrical outlets", isRequired: true, photoRequired: false }
        ]
      },
      {
        category: "Kitchen",
        items: [
          { id: "k_appliances", description: "All appliances functioning", isRequired: true, photoRequired: true },
          { id: "k_plumbing", description: "Plumbing and fixtures", isRequired: true, photoRequired: false },
          { id: "k_counters", description: "Countertops and cabinets", isRequired: true, photoRequired: true },
          { id: "k_ventilation", description: "Ventilation and exhaust", isRequired: true, photoRequired: false }
        ]
      },
      {
        category: "Bedrooms",
        items: [
          { id: "br_walls", description: "Walls and paint", isRequired: true, photoRequired: true },
          { id: "br_flooring", description: "Flooring condition", isRequired: true, photoRequired: true },
          { id: "br_closets", description: "Closet doors and fixtures", isRequired: true, photoRequired: false },
          { id: "br_windows", description: "Windows and blinds", isRequired: true, photoRequired: false }
        ]
      },
      {
        category: "Bathrooms",
        items: [
          { id: "br_fixtures", description: "All plumbing fixtures", isRequired: true, photoRequired: true },
          { id: "br_tiles", description: "Tile and grout condition", isRequired: true, photoRequired: true },
          { id: "br_ventilation", description: "Exhaust fan operation", isRequired: true, photoRequired: false },
          { id: "br_mirrors", description: "Mirrors and medicine cabinet", isRequired: true, photoRequired: false }
        ]
      }
    ],
    isDefault: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
]

export async function getPropertyInspections(
  status?: PropertyInspection['status'],
  inspectionType?: PropertyInspection['inspectionType'],
  unitId?: string
): Promise<PropertyInspection[]> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  let filtered = [...propertyInspections]
  
  if (status) {
    filtered = filtered.filter(inspection => inspection.status === status)
  }
  
  if (inspectionType) {
    filtered = filtered.filter(inspection => inspection.inspectionType === inspectionType)
  }
  
  if (unitId) {
    filtered = filtered.filter(inspection => inspection.unitId === unitId)
  }
  
  return filtered.sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
}

export async function getPropertyInspection(inspectionId: string): Promise<PropertyInspection | null> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return propertyInspections.find(inspection => inspection.id === inspectionId) || null
}

export async function createPropertyInspection(
  inspectionData: Omit<PropertyInspection, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'checklist' | 'overall' | 'signatures' | 'photos' | 'report'>
): Promise<PropertyInspection> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const newInspection: PropertyInspection = {
    ...inspectionData,
    id: generateInspectionId(),
    status: "scheduled",
    checklist: [],
    overall: {
      overallCondition: "good",
      moveInReady: true,
      keyIssues: [],
      recommendations: []
    },
    signatures: {
      inspector: { signed: false }
    },
    followUpRequired: false,
    photos: {
      general: [],
      issues: []
    },
    report: {
      summary: "",
      detailsGenerated: false
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  propertyInspections.push(newInspection)
  return newInspection
}

export async function updateInspectionStatus(
  inspectionId: string,
  status: PropertyInspection['status'],
  completedDate?: string
): Promise<PropertyInspection | null> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const inspectionIndex = propertyInspections.findIndex(insp => insp.id === inspectionId)
  if (inspectionIndex === -1) return null
  
  const updates: Partial<PropertyInspection> = {
    status,
    updatedAt: new Date().toISOString()
  }
  
  if (status === "completed" && completedDate) {
    updates.completedDate = completedDate
  }
  
  propertyInspections[inspectionIndex] = {
    ...propertyInspections[inspectionIndex],
    ...updates
  }
  
  return propertyInspections[inspectionIndex]
}

export async function updateInspectionChecklist(
  inspectionId: string,
  checklist: PropertyInspection['checklist']
): Promise<PropertyInspection | null> {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  const inspectionIndex = propertyInspections.findIndex(insp => insp.id === inspectionId)
  if (inspectionIndex === -1) return null
  
  propertyInspections[inspectionIndex] = {
    ...propertyInspections[inspectionIndex],
    checklist,
    updatedAt: new Date().toISOString()
  }
  
  return propertyInspections[inspectionIndex]
}

export async function completeInspection(
  inspectionId: string,
  completionData: {
    overall: PropertyInspection['overall']
    followUpItems?: PropertyInspection['followUpItems']
    summary: string
  }
): Promise<PropertyInspection | null> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const inspectionIndex = propertyInspections.findIndex(insp => insp.id === inspectionId)
  if (inspectionIndex === -1) return null
  
  const inspection = propertyInspections[inspectionIndex]
  
  propertyInspections[inspectionIndex] = {
    ...inspection,
    status: "completed",
    completedDate: new Date().toISOString(),
    overall: completionData.overall,
    followUpRequired: (completionData.followUpItems?.length || 0) > 0,
    followUpItems: completionData.followUpItems,
    report: {
      summary: completionData.summary,
      detailsGenerated: true,
      reportUrl: `/reports/inspection_${inspection.unitNumber.toLowerCase()}_${Date.now()}.pdf`
    },
    updatedAt: new Date().toISOString()
  }
  
  if (inspection.tenantId) {
    await sendInspectionNotification(propertyInspections[inspectionIndex], "completed")
  }
  
  return propertyInspections[inspectionIndex]
}

export async function signInspection(
  inspectionId: string,
  signatureType: 'inspector' | 'tenant' | 'landlord',
  signatureData: {
    signatureImage?: string
  }
): Promise<PropertyInspection | null> {
  await new Promise(resolve => setTimeout(resolve, 700))
  
  const inspectionIndex = propertyInspections.findIndex(insp => insp.id === inspectionId)
  if (inspectionIndex === -1) return null
  
  const inspection = propertyInspections[inspectionIndex]
  const now = new Date().toISOString()
  
  if (signatureType === 'inspector') {
    inspection.signatures.inspector = {
      signed: true,
      signedAt: now,
      signatureImage: signatureData.signatureImage
    }
  } else if (signatureType === 'tenant') {
    inspection.signatures.tenant = {
      signed: true,
      signedAt: now,
      signatureImage: signatureData.signatureImage
    }
  } else if (signatureType === 'landlord') {
    inspection.signatures.landlord = {
      signed: true,
      signedAt: now,
      signatureImage: signatureData.signatureImage
    }
  }
  
  inspection.updatedAt = now
  propertyInspections[inspectionIndex] = inspection
  
  return inspection
}

export async function getInspectors(): Promise<Inspector[]> {
  await new Promise(resolve => setTimeout(resolve, 400))
  return inspectors.filter(inspector => inspector.isActive)
    .sort((a, b) => b.averageRating - a.averageRating)
}

export async function getInspectionTemplates(): Promise<InspectionTemplate[]> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return inspectionTemplates.sort((a, b) => a.isDefault ? -1 : 1)
}

export async function getInspectionTemplate(templateId: string): Promise<InspectionTemplate | null> {
  await new Promise(resolve => setTimeout(resolve, 200))
  return inspectionTemplates.find(template => template.id === templateId) || null
}

export async function getUpcomingInspections(days: number = 7): Promise<PropertyInspection[]> {
  await new Promise(resolve => setTimeout(resolve, 400))
  
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() + days)
  
  return propertyInspections.filter(inspection => {
    const scheduledDate = new Date(inspection.scheduledDate)
    return scheduledDate <= cutoffDate && inspection.status === 'scheduled'
  }).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
}

export async function getInspectionStatistics(): Promise<{
  totalInspections: number
  completedThisMonth: number
  upcomingThisWeek: number
  overdueInspections: number
  averageCompletionTime: number
  followUpRequired: number
  byType: Record<PropertyInspection['inspectionType'], number>
  byStatus: Record<PropertyInspection['status'], number>
}> {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  const now = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisWeekEnd = new Date(now)
  thisWeekEnd.setDate(now.getDate() + 7)
  
  const completedThisMonth = propertyInspections.filter(insp => 
    insp.status === 'completed' && 
    insp.completedDate && 
    new Date(insp.completedDate) >= thisMonth
  ).length
  
  const upcomingThisWeek = propertyInspections.filter(insp =>
    insp.status === 'scheduled' &&
    new Date(insp.scheduledDate) <= thisWeekEnd &&
    new Date(insp.scheduledDate) >= now
  ).length
  
  const overdueInspections = propertyInspections.filter(insp =>
    insp.status === 'scheduled' &&
    new Date(insp.scheduledDate) < now
  ).length
  
  const followUpRequired = propertyInspections.filter(insp =>
    insp.followUpRequired
  ).length
  
  const byType: Record<PropertyInspection['inspectionType'], number> = {
    move_in: 0,
    move_out: 0,
    routine: 0,
    maintenance: 0,
    emergency: 0
  }
  
  const byStatus: Record<PropertyInspection['status'], number> = {
    scheduled: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0
  }
  
  propertyInspections.forEach(insp => {
    byType[insp.inspectionType]++
    byStatus[insp.status]++
  })
  
  return {
    totalInspections: propertyInspections.length,
    completedThisMonth,
    upcomingThisWeek,
    overdueInspections,
    averageCompletionTime: 2.5,
    followUpRequired,
    byType,
    byStatus
  }
}

async function sendInspectionNotification(
  inspection: PropertyInspection,
  type: "scheduled" | "completed" | "follow_up_required"
): Promise<void> {
  if (!inspection.tenantId) return
  
  const { sendSMS } = await import("./sms-service")
  
  let message: string
  
  if (type === "scheduled") {
    message = `INSPECTION SCHEDULED\nUnit: ${inspection.unitNumber}\nDate: ${new Date(inspection.scheduledDate).toLocaleDateString()}\nType: ${inspection.inspectionType.replace('_', ' ').toUpperCase()}\nInspector: ${inspection.inspectorName}\n\nSunset Apartments`
  } else if (type === "completed") {
    message = `INSPECTION COMPLETED\nUnit: ${inspection.unitNumber}\nOverall Condition: ${inspection.overall.overallCondition.toUpperCase()}\nFollow-up needed: ${inspection.followUpRequired ? 'Yes' : 'No'}\nReport available in tenant portal.\n\nSunset Apartments`
  } else {
    message = `FOLLOW-UP REQUIRED\nUnit: ${inspection.unitNumber}\nItems need attention after recent inspection.\nPlease check tenant portal for details.\n\nSunset Apartments`
  }
  
  await sendSMS(inspection.tenantId, message, "inspection")
}

function generateInspectionId(): string {
  return `INSP_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
}