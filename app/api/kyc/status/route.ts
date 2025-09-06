import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // In real implementation, fetch from database
    // Mock KYC status data
    const kycStatus = {
      userId: user.id,
      documentVerification: {
        status: "verified",
        submittedAt: "2024-01-15T10:30:00Z",
        verifiedAt: "2024-01-16T14:20:00Z",
        documents: [
          { type: "national_id", status: "verified" },
          { type: "selfie", status: "verified" },
        ],
      },
      phoneVerification: {
        status: "pending",
        phoneNumber: user.phoneNumbers?.[0]?.phoneNumber,
        lastAttempt: null,
      },
      overallStatus: "pending",
      completedSteps: 1,
      totalSteps: 2,
      nextAction: "Complete phone verification to finish KYC process",
    }

    return NextResponse.json(kycStatus)
  } catch (error) {
    console.error("KYC status error:", error)
    return NextResponse.json({ error: "Failed to fetch KYC status" }, { status: 500 })
  }
}
