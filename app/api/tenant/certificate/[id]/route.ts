import { type NextRequest, NextResponse } from "next/server"
import { getTenantScore, calculateTenantScore } from "@/lib/scoring-algorithm"
import { getUserByTenantScoreId } from "@/lib/auth"
import { generateTenantScoreCertificate, type CertificateData } from "@/lib/pdf-generator"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tenantScoreId = params.id

    if (!tenantScoreId) {
      return NextResponse.json({ error: "TenantScore ID is required" }, { status: 400 })
    }

    // Get tenant information
    const tenant = await getUserByTenantScoreId(tenantScoreId)
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Get score data
    const scoreData = await getTenantScore(tenant.id)
    const calculatedScore = await calculateTenantScore(tenant.id)

    // Prepare certificate data
    const certificateData: CertificateData = {
      tenantName: tenant.name,
      tenantScoreId: tenant.tenantScoreId,
      currentScore: calculatedScore.totalScore,
      scoreCategory:
        calculatedScore.totalScore >= 800
          ? "Excellent"
          : calculatedScore.totalScore >= 600
            ? "Good"
            : "Needs Improvement",
      totalPayments: scoreData.paymentHistory?.length || 0,
      onTimePayments: scoreData.paymentHistory?.filter((p: any) => p.daysLate === 0).length || 0,
      totalRentPaid: scoreData.paymentHistory?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0,
      generatedDate: new Date().toLocaleDateString("en-KE"),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-KE"), // 30 days validity
    }

    // Generate PDF
    const doc = generateTenantScoreCertificate(certificateData)
    const pdfBuffer = doc.output("arraybuffer")

    // Return PDF response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="tenantscore-certificate-${tenantScoreId}.pdf"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Certificate generation error:", error)
    return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 })
  }
}
