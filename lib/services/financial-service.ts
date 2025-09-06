// Financial Service - Advanced financial management and reporting

export interface FinancialTransaction {
  id: string
  type: "income" | "expense"
  category: string
  subcategory?: string
  description: string
  amount: number
  date: string
  tenantId?: string
  unitNumber?: string
  receiptUrl?: string
  paymentMethod: "mpesa" | "bank" | "cash" | "check"
  referenceNumber?: string
  isRecurring: boolean
  recurringPeriod?: "monthly" | "quarterly" | "yearly"
  taxDeductible: boolean
  status: "completed" | "pending" | "cancelled"
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface ExpenseCategory {
  id: string
  name: string
  type: "operating" | "maintenance" | "utilities" | "administrative" | "tax"
  description: string
  isTaxDeductible: boolean
  budgetAmount?: number
  icon: string
}

export interface SecurityDeposit {
  id: string
  tenantId: string
  tenantName: string
  unitNumber: string
  amount: number
  dateCollected: string
  status: "held" | "partially_returned" | "fully_returned" | "forfeited"
  deductions?: {
    id: string
    description: string
    amount: number
    date: string
    receiptUrl?: string
  }[]
  returnAmount?: number
  returnDate?: string
  returnMethod?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface FinancialReport {
  id: string
  type: "monthly" | "quarterly" | "yearly" | "custom"
  period: {
    start: string
    end: string
    label: string
  }
  summary: {
    totalIncome: number
    totalExpenses: number
    netIncome: number
    occupancyRate: number
    collectionRate: number
  }
  income: {
    rent: number
    deposits: number
    fees: number
    other: number
    byUnit: { unitNumber: string; amount: number }[]
  }
  expenses: {
    byCategory: { category: string; amount: number }[]
    maintenance: number
    utilities: number
    administrative: number
    tax: number
  }
  taxInfo: {
    deductibleExpenses: number
    taxableIncome: number
    estimatedTax: number
  }
  createdAt: string
}

// In-memory storage for demo (replace with database)
let transactions: FinancialTransaction[] = [
  {
    id: "TXN_001",
    type: "income",
    category: "rent",
    description: "Monthly rent - Unit 1A",
    amount: 25000,
    date: new Date().toISOString().split('T')[0],
    tenantId: "0712345678",
    unitNumber: "1A",
    paymentMethod: "mpesa",
    referenceNumber: "QBR7G8H9I0",
    isRecurring: true,
    recurringPeriod: "monthly",
    taxDeductible: false,
    status: "completed",
    createdBy: "system",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "TXN_002",
    type: "expense",
    category: "maintenance",
    subcategory: "plumbing",
    description: "Kitchen sink repair - Unit 1A",
    amount: 3500,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    unitNumber: "1A",
    paymentMethod: "cash",
    isRecurring: false,
    taxDeductible: true,
    status: "completed",
    createdBy: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "TXN_003",
    type: "expense",
    category: "utilities",
    subcategory: "electricity",
    description: "Building electricity bill",
    amount: 8500,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: "bank",
    referenceNumber: "KPLC2023001",
    isRecurring: true,
    recurringPeriod: "monthly",
    taxDeductible: true,
    status: "completed",
    createdBy: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

let securityDeposits: SecurityDeposit[] = [
  {
    id: "DEP_001",
    tenantId: "0712345678",
    tenantName: "John Doe",
    unitNumber: "1A",
    amount: 50000,
    dateCollected: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: "held",
    notes: "Full security deposit collected at lease signing",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "DEP_002",
    tenantId: "0723456789",
    tenantName: "Jane Smith",
    unitNumber: "2B",
    amount: 45000,
    dateCollected: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: "held",
    notes: "Security deposit for Unit 2B",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const expenseCategories: ExpenseCategory[] = [
  {
    id: "maintenance",
    name: "Maintenance & Repairs",
    type: "maintenance",
    description: "Property maintenance, repairs, and improvements",
    isTaxDeductible: true,
    budgetAmount: 15000,
    icon: "🔧"
  },
  {
    id: "utilities",
    name: "Utilities",
    type: "utilities",
    description: "Electricity, water, internet, garbage collection",
    isTaxDeductible: true,
    budgetAmount: 10000,
    icon: "⚡"
  },
  {
    id: "administrative",
    name: "Administrative",
    type: "administrative",
    description: "Legal, accounting, insurance, and management fees",
    isTaxDeductible: true,
    budgetAmount: 5000,
    icon: "📋"
  },
  {
    id: "tax",
    name: "Taxes & Fees",
    type: "tax",
    description: "Property tax, licensing fees, government charges",
    isTaxDeductible: false,
    budgetAmount: 8000,
    icon: "🏛️"
  }
]

/**
 * Get financial transactions with filtering
 */
export async function getTransactions(
  type?: "income" | "expense",
  category?: string,
  startDate?: string,
  endDate?: string,
  limit?: number
): Promise<FinancialTransaction[]> {
  let filtered = [...transactions]
  
  if (type) {
    filtered = filtered.filter(txn => txn.type === type)
  }
  
  if (category) {
    filtered = filtered.filter(txn => txn.category === category)
  }
  
  if (startDate) {
    filtered = filtered.filter(txn => txn.date >= startDate)
  }
  
  if (endDate) {
    filtered = filtered.filter(txn => txn.date <= endDate)
  }
  
  // Sort by date (newest first)
  filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  if (limit) {
    filtered = filtered.slice(0, limit)
  }
  
  return filtered
}

/**
 * Add new financial transaction
 */
export async function addTransaction(
  transactionData: Omit<FinancialTransaction, 'id' | 'createdAt' | 'updatedAt'>
): Promise<FinancialTransaction> {
  const newTransaction: FinancialTransaction = {
    ...transactionData,
    id: generateTransactionId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  transactions.push(newTransaction)
  
  console.log(`💰 ${newTransaction.type} added: KES ${newTransaction.amount} - ${newTransaction.description}`)
  
  return newTransaction
}

/**
 * Generate monthly financial report
 */
export async function generateMonthlyReport(year: number, month: number): Promise<FinancialReport> {
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0]
  const endDate = new Date(year, month, 0).toISOString().split('T')[0]
  
  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' })
  
  const monthTransactions = await getTransactions(undefined, undefined, startDate, endDate)
  
  const income = monthTransactions.filter(t => t.type === "income")
  const expenses = monthTransactions.filter(t => t.type === "expense")
  
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)
  const netIncome = totalIncome - totalExpenses
  
  // Calculate income breakdown
  const rentIncome = income.filter(t => t.category === "rent").reduce((sum, t) => sum + t.amount, 0)
  const depositIncome = income.filter(t => t.category === "deposit").reduce((sum, t) => sum + t.amount, 0)
  const feeIncome = income.filter(t => t.category === "fees").reduce((sum, t) => sum + t.amount, 0)
  const otherIncome = totalIncome - rentIncome - depositIncome - feeIncome
  
  // Calculate expenses by category
  const expensesByCategory = expenseCategories.map(cat => ({
    category: cat.name,
    amount: expenses.filter(t => t.category === cat.id).reduce((sum, t) => sum + t.amount, 0)
  }))
  
  // Calculate income by unit
  const { APARTMENT_UNITS } = await import("../mock/building-data")
  const incomeByUnit = APARTMENT_UNITS.map(unit => ({
    unitNumber: unit.unitNumber,
    amount: income.filter(t => t.unitNumber === unit.unitNumber).reduce((sum, t) => sum + t.amount, 0)
  })).filter(item => item.amount > 0)
  
  // Calculate occupancy and collection rates
  const totalUnits = APARTMENT_UNITS.length
  const occupiedUnits = APARTMENT_UNITS.filter(u => u.tenant).length
  const occupancyRate = (occupiedUnits / totalUnits) * 100
  
  const expectedRent = APARTMENT_UNITS.filter(u => u.tenant).reduce((sum, u) => sum + u.rent.amount, 0)
  const collectionRate = expectedRent > 0 ? (rentIncome / expectedRent) * 100 : 0
  
  // Tax calculations
  const deductibleExpenses = expenses.filter(t => t.taxDeductible).reduce((sum, t) => sum + t.amount, 0)
  const taxableIncome = Math.max(0, totalIncome - deductibleExpenses)
  const estimatedTax = taxableIncome * 0.3 // 30% tax rate (simplified)
  
  return {
    id: generateReportId(),
    type: "monthly",
    period: {
      start: startDate,
      end: endDate,
      label: `${monthName} ${year}`
    },
    summary: {
      totalIncome,
      totalExpenses,
      netIncome,
      occupancyRate: Math.round(occupancyRate),
      collectionRate: Math.round(collectionRate)
    },
    income: {
      rent: rentIncome,
      deposits: depositIncome,
      fees: feeIncome,
      other: otherIncome,
      byUnit: incomeByUnit
    },
    expenses: {
      byCategory: expensesByCategory,
      maintenance: expenses.filter(t => t.category === "maintenance").reduce((sum, t) => sum + t.amount, 0),
      utilities: expenses.filter(t => t.category === "utilities").reduce((sum, t) => sum + t.amount, 0),
      administrative: expenses.filter(t => t.category === "administrative").reduce((sum, t) => sum + t.amount, 0),
      tax: expenses.filter(t => t.category === "tax").reduce((sum, t) => sum + t.amount, 0)
    },
    taxInfo: {
      deductibleExpenses,
      taxableIncome,
      estimatedTax
    },
    createdAt: new Date().toISOString()
  }
}

/**
 * Get profit & loss statement
 */
export async function getProfitLossStatement(startDate: string, endDate: string): Promise<{
  period: { start: string; end: string }
  revenue: {
    rental: number
    fees: number
    deposits: number
    other: number
    total: number
  }
  expenses: {
    operating: { [key: string]: number; total: number }
    maintenance: number
    utilities: number
    administrative: number
    depreciation: number
    taxes: number
    total: number
  }
  netIncome: number
  margins: {
    grossMargin: number
    operatingMargin: number
    netMargin: number
  }
}> {
  const periodTransactions = await getTransactions(undefined, undefined, startDate, endDate)
  
  const income = periodTransactions.filter(t => t.type === "income")
  const expenses = periodTransactions.filter(t => t.type === "expense")
  
  // Revenue breakdown
  const rental = income.filter(t => t.category === "rent").reduce((sum, t) => sum + t.amount, 0)
  const fees = income.filter(t => t.category === "fees").reduce((sum, t) => sum + t.amount, 0)
  const deposits = income.filter(t => t.category === "deposit").reduce((sum, t) => sum + t.amount, 0)
  const otherRevenue = income.filter(t => !["rent", "fees", "deposit"].includes(t.category)).reduce((sum, t) => sum + t.amount, 0)
  const totalRevenue = rental + fees + deposits + otherRevenue
  
  // Expenses breakdown
  const maintenance = expenses.filter(t => t.category === "maintenance").reduce((sum, t) => sum + t.amount, 0)
  const utilities = expenses.filter(t => t.category === "utilities").reduce((sum, t) => sum + t.amount, 0)
  const administrative = expenses.filter(t => t.category === "administrative").reduce((sum, t) => sum + t.amount, 0)
  const taxes = expenses.filter(t => t.category === "tax").reduce((sum, t) => sum + t.amount, 0)
  const depreciation = 0 // Would be calculated based on property value and depreciation schedule
  
  const operating = {
    maintenance,
    utilities,
    administrative,
    insurance: 0, // Placeholder
    management: 0, // Placeholder
    total: maintenance + utilities + administrative
  }
  
  const totalExpenses = operating.total + depreciation + taxes
  const netIncome = totalRevenue - totalExpenses
  
  // Calculate margins
  const grossMargin = totalRevenue > 0 ? ((totalRevenue - operating.total) / totalRevenue) * 100 : 0
  const operatingMargin = totalRevenue > 0 ? ((totalRevenue - operating.total - depreciation) / totalRevenue) * 100 : 0
  const netMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0
  
  return {
    period: { start: startDate, end: endDate },
    revenue: {
      rental,
      fees,
      deposits,
      other: otherRevenue,
      total: totalRevenue
    },
    expenses: {
      operating,
      maintenance,
      utilities,
      administrative,
      depreciation,
      taxes,
      total: totalExpenses
    },
    netIncome,
    margins: {
      grossMargin: Math.round(grossMargin),
      operatingMargin: Math.round(operatingMargin),
      netMargin: Math.round(netMargin)
    }
  }
}

/**
 * Get security deposits
 */
export async function getSecurityDeposits(): Promise<SecurityDeposit[]> {
  return securityDeposits.sort((a, b) => new Date(b.dateCollected).getTime() - new Date(a.dateCollected).getTime())
}

/**
 * Process security deposit return
 */
export async function processDepositReturn(
  depositId: string,
  returnAmount: number,
  deductions: SecurityDeposit['deductions'] = [],
  notes?: string
): Promise<SecurityDeposit | null> {
  const depositIndex = securityDeposits.findIndex(d => d.id === depositId)
  if (depositIndex === -1) return null
  
  const deposit = securityDeposits[depositIndex]
  const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0)
  
  securityDeposits[depositIndex] = {
    ...deposit,
    status: returnAmount === deposit.amount ? "fully_returned" : 
           returnAmount > 0 ? "partially_returned" : "forfeited",
    deductions: deductions.length > 0 ? deductions : undefined,
    returnAmount,
    returnDate: new Date().toISOString().split('T')[0],
    returnMethod: "bank", // Default
    notes: notes || deposit.notes,
    updatedAt: new Date().toISOString()
  }
  
  // Add transaction for deposit return
  if (returnAmount > 0) {
    await addTransaction({
      type: "expense",
      category: "deposit_return",
      description: `Security deposit return - Unit ${deposit.unitNumber}`,
      amount: returnAmount,
      date: new Date().toISOString().split('T')[0],
      tenantId: deposit.tenantId,
      unitNumber: deposit.unitNumber,
      paymentMethod: "bank",
      isRecurring: false,
      taxDeductible: false,
      status: "completed",
      createdBy: "admin"
    })
  }
  
  console.log(`🏦 Security deposit processed: KES ${returnAmount} returned to ${deposit.tenantName}`)
  
  return securityDeposits[depositIndex]
}

/**
 * Get expense categories
 */
export async function getExpenseCategories(): Promise<ExpenseCategory[]> {
  return expenseCategories
}

/**
 * Get financial dashboard summary
 */
export async function getFinancialSummary(): Promise<{
  thisMonth: {
    income: number
    expenses: number
    netIncome: number
  }
  yearToDate: {
    income: number
    expenses: number
    netIncome: number
  }
  cashFlow: { month: string; income: number; expenses: number }[]
  topExpenses: { category: string; amount: number }[]
  securityDepositsHeld: number
  upcomingExpenses: FinancialTransaction[]
}> {
  const now = new Date()
  const thisMonth = {
    start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
    end: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
  }
  
  const yearStart = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]
  const today = now.toISOString().split('T')[0]
  
  // This month data
  const thisMonthTxns = await getTransactions(undefined, undefined, thisMonth.start, thisMonth.end)
  const thisMonthIncome = thisMonthTxns.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const thisMonthExpenses = thisMonthTxns.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  
  // Year to date data
  const ytdTxns = await getTransactions(undefined, undefined, yearStart, today)
  const ytdIncome = ytdTxns.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const ytdExpenses = ytdTxns.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  
  // Cash flow for last 6 months
  const cashFlow = []
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).toISOString().split('T')[0]
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).toISOString().split('T')[0]
    
