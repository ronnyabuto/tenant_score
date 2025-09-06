// Document Service - Digital document management and e-signatures

export interface Document {
  id: string
  name: string
  type: "lease_agreement" | "id_document" | "receipt" | "photo" | "other"
  category: "tenant_documents" | "property_documents" | "financial_records"
  tenantId?: string
  unitNumber?: string
  fileUrl: string
  fileName: string
  fileSize: number // in bytes
  mimeType: string
  uploadedBy: string
  uploadedAt: string
  isVerified?: boolean
  verifiedBy?: string
  verifiedAt?: string
  tags: string[]
  description?: string
  expiryDate?: string
  isActive: boolean
  signatureRequired: boolean
  signedBy?: string[]
  signedAt?: string
  createdAt: string
  updatedAt: string
}

export interface LeaseAgreement extends Document {
  leaseDetails: {
    startDate: string
    endDate: string
    monthlyRent: number
    securityDeposit: number
    terms: string[]
    specialConditions?: string[]
  }
  signatures: {
    landlord: {
      signed: boolean
      signedAt?: string
      signatureUrl?: string
    }
    tenant: {
      signed: boolean
      signedAt?: string
      signatureUrl?: string
    }
  }
  status: "draft" | "pending_signature" | "fully_signed" | "expired" | "terminated"
}

export interface DocumentCategory {
  id: string
  name: string
  description: string
  icon: string
  requiredForTenant: boolean
  maxFileSize: number // in MB
  allowedTypes: string[]
  retentionPeriod?: number // in years
}

// In-memory storage for demo (replace with database)
let documents: Document[] = [
  {
    id: "DOC_001",
    name: "John Doe - National ID",
    type: "id_document",
    category: "tenant_documents",
    tenantId: "0712345678",
    unitNumber: "1A",
    fileUrl: "/documents/id_john_doe.pdf",
    fileName: "john_doe_id.pdf",
    fileSize: 2048576, // 2MB
    mimeType: "application/pdf",
    uploadedBy: "tenant",
    uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isVerified: true,
    verifiedBy: "admin",
    verifiedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ["id", "verification", "required"],
    description: "National ID copy for tenant verification",
    isActive: true,
    signatureRequired: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "DOC_002",
    name: "Unit 1A Lease Agreement",
    type: "lease_agreement",
    category: "tenant_documents",
    tenantId: "0712345678",
    unitNumber: "1A",
    fileUrl: "/documents/lease_1a_john_doe.pdf",
    fileName: "lease_agreement_1a.pdf",
    fileSize: 1536000, // 1.5MB
    mimeType: "application/pdf",
    uploadedBy: "admin",
    uploadedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    isVerified: true,
    verifiedBy: "admin",
    verifiedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ["lease", "legal", "signed"],
    description: "12-month lease agreement for Unit 1A",
    expiryDate: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(), // ~10 months
    isActive: true,
    signatureRequired: true,
    signedBy: ["landlord", "tenant"],
    signedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString()
  }
]

const documentCategories: DocumentCategory[] = [
  {
    id: "tenant_documents",
    name: "Tenant Documents",
    description: "Personal documents and agreements for tenants",
    icon: "👤",
    requiredForTenant: true,
    maxFileSize: 10, // 10MB
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    retentionPeriod: 7 // 7 years
  },
  {
    id: "property_documents",
    name: "Property Documents",
    description: "Building permits, inspections, and property records",
    icon: "🏠",
    requiredForTenant: false,
    maxFileSize: 25, // 25MB
    allowedTypes: ["application/pdf", "image/jpeg", "image/png", "application/msword"],
    retentionPeriod: 10 // 10 years
  },
  {
    id: "financial_records",
    name: "Financial Records",
    description: "Receipts, invoices, and payment records",
    icon: "💰",
    requiredForTenant: false,
    maxFileSize: 5, // 5MB
    allowedTypes: ["application/pdf", "image/jpeg", "image/png", "application/vnd.ms-excel"],
    retentionPeriod: 5 // 5 years
  }
]

/**
 * Get all documents with filtering
 */
export async function getDocuments(
  category?: string,
  type?: Document['type'],
  tenantId?: string,
  verified?: boolean,
  limit?: number
): Promise<Document[]> {
  let filtered = documents.filter(doc => doc.isActive)
  
  if (category) {
    filtered = filtered.filter(doc => doc.category === category)
  }
  
  if (type) {
    filtered = filtered.filter(doc => doc.type === type)
  }
  
  if (tenantId) {
    filtered = filtered.filter(doc => doc.tenantId === tenantId)
  }
  
  if (verified !== undefined) {
    filtered = filtered.filter(doc => doc.isVerified === verified)
  }
  
  // Sort by upload date (newest first)
  filtered = filtered.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  
  if (limit) {
    filtered = filtered.slice(0, limit)
  }
  
  return filtered
}

