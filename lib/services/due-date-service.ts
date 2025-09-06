// Due Date Service - Handles automatic rent due date management and status updates

import { updateOverdueRentStatus } from "./payment-service"
import { scheduleRentReminders, sendOverdueNoticeSMS } from "./sms-service"

export interface RentCycle {
  unitId: string
  tenantPhone: string
  unitNumber: string
  rentAmount: number
  dueDate: string
  gracePeriodDays: number
  status: "pending" | "paid" | "overdue"
}

/**
 * Initialize monthly rent cycle for all units
 */
export async function initializeMonthlyRentCycle(): Promise<void> {
  const { APARTMENT_UNITS } = await import("../mock/building-data")
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  // Set due date to 1st of current month for all occupied units
  const dueDate = new Date(currentYear, currentMonth, 1).toISOString()
  
  let initializedUnits = 0
  
  APARTMENT_UNITS.forEach(unit => {
    if (unit.tenant) {
      // Reset rent status for new month (except if already paid this month)
      const lastPaymentDate = unit.rent.lastPaymentDate ? new Date(unit.rent.lastPaymentDate) : null
      const isAlreadyPaidThisMonth = lastPaymentDate && 
        lastPaymentDate.getMonth() === currentMonth && 
        lastPaymentDate.getFullYear() === currentYear
      
      if (!isAlreadyPaidThisMonth) {
        unit.rent.status = "pending"
        unit.rent.dueDate = dueDate
        initializedUnits++
      }
    }
  })
  
  console.log(`📅 Monthly rent cycle initialized for ${initializedUnits} units`)
}

/**
 * Process daily rent status updates
 */
export async function processDailyRentUpdates(): Promise<void> {
  console.log("🔄 Processing daily rent status updates...")
  
  try {
    // 1. Update overdue statuses
    await updateOverdueRentStatus()
    
    // 2. Send automatic reminders
    await scheduleRentReminders()
    
    // 3. Send final notices for severely overdue
    await sendFinalNotices()
    
    // 4. Generate daily report
    await generateDailyRentReport()
    
    console.log("✅ Daily rent updates completed")
    
  } catch (error) {
    console.error("❌ Failed to process daily rent updates:", error)
  }
}

/**
 * Send final notices for severely overdue rent
 */
