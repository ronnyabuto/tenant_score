import { db } from "../connection"

export interface Payment {
  id: string
  tenancyId: string
  amount: number
  paymentDate: string
  dueDate: string
  mpesaTransactionId?: string
  paymentMethod: string
  status: "pending" | "confirmed" | "disputed"
  daysLate: number
  createdAt: string
}

export class PaymentRepository {
  async findByTenantId(tenantId: string): Promise<Payment[]> {
    return await db.query<Payment>(
      `SELECT p.* FROM rent_payments p
       JOIN tenancies t ON p.tenancy_id = t.id
       WHERE t.tenant_id = $1
       ORDER BY p.payment_date DESC`,
      [tenantId],
    )
  }

  async create(paymentData: Omit<Payment, "id" | "createdAt">): Promise<Payment> {
    const payment = await db.queryOne<Payment>(
      `INSERT INTO rent_payments (tenancy_id, amount, payment_date, due_date, 
                                 mpesa_transaction_id, payment_method, status, days_late)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        paymentData.tenancyId,
        paymentData.amount,
        paymentData.paymentDate,
        paymentData.dueDate,
        paymentData.mpesaTransactionId,
        paymentData.paymentMethod,
        paymentData.status,
        paymentData.daysLate,
      ],
    )
    return payment!
  }

  async updateStatus(paymentId: string, status: Payment["status"]): Promise<void> {
    await db.execute("UPDATE rent_payments SET status = $1 WHERE id = $2", [status, paymentId])
  }

  async findByMpesaTransactionId(transactionId: string): Promise<Payment | null> {
    return await db.queryOne<Payment>("SELECT * FROM rent_payments WHERE mpesa_transaction_id = $1", [transactionId])
  }
}
