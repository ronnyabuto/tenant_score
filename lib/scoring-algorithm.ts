// TenantScore Scoring Algorithm - TEMPORARILY COMMENTED OUT
// Calculates tenant rent-worthiness scores from 0-1000
// TODO: Implement this later - focusing on rental management system first

/*
export interface PaymentRecord {
  amount: number
  paymentDate: string
  dueDate: string
  daysLate: number
  status: "confirmed" | "pending" | "disputed"
}

export interface TenantScoreData {
  totalPayments: number
  onTimePayments: number
  latePayments: number
  totalRentPaid: number
  averageDaysLate: number
  tenancyDurationMonths: number
  paymentHistory: PaymentRecord[]
}

export interface ScoreBreakdown {
  totalScore: number
  paymentTimeliness: number
  paymentConsistency: number
  paymentVolume: number
  tenancyStability: number
  breakdown: {
    paymentTimeliness: { score: number; weight: number; description: string }
    paymentConsistency: { score: number; weight: number; description: string }
    paymentVolume: { score: number; weight: number; description: string }
    tenancyStability: { score: number; weight: number; description: string }
  }
}

// Scoring weights (must sum to 1.0)
const SCORING_WEIGHTS = {
  paymentTimeliness: 0.4, // 40% - Most important factor
  paymentConsistency: 0.3, // 30% - Consistency of payments
  paymentVolume: 0.2, // 20% - Total rent paid (stability indicator)
  tenancyStability: 0.1, // 10% - Length of rental history
}

// Base score for new tenants
const BASE_SCORE = 500

/**
 * Calculate payment timeliness score (0-1000)
 * Based on percentage of on-time payments and severity of late payments
 */
function calculatePaymentTimeliness(data: TenantScoreData): number {
  if (data.totalPayments === 0) return BASE_SCORE

  // On-time payment percentage (0-1)
  const onTimeRate = data.onTimePayments / data.totalPayments

  // Penalty for average days late
  const latePenalty = Math.min(data.averageDaysLate * 10, 200) // Max 200 point penalty

  // Base score from on-time rate
  const baseScore = onTimeRate * 1000

  // Apply late penalty
  const finalScore = Math.max(0, baseScore - latePenalty)

  return Math.round(finalScore)
}

/**
 * Calculate payment consistency score (0-1000)
 * Based on regularity and pattern of payments
 */
