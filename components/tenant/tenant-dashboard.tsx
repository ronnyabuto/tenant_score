"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import {
  Shield,
  CreditCard,
  Home,
  Wrench,
  AlertTriangle,
  Plus,
  TrendingUp,
  Calendar,
  Phone,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  Info,
  Send,
} from "lucide-react"

interface PaymentRecord {
  id: string
  amount: number
  dueDate: string
  paidDate?: string
  status: "paid" | "pending" | "overdue"
  method?: string
  reference?: string
}

interface MaintenanceRequest {
  id: string
  title: string
  description: string
  category: "plumbing" | "electrical" | "hvac" | "general"
  priority: "low" | "medium" | "high"
  status: "pending" | "assigned" | "in_progress" | "completed"
  submittedDate: string
  completedDate?: string
}

interface ScoreHistory {
  month: string
  score: number
  change: number
}

const mockTenantData = {
  currentScore: 720,
  scoreHistory: [
    { month: "Nov 2024", score: 720, change: +15 },
    { month: "Oct 2024", score: 705, change: +10 },
    { month: "Sep 2024", score: 695, change: -5 },
    { month: "Aug 2024", score: 700, change: +20 },
    { month: "Jul 2024", score: 680, change: +5 },
  ] as ScoreHistory[],
  payments: [
    {
      id: "P001",
      amount: 45000,
      dueDate: "2024-12-01",
      paidDate: "2024-11-28",
      status: "paid",
      method: "M-Pesa",
      reference: "RK12345678",
    },
    {
      id: "P002", 
      amount: 45000,
      dueDate: "2024-11-01",
      paidDate: "2024-10-30",
      status: "paid",
      method: "M-Pesa",
      reference: "RK12345679",
    },
    {
      id: "P003",
      amount: 45000,
      dueDate: "2025-01-01",
      status: "pending",
    },
  ] as PaymentRecord[],
  maintenanceRequests: [
    {
      id: "M001",
      title: "Kitchen Sink Leak",
      description: "The kitchen sink has been leaking for 3 days. Water is dripping constantly.",
      category: "plumbing",
      priority: "high",
      status: "in_progress",
      submittedDate: "2024-11-05",
    },
    {
      id: "M002",
      title: "Bedroom Light Fixture",
      description: "Light in master bedroom is flickering intermittently.",
      category: "electrical",
      priority: "medium", 
      status: "completed",
      submittedDate: "2024-10-28",
      completedDate: "2024-11-02",
    },
  ] as MaintenanceRequest[],
  lease: {
    property: "Kileleshwa Apartments, Unit 3B",
    landlord: "John Mwangi",
    landlordPhone: "254712345678",
    monthlyRent: 45000,
    leaseStart: "2024-01-01",
    leaseEnd: "2024-12-31",
    deposit: 90000,
  },
}

