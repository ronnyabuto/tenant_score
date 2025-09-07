"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import {
  Shield,
  Users,
  AlertTriangle,
  Activity,
  Search,
  Edit,
  CheckCircle,
  XCircle,
  Building,
  CreditCard,
  TrendingUp,
  Calendar,
  Clock,
  Target,
  DollarSign,
  BarChart3,
} from "lucide-react"

// Mock admin data
const mockAdminData = {
  systemStats: {
    totalUsers: 1247,
    totalTenants: 892,
    totalLandlords: 355,
    totalProperties: 423,
    totalPayments: 15678,
    averageScore: 672,
    activeIssues: 24,
  },
  rentAnalytics: {
    totalRentCollected: 24780000,
    monthlyTarget: 28500000,
    collectionRate: 86.9,
    avgDaysToCollect: 4.2,
    onTimePayments: 74.3,
    latePayments: 22.1,
    overduePayments: 3.6,
    recoveryTimeline: [
      { daysLate: "1-3", percentage: 68, amount: 3420000 },
      { daysLate: "4-7", percentage: 24, amount: 1210000 },
      { daysLate: "8-14", percentage: 6, amount: 302000 },
      { daysLate: "15+", percentage: 2, amount: 101000 },
    ],
    paymentHeatmap: [
      { day: 1, payments: 45, amount: 1980000 },
      { day: 2, payments: 12, amount: 540000 },
      { day: 3, payments: 8, amount: 360000 },
      { day: 4, payments: 15, amount: 675000 },
      { day: 5, payments: 23, amount: 1035000 },
      { day: 15, payments: 67, amount: 3015000 },
      { day: 28, payments: 34, amount: 1530000 },
      { day: 29, payments: 28, amount: 1260000 },
      { day: 30, payments: 41, amount: 1845000 },
      { day: 31, payments: 19, amount: 855000 },
    ],
    monthlyTrends: [
      { month: "Jul", collected: 22100000, target: 25000000 },
      { month: "Aug", collected: 23800000, target: 26000000 },
      { month: "Sep", collected: 24200000, target: 27000000 },
      { month: "Oct", collected: 23900000, target: 27500000 },
      { month: "Nov", collected: 24780000, target: 28500000 },
    ],
  },
  recentIssues: [
    {
      id: "I001",
      type: "Payment Dispute",
      tenant: "Peter Kiprotich",
      landlord: "John Mwangi",
      amount: 45000,
      description: "Tenant claims payment was made but not reflected",
      status: "pending",
      createdAt: "2024-11-08",
      priority: "high",
      category: "dispute",
    },
    {
      id: "I002",
      type: "Maintenance Request",
      tenant: "Grace Achieng",
      landlord: "Mary Wanjiku",
      amount: 0,
      description: "Kitchen sink is leaking, needs urgent repair",
      status: "investigating",
      createdAt: "2024-11-07",
      priority: "high",
      category: "maintenance",
    },
    {
      id: "I003",
      type: "Noise Complaint",
      tenant: "David Mutua",
      landlord: "Sarah Wanjiru",
      amount: 0,
      description: "Neighbors playing loud music past 10 PM daily",
      status: "pending",
      createdAt: "2024-11-06",
      priority: "medium",
      category: "complaint",
    },
    {
      id: "I004",
      type: "Security Issue",
      tenant: "Lucy Wanjiku",
      landlord: "John Mwangi",
      amount: 0,
      description: "Main gate lock is broken, security concern",
      status: "resolved",
      createdAt: "2024-11-05",
      priority: "high",
      category: "maintenance",
    },
    {
      id: "I005",
      type: "Score Dispute",
      tenant: "Michael Otieno",
      landlord: "Rose Njeri",
      amount: 0,
      description: "Tenant disputes late payment marking on credit report",
      status: "investigating",
      createdAt: "2024-11-04",
      priority: "medium",
      category: "dispute",
    },
  ],
  recentUsers: [
    {
      id: "U001",
      name: "David Mutua",
      phone: "254756789012",
      type: "tenant",
      score: 580,
      joinDate: "2024-11-08",
      status: "active",
    },
    {
      id: "U002",
      name: "Sarah Wanjiru",
      phone: "254767890123",
      type: "landlord",
      properties: 2,
      joinDate: "2024-11-07",
      status: "pending_verification",
    },
  ],
  systemLogs: [
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
      action: "Issue Resolved",
      user: "Admin: System Administrator",
      details: "Payment dispute I003 resolved in favor of tenant",
      timestamp: "2024-11-08 13:15:00",
      type: "admin",
    },
    {
      id: "L003",
      action: "Maintenance Completed",
      user: "Maintenance Team",
      details: "Kitchen sink repair completed for Grace Achieng",
      timestamp: "2024-11-08 11:45:00",
      type: "system",
    },
  ],
}

