import { type NextRequest, NextResponse } from "next/server"
import { getFinancialSummary } from "@/lib/services/financial-service"

export async function GET(request: NextRequest) {
  try {
    const summary = await getFinancialSummary()
    
    return NextResponse.json({
      success: true,
      data: summary
    })
  } catch (error) {
    console.error("Financial summary error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to get financial summary"
    }, { status: 500 })
  }
}