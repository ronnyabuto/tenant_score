import { type NextRequest, NextResponse } from "next/server"
import { getMaintenanceRequests, createMaintenanceRequest } from "@/lib/services/maintenance-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") as any || undefined
    const priority = searchParams.get("priority") as any || undefined
    const category = searchParams.get("category") as any || undefined
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined
    
    const requests = await getMaintenanceRequests(status, priority, category, limit)
    
    return NextResponse.json({
      success: true,
      data: requests,
      total: requests.length
    })
  } catch (error) {
    console.error("Get maintenance requests error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to get maintenance requests"
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()
    
    // Validate required fields
    const requiredFields = ['tenantId', 'tenantName', 'unitNumber', 'phoneNumber', 'title', 'description', 'category', 'priority']
    const missingFields = requiredFields.filter(field => !requestData[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 })
    }
    
    // Validate enums
    const validCategories = ["plumbing", "electrical", "appliances", "structural", "cleaning", "other"]
    const validPriorities = ["low", "normal", "urgent"]
    
    if (!validCategories.includes(requestData.category)) {
      return NextResponse.json({
        success: false,
        message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      }, { status: 400 })
    }
    
    if (!validPriorities.includes(requestData.priority)) {
      return NextResponse.json({
        success: false,
        message: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`
      }, { status: 400 })
    }
    
    const newRequest = await createMaintenanceRequest({
      ...requestData,
      photos: requestData.photos || []
    })
    
    return NextResponse.json({
      success: true,
      data: newRequest,
      message: "Maintenance request created successfully"
    })
  } catch (error) {
    console.error("Create maintenance request error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to create maintenance request"
    }, { status: 500 })
  }
}