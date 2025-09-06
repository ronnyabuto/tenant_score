import { type NextRequest, NextResponse } from "next/server"
import { SMSNotificationService } from "@/lib/sms-ussd"
import { verifyToken } from "@/lib/auth"

const notificationService = new SMSNotificationService()

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const { type, phoneNumber, data } = await request.json()

    // Verify admin or system access for sending notifications
    if (token) {
      const user = await verifyToken(token)
      if (!user || (user.userType !== "admin" && user.userType !== "system")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    }

    if (!phoneNumber || !type) {
      return NextResponse.json({ error: "Phone number and notification type required" }, { status: 400 })
    }

    // Send appropriate notification based on type
    switch (type) {
      case "score_update":
        await notificationService.sendScoreUpdate(phoneNumber, data.oldScore, data.newScore)
        break

      case "payment_confirmation":
        await notificationService.sendPaymentConfirmation(phoneNumber, data.amount, data.landlord)
        break

      case "verification_complete":
        await notificationService.sendVerificationComplete(phoneNumber, data.tenantScoreId)
        break

      default:
        return NextResponse.json({ error: "Invalid notification type" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Notification sent successfully",
      type,
      phoneNumber,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("SMS notification error:", error)
    return NextResponse.json({ error: "Notification failed" }, { status: 500 })
  }
}
