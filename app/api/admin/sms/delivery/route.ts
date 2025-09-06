import { type NextRequest, NextResponse } from "next/server"
import { updateMessageDeliveryStatus, getDeliveryStats } from "@/lib/services/sms-service"

// GET: Get real-time delivery statistics
export async function GET(request: NextRequest) {
  try {
    const stats = await getDeliveryStats()
    
    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error("Delivery stats error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to get delivery statistics"
    }, { status: 500 })
  }
}

// POST: Webhook for SMS delivery status updates (from SMS gateway)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate webhook payload
    if (!body.messageId || !body.status) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields: messageId, status"
      }, { status: 400 })
    }
    
    const { messageId, status, failureReason } = body
    
    // Validate status
    if (!["delivered", "failed"].includes(status)) {
      return NextResponse.json({
        success: false,
        message: "Invalid status. Must be 'delivered' or 'failed'"
      }, { status: 400 })
    }
    
    const updated = await updateMessageDeliveryStatus(messageId, status, failureReason)
    
    if (updated) {
      return NextResponse.json({
        success: true,
        message: `Message ${messageId} status updated to ${status}`
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Message not found"
      }, { status: 404 })
    }
  } catch (error) {
    console.error("Delivery webhook error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to process delivery status update"
    }, { status: 500 })
  }
}