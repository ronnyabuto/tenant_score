import { type NextRequest, NextResponse } from "next/server"
import { SMSCommandHandler, SMSNotificationService } from "@/lib/sms-ussd"

const smsHandler = new SMSCommandHandler()
const notificationService = new SMSNotificationService()

export async function POST(request: NextRequest) {
  try {
    const { from, to, text, messageId, timestamp } = await request.json()

    // Validate required fields
    if (!from || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Process SMS command
    const response = await smsHandler.handleSMSCommand(from, text)

    // Log the interaction for monitoring
    console.log(`SMS Command from ${from}: ${text}`)
    console.log(`SMS Response: ${response}`)

    // In production, send response via SMS provider
    // For now, return the response for webhook handling
    return NextResponse.json({
      success: true,
      from: to || "40404", // TenantScore SMS shortcode
      to: from,
      message: response,
      messageId: messageId || Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("SMS processing error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "SMS processing failed",
      },
      { status: 500 },
    )
  }
}

// Handle SMS delivery status updates
export async function PUT(request: NextRequest) {
  try {
    const { messageId, status, phoneNumber, timestamp } = await request.json()

    // Log delivery status for monitoring
    console.log(`SMS Delivery Status: ${messageId} - ${status} to ${phoneNumber}`)

    // Update delivery status in database if needed
    // This helps track SMS delivery success rates

    return NextResponse.json({
      success: true,
      messageId,
      status,
      processed: true,
    })
  } catch (error) {
    console.error("SMS status update error:", error)
    return NextResponse.json({ error: "Status update failed" }, { status: 500 })
  }
}
