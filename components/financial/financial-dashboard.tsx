"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3, Plus, FileText, Calculator, Shield, Calendar, Download } from "lucide-react"

interface FinancialSummary {
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
  upcomingExpenses: any[]
}

interface FinancialDashboardProps {
  onBack: () => void
}

export default function FinancialDashboard({ onBack }: FinancialDashboardProps) {
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<"overview" | "reports" | "expenses" | "deposits">("overview")

  useEffect(() => {
    loadFinancialSummary()
  }, [])

  const loadFinancialSummary = async () => {
    try {
      const response = await fetch('/api/admin/financial/summary')
      const data = await response.json()
      if (data.success) {
        setSummary(data.data)
      }
    } catch (error) {
      console.error('Failed to load financial summary:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`
  }

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0
    return Math.round(((current - previous) / previous) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto ios-card animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto ios-card text-center py-8">
          <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Failed to load financial data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center text-blue-600 font-medium"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Financials</h1>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* View Toggle */}
        <div className="ios-card">
          <div className="grid grid-cols-4 gap-1">
            {[
              { key: "overview", label: "Overview", icon: BarChart3 },
              { key: "reports", label: "Reports", icon: FileText },
              { key: "expenses", label: "Expenses", icon: Calculator },
              { key: "deposits", label: "Deposits", icon: Shield }
            ].map(option => (
              <button
                key={option.key}
                onClick={() => setActiveView(option.key as any)}
                className={`py-3 px-2 rounded-lg font-medium transition-all flex flex-col items-center space-y-1 ${
                  activeView === option.key
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <option.icon className="w-4 h-4" />
                <span className="text-xs">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview */}
        {activeView === "overview" && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="ios-card text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">{formatCurrency(summary.thisMonth.income)}</div>
                <div className="text-sm text-gray-600">Income This Month</div>
                <div className="text-xs text-green-600 mt-1">
                  {summary.thisMonth.income > 0 ? "+12% vs last month" : "No income"}
                </div>
              </div>

              <div className="ios-card text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">{formatCurrency(summary.thisMonth.expenses)}</div>
                <div className="text-sm text-gray-600">Expenses This Month</div>
                <div className="text-xs text-red-600 mt-1">
                  {summary.thisMonth.expenses > 0 ? "+5% vs last month" : "No expenses"}
                </div>
              </div>
            </div>

            {/* Net Income */}
            <div className="ios-card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Net Income</h3>
                    <p className="text-sm text-blue-700">This Month</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(summary.thisMonth.netIncome)}
                  </div>
                  <div className={`text-sm font-medium ${
                    summary.thisMonth.netIncome >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {summary.thisMonth.netIncome >= 0 ? "Profit" : "Loss"}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-blue-200">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{formatCurrency(summary.yearToDate.income)}</div>
                  <div className="text-xs text-gray-600">YTD Income</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{formatCurrency(summary.yearToDate.netIncome)}</div>
                  <div className="text-xs text-gray-600">YTD Net</div>
                </div>
              </div>
            </div>

            {/* Cash Flow Chart */}
            <div className="ios-card">
              <h3 className="font-semibold text-gray-900 mb-4">6-Month Cash Flow</h3>
              <div className="space-y-3">
                {summary.cashFlow.map((month, index) => {
                  const maxAmount = Math.max(
                    ...summary.cashFlow.map(m => Math.max(m.income, m.expenses))
                  )
                  const incomeWidth = (month.income / maxAmount) * 100
                  const expenseWidth = (month.expenses / maxAmount) * 100
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">{month.month}</span>
                        <span className="text-gray-600">
                          Net: {formatCurrency(month.income - month.expenses)}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-12 text-xs text-gray-500">Income</div>
                          <div className="flex-1 bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-green-500 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${incomeWidth}%` }}
                            />
                          </div>
                          <div className="w-16 text-xs text-right text-gray-600">
                            {formatCurrency(month.income)}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="w-12 text-xs text-gray-500">Expense</div>
                          <div className="flex-1 bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-red-500 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${expenseWidth}%` }}
                            />
                          </div>
                          <div className="w-16 text-xs text-right text-gray-600">
                            {formatCurrency(month.expenses)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Top Expenses */}
            <div className="ios-card">
              <h3 className="font-semibold text-gray-900 mb-4">Top Expenses This Month</h3>
              {summary.topExpenses.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No expenses recorded</p>
              ) : (
                <div className="space-y-3">
                  {summary.topExpenses.map((expense, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-600">{index + 1}</span>
                        </div>
                        <span className="font-medium text-gray-900 capitalize">
                          {expense.category.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="font-bold text-gray-900">{formatCurrency(expense.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Reports */}
        {activeView === "reports" && (
          <>
            <div className="ios-card">
              <h3 className="font-semibold text-gray-900 mb-4">Financial Reports</h3>
              <div className="space-y-3">
                <button className="w-full p-4 bg-blue-50 border border-blue-200 rounded-xl text-left hover:bg-blue-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Monthly P&L Statement</p>
                        <p className="text-sm text-gray-600">Profit and loss for current month</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">Generate</p>
                    </div>
                  </div>
                </button>

                <button className="w-full p-4 bg-green-50 border border-green-200 rounded-xl text-left hover:bg-green-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Tax Summary Report</p>
                        <p className="text-sm text-gray-600">Tax-deductible expenses & income</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">Generate</p>
                    </div>
                  </div>
                </button>

                <button className="w-full p-4 bg-purple-50 border border-purple-200 rounded-xl text-left hover:bg-purple-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <PieChart className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-900">Cash Flow Analysis</p>
                        <p className="text-sm text-gray-600">12-month cash flow trends</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-purple-600">Generate</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="ios-card">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-gray-900">{formatCurrency(summary.yearToDate.income)}</div>
                  <div className="text-sm text-gray-600">YTD Revenue</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{formatCurrency(summary.yearToDate.expenses)}</div>
                  <div className="text-sm text-gray-600">YTD Expenses</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600">
                    {summary.yearToDate.income > 0 
                      ? Math.round((summary.yearToDate.netIncome / summary.yearToDate.income) * 100)
                      : 0}%
                  </div>
                  <div className="text-sm text-gray-600">Profit Margin</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-600">95%</div>
                  <div className="text-sm text-gray-600">Collection Rate</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Expenses */}
        {activeView === "expenses" && (
          <>
            <div className="ios-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Expense Management</h3>
                <button className="ios-button bg-blue-500 py-2 px-3 flex items-center space-x-1">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add</span>
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { category: "Maintenance", amount: 15000, budget: 20000, icon: "🔧" },
                  { category: "Utilities", amount: 8500, budget: 10000, icon: "⚡" },
                  { category: "Administrative", amount: 3200, budget: 5000, icon: "📋" },
                  { category: "Insurance", amount: 2800, budget: 3000, icon: "🛡️" }
                ].map((expense, index) => {
                  const percentage = (expense.amount / expense.budget) * 100
                  const isOverBudget = percentage > 100
                  
                  return (
                    <div key={index} className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{expense.icon}</span>
                          <span className="font-medium text-gray-900">{expense.category}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatCurrency(expense.amount)}</p>
                          <p className="text-xs text-gray-500">of {formatCurrency(expense.budget)}</p>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isOverBudget ? "bg-red-500" : percentage > 75 ? "bg-yellow-500" : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{Math.round(percentage)}% of budget</span>
                        <span className={isOverBudget ? "text-red-600 font-medium" : ""}>
                          {isOverBudget ? "Over budget!" : `${formatCurrency(expense.budget - expense.amount)} left`}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="ios-card">
              <h3 className="font-semibold text-gray-900 mb-4">Upcoming Expenses</h3>
              {summary.upcomingExpenses.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No upcoming expenses</p>
              ) : (
                <div className="space-y-3">
                  {summary.upcomingExpenses.map((expense, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">{expense.description}</p>
                        <p className="text-sm text-gray-600">Due: Next month</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(expense.amount)}</p>
                        <p className="text-xs text-yellow-600">Recurring</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Security Deposits */}
        {activeView === "deposits" && (
          <>
            <div className="ios-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Security Deposits</h3>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(summary.securityDepositsHeld)}</p>
                  <p className="text-sm text-gray-600">Total Held</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { tenant: "John Doe", unit: "1A", amount: 50000, status: "held", date: "2023-12-01" },
                  { tenant: "Jane Smith", unit: "2B", amount: 45000, status: "held", date: "2023-11-15" },
                  { tenant: "Bob Wilson", unit: "3C", amount: 25000, status: "partially_returned", date: "2023-10-20" }
                ].map((deposit, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{deposit.tenant}</p>
                        <p className="text-sm text-gray-600">Unit {deposit.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(deposit.amount)}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          deposit.status === "held" ? "bg-green-100 text-green-800" :
                          deposit.status === "partially_returned" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {deposit.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Collected: {new Date(deposit.date).toLocaleDateString()}</span>
                      {deposit.status === "held" && (
                        <button className="text-blue-600 font-medium">Process Return</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ios-card">
              <h3 className="font-semibold text-gray-900 mb-4">Deposit Statistics</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-green-600">3</div>
                  <div className="text-sm text-gray-600">Deposits Held</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-600">1</div>
                  <div className="text-sm text-gray-600">Returns Processed</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Return Rate</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-600">KES 5K</div>
                  <div className="text-sm text-gray-600">Avg. Deduction</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}