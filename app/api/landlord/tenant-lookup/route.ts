import { type NextRequest, NextResponse } from "next/server"
import { lookupTenant } from "@/lib/auth"
import { getTenantScore } from "@/lib/scoring-algorithm"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const { tenantScoreId, phoneNumber } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 })
    }

    const landlord = await verifyToken(token)
    if (!landlord || landlord.userType !== "landlord") {
      return NextResponse.json({ error: "Landlord access required" }, { status: 403 })
    }

    if (!tenantScoreId && !phoneNumber) {
      return NextResponse.json({ error: "TenantScore ID or phone number required" }, { status: 400 })
    }

    const tenant = await lookupTenant(tenantScoreId, phoneNumber)
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    const scoreData = await getTenantScore(tenant.id)

    return NextResponse.json({
      tenantScoreId: tenant.tenantScoreId,
      name: tenant.name,
      currentScore: scoreData.currentScore,
      scoreCategory: scoreData.scoreCategory,
      paymentReliability: scoreData.breakdown.paymentReliability,
      tenancyLength: scoreData.breakdown.tenancyLength,
      lastPayment: scoreData.lastPayment,
      isVerified: tenant.isVerified,
    })
  } catch (error) {
    console.error("Tenant lookup error:", error)
    return NextResponse.json({ error: "Tenant lookup failed" }, { status: 500 })
  }
}
