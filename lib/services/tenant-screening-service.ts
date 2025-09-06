export interface TenantApplication {
  id: string
  unitId: string
  unitNumber: string
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected" | "lease_signed"
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: string
    idNumber: string
    idType: "national_id" | "passport" | "drivers_license"
    maritalStatus: "single" | "married" | "divorced" | "widowed"
    nationality: string
    emergencyContact: {
      name: string
      phone: string
      relationship: string
    }
  }
  employment: {
    status: "employed" | "self_employed" | "unemployed" | "student" | "retired"
    employer?: string
    jobTitle?: string
    monthlyIncome: number
    employmentLength?: string
    previousEmployer?: string
    businessName?: string
    businessType?: string
  }
  financialInfo: {
    bankName: string
    accountType: "savings" | "current"
    creditScore?: number
    monthlyExpenses: number
    otherIncome?: number
    hasExistingLoans: boolean
    loanDetails?: string
    canPayDeposit: boolean
    preferredMoveInDate: string
  }
  references: {
    previousLandlord?: {
      name: string
      phone: string
      address: string
      rentAmount: number
      tenancyPeriod: string
    }
    personalReferences: Array<{
      name: string
      phone: string
      relationship: string
      yearsKnown: number
    }>
  }
  documents: {
    idCopy?: string
    payslips?: string[]
    bankStatements?: string[]
    employmentLetter?: string
    previousLeaseAgreement?: string
    passportPhoto?: string
  }
  screening: {
    creditCheckStatus?: "pending" | "completed" | "failed"
    creditCheckScore?: number
    backgroundCheckStatus?: "pending" | "completed" | "failed"
    backgroundCheckNotes?: string
    incomeVerificationStatus?: "pending" | "verified" | "rejected"
    referenceCheckStatus?: "pending" | "completed" | "issues_found"
    referenceCheckNotes?: string
    overallRisk: "low" | "medium" | "high"
    recommendedAction: "approve" | "approve_with_conditions" | "reject"
    screeningNotes?: string
  }
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  createdAt: string
  updatedAt: string
}

export interface ScreeningCriteria {
  minCreditScore: number
  minIncomeMultiplier: number
  maxIncomeToRentRatio: number
  requiredDocuments: string[]
  backgroundCheckRequired: boolean
  minimumEmploymentPeriod: number
  requiresPreviousLandlordReference: boolean
}

export interface UnitListing {
  id: string
  unitNumber: string
  floor: number
  bedrooms: number
  bathrooms: number
  squareFeet: number
  rentAmount: number
  depositAmount: number
  isAvailable: boolean
  availableFrom: string
  description: string
  amenities: string[]
  photos: string[]
  virtualTourUrl?: string
  createdAt: string
  updatedAt: string
}