export function TenantDashboard() {
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [newMaintenanceRequest, setNewMaintenanceRequest] = useState({
    title: "",
    description: "",
    category: "general" as MaintenanceRequest["category"],
    priority: "medium" as MaintenanceRequest["priority"],
  })
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false)
  const [showComplaintForm, setShowComplaintForm] = useState(false)
  const [complaintText, setComplaintText] = useState("")

  const getScoreColor = (score: number) => {
    if (score >= 750) return "text-green-600"
    if (score >= 650) return "text-blue-600" 
    if (score >= 550) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 750) return "Excellent"
    if (score >= 650) return "Good"
    if (score >= 550) return "Fair"
    return "Needs Improvement"
  }

  const getPaymentStatusColor = (status: PaymentRecord["status"]) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "overdue": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getMaintenanceStatusColor = (status: MaintenanceRequest["status"]) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800"
      case "in_progress": return "bg-blue-100 text-blue-800"
      case "assigned": return "bg-purple-100 text-purple-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleSubmitMaintenance = () => {
    if (!newMaintenanceRequest.title || !newMaintenanceRequest.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Maintenance request submitted",
      description: "Your request has been sent to property management",
    })

    setNewMaintenanceRequest({
      title: "",
      description: "",
      category: "general",
      priority: "medium",
    })
    setShowMaintenanceForm(false)
  }

  const handleSubmitComplaint = () => {
    if (!complaintText.trim()) {
      toast({
        title: "Missing information", 
        description: "Please describe your complaint",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Complaint submitted",
      description: "Your complaint has been sent to property management",
    })

    setComplaintText("")
    setShowComplaintForm(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="ios-container safe-area-pt">
        <div className="ios-space-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="ios-title text-blue-600">Tenant Score</h1>
              <div className="flex items-center mt-1">
                <Shield className="h-3 w-3 text-green-500 mr-1" />
                <span className="ios-caption text-green-600">Verified Account</span>
              </div>
            </div>
            <button onClick={signOut} className="ios-button-text">
              Sign Out
            </button>
          </div>
        </div>

        <div className="ios-card mb-4">
          <div className="grid grid-cols-4 gap-1">
            {[
              { id: "overview", label: "Overview", icon: Home },
              { id: "payments", label: "Payments", icon: CreditCard },
              { id: "maintenance", label: "Maintenance", icon: Wrench },
              { id: "lease", label: "Lease", icon: Info },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`py-3 px-2 rounded-xl text-xs font-medium transition-all flex flex-col items-center space-y-1 ${
                  activeTab === id
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-blue-500 hover:bg-blue-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="ios-space-sm">
            <div className="ios-card mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className={`text-5xl font-bold ${getScoreColor(mockTenantData.currentScore)}`}>
                    {mockTenantData.currentScore}
                  </div>
                  <div className="ml-4">
                    <TrendingUp className={`h-8 w-8 ${getScoreColor(mockTenantData.currentScore)}`} />
                  </div>
                </div>
                <div className="ios-body font-semibold mb-2">
                  {getScoreLabel(mockTenantData.currentScore)} Credit Score
                </div>
                <div className="flex items-center justify-center text-green-600">
                  <span className="text-sm font-medium">+15 points this month</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>300</span>
                  <span>850</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      mockTenantData.currentScore >= 750 ? 'bg-green-500' :
                      mockTenantData.currentScore >= 650 ? 'bg-blue-500' :
                      mockTenantData.currentScore >= 550 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{
                      width: `${((mockTenantData.currentScore - 300) / 550) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                onClick={() => setActiveTab("payments")}
                className="ios-card text-left p-4 hover:bg-blue-50 transition-colors"
              >
                <CreditCard className="h-6 w-6 text-blue-500 mb-2" />
                <div className="ios-caption font-medium">Next Payment</div>
                <div className="ios-body text-blue-600">KES 45,000</div>
                <div className="ios-micro text-gray-500">Due Jan 1, 2025</div>
              </button>
              
              <button 
                onClick={() => setShowMaintenanceForm(true)}
                className="ios-card text-left p-4 hover:bg-orange-50 transition-colors"
              >
                <Plus className="h-6 w-6 text-orange-500 mb-2" />
                <div className="ios-caption font-medium">Report Issue</div>
                <div className="ios-body text-orange-600">Maintenance</div>
                <div className="ios-micro text-gray-500">Submit request</div>
              </button>
            </div>

            <div className="ios-space-xs">
              <h3 className="ios-title mb-4">Recent Activity</h3>
              
              <div className="ios-card mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="ios-caption font-medium">Payment Processed</div>
                    <div className="ios-micro text-gray-500">Nov 28, 2024 • KES 45,000</div>
                  </div>
                </div>
              </div>

              <div className="ios-card mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Wrench className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="ios-caption font-medium">Maintenance In Progress</div>
                    <div className="ios-micro text-gray-500">Kitchen sink repair</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="ios-space-sm">
            <h2 className="ios-title mb-4">Payment History</h2>
            
            <div className="ios-space-xs">
              {mockTenantData.payments.map((payment) => (
                <div key={payment.id} className="ios-card">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        payment.status === 'paid' ? 'bg-green-100' :
                        payment.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        {payment.status === 'paid' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : payment.status === 'pending' ? (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="ios-body font-semibold">KES {payment.amount.toLocaleString()}</div>
                        <div className="ios-caption text-gray-500">
                          Due: {new Date(payment.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                  
                  {payment.paidDate && (
                    <div className="ios-space-xs pt-3 border-t border-gray-100">
                      <div className="ios-micro text-gray-500">
                        Paid: {new Date(payment.paidDate).toLocaleDateString()}
                      </div>
                      {payment.method && (
                        <div className="ios-micro text-gray-500">
                          Method: {payment.method} • Ref: {payment.reference}
                        </div>
                      )}
                    </div>
                  )}

                  {payment.status === 'pending' && (
                    <div className="mt-4">
                      <button className="ios-button w-full">
                        Pay Now
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "maintenance" && (
          <div className="ios-space-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="ios-title">Maintenance</h2>
              <button 
                onClick={() => setShowMaintenanceForm(true)}
                className="ios-button-secondary py-2 px-4"
              >
                <Plus className="h-4 w-4 mr-1" />
                New Request
              </button>
            </div>

            {showMaintenanceForm && (
              <div className="ios-card mb-6">
                <h3 className="ios-body font-semibold mb-4">Submit Maintenance Request</h3>
                
                <div className="ios-space-xs">
                  <input
                    type="text"
                    placeholder="Issue title (e.g., Leaking faucet)"
                    value={newMaintenanceRequest.title}
                    onChange={(e) => setNewMaintenanceRequest({
                      ...newMaintenanceRequest,
                      title: e.target.value
                    })}
                    className="ios-input mb-3"
                  />
                  
                  <textarea
                    placeholder="Describe the issue in detail..."
                    value={newMaintenanceRequest.description}
                    onChange={(e) => setNewMaintenanceRequest({
                      ...newMaintenanceRequest,
                      description: e.target.value
                    })}
                    className="ios-input mb-3"
                    rows={4}
                  />
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <select
                      value={newMaintenanceRequest.category}
                      onChange={(e) => setNewMaintenanceRequest({
                        ...newMaintenanceRequest,
                        category: e.target.value as MaintenanceRequest["category"]
                      })}
                      className="ios-input"
                    >
                      <option value="general">General</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="hvac">HVAC</option>
                    </select>
                    
                    <select
                      value={newMaintenanceRequest.priority}
                      onChange={(e) => setNewMaintenanceRequest({
                        ...newMaintenanceRequest,
                        priority: e.target.value as MaintenanceRequest["priority"]
                      })}
                      className="ios-input"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button onClick={handleSubmitMaintenance} className="flex-1 ios-button">
                      <Send className="h-4 w-4 mr-1" />
                      Submit Request
                    </button>
                    <button 
                      onClick={() => setShowMaintenanceForm(false)}
                      className="flex-1 ios-button-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="ios-space-xs">
              {mockTenantData.maintenanceRequests.map((request) => (
                <div key={request.id} className="ios-card">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="ios-body font-semibold">{request.title}</div>
                      <div className="ios-caption text-gray-600 capitalize">
                        {request.category} • {request.priority} priority
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMaintenanceStatusColor(request.status)}`}>
                      {request.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="ios-micro text-gray-600 mb-3">
                    {request.description}
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Submitted: {new Date(request.submittedDate).toLocaleDateString()}</span>
                    {request.completedDate && (
                      <span>Completed: {new Date(request.completedDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button 
                onClick={() => setShowComplaintForm(true)}
                className="w-full ios-card p-4 text-left hover:bg-red-50 transition-colors border border-red-200"
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                  <div>
                    <div className="ios-caption font-medium text-red-700">File a Complaint</div>
                    <div className="ios-micro text-red-600">Noise, disturbance, or other issues</div>
                  </div>
                </div>
              </button>
            </div>

            {showComplaintForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
                <div className="w-full bg-white rounded-t-2xl p-6 max-h-96 overflow-y-auto">
                  <h3 className="ios-body font-semibold mb-4">Submit Complaint</h3>
                  
                  <textarea
                    placeholder="Describe your complaint in detail..."
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    className="ios-input mb-4"
                    rows={6}
                  />
                  
                  <div className="flex space-x-2">
                    <button onClick={handleSubmitComplaint} className="flex-1 ios-button">
                      Submit Complaint
                    </button>
                    <button 
                      onClick={() => setShowComplaintForm(false)}
                      className="flex-1 ios-button-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "lease" && (
          <div className="ios-space-sm">
            <h2 className="ios-title mb-4">Lease Information</h2>
            
            <div className="ios-card mb-6">
              <div className="ios-space-xs">
                <div className="flex items-center space-x-3 mb-4">
                  <Home className="h-6 w-6 text-blue-500" />
                  <div>
                    <div className="ios-body font-semibold">{mockTenantData.lease.property}</div>
                    <div className="ios-caption text-gray-600">Your Current Residence</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <div className="ios-caption text-gray-500">Monthly Rent</div>
                    <div className="ios-body font-semibold text-blue-600">
                      KES {mockTenantData.lease.monthlyRent.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="ios-caption text-gray-500">Security Deposit</div>
                    <div className="ios-body font-semibold">
                      KES {mockTenantData.lease.deposit.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ios-card mb-6">
              <h3 className="ios-body font-semibold mb-4">Lease Period</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="ios-caption text-gray-500">Start Date</div>
                  <div className="ios-body">
                    {new Date(mockTenantData.lease.leaseStart).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="ios-caption text-gray-500">End Date</div>
                  <div className="ios-body">
                    {new Date(mockTenantData.lease.leaseEnd).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                  <div className="ios-micro text-yellow-700">
                    Lease expires in 2 months. Consider renewal discussion.
                  </div>
                </div>
              </div>
            </div>

            <div className="ios-card">
              <h3 className="ios-body font-semibold mb-4">Landlord Contact</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="ios-body font-medium">{mockTenantData.lease.landlord}</div>
                  <div className="ios-caption text-gray-600">{mockTenantData.lease.landlordPhone}</div>
                </div>
                <a 
                  href={`tel:${mockTenantData.lease.landlordPhone}`}
                  className="ios-button-secondary py-2 px-4"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}