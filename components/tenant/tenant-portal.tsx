"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Home, CreditCard, FileText, Wrench, MessageSquare, Download, Plus, Phone, User, Calendar, DollarSign, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface TenantData {
  id: string
  name: string
  unitNumber: string
  phone: string
  email?: string
  leaseStart: string
  leaseEnd: string
  monthlyRent: number
  securityDeposit: number
  rentStatus: "paid" | "pending" | "overdue"
  lastPayment?: {
    amount: number
    date: string
    method: string
    reference: string
  }
}

interface PaymentHistory {
  id: string
  date: string
  amount: number
  method: string
  reference: string
  status: "completed" | "pending" | "failed"
  receiptUrl?: string
}

interface MaintenanceRequest {
  id: string
  title: string
  description: string
  category: string
  priority: "low" | "normal" | "urgent"
  status: "submitted" | "acknowledged" | "in_progress" | "completed"
  submittedAt: string
  photos: string[]
}

interface TenantPortalProps {
  tenantId: string
  onBack?: () => void
}

export default function TenantPortal({ tenantId, onBack }: TenantPortalProps) {
  const [tenantData, setTenantData] = useState<TenantData | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([])
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<"overview" | "payments" | "maintenance" | "documents">("overview")

  useEffect(() => {
    loadTenantData()
    loadPaymentHistory()
    loadMaintenanceRequests()
    loadDocuments()
  }, [tenantId])

  const loadTenantData = async () => {
    try {
      // Mock tenant data - in production, fetch from API
      const mockTenantData: TenantData = {
        id: tenantId,
        name: "John Doe",
        unitNumber: "1A",
        phone: "0712345678",
        email: "john@example.com",
        leaseStart: "2023-12-01",
        leaseEnd: "2024-11-30",
        monthlyRent: 25000,
        securityDeposit: 50000,
        rentStatus: "paid",
        lastPayment: {
          amount: 25000,
          date: new Date().toISOString().split('T')[0],
          method: "M-Pesa",
          reference: "QBR7G8H9I0"
        }
      }
      setTenantData(mockTenantData)
    } catch (error) {
      console.error('Failed to load tenant data:', error)
    }
  }

  const loadPaymentHistory = async () => {
    try {
      // Mock payment history
      const mockPayments: PaymentHistory[] = [
        {
          id: "PAY_001",
          date: new Date().toISOString().split('T')[0],
          amount: 25000,
          method: "M-Pesa",
          reference: "QBR7G8H9I0",
          status: "completed",
          receiptUrl: "/receipts/pay_001.pdf"
        },
        {
          id: "PAY_002",
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          amount: 25000,
          method: "M-Pesa",
          reference: "XYZ123ABC",
          status: "completed",
          receiptUrl: "/receipts/pay_002.pdf"
        }
      ]
      setPaymentHistory(mockPayments)
    } catch (error) {
      console.error('Failed to load payment history:', error)
    }
  }

  const loadMaintenanceRequests = async () => {
    try {
      // Mock maintenance requests
      const mockRequests: MaintenanceRequest[] = [
        {
          id: "MR_001",
          title: "Kitchen Sink Leak",
          description: "The kitchen sink has been leaking from the faucet for 2 days.",
          category: "plumbing",
          priority: "normal",
          status: "in_progress",
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          photos: ["/maintenance/kitchen-leak.jpg"]
        }
      ]
      setMaintenanceRequests(mockRequests)
    } catch (error) {
      console.error('Failed to load maintenance requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDocuments = async () => {
    try {
      // Mock documents
      const mockDocuments = [
        {
          id: "DOC_001",
          name: "Lease Agreement",
          type: "lease_agreement",
          url: "/documents/lease_1a.pdf",
          date: "2023-12-01"
        },
        {
          id: "DOC_002",
          name: "Move-in Inspection",
          type: "inspection",
          url: "/documents/movein_1a.pdf",
          date: "2023-12-01"
        }
      ]
      setDocuments(mockDocuments)
    } catch (error) {
      console.error('Failed to load documents:', error)
    }
  }

  const formatCurrency = (amount: number) => `KES ${amount.toLocaleString()}`

  const getRentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "overdue": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getRentStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending": return <Clock className="w-4 h-4 text-yellow-500" />
      case "overdue": return <AlertTriangle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800"
      case "in_progress": return "bg-blue-100 text-blue-800"
      case "acknowledged": return "bg-yellow-100 text-yellow-800"
      case "submitted": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const submitMaintenanceRequest = async (requestData: any) => {
    // Mock API call - in production, submit to backend
    console.log('Submitting maintenance request:', requestData)
  }

  if (loading || !tenantData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto ios-card animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
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
            {onBack && (
              <button 
                onClick={onBack}
                className="flex items-center text-blue-600 font-medium"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </button>
            )}
            <h1 className="text-lg font-semibold text-gray-900">Tenant Portal</h1>
            <div className="w-12"></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Welcome Section */}
        <div className="ios-card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{tenantData.name}</h2>
              <p className="text-sm text-blue-700">Unit {tenantData.unitNumber} • Sunset Apartments</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">{formatCurrency(tenantData.monthlyRent)}</div>
              <div className="text-xs text-gray-600">Monthly Rent</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {new Date(tenantData.leaseEnd).toLocaleDateString()}
              </div>
              <div className="text-xs text-gray-600">Lease Expires</div>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="ios-card">
          <div className="grid grid-cols-4 gap-1">
            {[
              { key: "overview", label: "Overview", icon: Home },
              { key: "payments", label: "Payments", icon: CreditCard },
              { key: "maintenance", label: "Repairs", icon: Wrench },
              { key: "documents", label: "Documents", icon: FileText }
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
            {/* Rent Status */}
            <div className="ios-card">
              <h3 className="font-semibold text-gray-900 mb-3">Current Rent Status</h3>
              <div className="flex items-center space-x-3 mb-4">
                {getRentStatusIcon(tenantData.rentStatus)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">
                      {tenantData.rentStatus === "paid" ? "Rent Paid" :
                       tenantData.rentStatus === "pending" ? "Payment Due" :
                       "Payment Overdue"}
                    </p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRentStatusColor(tenantData.rentStatus)}`}>
                      {tenantData.rentStatus.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {tenantData.rentStatus === "paid" && tenantData.lastPayment && 
                      `Last payment: ${formatCurrency(tenantData.lastPayment.amount)} on ${new Date(tenantData.lastPayment.date).toLocaleDateString()}`
                    }
                    {tenantData.rentStatus === "pending" && 
                      `Monthly rent of ${formatCurrency(tenantData.monthlyRent)} is due`
                    }
                    {tenantData.rentStatus === "overdue" && 
                      `Payment of ${formatCurrency(tenantData.monthlyRent)} is overdue`
                    }
                  </p>
                </div>
              </div>

              {tenantData.rentStatus !== "paid" && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-medium text-blue-900 mb-2">How to Pay</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• M-Pesa Paybill: <strong>174379</strong></p>
                    <p>• Account Number: <strong>{tenantData.unitNumber}</strong></p>
                    <p>• Amount: <strong>{formatCurrency(tenantData.monthlyRent)}</strong></p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setActiveView("payments")}
                className="ios-card text-left active:scale-95 transition-transform"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Payment History</p>
                    <p className="text-sm text-gray-600">{paymentHistory.length} payments</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => setActiveView("maintenance")}
                className="ios-card text-left active:scale-95 transition-transform"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Maintenance</p>
                    <p className="text-sm text-gray-600">{maintenanceRequests.length} requests</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Contact Information */}
            <div className="ios-card">
              <h3 className="font-semibold text-gray-900 mb-3">Property Management</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Emergency Line</span>
                  <button className="flex items-center space-x-2 text-blue-600 font-medium">
                    <Phone className="w-4 h-4" />
                    <span>0712345678</span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Office Hours</span>
                  <span className="font-medium text-gray-900">8 AM - 6 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Property Manager</span>
                  <span className="font-medium text-gray-900">James Mwangi</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Payments */}
        {activeView === "payments" && (
          <>
            <div className="ios-card">
              <h3 className="font-semibold text-gray-900 mb-4">Payment History</h3>
              {paymentHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No payments found</p>
              ) : (
                <div className="space-y-3">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(payment.date).toLocaleDateString()} • {payment.method}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <button className="text-blue-600 text-sm font-medium">
                          <Download className="w-4 h-4 inline mr-1" />
                          Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="ios-card">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Rent</span>
                  <span className="font-bold text-gray-900">{formatCurrency(tenantData.monthlyRent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Security Deposit</span>
                  <span className="font-medium text-gray-900">{formatCurrency(tenantData.securityDeposit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date</span>
                  <span className="font-medium text-gray-900">1st of each month</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Maintenance */}
        {activeView === "maintenance" && (
          <>
            <div className="ios-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Maintenance Requests</h3>
                <button className="ios-button bg-blue-500 py-2 px-3 flex items-center space-x-1">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">New Request</span>
                </button>
              </div>

              {maintenanceRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No maintenance requests</p>
              ) : (
                <div className="space-y-3">
                  {maintenanceRequests.map((request) => (
                    <div key={request.id} className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{request.title}</h4>
                          <p className="text-sm text-gray-600">{request.description}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMaintenanceStatusColor(request.status)}`}>
                          {request.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Submitted {new Date(request.submittedAt).toLocaleDateString()}</span>
                        <span className="capitalize">{request.priority} priority</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Documents */}
        {activeView === "documents" && (
          <>
            <div className="ios-card">
              <h3 className="font-semibold text-gray-900 mb-4">Your Documents</h3>
              {documents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No documents available</p>
              ) : (
                <div className="space-y-3">
                  {documents.map((document) => (
                    <div key={document.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{document.name}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(document.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button className="text-blue-600 text-sm font-medium">
                        <Download className="w-4 h-4 inline mr-1" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}