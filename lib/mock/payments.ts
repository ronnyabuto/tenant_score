export interface MockPaymentRecord {
  id: string
  transactionId: string
  amount: number
  phoneNumber: string
  date: string
  dueDate: string
  status: "confirmed" | "pending" | "disputed" | "verified" | "failed"
  daysLate: number
}

export const MOCK_PAYMENTS: MockPaymentRecord[] = [
  {
    id: "1",
    transactionId: "QK7X8M9N2P",
    amount: 45000,
    phoneNumber: "254734567890",
    date: "2024-11-01",
    dueDate: "2024-11-01",
    status: "confirmed",
    daysLate: 0,
  },
  {
    id: "2",
    transactionId: "RL8Y9N0Q3R",
    amount: 45000,
    phoneNumber: "254734567890",
    date: "2024-10-03",
    dueDate: "2024-10-01",
    status: "confirmed",
    daysLate: 2,
  },
  {
    id: "3",
    transactionId: "SM9Z0P1R4S",
    amount: 45000,
    phoneNumber: "254734567890",
    date: "2024-09-01",
    dueDate: "2024-09-01",
    status: "confirmed",
    daysLate: 0,
  },
  {
    id: "4",
    transactionId: "TN0A1Q2S5T",
    amount: 45000,
    phoneNumber: "254734567890",
    date: "2024-08-05",
    dueDate: "2024-08-01",
    status: "confirmed",
    daysLate: 4,
  },
]

export const mockPayments = MOCK_PAYMENTS

export function generateMockPaymentHistory(phoneNumber: string, months = 12): MockPaymentRecord[] {
  const payments: MockPaymentRecord[] = []
  const baseAmount = 45000
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - months)

  for (let i = 0; i < months; i++) {
    const paymentDate = new Date(startDate)
    paymentDate.setMonth(paymentDate.getMonth() + i)

    const dueDate = new Date(paymentDate)
    const isLate = Math.random() > 0.8 // 20% chance of late payment
    const daysLate = isLate ? Math.floor(Math.random() * 10) + 1 : 0

    if (daysLate > 0) {
      paymentDate.setDate(paymentDate.getDate() + daysLate)
    }

    payments.push({
      id: `payment_${i + 1}`,
      transactionId: Math.random().toString(36).substr(2, 10).toUpperCase(),
      amount: baseAmount,
      phoneNumber,
      date: paymentDate.toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
      status: "confirmed",
      daysLate,
    })
  }

  return payments
}
