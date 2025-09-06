import { describe, it, expect } from "vitest"
import { calculateTenantScore } from "@/lib/scoring-algorithm"

describe("Scoring Algorithm", () => {
  describe("calculateTenantScore", () => {
    it("should return 500 for new tenant with no payment history", () => {
      const score = calculateTenantScore({
        totalPayments: 0,
        onTimePayments: 0,
        latePayments: 0,
        totalRentPaid: 0,
        averageDaysLate: 0,
      })

      expect(score).toBe(500)
    })

    it("should increase score for consistent on-time payments", () => {
      const score = calculateTenantScore({
        totalPayments: 12,
        onTimePayments: 12,
        latePayments: 0,
        totalRentPaid: 120000,
        averageDaysLate: 0,
      })

      expect(score).toBeGreaterThan(500)
      expect(score).toBeLessThanOrEqual(1000)
    })

    it("should decrease score for late payments", () => {
      const score = calculateTenantScore({
        totalPayments: 12,
        onTimePayments: 6,
        latePayments: 6,
        totalRentPaid: 120000,
        averageDaysLate: 5,
      })

      expect(score).toBeLessThan(500)
      expect(score).toBeGreaterThanOrEqual(0)
    })

    it("should cap score at maximum 1000", () => {
      const score = calculateTenantScore({
        totalPayments: 100,
        onTimePayments: 100,
        latePayments: 0,
        totalRentPaid: 5000000,
        averageDaysLate: 0,
      })

      expect(score).toBe(1000)
    })
  })
})
