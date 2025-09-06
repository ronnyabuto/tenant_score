import { type NextRequest, NextResponse } from "next/server"
import { getCommunicationAnalytics } from "@/lib/services/communication-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "30d"
    
    const analytics = await getCommunicationAnalytics()
    
    // In a real app, you'd filter by timeframe here
    // For demo purposes, we'll return the full analytics data
    const enhancedAnalytics = {
      ...analytics,
      dailyStats: generateDailyStats(timeframe),
      monthlyTrend: generateMonthlyTrend()
    }
    
    return NextResponse.json({
      success: true,
      data: enhancedAnalytics
    })
  } catch (error) {
    console.error("Communication analytics error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to get communication analytics"
    }, { status: 500 })
  }
}

// Helper functions to generate mock data for charts
function generateDailyStats(timeframe: string) {
  const days = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 90
  const stats = []
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    stats.push({
      date: date.toISOString().split('T')[0],
      messages: Math.floor(Math.random() * 20) + 5,
      cost: Math.floor(Math.random() * 50) + 15
    })
  }
  
  return stats
}

function generateMonthlyTrend() {
  const months = []
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    
    months.push({
      month: monthNames[date.getMonth()],
      messages: Math.floor(Math.random() * 200) + 100,
      cost: Math.floor(Math.random() * 500) + 200
    })
  }
  
  return months
}