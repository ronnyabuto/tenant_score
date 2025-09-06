import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const formData = await request.formData()
    const idDocument = formData.get("idDocument") as File
    const selfie = formData.get("selfie") as File

    if (!idDocument) {
      return NextResponse.json({ error: "ID document is required" }, { status: 400 })
    }

    // Validate file types and sizes
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(idDocument.type) || idDocument.size > maxSize) {
      return NextResponse.json(
        {
          error: "Invalid file type or size. Please upload JPEG/PNG under 5MB",
        },
        { status: 400 },
      )
    }

    // In real implementation, this would:
    // 1. Upload files to secure storage (Vercel Blob, AWS S3, etc.)
    // 2. Queue document for manual/AI verification
    // 3. Update user KYC status in database

    // Mock verification process
    const verificationResult = {
      documentId: Math.random().toString(36).substr(2, 9),
      status: "pending",
      submittedAt: new Date().toISOString(),
      estimatedReviewTime: "24-48 hours",
    }

    return NextResponse.json({
      success: true,
      message: "Documents submitted successfully",
      verification: verificationResult,
    })
  } catch (error) {
    console.error("Document verification error:", error)
    return NextResponse.json({ error: "Document verification failed" }, { status: 500 })
  }
}
