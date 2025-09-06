"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScoreBreakdownComponent } from "./score-breakdown"
import { useAuth } from "@/contexts/auth-context"
import { Download, Calendar, CreditCard, User, Award, TrendingUp } from "lucide-react"

// Mock data - replace with actual API calls
const mockTenantData = {
  score: 750,
  totalPayments: 12,
  onTimePayments: 10,
  latePayments: 2,
  totalRentPaid: 540000,
  averageDaysLate: 2.5,
  currentTenancy: {
    propertyName: "Sunrise Apartments Unit 2B",
    location: "Westlands, Nairobi",
    monthlyRent: 45000,
    startDate: "2024-01-01",
    landlordName: "John Mwangi",
    landlordPhone: "254712345678",
  },
  recentPayments: [
    { id: 1, amount: 45000, date: "2024-11-01", dueDate: "2024-11-01", status: "confirmed", daysLate: 0 },
    { id: 2, amount: 45000, date: "2024-10-03", dueDate: "2024-10-01", status: "confirmed", daysLate: 2 },
    { id: 3, amount: 45000, date: "2024-09-01", dueDate: "2024-09-01", status: "confirmed", daysLate: 0 },
    { id: 4, amount: 45000, date: "2024-08-05", dueDate: "2024-08-01", status: "confirmed", daysLate: 4 },
  ],
}

export function TenantDashboard() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  const getScoreColor = (score: number) => {
    if (score >= 800) return "text-green-600"
    if (score >= 600) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 800) return "Excellent"
    if (score >= 600) return "Good"
    return "Needs Improvement"
  }

  const handleDownloadCertificate = async () => {
    try {
      const response = await fetch(`/api/tenant/certificate/${user?.tenantScoreId}`)

      if (!response.ok) {
        throw new Error("Failed to generate certificate")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const element = document.createElement("a")
      element.href = url
      element.download = `tenantscore-certificate-${user?.tenantScoreId}.pdf`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Certificate download failed:", error)
      // Fallback to text certificate
      const element = document.createElement("a")
      const file = new Blob(
        [
          `TenantScore Certificate\n\nTenant: ${user?.fullName}\nScore: ${mockTenantData.score}\nGenerated: ${new Date().toLocaleDateString()}`,
        ],
        { type: "text/plain" },
      )
      element.href = URL.createObjectURL(file)
      element.download = "tenantscore-certificate.txt"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-green-600">TenantScore</h1>
              <Badge variant="secondary">{user?.userType}</Badge>
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
            <TabsTrigger value="score">Score Details</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="tenancy">Tenancy</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Score Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <span>Your TenantScore</span>
                </CardTitle>
                <CardDescription>Your rental reputation score based on payment history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className={`text-4xl font-bold ${getScoreColor(mockTenantData.score)}`}>
                      {mockTenantData.score}
                    </div>
                    <div className="text-sm text-gray-600">{getScoreLabel(mockTenantData.score)}</div>
                  </div>
                  <Button onClick={handleDownloadCertificate} className="bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                </div>
                <Progress value={(mockTenantData.score / 1000) * 100} className="mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-green-600">{mockTenantData.onTimePayments}</div>
                    <div className="text-gray-600">On-time payments</div>
                  </div>
                  <div>
                    <div className="font-semibold text-red-600">{mockTenantData.latePayments}</div>
                    <div className="text-gray-600">Late payments</div>
                  </div>
                  <div>
                    <div className="font-semibold">KES {mockTenantData.totalRentPaid.toLocaleString()}</div>
                    <div className="text-gray-600">Total rent paid</div>
                  </div>
                  <div>
                    <div className="font-semibold">{mockTenantData.averageDaysLate} days</div>
                    <div className="text-gray-600">Avg. late days</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Payment Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round((mockTenantData.onTimePayments / mockTenantData.totalPayments) * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">On-time payment rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Rent</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    KES {mockTenantData.currentTenancy.monthlyRent.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">Monthly rent amount</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tenancy Duration</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.floor(
                      (new Date().getTime() - new Date(mockTenantData.currentTenancy.startDate).getTime()) /
                        (1000 * 60 * 60 * 24 * 30),
                    )}{" "}
                    months
                  </div>
                  <p className="text-xs text-muted-foreground">Current tenancy</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="score" className="space-y-6">
            <ScoreBreakdownComponent />
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Your recent rent payment records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTenantData.recentPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-3 h-3 rounded-full ${payment.daysLate === 0 ? "bg-green-500" : "bg-yellow-500"}`}
                        />
                        <div>
                          <div className="font-medium">KES {payment.amount.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">
                            Paid on {new Date(payment.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={payment.daysLate === 0 ? "default" : "secondary"}>
                          {payment.daysLate === 0 ? "On Time" : `${payment.daysLate} days late`}
                        </Badge>
                        <div className="text-sm text-gray-600 mt-1">
                          Due: {new Date(payment.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tenancy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Tenancy</CardTitle>
                <CardDescription>Details about your current rental agreement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Property</label>
                    <div className="text-lg font-semibold">{mockTenantData.currentTenancy.propertyName}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Location</label>
                    <div className="text-lg">{mockTenantData.currentTenancy.location}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Monthly Rent</label>
                    <div className="text-lg font-semibold text-green-600">
                      KES {mockTenantData.currentTenancy.monthlyRent.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Start Date</label>
                    <div className="text-lg">
                      {new Date(mockTenantData.currentTenancy.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Landlord</label>
                    <div className="text-lg">{mockTenantData.currentTenancy.landlordName}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Landlord Contact</label>
                    <div className="text-lg">{mockTenantData.currentTenancy.landlordPhone}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>Your account details and verification status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <div className="text-lg">{user?.fullName}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone Number</label>
                    <div className="text-lg">{user?.phoneNumber}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">ID Number</label>
                    <div className="text-lg">{user?.idNumber || "Not provided"}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <div className="text-lg">{user?.email || "Not provided"}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Account Type</label>
                    <div className="text-lg capitalize">{user?.userType}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Verification Status</label>
                    <div className="flex items-center space-x-2">
                      <Badge variant={user?.isVerified ? "default" : "secondary"}>
                        {user?.isVerified ? "Verified" : "Pending"}
                      </Badge>
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