/**
 * Upload new document
 */
export async function uploadDocument(
  documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'uploadedAt' | 'isActive'>
): Promise<Document> {
  const newDocument: Document = {
    ...documentData,
    id: generateDocumentId(),
    uploadedAt: new Date().toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  documents.push(newDocument)
  
  console.log(`📄 Document uploaded: ${newDocument.name} (${newDocument.type})`)
  
  // Send notification if document requires verification
  if (documentData.type === "id_document" || documentData.type === "lease_agreement") {
    await sendDocumentNotification(newDocument, "uploaded")
  }
  
  return newDocument
}

/**
 * Verify document
 */
export async function verifyDocument(
  documentId: string,
  verifiedBy: string,
  notes?: string
): Promise<Document | null> {
  const documentIndex = documents.findIndex(doc => doc.id === documentId)
  if (documentIndex === -1) return null
  
  const document = documents[documentIndex]
  
  documents[documentIndex] = {
    ...document,
    isVerified: true,
    verifiedBy,
    verifiedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  const verifiedDocument = documents[documentIndex]
  
  // Send verification notification
  await sendDocumentNotification(verifiedDocument, "verified")
  
  console.log(`✅ Document verified: ${verifiedDocument.name}`)
  
  return verifiedDocument
}

/**
 * Create lease agreement
 */
export async function createLeaseAgreement(
  tenantId: string,
  unitNumber: string,
  leaseDetails: LeaseAgreement['leaseDetails']
): Promise<LeaseAgreement> {
  const leaseDocument: LeaseAgreement = {
    id: generateDocumentId(),
    name: `Unit ${unitNumber} Lease Agreement`,
    type: "lease_agreement",
    category: "tenant_documents",
    tenantId,
    unitNumber,
    fileUrl: `/documents/lease_${unitNumber.toLowerCase()}_draft.pdf`,
    fileName: `lease_agreement_${unitNumber.toLowerCase()}.pdf`,
    fileSize: 0, // Will be set after generation
    mimeType: "application/pdf",
    uploadedBy: "admin",
    uploadedAt: new Date().toISOString(),
    isVerified: false,
    tags: ["lease", "draft", "pending"],
    description: `Lease agreement for Unit ${unitNumber}`,
    expiryDate: leaseDetails.endDate,
    isActive: true,
    signatureRequired: true,
    leaseDetails,
    signatures: {
      landlord: { signed: false },
      tenant: { signed: false }
    },
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  documents.push(leaseDocument as Document)
  
  console.log(`📄 Lease agreement created for Unit ${unitNumber}`)
  
  return leaseDocument
}

/**
 * Sign document
 */
export async function signDocument(
  documentId: string,
  signerType: "landlord" | "tenant",
  signatureData: string
): Promise<Document | null> {
  const documentIndex = documents.findIndex(doc => doc.id === documentId)
  if (documentIndex === -1) return null
  
  const document = documents[documentIndex]
  
  if (document.type === "lease_agreement") {
    const leaseDoc = document as any // Cast to access lease-specific properties
    
    leaseDoc.signatures[signerType] = {
      signed: true,
      signedAt: new Date().toISOString(),
      signatureUrl: `/signatures/${documentId}_${signerType}.png`
    }
    
    // Update signed by array
    if (!document.signedBy) {
      document.signedBy = []
    }
    if (!document.signedBy.includes(signerType)) {
      document.signedBy.push(signerType)
    }
    
    // Check if fully signed
    if (leaseDoc.signatures.landlord.signed && leaseDoc.signatures.tenant.signed) {
      leaseDoc.status = "fully_signed"
      document.signedAt = new Date().toISOString()
      document.isVerified = true
      document.verifiedBy = "system"
      document.verifiedAt = new Date().toISOString()
    } else {
      leaseDoc.status = "pending_signature"
    }
  }
  
  document.updatedAt = new Date().toISOString()
  documents[documentIndex] = document
  
  // Send signature notification
  await sendDocumentNotification(document, "signed")
  
  console.log(`✍️ Document signed by ${signerType}: ${document.name}`)
  
  return document
}

/**
 * Get tenant documents summary
 */
export async function getTenantDocumentsSummary(tenantId: string): Promise<{
  total: number
  verified: number
  pending: number
  required: DocumentCategory[]
  missing: string[]
  documents: Document[]
}> {
  const tenantDocs = documents.filter(doc => doc.tenantId === tenantId && doc.isActive)
  const verified = tenantDocs.filter(doc => doc.isVerified).length
  const pending = tenantDocs.filter(doc => !doc.isVerified).length
  
  const requiredCategories = documentCategories.filter(cat => cat.requiredForTenant)
  const requiredTypes = ["id_document", "lease_agreement"]
  
  const existingTypes = tenantDocs.map(doc => doc.type)
  const missing = requiredTypes.filter(type => !existingTypes.includes(type))
  
  return {
    total: tenantDocs.length,
    verified,
    pending,
    required: requiredCategories,
    missing,
    documents: tenantDocs
  }
}

/**
 * Get document categories
 */
export async function getDocumentCategories(): Promise<DocumentCategory[]> {
  return documentCategories
}

/**
 * Get documents expiring soon
 */
export async function getExpiringDocuments(daysAhead: number = 30): Promise<Document[]> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() + daysAhead)
  
  return documents.filter(doc => 
    doc.isActive &&
    doc.expiryDate &&
    new Date(doc.expiryDate) <= cutoffDate &&
    new Date(doc.expiryDate) > new Date()
  ).sort((a, b) => new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime())
}

/**
 * Get document statistics
 */
export async function getDocumentStatistics(): Promise<{
  total: number
  byCategory: Record<string, number>
  byType: Record<string, number>
  verified: number
  pending: number
  expiringSoon: number
  totalFileSize: number // in MB
  averageFileSize: number // in MB
}> {
  const activeDocuments = documents.filter(doc => doc.isActive)
  
  const byCategory: Record<string, number> = {}
  const byType: Record<string, number> = {}
  let totalFileSize = 0
  
  activeDocuments.forEach(doc => {
    byCategory[doc.category] = (byCategory[doc.category] || 0) + 1
    byType[doc.type] = (byType[doc.type] || 0) + 1
    totalFileSize += doc.fileSize
  })
  
  const verified = activeDocuments.filter(doc => doc.isVerified).length
  const pending = activeDocuments.filter(doc => !doc.isVerified).length
  
  const expiringSoon = (await getExpiringDocuments()).length
  
  const totalFileSizeMB = totalFileSize / (1024 * 1024)
  const averageFileSize = activeDocuments.length > 0 ? totalFileSizeMB / activeDocuments.length : 0
  
  return {
    total: activeDocuments.length,
    byCategory,
    byType,
    verified,
    pending,
    expiringSoon,
    totalFileSize: Math.round(totalFileSizeMB),
    averageFileSize: Math.round(averageFileSize * 100) / 100
  }
}

/**
 * Send document notification
 */
async function sendDocumentNotification(
  document: Document,
  type: "uploaded" | "verified" | "signed" | "expiring"
): Promise<void> {
  const { sendSMS } = await import("./sms-service")
  
  let message: string
  let recipient: string
  
  switch (type) {
    case "uploaded":
      message = `📄 DOCUMENT UPLOADED\nDocument: ${document.name}\nStatus: Pending verification\n\nWe'll review and verify your document soon.\n\nSunset Apartments`
      recipient = document.tenantId || "0712345678" // Fallback to admin
      break
      
    case "verified":
      message = `✅ DOCUMENT VERIFIED\nDocument: ${document.name}\nVerified by: Admin\n\nYour document has been successfully verified.\n\nSunset Apartments`
      recipient = document.tenantId || "0712345678"
      break
      
    case "signed":
      message = `✍️ DOCUMENT SIGNED\nDocument: ${document.name}\n\nThank you for signing the document. It's now legally binding.\n\nSunset Apartments`
      recipient = document.tenantId || "0712345678"
      break
      
    case "expiring":
      message = `⚠️ DOCUMENT EXPIRING\nDocument: ${document.name}\nExpires: ${new Date(document.expiryDate!).toLocaleDateString()}\n\nPlease renew or update this document soon.\n\nSunset Apartments`
      recipient = document.tenantId || "0712345678"
      break
      
    default:
      return
  }
  
  await sendSMS(recipient, message, "general")
}

// Helper functions
function generateDocumentId(): string {
  return `DOC_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
}

/**
 * Generate PDF document (mock implementation)
 */
export async function generatePDF(
  template: "lease_agreement" | "receipt" | "report",
  data: any
): Promise<{ fileUrl: string; fileName: string }> {
  // In production, this would use a PDF generation library like jsPDF or Puppeteer
  const fileName = `${template}_${Date.now()}.pdf`
  const fileUrl = `/generated/${fileName}`
  
  console.log(`📄 Generated PDF: ${fileName}`)
  
  return { fileUrl, fileName }
}