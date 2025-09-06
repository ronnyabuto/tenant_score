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
    activeDisputes: 12,
  },
  recentDisputes: [
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
      action: "Dispute Resolved",
      user: "Admin: System Administrator",
      details: "Payment dispute D003 resolved in favor of tenant",
      timestamp: "2024-11-08 13:15:00",
      type: "admin",
    },
  ],
}

export function AdminDashboard() {
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedDispute, setSelectedDispute] = useState<any>(null)
  const [disputeResolution, setDisputeResolution] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [scoreAdjustment, setScoreAdjustment] = useState({
    userId: "",
    newScore: "",
    reason: "",
  })

  const handleResolveDispute = (disputeId: string, resolution: "approve" | "reject") => {
    toast({
      title: "Dispute resolved",
      description: `Dispute ${disputeId} has been ${resolution === "approve" ? "approved" : "rejected"}`,
    })
    setSelectedDispute(null)
    setDisputeResolution("")
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-green-600">TenantScore Admin</h1>
              <Badge variant="destructive">
                <Shield className="h-3 w-3 mr-1" />
                {user?.userType}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.fullName}</span>
              <Button onClick={signOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAdminData.systemStats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {mockAdminData.systemStats.totalTenants} tenants, {mockAdminData.systemStats.totalLandlords}{" "}
                    landlords
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Properties</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAdminData.systemStats.totalProperties.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Registered properties</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAdminData.systemStats.totalPayments.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Processed payments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Disputes</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{mockAdminData.systemStats.activeDisputes}</div>
                  <p className="text-xs text-muted-foreground">Requiring attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Disputes</CardTitle>
                  <CardDescription>Latest disputes requiring admin attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAdminData.recentDisputes.map((dispute) => (
                      <div key={dispute.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getStatusColor(dispute.status)}>{dispute.status}</Badge>
                          <span className={`text-sm font-medium ${getPriorityColor(dispute.priority)}`}>
                            {dispute.priority} priority
                          </span>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">{dispute.type}</div>
                          <div className="text-gray-600">
                            {dispute.tenant} vs {dispute.landlord}
                          </div>
                          <div className="text-gray-600 mt-1">{dispute.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Activity</CardTitle>
                  <CardDescription>Recent system events and admin actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAdminData.systemLogs.map((log) => (
                      <div key={log.id} className="border-l-2 border-blue-200 pl-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{log.action}</span>
                          <Badge variant={log.type === "admin" ? "destructive" : "secondary"}>{log.type}</Badge>
                        </div>
                        <div className="text-sm text-gray-600">{log.details}</div>
                        <div className="text-xs text-gray-500 mt-1">{log.timestamp}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="disputes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dispute Management</CardTitle>
                <CardDescription>Review and resolve tenant-landlord disputes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAdminData.recentDisputes.map((dispute) => (
                    <div key={dispute.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">#{dispute.id}</span>
                            <Badge className={getStatusColor(dispute.status)}>{dispute.status}</Badge>
                            <span className={`text-sm ${getPriorityColor(dispute.priority)}`}>
                              {dispute.priority} priority
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Created: {new Date(dispute.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedDispute(dispute)}
                              className="bg-transparent"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>
                                Dispute #{dispute.id} - {dispute.type}
                              </DialogTitle>
                              <DialogDescription>Review and resolve this dispute</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Tenant</Label>
                                  <div className="font-medium">{dispute.tenant}</div>
                                </div>
                                <div>
                                  <Label>Landlord</Label>
                                  <div className="font-medium">{dispute.landlord}</div>
                                </div>
                              </div>
                              {dispute.amount > 0 && (
                                <div>
                                  <Label>Amount</Label>
                                  <div className="font-medium">KES {dispute.amount.toLocaleString()}</div>
                                </div>
                              )}
                              <div>
                                <Label>Description</Label>
                                <div className="text-sm bg-gray-50 p-3 rounded">{dispute.description}</div>
                              </div>
                              <div>
                                <Label htmlFor="resolution">Resolution Notes</Label>
                                <Textarea
                                  id="resolution"
                                  placeholder="Enter your resolution notes..."
                                  value={disputeResolution}
                                  onChange={(e) => setDisputeResolution(e.target.value)}
                                />
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => handleResolveDispute(dispute.id, "approve")}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => handleResolveDispute(dispute.id, "reject")}
                                  variant="destructive"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Type:</span> {dispute.type}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Parties:</span> {dispute.tenant} vs {dispute.landlord}
                        </div>
                        {dispute.amount > 0 && (
                          <div className="text-sm">
                            <span className="font-medium">Amount:</span> KES {dispute.amount.toLocaleString()}
                          </div>
                        )}
                        <div className="text-sm">
                          <span className="font-medium">Description:</span> {dispute.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage tenants and landlords in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search users by name or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>

                <div className="space-y-4">
                  {mockAdminData.recentUsers.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{user.name}</span>
                            <Badge variant={user.type === "tenant" ? "default" : "secondary"}>{user.type}</Badge>
                            <Badge
                              variant={user.status === "active" ? "default" : "secondary"}
                              className={user.status === "active" ? "bg-green-100 text-green-800" : ""}
                            >
                              {user.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Phone: {user.phone} • Joined: {new Date(user.joinDate).toLocaleDateString()}
                          </div>
                          {user.type === "tenant" && (
                            <div className="text-sm text-gray-600">TenantScore: {user.score}</div>
                          )}
                          {user.type === "landlord" && (
                            <div className="text-sm text-gray-600">Properties: {user.properties}</div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="bg-transparent">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Monitoring</CardTitle>
                <CardDescription>Monitor system health and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">99.9%</div>
                    <div className="text-sm text-gray-600">System Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{mockAdminData.systemStats.averageScore}</div>
                    <div className="text-sm text-gray-600">Average TenantScore</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">2.3s</div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>Recent system events and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAdminData.systemLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-sm">{log.action}</div>
                        <div className="text-sm text-gray-600">{log.details}</div>
                      </div>
                      <div className="text-right">
                        <Badge variant={log.type === "admin" ? "destructive" : "secondary"}>{log.type}</Badge>
                        <div className="text-xs text-gray-500 mt-1">{log.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Tools</CardTitle>
                <CardDescription>Administrative tools for system management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Score Adjustment Tool */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Manual Score Adjustment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="userId">User ID or Phone</Label>
                        <Input
                          id="userId"
                          placeholder="254XXXXXXXXX"
                          value={scoreAdjustment.userId}
                          onChange={(e) => setScoreAdjustment((prev) => ({ ...prev, userId: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="newScore">New Score (0-1000)</Label>
                        <Input
                          id="newScore"
                          type="number"
                          min="0"
                          max="1000"
                          placeholder="750"
                          value={scoreAdjustment.newScore}
                          onChange={(e) => setScoreAdjustment((prev) => ({ ...prev, newScore: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="reason">Reason</Label>
                        <Select onValueChange={(value) => setScoreAdjustment((prev) => ({ ...prev, reason: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dispute_resolution">Dispute Resolution</SelectItem>
                            <SelectItem value="data_correction">Data Correction</SelectItem>
                            <SelectItem value="system_error">System Error Fix</SelectItem>
                            <SelectItem value="manual_review">Manual Review</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={handleScoreAdjustment} className="mt-4 bg-red-600 hover:bg-red-700">
                      <Edit className="h-4 w-4 mr-2" />
                      Adjust Score
                    </Button>
                  </div>

                  {/* System Actions */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">System Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button variant="outline" className="bg-transparent">
                        <Activity className="h-4 w-4 mr-2" />
                        Refresh Scores
                      </Button>
                      <Button variant="outline" className="bg-transparent">
                        <Users className="h-4 w-4 mr-2" />
                        Export Users
                      </Button>
                      <Button variant="outline" className="bg-transparent">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        System Health Check
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
