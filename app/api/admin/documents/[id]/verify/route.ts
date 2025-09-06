import { type NextRequest, NextResponse } from "next/server"
import { verifyDocument } from "@/lib/services/document-service"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { verifiedBy } = await request.json()
    
    if (!verifiedBy) {
      return NextResponse.json({
        success: false,
        message: "verifiedBy field is required"
      }, { status: 400 })
    }
    
    const verifiedDoc = await verifyDocument(params.id, verifiedBy)
    
    if (!verifiedDoc) {
      return NextResponse.json({
        success: false,
        message: "Document not found"
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: verifiedDoc,
      message: "Document verified successfully"
    })
  } catch (error) {
    console.error("Verify document error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to verify document"
    }, { status: 500 })
  }
}