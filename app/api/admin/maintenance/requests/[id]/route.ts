import { type NextRequest, NextResponse } from "next/server"
import { updateMaintenanceRequest } from "@/lib/services/maintenance-service"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json()
    
    const updatedRequest = await updateMaintenanceRequest(params.id, updates)
    
    if (!updatedRequest) {
      return NextResponse.json({
        success: false,
        message: "Maintenance request not found"
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: updatedRequest,
      message: "Maintenance request updated successfully"
    })
  } catch (error) {
    console.error("Update maintenance request error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to update maintenance request"
    }, { status: 500 })
  }
}