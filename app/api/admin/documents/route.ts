import { type NextRequest, NextResponse } from "next/server"
import { getDocuments, uploadDocument } from "@/lib/services/document-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const type = searchParams.get("type") as any || undefined
    const tenantId = searchParams.get("tenantId") || undefined
    const verified = searchParams.get("verified") ? searchParams.get("verified") === "true" : undefined
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined
    
    const documents = await getDocuments(category, type, tenantId, verified, limit)
    
    return NextResponse.json({
      success: true,
      data: documents,
      total: documents.length
    })
  } catch (error) {
    console.error("Get documents error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to get documents"
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const documentData = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'type', 'category', 'fileName', 'fileSize', 'mimeType', 'uploadedBy']
    const missingFields = requiredFields.filter(field => !documentData[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 })
    }
    
    // Validate file size (max 25MB)
    if (documentData.fileSize > 25 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        message: "File size too large. Maximum size is 25MB."
      }, { status: 400 })
    }
    
    const newDocument = await uploadDocument({
      ...documentData,
      fileUrl: documentData.fileUrl || `/documents/${documentData.fileName}`,
      tags: documentData.tags || [],
      signatureRequired: documentData.signatureRequired || false
    })
    
    return NextResponse.json({
      success: true,
      data: newDocument,
      message: "Document uploaded successfully"
    })
  } catch (error) {
    console.error("Upload document error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to upload document"
    }, { status: 500 })
  }
}