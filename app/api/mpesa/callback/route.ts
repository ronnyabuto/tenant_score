import { type NextRequest, NextResponse } from "next/server"
import { processMpesaPayment, validateMpesaSignature, type MpesaTransaction } from "@/lib/mpesa"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-mpesa-signature") || ""

    // Validate webhook signature for security
    if (!validateMpesaSignature(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const transaction: MpesaTransaction = JSON.parse(body)

    // Process the payment
    const paymentNotification = await processMpesaPayment(transaction)

    // Log for monitoring
    console.log("M-Pesa payment processed:", {
      transactionId: transaction.TransID,
      amount: transaction.TransAmount,
      phoneNumber: transaction.MSISDN,
      status: paymentNotification.status,
    })

    // Respond to M-Pesa
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Payment processed successfully",
    })
  } catch (error) {
    console.error("M-Pesa callback error:", error)

    return NextResponse.json(
      {
        ResultCode: 1,
        ResultDesc: "Payment processing failed",
      },
      { status: 500 },
    )
  }
}

// Handle GET requests for webhook verification
export async function GET() {
  return NextResponse.json({
    message: "M-Pesa webhook endpoint is active",
    timestamp: new Date().toISOString(),
  })
}
