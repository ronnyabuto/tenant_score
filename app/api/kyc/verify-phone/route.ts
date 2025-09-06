import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const { phoneNumber, otpCode, action } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    if (action === "send_otp") {
      if (!phoneNumber || !phoneNumber.match(/^254[0-9]{9}$/)) {
        return NextResponse.json(
          {
            error: "Valid Kenyan phone number required (254XXXXXXXXX)",
          },
          { status: 400 },
        )
      }

      // In real implementation, integrate with SMS provider (Africa's Talking, Twilio, etc.)
      // Mock OTP generation and sending
      const otp = Math.floor(100000 + Math.random() * 900000).toString()

      // Store OTP temporarily (use Redis or database in production)
      // For demo purposes, we'll use a mock response

      return NextResponse.json({
        success: true,
        message: "OTP sent successfully",
        // Don't return OTP in production - this is for demo only
        mockOtp: "123456",
      })
    }

    if (action === "verify_otp") {
      if (!otpCode || otpCode.length !== 6) {
        return NextResponse.json({ error: "Valid 6-digit OTP required" }, { status: 400 })
      }

      // In real implementation, verify OTP against stored value
      // Mock verification - accept "123456" as valid OTP
      const isValidOtp = otpCode === "123456"

      if (!isValidOtp) {
        return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 })
      }

      // Update user phone verification status in database
      // Mock successful verification
      return NextResponse.json({
        success: true,
        message: "Phone number verified successfully",
        verifiedAt: new Date().toISOString(),
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Phone verification error:", error)
    return NextResponse.json({ error: "Phone verification failed" }, { status: 500 })
  }
}
