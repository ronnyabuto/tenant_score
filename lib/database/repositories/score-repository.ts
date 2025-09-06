import { db } from "../connection"

export interface TenantScore {
  id: string
  tenantId: string
  score: number
  totalPayments: number
  onTimePayments: number
  latePayments: number
  totalRentPaid: number
  averageDaysLate: number
  lastUpdated: string
}

export class ScoreRepository {
  async findByTenantId(tenantId: string): Promise<TenantScore | null> {
    return await db.queryOne<TenantScore>("SELECT * FROM tenant_scores WHERE tenant_id = $1", [tenantId])
  }

  async upsert(scoreData: Omit<TenantScore, "id" | "lastUpdated">): Promise<TenantScore> {
    const score = await db.queryOne<TenantScore>(
      `INSERT INTO tenant_scores (tenant_id, score, total_payments, on_time_payments, 
                                 late_payments, total_rent_paid, average_days_late)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (tenant_id) 
       DO UPDATE SET 
         score = EXCLUDED.score,
         total_payments = EXCLUDED.total_payments,
         on_time_payments = EXCLUDED.on_time_payments,
         late_payments = EXCLUDED.late_payments,
         total_rent_paid = EXCLUDED.total_rent_paid,
         average_days_late = EXCLUDED.average_days_late,
         last_updated = NOW()
       RETURNING *`,
      [
        scoreData.tenantId,
        scoreData.score,
        scoreData.totalPayments,
        scoreData.onTimePayments,
        scoreData.latePayments,
        scoreData.totalRentPaid,
        scoreData.averageDaysLate,
      ],
    )
    return score!
  }

  async findTopScores(limit = 10): Promise<TenantScore[]> {
    return await db.query<TenantScore>("SELECT * FROM tenant_scores ORDER BY score DESC LIMIT $1", [limit])
  }
}