let tenantApplications: TenantApplication[] = [
  {
    id: "APP_001",
    unitId: "unit_3c",
    unitNumber: "3C",
    status: "under_review",
    personalInfo: {
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@email.com",
      phone: "0722334455",
      dateOfBirth: "1990-03-15",
      idNumber: "32567890",
      idType: "national_id",
      maritalStatus: "single",
      nationality: "Kenyan",
      emergencyContact: {
        name: "Mary Johnson",
        phone: "0733445566",
        relationship: "Mother"
      }
    },
    employment: {
      status: "employed",
      employer: "Tech Solutions Ltd",
      jobTitle: "Software Developer",
      monthlyIncome: 85000,
      employmentLength: "2 years",
      previousEmployer: "StartupTech"
    },
    financialInfo: {
      bankName: "KCB Bank",
      accountType: "savings",
      creditScore: 720,
      monthlyExpenses: 35000,
      otherIncome: 10000,
      hasExistingLoans: false,
      canPayDeposit: true,
      preferredMoveInDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    references: {
      previousLandlord: {
        name: "John Smith",
        phone: "0711223344",
        address: "Kileleshwa Apartments",
        rentAmount: 45000,
        tenancyPeriod: "18 months"
      },
      personalReferences: [
        {
          name: "David Kariuki",
          phone: "0744556677",
          relationship: "Colleague",
          yearsKnown: 3
        },
        {
          name: "Grace Wanjiku",
          phone: "0755667788",
          relationship: "Friend",
          yearsKnown: 5
        }
      ]
    },
    documents: {
      idCopy: "/documents/sarah_id.pdf",
      payslips: ["/documents/sarah_payslip_1.pdf", "/documents/sarah_payslip_2.pdf"],
      bankStatements: ["/documents/sarah_bank_stmt.pdf"],
      employmentLetter: "/documents/sarah_employment.pdf",
      passportPhoto: "/documents/sarah_photo.jpg"
    },
    screening: {
      creditCheckStatus: "completed",
      creditCheckScore: 720,
      backgroundCheckStatus: "completed",
      incomeVerificationStatus: "verified",
      referenceCheckStatus: "completed",
      overallRisk: "low",
      recommendedAction: "approve",
      screeningNotes: "Excellent candidate with strong financial background and good references."
    },
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedBy: "admin",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
]

let unitListings: UnitListing[] = [
  {
    id: "unit_3c",
    unitNumber: "3C",
    floor: 3,
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 900,
    rentAmount: 55000,
    depositAmount: 55000,
    isAvailable: true,
    availableFrom: new Date().toISOString().split('T')[0],
    description: "Spacious 2-bedroom apartment with modern amenities, great natural light, and balcony overlooking the garden.",
    amenities: ["Parking", "24/7 Security", "Water Backup", "Gym Access", "Balcony"],
    photos: ["/units/3c_living.jpg", "/units/3c_bedroom.jpg", "/units/3c_kitchen.jpg"],
    virtualTourUrl: "https://virtualtour.com/unit3c",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "unit_2d",
    unitNumber: "2D",
    floor: 2,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 650,
    rentAmount: 42000,
    depositAmount: 42000,
    isAvailable: true,
    availableFrom: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: "Cozy 1-bedroom apartment perfect for professionals. Recently renovated with modern fixtures.",
    amenities: ["Parking", "24/7 Security", "Water Backup"],
    photos: ["/units/2d_main.jpg", "/units/2d_bedroom.jpg"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const defaultScreeningCriteria: ScreeningCriteria = {
  minCreditScore: 650,
  minIncomeMultiplier: 3,
  maxIncomeToRentRatio: 30,
  requiredDocuments: ["idCopy", "payslips", "bankStatements"],
  backgroundCheckRequired: true,
  minimumEmploymentPeriod: 6,
  requiresPreviousLandlordReference: true
}

export async function getUnitListings(availableOnly: boolean = true): Promise<UnitListing[]> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  if (availableOnly) {
    return unitListings.filter(unit => unit.isAvailable)
  }
  
  return unitListings.sort((a, b) => a.unitNumber.localeCompare(b.unitNumber))
}

export async function getUnitListing(unitId: string): Promise<UnitListing | null> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return unitListings.find(unit => unit.id === unitId) || null
}

export async function createTenantApplication(
  applicationData: Omit<TenantApplication, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'submittedAt'>
): Promise<TenantApplication> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const newApplication: TenantApplication = {
    ...applicationData,
    id: generateApplicationId(),
    status: "draft",
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  tenantApplications.push(newApplication)
  return newApplication
}

export async function submitTenantApplication(applicationId: string): Promise<TenantApplication | null> {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  const applicationIndex = tenantApplications.findIndex(app => app.id === applicationId)
  if (applicationIndex === -1) return null
  
  tenantApplications[applicationIndex] = {
    ...tenantApplications[applicationIndex],
    status: "submitted",
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  return tenantApplications[applicationIndex]
}

export async function getTenantApplications(
  status?: TenantApplication['status'],
  unitId?: string
): Promise<TenantApplication[]> {
  await new Promise(resolve => setTimeout(resolve, 400))
  
  let filtered = [...tenantApplications]
  
  if (status) {
    filtered = filtered.filter(app => app.status === status)
  }
  
  if (unitId) {
    filtered = filtered.filter(app => app.unitId === unitId)
  }
  
  return filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
}

export async function getTenantApplication(applicationId: string): Promise<TenantApplication | null> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return tenantApplications.find(app => app.id === applicationId) || null
}

export async function updateApplicationStatus(
  applicationId: string,
  status: TenantApplication['status'],
  reviewNotes?: string
): Promise<TenantApplication | null> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const applicationIndex = tenantApplications.findIndex(app => app.id === applicationId)
  if (applicationIndex === -1) return null
  
  const updates: Partial<TenantApplication> = {
    status,
    updatedAt: new Date().toISOString()
  }
  
  if (status === "under_review" || status === "approved" || status === "rejected") {
    updates.reviewedAt = new Date().toISOString()
    updates.reviewedBy = "admin"
  }
  
  if (reviewNotes && tenantApplications[applicationIndex].screening) {
    updates.screening = {
      ...tenantApplications[applicationIndex].screening,
      screeningNotes: reviewNotes
    }
  }
  
  tenantApplications[applicationIndex] = {
    ...tenantApplications[applicationIndex],
    ...updates
  }
  
  return tenantApplications[applicationIndex]
}

export async function performScreeningCheck(
  applicationId: string,
  checkType: "credit" | "background" | "income" | "references"
): Promise<TenantApplication | null> {
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const applicationIndex = tenantApplications.findIndex(app => app.id === applicationId)
  if (applicationIndex === -1) return null
  
  const application = tenantApplications[applicationIndex]
  const screening = application.screening || {}
  
  switch (checkType) {
    case "credit":
      screening.creditCheckStatus = "completed"
      screening.creditCheckScore = Math.floor(Math.random() * 200) + 600
      break
    
    case "background":
      screening.backgroundCheckStatus = "completed"
      screening.backgroundCheckNotes = "No criminal record found. Clean background check."
      break
    
    case "income":
      const incomeToRentRatio = (application.employment.monthlyIncome / unitListings.find(u => u.id === application.unitId)!.rentAmount) * 100
      screening.incomeVerificationStatus = incomeToRentRatio >= 300 ? "verified" : "rejected"
      break
    
    case "references":
      screening.referenceCheckStatus = "completed"
      screening.referenceCheckNotes = "Previous landlord and personal references provided positive feedback."
      break
  }
  
  const overallRisk = calculateRisk(application)
  screening.overallRisk = overallRisk
  screening.recommendedAction = overallRisk === "low" ? "approve" : overallRisk === "medium" ? "approve_with_conditions" : "reject"
  
  tenantApplications[applicationIndex] = {
    ...application,
    screening,
    updatedAt: new Date().toISOString()
  }
  
  return tenantApplications[applicationIndex]
}

export async function getScreeningCriteria(): Promise<ScreeningCriteria> {
  await new Promise(resolve => setTimeout(resolve, 200))
  return defaultScreeningCriteria
}

export async function getApplicationStatistics(): Promise<{
  total: number
  byStatus: Record<TenantApplication['status'], number>
  avgProcessingTime: number
  approvalRate: number
  topRejectReasons: Array<{ reason: string; count: number }>
}> {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  const byStatus: Record<TenantApplication['status'], number> = {
    draft: 0,
    submitted: 0,
    under_review: 0,
    approved: 0,
    rejected: 0,
    lease_signed: 0
  }
  
  let totalProcessingTime = 0
  let processedCount = 0
  let approvedCount = 0
  let rejectedCount = 0
  
  tenantApplications.forEach(app => {
    byStatus[app.status]++
    
    if (app.status === "approved" || app.status === "rejected") {
      if (app.reviewedAt && app.submittedAt) {
        const processingTime = new Date(app.reviewedAt).getTime() - new Date(app.submittedAt).getTime()
        totalProcessingTime += processingTime
        processedCount++
      }
      
      if (app.status === "approved") approvedCount++
      if (app.status === "rejected") rejectedCount++
    }
  })
  
  const avgProcessingTime = processedCount > 0 ? totalProcessingTime / processedCount / (1000 * 60 * 60 * 24) : 0
  const approvalRate = (approvedCount + rejectedCount) > 0 ? (approvedCount / (approvedCount + rejectedCount)) * 100 : 0
  
  return {
    total: tenantApplications.length,
    byStatus,
    avgProcessingTime,
    approvalRate,
    topRejectReasons: [
      { reason: "Insufficient Income", count: 3 },
      { reason: "Poor Credit History", count: 2 },
      { reason: "Incomplete Documents", count: 1 }
    ]
  }
}

function calculateRisk(application: TenantApplication): "low" | "medium" | "high" {
  let riskScore = 0
  
  const unit = unitListings.find(u => u.id === application.unitId)
  if (!unit) return "high"
  
  const incomeToRentRatio = application.employment.monthlyIncome / unit.rentAmount
  if (incomeToRentRatio < 3) riskScore += 30
  else if (incomeToRentRatio < 4) riskScore += 15
  
  if (application.screening?.creditCheckScore) {
    if (application.screening.creditCheckScore < 650) riskScore += 25
    else if (application.screening.creditCheckScore < 700) riskScore += 10
  }
  
  if (application.employment.status === "unemployed") riskScore += 40
  else if (application.employment.status === "self_employed") riskScore += 15
  
  if (!application.references.previousLandlord) riskScore += 10
  
  if (application.financialInfo.hasExistingLoans) riskScore += 10
  
  if (riskScore <= 20) return "low"
  if (riskScore <= 40) return "medium"
  return "high"
}

function generateApplicationId(): string {
  return `APP_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
}