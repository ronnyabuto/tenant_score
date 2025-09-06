import { type NextRequest, NextResponse } from "next/server"
import { triggerRentCycleManually, getUnitsForReminders } from "@/lib/services/due-date-service"
import { getPaymentStatistics } from "@/lib/services/payment-service"

export async function POST(request: NextRequest) {
  try {
    // Trigger the rent cycle manually
    const result = await triggerRentCycleManually()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        data: result.stats,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Rent cycle trigger error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to trigger rent cycle"
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current rent cycle status
    const reminders = await getUnitsForReminders()
    const paymentStats = await getPaymentStatistics()
    
    return NextResponse.json({
      success: true,
      data: {
        reminders,
        paymentStats,
        lastUpdated: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error("Rent cycle status error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to get rent cycle status"
    }, { status: 500 })
  }
}