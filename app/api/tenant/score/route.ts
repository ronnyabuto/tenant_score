import { type NextRequest, NextResponse } from "next/server"
import { getTenantScore, calculateTenantScore } from "@/lib/scoring-algorithm"
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

    const scoreData = await getTenantScore(user.id)
    const calculatedScore = await calculateTenantScore(user.id)

    return NextResponse.json({
      tenantScoreId: user.tenantScoreId,
      currentScore: calculatedScore.totalScore,
      scoreBreakdown: calculatedScore.breakdown,
      paymentHistory: scoreData.paymentHistory,
      lastUpdated: scoreData.lastUpdated,
      certificateUrl: `/api/tenant/certificate/${user.tenantScoreId}`,
    })
  } catch (error) {
    console.error("Score retrieval error:", error)
    return NextResponse.json({ error: "Failed to retrieve score" }, { status: 500 })
  }
}
