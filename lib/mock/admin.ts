export interface MockSystemStats {
  totalUsers: number
  totalTenants: number
  totalLandlords: number
  totalProperties: number
  totalPayments: number
  averageScore: number
  activeDisputes: number
}

export interface MockDispute {
  id: string
  type: string
  tenant: string
  landlord: string
  amount: number
  description: string
  status: string
  createdAt: string
  priority: string
}

export interface MockSystemLog {
  id: string
  action: string
  user: string
  details: string
  timestamp: string
  type: string
}

export const MOCK_SYSTEM_STATS: MockSystemStats = {
  totalUsers: 1247,
  totalTenants: 892,
  totalLandlords: 355,
  totalProperties: 423,
  totalPayments: 15678,
  averageScore: 672,
  activeDisputes: 12,
}

export const MOCK_DISPUTES: MockDispute[] = [
  {
    id: "D001",
    type: "Payment Dispute",
    tenant: "Peter Kiprotich",
    landlord: "John Mwangi",
    amount: 45000,
    description: "Tenant claims payment was made but not reflected",
    status: "pending",
    createdAt: "2024-11-08",
    priority: "high",
  },
  {
    id: "D002",
    type: "Score Dispute",
    tenant: "Grace Achieng",
    landlord: "Mary Wanjiku",
    amount: 0,
    description: "Tenant disputes late payment marking",
    status: "investigating",
    createdAt: "2024-11-07",
    priority: "medium",
  },
]

export const MOCK_SYSTEM_LOGS: MockSystemLog[] = [
  {
    id: "L001",
    action: "Score Updated",
    user: "Peter Kiprotich",
    details: "Score increased from 720 to 750 due to on-time payment",
    timestamp: "2024-11-08 14:30:00",
    type: "system",
  },
  {
    id: "L002",
    action: "Dispute Resolved",
    user: "Admin: System Administrator",
    details: "Payment dispute D003 resolved in favor of tenant",
    timestamp: "2024-11-08 13:15:00",
    type: "admin",
  },
]
