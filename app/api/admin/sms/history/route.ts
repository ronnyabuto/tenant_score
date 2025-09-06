import { type NextRequest, NextResponse } from "next/server"
import { getSMSHistory } from "@/lib/services/sms-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined
    const status = searchParams.get("status") || undefined
    
    const history = await getSMSHistory(limit)
    
    // Filter by status if provided
    const filteredHistory = status 
      ? history.filter(msg => msg.status === status)
      : history
    
    // Enrich with tenant names from building data
    const { APARTMENT_UNITS } = await import("@/lib/mock/building-data")
    const enrichedHistory = filteredHistory.map(msg => {
      const unit = APARTMENT_UNITS.find(u => u.tenant?.phone === msg.recipient)
      return {
        ...msg,
        recipientName: unit?.tenant?.name || undefined,
        unitNumber: unit?.unitNumber || undefined
      }
    })
    
    return NextResponse.json({
      success: true,
      data: enrichedHistory,
      total: enrichedHistory.length
    })
  } catch (error) {
    console.error("SMS history error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to get SMS history"
    }, { status: 500 })
  }
}