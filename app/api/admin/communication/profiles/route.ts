import { type NextRequest, NextResponse } from "next/server"
import { getAllTenantCommunications } from "@/lib/services/communication-service"

export async function GET(request: NextRequest) {
  try {
    const profiles = await getAllTenantCommunications()
    
    return NextResponse.json({
      success: true,
      data: profiles,
      total: profiles.length
    })
  } catch (error) {
    console.error("Communication profiles error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to get tenant communication profiles"
    }, { status: 500 })
  }
}