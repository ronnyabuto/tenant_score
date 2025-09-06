import { type NextRequest, NextResponse } from "next/server"
import { getTransactions, addTransaction } from "@/lib/services/financial-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") as "income" | "expense" || undefined
    const category = searchParams.get("category") || undefined
    const startDate = searchParams.get("startDate") || undefined
    const endDate = searchParams.get("endDate") || undefined
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined
    
    const transactions = await getTransactions(type, category, startDate, endDate, limit)
    
    return NextResponse.json({
      success: true,
      data: transactions,
      total: transactions.length
    })
  } catch (error) {
    console.error("Get transactions error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to get transactions"
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const transactionData = await request.json()
    
    // Validate required fields
    const requiredFields = ['type', 'category', 'description', 'amount', 'date', 'paymentMethod', 'createdBy']
    const missingFields = requiredFields.filter(field => !transactionData[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 })
    }
    
    // Validate amount
    if (typeof transactionData.amount !== 'number' || transactionData.amount <= 0) {
      return NextResponse.json({
        success: false,
        message: "Amount must be a positive number"
      }, { status: 400 })
    }
    
    const newTransaction = await addTransaction({
      ...transactionData,
      status: transactionData.status || "completed",
      isRecurring: transactionData.isRecurring || false,
      taxDeductible: transactionData.taxDeductible || false
    })
    
    return NextResponse.json({
      success: true,
      data: newTransaction,
      message: "Transaction added successfully"
    })
  } catch (error) {
    console.error("Add transaction error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to add transaction"
    }, { status: 500 })
  }
}