import { type NextRequest, NextResponse } from "next/server"
import { getTenantCommunication } from "@/lib/services/communication-service"

export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const profile = await getTenantCommunication(params.tenantId)
    
    if (!profile) {
      return NextResponse.json({
        success: false,
        message: "Tenant communication profile not found"
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: profile
    })
  } catch (error) {
    console.error("Get tenant profile error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to get tenant communication profile"
    }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const { preferences } = await request.json()
    
    if (!preferences) {
      return NextResponse.json({
        success: false,
        message: "Preferences data is required"
      }, { status: 400 })
    }
    
    // In a real app, you'd update the database here
    // For demo purposes, we'll just return success
    console.log(`Updating preferences for tenant ${params.tenantId}:`, preferences)
    
    return NextResponse.json({
      success: true,
      message: "Communication preferences updated successfully"
    })
  } catch (error) {
    console.error("Update tenant preferences error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to update communication preferences"
    }, { status: 500 })
  }
}