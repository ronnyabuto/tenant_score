import { type NextRequest, NextResponse } from "next/server"
import { verifyPayment } from "@/lib/mpesa"

export async function POST(request: NextRequest) {
  try {
    const { transactionId } = await request.json()

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 })
    }

    const result = await verifyPayment(transactionId)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Payment verification error:", error)

    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 })
  }
}
