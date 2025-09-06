// Payment Service - Handles rent payment status updates and automation

export interface PaymentUpdate {
  status: "paid" | "pending" | "overdue"
  lastPaymentDate?: string
  transactionId?: string
  amount: number
  daysFromDue?: number
}

export interface PaymentRecord {
  id: string
  unitId: string
  tenantPhone: string
  amount: number
  paymentDate: string
  dueDate: string
  transactionId: string
  status: "paid" | "pending" | "overdue"
  daysFromDue: number
  method: "mpesa" | "cash" | "bank"
}

// In-memory storage for demo (replace with database in production)
let paymentRecords: PaymentRecord[] = []

/**
 * Update unit payment status when rent is received
 */
export async function updateUnitPaymentStatus(unitId: string, update: PaymentUpdate): Promise<void> {
  try {
    // Import apartment units data
    const { APARTMENT_UNITS } = await import("../mock/building-data")
    
    // Find the unit
    const unit = APARTMENT_UNITS.find(u => u.id === unitId)
    if (!unit) {
      throw new Error(`Unit ${unitId} not found`)
    }

    // Update the unit's rent status
    unit.rent.status = update.status
    if (update.lastPaymentDate) {
      unit.rent.lastPaymentDate = update.lastPaymentDate
    }

    // Create payment record
    const paymentRecord: PaymentRecord = {
      id: generatePaymentId(),
      unitId: unitId,
      tenantPhone: unit.tenant?.phone || "",
      amount: update.amount,
      paymentDate: update.lastPaymentDate || new Date().toISOString(),
      dueDate: unit.rent.dueDate,
      transactionId: update.transactionId || "",
      status: update.status,
      daysFromDue: update.daysFromDue || 0,
      method: "mpesa"
    }

    // Store payment record
    paymentRecords.push(paymentRecord)

    console.log(`💰 Payment recorded for Unit ${unit.unitNumber}: KES ${update.amount}`)
    
    // If payment is late, still mark as paid but log the delay
    if (update.daysFromDue && update.daysFromDue > 0) {
      console.log(`⚠️ Late payment: ${update.daysFromDue} days after due date`)
    }

  } catch (error) {
    console.error("Failed to update payment status:", error)
    throw error
  }
}

/**
 * Get payment history for a unit
 */
export async function getUnitPaymentHistory(unitId: string): Promise<PaymentRecord[]> {
  return paymentRecords.filter(record => record.unitId === unitId)
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
}

/**
 * Get all payments for a specific month
 */
export async function getMonthlyPayments(year: number, month: number): Promise<PaymentRecord[]> {
  return paymentRecords.filter(record => {
    const paymentDate = new Date(record.paymentDate)
    return paymentDate.getFullYear() === year && paymentDate.getMonth() === month
  })
}

/**
 * Calculate outstanding rent across all units
 */
export async function calculateOutstandingRent(): Promise<{
  totalOutstanding: number
  overdueUnits: number
  pendingUnits: number
}> {
  const { APARTMENT_UNITS } = await import("../mock/building-data")
  
  let totalOutstanding = 0
  let overdueUnits = 0
  let pendingUnits = 0

  APARTMENT_UNITS.forEach(unit => {
    if (unit.tenant && unit.rent.status !== "paid") {
      totalOutstanding += unit.rent.amount
      
      if (unit.rent.status === "overdue") {
        overdueUnits++
      } else if (unit.rent.status === "pending") {
        pendingUnits++
      }
    }
  })

  return {
    totalOutstanding,
    overdueUnits, 
    pendingUnits
  }
}

/**
 * Mark rent as overdue for units past due date
 */
export async function updateOverdueRentStatus(): Promise<void> {
  const { APARTMENT_UNITS } = await import("../mock/building-data")
  const currentDate = new Date()
  
  let updatedUnits = 0

  APARTMENT_UNITS.forEach(unit => {
    if (unit.tenant && unit.rent.status === "pending" && unit.rent.dueDate) {
      const dueDate = new Date(unit.rent.dueDate)
      const gracePeriod = 5 // 5 days grace period
      const overdueDate = new Date(dueDate.getTime() + (gracePeriod * 24 * 60 * 60 * 1000))
      
      if (currentDate > overdueDate) {
        unit.rent.status = "overdue"
        updatedUnits++
        console.log(`🔴 Unit ${unit.unitNumber} marked as overdue`)
      }
    }
  })

  if (updatedUnits > 0) {
    console.log(`📅 Updated ${updatedUnits} units to overdue status`)
  }
}

/**
 * Generate unique payment ID
 */
function generatePaymentId(): string {
  return `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get payment statistics for dashboard
 */
export async function getPaymentStatistics(): Promise<{
  thisMonth: {
    collected: number
    expected: number
    collectionRate: number
  }
  lastMonth: {
    collected: number
    expected: number
    collectionRate: number
  }
}> {
  const { getTotalMonthlyRent } = await import("../mock/building-data")
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  const thisMonthPayments = await getMonthlyPayments(currentYear, currentMonth)
  const lastMonthPayments = await getMonthlyPayments(
    currentMonth === 0 ? currentYear - 1 : currentYear,
    currentMonth === 0 ? 11 : currentMonth - 1
  )
  
  const expectedMonthlyRent = getTotalMonthlyRent()
  const thisMonthCollected = thisMonthPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const lastMonthCollected = lastMonthPayments.reduce((sum, payment) => sum + payment.amount, 0)
  
  return {
    thisMonth: {
      collected: thisMonthCollected,
      expected: expectedMonthlyRent,
      collectionRate: expectedMonthlyRent > 0 ? (thisMonthCollected / expectedMonthlyRent) * 100 : 0
    },
    lastMonth: {
      collected: lastMonthCollected,
      expected: expectedMonthlyRent,
      collectionRate: expectedMonthlyRent > 0 ? (lastMonthCollected / expectedMonthlyRent) * 100 : 0
    }
  }
}