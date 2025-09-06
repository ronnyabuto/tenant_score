export interface MockScoreData {
  score: number
  totalPayments: number
  onTimePayments: number
  latePayments: number
  totalRentPaid: number
  averageDaysLate: number
  tenancyDurationMonths: number
}

export const MOCK_TENANT_SCORES: Record<string, MockScoreData> = {
  "254734567890": {
    score: 750,
    totalPayments: 12,
    onTimePayments: 10,
    latePayments: 2,
    totalRentPaid: 540000,
    averageDaysLate: 2.5,
    tenancyDurationMonths: 12,
  },
  "254745678901": {
    score: 680,
    totalPayments: 8,
    onTimePayments: 6,
    latePayments: 2,
    totalRentPaid: 520000,
    averageDaysLate: 3.2,
    tenancyDurationMonths: 10,
  },
  "254756789012": {
    score: 580,
    totalPayments: 6,
    onTimePayments: 3,
    latePayments: 3,
    totalRentPaid: 270000,
    averageDaysLate: 5.8,
    tenancyDurationMonths: 6,
  },
}

export const mockScores = Object.values(MOCK_TENANT_SCORES)

export function getMockScoreData(phoneNumber: string): MockScoreData {
  return (
    MOCK_TENANT_SCORES[phoneNumber] || {
      score: 500, // Base score for new tenants
      totalPayments: 0,
      onTimePayments: 0,
      latePayments: 0,
      totalRentPaid: 0,
      averageDaysLate: 0,
      tenancyDurationMonths: 0,
    }
  )
}
