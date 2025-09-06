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
            <h2 className="ios-title mb-4">System Overview</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="ios-card text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                <div className="ios-title text-xl">{mockAdminData.systemStats.totalUsers}</div>
                <p className="ios-caption">Total Users</p>
              </div>
              <div className="ios-card text-center">
                <Building className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <div className="ios-title text-xl">{mockAdminData.systemStats.totalProperties}</div>
                <p className="ios-caption">Properties</p>
              </div>
              <div className="ios-card text-center">
                <CreditCard className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                <div className="ios-title text-xl">{mockAdminData.systemStats.totalPayments.toLocaleString()}</div>
                <p className="ios-caption">Payments</p>
              </div>
              <div className="ios-card text-center">
                <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-3" />
                <div className="ios-title text-xl">{mockAdminData.systemStats.activeIssues}</div>
                <p className="ios-caption">Active Issues</p>
              </div>
            </div>

            {/* Recent Issues */}
            <h3 className="ios-title mb-4">Recent Issues</h3>
            <div className="ios-space-xs">
              {mockAdminData.recentIssues.slice(0, 3).map((issue) => (
                <div key={issue.id} className="ios-card">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex space-x-2">
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
                    <span className={`text-xs font-semibold ${getPriorityColor(issue.priority)} uppercase`}>
                      {issue.priority}
                    </span>
                  </div>
                  <div className="ios-space-xs">
                    <div className="ios-body font-semibold">{issue.type}</div>
                    <div className="ios-caption">{issue.tenant} vs {issue.landlord}</div>
                    <div className="ios-micro text-gray-600">{issue.description}</div>
                    {issue.amount > 0 && (
                      <div className="ios-micro font-medium text-green-600">KES {issue.amount.toLocaleString()}</div>
                    )}
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