    const monthTxns = await getTransactions(undefined, undefined, monthStart, monthEnd)
    const monthIncome = monthTxns.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const monthExpenses = monthTxns.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
    
    cashFlow.push({
      month: monthDate.toLocaleString('default', { month: 'short' }),
      income: monthIncome,
      expenses: monthExpenses
    })
  }
  
  // Top expense categories this month
  const expensesByCategory = new Map()
  thisMonthTxns.filter(t => t.type === "expense").forEach(t => {
    expensesByCategory.set(t.category, (expensesByCategory.get(t.category) || 0) + t.amount)
  })
  
  const topExpenses = Array.from(expensesByCategory.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
  
  // Security deposits held
  const securityDepositsHeld = securityDeposits
    .filter(d => d.status === "held")
    .reduce((sum, d) => sum + d.amount, 0)
  
  // Upcoming recurring expenses (mock)
  const upcomingExpenses = transactions
    .filter(t => t.type === "expense" && t.isRecurring)
    .slice(0, 3)
  
  return {
    thisMonth: {
      income: thisMonthIncome,
      expenses: thisMonthExpenses,
      netIncome: thisMonthIncome - thisMonthExpenses
    },
    yearToDate: {
      income: ytdIncome,
      expenses: ytdExpenses,
      netIncome: ytdIncome - ytdExpenses
    },
    cashFlow,
    topExpenses,
    securityDepositsHeld,
    upcomingExpenses
  }
}

// Helper functions
function generateTransactionId(): string {
  return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
}

function generateReportId(): string {
  return `RPT_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
}