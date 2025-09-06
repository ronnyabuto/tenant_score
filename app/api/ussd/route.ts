import { type NextRequest, NextResponse } from "next/server"
import { USSDMenuHandler } from "@/lib/sms-ussd"

const ussdHandler = new USSDMenuHandler()

export async function POST(request: NextRequest) {
  try {
    const { sessionId, serviceCode, phoneNumber, text } = await request.json()

    // Validate required fields
    if (!sessionId || !phoneNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Process USSD request
    const response = await ussdHandler.handleUSSDRequest(phoneNumber, text || "", sessionId)

    // Return USSD response in the format expected by telecom providers
    return NextResponse.json({
      sessionId,
      phoneNumber,
      text: response,
      // Additional metadata for telecom integration
      timestamp: new Date().toISOString(),
      serviceCode: serviceCode || "*384*7826#",
    })
  } catch (error) {
    console.error("USSD processing error:", error)

    return NextResponse.json(
      {
        sessionId: "",
        phoneNumber: "",
        text: "END Service temporarily unavailable. Please try again later.",
      },
      { status: 500 },
    )
  }
}

// Handle GET requests for USSD service verification
export async function GET() {
  return NextResponse.json({
    service: "TenantScore USSD",
    shortCode: "*384*7826#",
    status: "active",
    supportedOperators: ["Safaricom", "Airtel", "Telkom"],
    lastUpdated: new Date().toISOString(),
  })
}