async function sendFinalNotices(): Promise<void> {
  const { APARTMENT_UNITS } = await import("../mock/building-data")
  const currentDate = new Date()
  
  for (const unit of APARTMENT_UNITS) {
    if (unit.tenant && unit.rent.status === "overdue" && unit.rent.dueDate) {
      const dueDate = new Date(unit.rent.dueDate)
      const daysOverdue = Math.floor((currentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
      
      // Send final notice after 10 days overdue
      if (daysOverdue === 10) {
        await sendOverdueNoticeSMS(
          unit.tenant.phone,
          unit.unitNumber,
          unit.rent.amount,
          daysOverdue
        )
        console.log(`🚨 Final notice sent to Unit ${unit.unitNumber} (${daysOverdue} days overdue)`)
      }
    }
  }
}

/**
 * Generate daily rent status report
 */
async function generateDailyRentReport(): Promise<void> {
  const { APARTMENT_UNITS, getTotalMonthlyRent } = await import("../mock/building-data")
  const currentDate = new Date()
  
  let paidUnits = 0
  let pendingUnits = 0
  let overdueUnits = 0
  let totalCollected = 0
  let totalOutstanding = 0
  
  APARTMENT_UNITS.forEach(unit => {
    if (unit.tenant) {
      switch (unit.rent.status) {
        case "paid":
          paidUnits++
          totalCollected += unit.rent.amount
          break
        case "pending":
          pendingUnits++
          totalOutstanding += unit.rent.amount
          break
        case "overdue":
          overdueUnits++
          totalOutstanding += unit.rent.amount
          break
      }
    }
  })
  
  const totalExpected = getTotalMonthlyRent()
  const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0
  
  console.log(`
📊 DAILY RENT REPORT - ${currentDate.toDateString()}
====================================================
💚 Paid Units: ${paidUnits}
🟡 Pending Units: ${pendingUnits}  
🔴 Overdue Units: ${overdueUnits}
💰 Collected: KES ${totalCollected.toLocaleString()}
⏳ Outstanding: KES ${totalOutstanding.toLocaleString()}
📈 Collection Rate: ${collectionRate.toFixed(1)}%
====================================================
  `)
}

/**
 * Check for lease expirations and send alerts
 */
export async function checkLeaseExpirations(): Promise<void> {
  const { APARTMENT_UNITS } = await import("../mock/building-data")
  const currentDate = new Date()
  
  for (const unit of APARTMENT_UNITS) {
    if (unit.lease && unit.tenant) {
      const endDate = new Date(unit.lease.endDate)
      const daysUntilExpiry = Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
      
      // Send alerts at 60, 30, and 7 days before expiry
      if ([60, 30, 7].includes(daysUntilExpiry)) {
        const message = `🏠 Lease Reminder\nUnit: ${unit.unitNumber}\nLease expires in ${daysUntilExpiry} days\nExpiry: ${endDate.toLocaleDateString()}\n\nPlease contact us to renew.\nSunset Apartments`
        
        const { sendSMS } = await import("./sms-service")
        await sendSMS(unit.tenant.phone, message, "general")
        
        console.log(`📋 Lease expiry reminder sent to Unit ${unit.unitNumber} (${daysUntilExpiry} days)`)
      }
    }
  }
}

/**
 * Get units due for payment reminders today
 */
export async function getUnitsForReminders(): Promise<{
  dueToday: number
  dueSoon: number
  overdue: number
  overdueList: { unitNumber: string; daysOverdue: number; tenantPhone: string }[]
}> {
  const { APARTMENT_UNITS } = await import("../mock/building-data")
  const currentDate = new Date()
  
  let dueToday = 0
  let dueSoon = 0 // Due in next 3 days
  let overdue = 0
  const overdueList: { unitNumber: string; daysOverdue: number; tenantPhone: string }[] = []
  
  APARTMENT_UNITS.forEach(unit => {
    if (unit.tenant && unit.rent.status !== "paid" && unit.rent.dueDate) {
      const dueDate = new Date(unit.rent.dueDate)
      const daysUntilDue = Math.ceil((dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysUntilDue === 0) {
        dueToday++
      } else if (daysUntilDue > 0 && daysUntilDue <= 3) {
        dueSoon++
      } else if (daysUntilDue < 0) {
        const daysOverdue = Math.abs(daysUntilDue)
        overdue++
        overdueList.push({
          unitNumber: unit.unitNumber,
          daysOverdue,
          tenantPhone: unit.tenant.phone
        })
      }
    }
  })
  
  return { dueToday, dueSoon, overdue, overdueList }
}

/**
 * Set up automatic rent cycle (run on 1st of each month)
 */
export async function setupAutomaticRentCycle(): Promise<void> {
  const currentDate = new Date()
  
  // Check if it's the 1st of the month
  if (currentDate.getDate() === 1) {
    console.log("🔄 Starting new monthly rent cycle...")
    await initializeMonthlyRentCycle()
  }
  
  // Always process daily updates
  await processDailyRentUpdates()
  
  // Check lease expirations
  await checkLeaseExpirations()
}

/**
 * Manual trigger for rent cycle (for testing/admin use)
 */
export async function triggerRentCycleManually(): Promise<{
  success: boolean
  message: string
  stats: {
    totalUnits: number
    activeUnits: number
    pendingPayments: number
  }
}> {
  try {
    await initializeMonthlyRentCycle()
    await processDailyRentUpdates()
    
    const { APARTMENT_UNITS } = await import("../mock/building-data")
    const activeUnits = APARTMENT_UNITS.filter(u => u.tenant).length
    const pendingPayments = APARTMENT_UNITS.filter(u => u.tenant && u.rent.status === "pending").length
    
    return {
      success: true,
      message: "Rent cycle triggered successfully",
      stats: {
        totalUnits: APARTMENT_UNITS.length,
        activeUnits,
        pendingPayments
      }
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to trigger rent cycle: ${error}`,
      stats: { totalUnits: 0, activeUnits: 0, pendingPayments: 0 }
    }
  }
}