function calculatePaymentConsistency(data: TenantScoreData): number {
  if (data.totalPayments < 3) return BASE_SCORE

  const payments = data.paymentHistory
    .filter((p) => p.status === "confirmed")
    .sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime())

  if (payments.length < 3) return BASE_SCORE

  // Calculate payment intervals (days between payments)
  const intervals: number[] = []
  for (let i = 1; i < payments.length; i++) {
    const prevDate = new Date(payments[i - 1].paymentDate)
    const currDate = new Date(payments[i].paymentDate)
    const daysDiff = Math.abs((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
    intervals.push(daysDiff)
  }

  // Calculate standard deviation of intervals
  const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
  const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length
  const stdDev = Math.sqrt(variance)

  // Lower standard deviation = higher consistency
  // Normalize to 0-1000 scale (assume monthly payments ~30 days)
  const consistencyScore = Math.max(0, 1000 - stdDev * 10)

  return Math.round(consistencyScore)
}

/**
 * Calculate payment volume score (0-1000)
 * Based on total rent paid (higher amounts indicate stability)
 */
function calculatePaymentVolume(data: TenantScoreData): number {
  if (data.totalRentPaid === 0) return BASE_SCORE

  // Score based on total rent paid
  // Logarithmic scale to prevent extreme scores
  const volumeScore = Math.min(1000, Math.log10(data.totalRentPaid / 10000) * 200 + 500)

  return Math.round(Math.max(0, volumeScore))
}

/**
 * Calculate tenancy stability score (0-1000)
 * Based on length of rental history
 */
function calculateTenancyStability(data: TenantScoreData): number {
  if (data.tenancyDurationMonths === 0) return BASE_SCORE

  // Score increases with tenancy duration
  // 12 months = 600, 24 months = 750, 36+ months = 900+
  const stabilityScore = Math.min(1000, 500 + data.tenancyDurationMonths * 15)

  return Math.round(stabilityScore)
}

/**
 * Main scoring function - calculates comprehensive tenant score
 */
export function calculateTenantScore(data: TenantScoreData): ScoreBreakdown {
  // Calculate individual component scores
  const paymentTimeliness = calculatePaymentTimeliness(data)
  const paymentConsistency = calculatePaymentConsistency(data)
  const paymentVolume = calculatePaymentVolume(data)
  const tenancyStability = calculateTenancyStability(data)

  // Calculate weighted total score
  const totalScore = Math.round(
    paymentTimeliness * SCORING_WEIGHTS.paymentTimeliness +
      paymentConsistency * SCORING_WEIGHTS.paymentConsistency +
      paymentVolume * SCORING_WEIGHTS.paymentVolume +
      tenancyStability * SCORING_WEIGHTS.tenancyStability,
  )

  return {
    totalScore: Math.min(1000, Math.max(0, totalScore)),
    paymentTimeliness,
    paymentConsistency,
    paymentVolume,
    tenancyStability,
    breakdown: {
      paymentTimeliness: {
        score: paymentTimeliness,
        weight: SCORING_WEIGHTS.paymentTimeliness,
        description: `${Math.round((data.onTimePayments / Math.max(1, data.totalPayments)) * 100)}% on-time payments`,
      },
      paymentConsistency: {
        score: paymentConsistency,
        weight: SCORING_WEIGHTS.paymentConsistency,
        description: "Regular payment pattern analysis",
      },
      paymentVolume: {
        score: paymentVolume,
        weight: SCORING_WEIGHTS.paymentVolume,
        description: `KES ${data.totalRentPaid.toLocaleString()} total rent paid`,
      },
      tenancyStability: {
        score: tenancyStability,
        weight: SCORING_WEIGHTS.tenancyStability,
        description: `${data.tenancyDurationMonths} months rental history`,
      },
    },
  }
}

/**
 * Get score category and description
 */
export function getScoreCategory(score: number): {
  category: string
  description: string
  color: string
  recommendations: string[]
} {
  if (score >= 850) {
    return {
      category: "Exceptional",
      description: "Outstanding rental history with excellent payment record",
      color: "text-green-700",
      recommendations: [
        "Eligible for premium properties",
        "May qualify for reduced deposits",
        "Excellent rental references",
      ],
    }
  } else if (score >= 750) {
    return {
      category: "Excellent",
      description: "Very reliable tenant with strong payment history",
      color: "text-green-600",
      recommendations: [
        "Highly recommended for most properties",
        "Strong rental application",
        "Good negotiating position",
      ],
    }
  } else if (score >= 650) {
    return {
      category: "Good",
      description: "Reliable tenant with generally good payment record",
      color: "text-blue-600",
      recommendations: ["Suitable for most rental properties", "May need standard deposit", "Good rental prospects"],
    }
  } else if (score >= 550) {
    return {
      category: "Fair",
      description: "Average rental history with some payment delays",
      color: "text-yellow-600",
      recommendations: ["May need additional references", "Consider higher deposit", "Room for improvement"],
    }
  } else if (score >= 400) {
    return {
      category: "Poor",
      description: "Below average rental history with frequent late payments",
      color: "text-orange-600",
      recommendations: ["Requires careful evaluation", "Higher deposit recommended", "Consider co-signer"],
    }
  } else {
    return {
      category: "Very Poor",
      description: "Significant payment issues and rental history concerns",
      color: "text-red-600",
      recommendations: ["High risk tenant", "Requires guarantor", "Consider alternative arrangements"],
    }
  }
}

/**
 * Simulate score calculation for demo purposes
 */
export function generateMockScoreData(phoneNumber: string): TenantScoreData {
  // Generate realistic mock data based on phone number
  const seed = phoneNumber.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const random = ((seed * 9301 + 49297) % 233280) / 233280

  const totalPayments = Math.floor(random * 24) + 6 // 6-30 payments
  const onTimeRate = 0.6 + random * 0.35 // 60-95% on-time rate
  const onTimePayments = Math.floor(totalPayments * onTimeRate)
  const latePayments = totalPayments - onTimePayments
  const averageDaysLate = latePayments > 0 ? 1 + random * 8 : 0 // 1-9 days average
  const monthlyRent = 30000 + random * 50000 // 30k-80k rent
  const totalRentPaid = totalPayments * monthlyRent
  const tenancyDurationMonths = Math.floor(totalPayments * 1.2) // Slightly longer than payments

  // Generate payment history
  const paymentHistory: PaymentRecord[] = []
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - totalPayments)

  for (let i = 0; i < totalPayments; i++) {
    const paymentDate = new Date(startDate)
    paymentDate.setMonth(paymentDate.getMonth() + i)

    const dueDate = new Date(paymentDate)
    const isLate = i >= onTimePayments
    const daysLate = isLate ? Math.floor(random * 10) + 1 : 0

    if (daysLate > 0) {
      paymentDate.setDate(paymentDate.getDate() + daysLate)
    }

    paymentHistory.push({
      amount: monthlyRent,
      paymentDate: paymentDate.toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
      daysLate,
      status: "confirmed",
    })
  }

  return {
    totalPayments,
    onTimePayments,
    latePayments,
    totalRentPaid,
    averageDaysLate,
    tenancyDurationMonths,
    paymentHistory,
  }
}

export async function getTenantScore(userId: string): Promise<{
  currentScore: number
  scoreCategory: string
  breakdown: ScoreBreakdown
  paymentHistory: PaymentRecord[]
  lastUpdated: string
}> {
  // Mock implementation - replace with actual database query
  const mockData = generateMockScoreData(userId)
  const scoreBreakdown = calculateTenantScore(mockData)
  const category = getScoreCategory(scoreBreakdown.totalScore)

  return {
    currentScore: scoreBreakdown.totalScore,
    scoreCategory: category.category,
    breakdown: scoreBreakdown,
    paymentHistory: mockData.paymentHistory,
    lastUpdated: new Date().toISOString(),
  }
}

// SIMPLIFIED VERSION FOR RENTAL MANAGEMENT SYSTEM
export interface SimplePaymentRecord {
  id: string
  amount: number
  date: string
  status: "paid" | "pending" | "overdue"
  description: string
}

export interface SimpleTenantData {
  id: string
  name: string
  phone: string
  propertyId: string
  monthlyRent: number
  paymentHistory: SimplePaymentRecord[]
}