export function AdminDashboard() {
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedIssue, setSelectedIssue] = useState<any>(null)
  const [issueResolution, setIssueResolution] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [scoreAdjustment, setScoreAdjustment] = useState({
    userId: "",
    newScore: "",
    reason: "",
  })

  const handleResolveIssue = (issueId: string, resolution: "approve" | "reject") => {
    toast({
      title: "Issue resolved",
      description: `Issue ${issueId} has been ${resolution === "approve" ? "approved" : "rejected"}`,
    })
    setSelectedIssue(null)
    setIssueResolution("")
  }

  const handleScoreAdjustment = () => {
    if (!scoreAdjustment.userId || !scoreAdjustment.newScore || !scoreAdjustment.reason) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields for score adjustment",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Score adjusted",
      description: `User score has been updated to ${scoreAdjustment.newScore}`,
    })

    setScoreAdjustment({ userId: "", newScore: "", reason: "" })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "investigating":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="ios-container safe-area-pt">
        {/* Header */}
        <div className="ios-space-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="ios-title text-blue-600">Admin Panel</h1>
              <div className="flex items-center mt-1">
                <Shield className="h-3 w-3 text-green-500 mr-1" />
                <span className="ios-caption text-green-600">{user?.userType}</span>
              </div>
            </div>
            <button onClick={signOut} className="ios-button-text">
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="ios-card mb-4">
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === "overview" 
                  ? "bg-blue-500 text-white shadow-sm" 
                  : "text-gray-600 hover:text-blue-500 hover:bg-blue-50"
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab("issues")}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === "issues" 
                  ? "bg-blue-500 text-white shadow-sm" 
                  : "text-gray-600 hover:text-blue-500 hover:bg-blue-50"
              }`}
            >
              Issues
            </button>
            <button 
              onClick={() => setActiveTab("users")}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === "users" 
                  ? "bg-blue-500 text-white shadow-sm" 
                  : "text-gray-600 hover:text-blue-500 hover:bg-blue-50"
              }`}
            >
              Users
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="ios-space-sm">
            {/* Total Rent Collected */}
            <div className="ios-card mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="text-center">
                <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-700 mb-2">
                  KES {(mockAdminData.rentAnalytics.totalRentCollected / 1000000).toFixed(1)}M
                </div>
                <div className="ios-caption text-green-600 mb-3">Total Rent Collected This Month</div>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Target className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-gray-600">Target: KES {(mockAdminData.rentAnalytics.monthlyTarget / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Velocity Tracker */}
            <div className="ios-card mb-6">
              <h3 className="ios-body font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                Revenue Velocity Tracker
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                {/* Collection Rate Ring */}
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-gray-200"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        className="text-green-500"
                        style={{
                          strokeDasharray: `${2 * Math.PI * 28}`,
                          strokeDashoffset: `${2 * Math.PI * 28 * (1 - mockAdminData.rentAnalytics.collectionRate / 100)}`,
                          transition: 'stroke-dashoffset 2s ease-in-out'
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600">
                        {mockAdminData.rentAnalytics.collectionRate}%
                      </span>
                    </div>
                  </div>
                  <div className="ios-micro">Collection Rate</div>
                </div>

                {/* On-Time Payments Ring */}
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-gray-200"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        className="text-blue-500"
                        style={{
                          strokeDasharray: `${2 * Math.PI * 28}`,
                          strokeDashoffset: `${2 * Math.PI * 28 * (1 - mockAdminData.rentAnalytics.onTimePayments / 100)}`,
                          transition: 'stroke-dashoffset 2s ease-in-out'
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">
                        {mockAdminData.rentAnalytics.onTimePayments}%
                      </span>
                    </div>
                  </div>
                  <div className="ios-micro">On-Time</div>
                </div>

                {/* Average Collection Time */}
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                      <span className="text-xs font-bold text-purple-600 bg-white px-1 rounded">
                        {mockAdminData.rentAnalytics.avgDaysToCollect}d
                      </span>
                    </div>
                  </div>
                  <div className="ios-micro">Avg Days</div>
                </div>
              </div>
            </div>

            {/* Payment Pattern Heatmap */}
            <div className="ios-card mb-6">
              <h3 className="ios-body font-semibold mb-4 flex items-center">
                <Calendar className="h-5 w-5 text-orange-500 mr-2" />
                Payment Pattern Heatmap
              </h3>
              
              <div className="grid grid-cols-7 gap-1 mb-4">
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1
                  const dayData = mockAdminData.rentAnalytics.paymentHeatmap.find(d => d.day === day)
                  const intensity = dayData ? Math.min(dayData.payments / 70 * 100, 100) : 0
                  
                  return (
                    <div
                      key={day}
                      className={`aspect-square rounded text-xs flex items-center justify-center font-medium transition-all duration-300 ${
                        intensity > 60 ? 'bg-green-500 text-white' :
                        intensity > 40 ? 'bg-green-400 text-white' :
                        intensity > 20 ? 'bg-green-300 text-gray-800' :
                        intensity > 0 ? 'bg-green-200 text-gray-700' :
                        'bg-gray-100 text-gray-400'
                      }`}
                      title={dayData ? `Day ${day}: ${dayData.payments} payments (KES ${(dayData.amount / 1000).toFixed(0)}K)` : `Day ${day}: No payments`}
                    >
                      {day}
                    </div>
                  )
                })}
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Peak days: 1st, 15th, 30th</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Less</span>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-gray-100 rounded"></div>
                    <div className="w-3 h-3 bg-green-200 rounded"></div>
                    <div className="w-3 h-3 bg-green-300 rounded"></div>
                    <div className="w-3 h-3 bg-green-400 rounded"></div>
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                  </div>
                  <span className="text-gray-500">More</span>
                </div>
              </div>
            </div>

            {/* Late Payment Recovery Timeline */}
            <div className="ios-card mb-6">
              <h3 className="ios-body font-semibold mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 text-red-500 mr-2" />
                Late Payment Recovery Timeline
              </h3>
              
              <div className="space-y-3">
                {mockAdminData.rentAnalytics.recoveryTimeline.map((period, index) => (
                  <div key={period.daysLate} className="flex items-center space-x-3">
                    <div className="w-12 text-sm font-medium text-gray-600">
                      {period.daysLate}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{period.percentage}% recover</span>
                        <span className="text-sm text-green-600">
                          KES {(period.amount / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 delay-${index * 200} ${
                            period.percentage > 50 ? 'bg-green-500' :
                            period.percentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${period.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-blue-600 mr-2" />
                  <div className="ios-micro text-blue-700">
                    <strong>Insight:</strong> 92% of late payments are recovered within 14 days. 
                    Focus collection efforts on 15+ day overdue accounts.
                  </div>
                </div>
              </div>
            </div>

            {/* System Statistics */}
            <h2 className="ios-title mb-4">System Overview</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="ios-card text-center">
                <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <div className="ios-body font-semibold">{mockAdminData.systemStats.totalUsers}</div>
                <p className="ios-micro text-gray-500">Total Users</p>
              </div>
              <div className="ios-card text-center">
                <Building className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <div className="ios-body font-semibold">{mockAdminData.systemStats.totalProperties}</div>
                <p className="ios-micro text-gray-500">Properties</p>
              </div>
            </div>

            {/* Recent Issues */}
            <h3 className="ios-title mb-4">Recent Issues</h3>
            <div className="ios-space-xs">
              {mockAdminData.recentIssues.slice(0, 2).map((issue) => (
                <div key={issue.id} className="ios-card">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                    <span className={`text-xs font-semibold ${getPriorityColor(issue.priority)} uppercase`}>
                      {issue.priority}
                    </span>
                  </div>
                  <div className="ios-space-xs">
                    <div className="ios-caption font-medium">{issue.type}</div>
                    <div className="ios-micro text-gray-600">{issue.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Issues Tab */}
        {activeTab === "issues" && (
          <div className="ios-space-sm">
            <h2 className="ios-title mb-4">Issue Management</h2>
            
            {/* Filter Tabs */}
            <div className="ios-card mb-4">
              <div className="flex space-x-1 overflow-x-auto pb-1">
                {['all', 'dispute', 'maintenance', 'complaint'].map((filter) => (
                  <button 
                    key={filter}
                    className="px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                  >
                    {filter === 'all' ? 'All Issues' : filter.charAt(0).toUpperCase() + filter.slice(1) + 's'}
                  </button>
                ))}
              </div>
            </div>

            <div className="ios-space-xs">
              {mockAdminData.recentIssues.map((issue) => (
                <div key={issue.id} className="ios-card">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="ios-body font-bold">#{issue.id}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        issue.category === 'maintenance' ? 'bg-blue-100 text-blue-800' :
                        issue.category === 'complaint' ? 'bg-orange-100 text-orange-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {issue.category}
                      </span>
                    </div>
                    <button className="ios-button-secondary py-2 px-4">Review</button>
                  </div>
                  <div className="ios-space-xs">
                    <div className="ios-body font-semibold">{issue.type}</div>
                    <div className="ios-caption">{issue.tenant} → {issue.landlord}</div>
                    <div className="ios-micro text-gray-600 mb-2">{issue.description}</div>
                    {issue.amount > 0 && (
                      <div className="ios-micro font-semibold text-green-600">Amount: KES {issue.amount.toLocaleString()}</div>
                    )}
                    <div className="flex justify-between items-center">
                      <div className="ios-micro text-gray-500">Created: {issue.createdAt}</div>
                      <span className={`text-xs font-semibold ${getPriorityColor(issue.priority)} uppercase`}>
                        {issue.priority}
                      </span>
                    </div>
                  </div>
                  
                  {issue.status === "pending" && (
                    <div className="flex space-x-2 mt-4">
                      <button 
                        onClick={() => handleResolveIssue(issue.id, "approve")}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl text-sm font-medium"
                      >
                        <CheckCircle className="h-4 w-4 inline mr-1" />
                        {issue.category === 'maintenance' ? 'Assign' : 'Approve'}
                      </button>
                      <button 
                        onClick={() => handleResolveIssue(issue.id, "reject")}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl text-sm font-medium"
                      >
                        <XCircle className="h-4 w-4 inline mr-1" />
                        {issue.category === 'maintenance' ? 'Dismiss' : 'Reject'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="ios-space-sm">
            <h2 className="ios-title mb-4">User Management</h2>
            
            <div className="ios-card mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="ios-space-xs">
              {mockAdminData.recentUsers.map((user) => (
                <div key={user.id} className="ios-card">
                  <div className="flex justify-between items-start">
                    <div className="ios-space-xs">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="ios-body font-semibold">{user.name}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {user.type}
                        </span>
                        {user.status === "active" && (
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        )}
                      </div>
                      <div className="ios-caption">📱 {user.phone}</div>
                      {user.type === "tenant" && (
                        <div className="ios-caption">⭐ Score: {user.score}</div>
                      )}
                      {user.type === "landlord" && user.properties && (
                        <div className="ios-caption">🏠 Properties: {user.properties}</div>
                      )}
                      <div className="ios-micro text-gray-500">Joined: {user.joinDate}</div>
                    </div>
                    <button className="ios-button-secondary py-2 px-4">
                      <Edit className="h-4 w-4 mr-1 inline" />
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Score Adjustment Tool */}
            <div className="ios-card mt-6">
              <h3 className="ios-body font-semibold mb-4">Manual Score Adjustment</h3>
              <div className="ios-space-xs">
                <input
                  type="text"
                  placeholder="User ID"
                  value={scoreAdjustment.userId}
                  onChange={(e) => setScoreAdjustment({...scoreAdjustment, userId: e.target.value})}
                  className="ios-input mb-3"
                />
                <input
                  type="number"
                  placeholder="New Score"
                  value={scoreAdjustment.newScore}
                  onChange={(e) => setScoreAdjustment({...scoreAdjustment, newScore: e.target.value})}
                  className="ios-input mb-3"
                />
                <textarea
                  placeholder="Reason for adjustment"
                  value={scoreAdjustment.reason}
                  onChange={(e) => setScoreAdjustment({...scoreAdjustment, reason: e.target.value})}
                  className="ios-input mb-4"
                  rows={3}
                />
                <button onClick={handleScoreAdjustment} className="ios-button">
                  Update Score
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
