"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Phone,
  Mail,
  Home,
  DollarSign,
  Calendar,
  Star,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Search,
  Filter
} from "lucide-react"
import {
  getTenantApplications,
  getUnitListings,
  getApplicationStatistics,
  updateApplicationStatus,
  performScreeningCheck,
  type TenantApplication,
  type UnitListing
} from "@/lib/services/tenant-screening-service"

interface ScreeningDashboardProps {
  onBack: () => void
}

export function ScreeningDashboard({ onBack }: ScreeningDashboardProps) {
  const [applications, setApplications] = useState<TenantApplication[]>([])
  const [units, setUnits] = useState<UnitListing[]>([])
  const [statistics, setStatistics] = useState<any>(null)
  const [selectedApplication, setSelectedApplication] = useState<TenantApplication | null>(null)
  const [activeTab, setActiveTab] = useState("applications")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [processingScreening, setProcessingScreening] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [appsData, unitsData, statsData] = await Promise.all([
        getTenantApplications(),
        getUnitListings(false),
        getApplicationStatistics()
      ])
      
      setApplications(appsData)
      setUnits(unitsData)
      setStatistics(statsData)
    } catch (error) {
      console.error("Failed to load screening data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredApplications = applications.filter(app => 
    statusFilter === "all" || app.status === statusFilter
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "under_review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "submitted":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "lease_signed":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "under_review":
        return <Clock className="h-4 w-4" />
      case "submitted":
        return <FileText className="h-4 w-4" />
      case "lease_signed":
        return <Home className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "high":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const handleStatusUpdate = async (applicationId: string, newStatus: TenantApplication['status']) => {
    try {
      await updateApplicationStatus(applicationId, newStatus)
      await loadData()
      if (selectedApplication?.id === applicationId) {
        const updatedApp = applications.find(app => app.id === applicationId)
        if (updatedApp) setSelectedApplication(updatedApp)
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const handleScreeningCheck = async (applicationId: string, checkType: "credit" | "background" | "income" | "references") => {
    try {
      setProcessingScreening(true)
      await performScreeningCheck(applicationId, checkType)
      await loadData()
      const updatedApp = applications.find(app => app.id === applicationId)
      if (updatedApp) setSelectedApplication(updatedApp)
    } catch (error) {
      console.error("Failed to perform screening check:", error)
    } finally {
      setProcessingScreening(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading tenant applications...</p>
          </div>
        </div>
      </div>
    )
  }

  if (selectedApplication) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedApplication(null)}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {selectedApplication.personalInfo.firstName} {selectedApplication.personalInfo.lastName}
                </h1>
                <p className="text-sm text-gray-500">Unit {selectedApplication.unitNumber} Application</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(selectedApplication.status)}>
                {getStatusIcon(selectedApplication.status)}
                <span className="ml-1 capitalize">{selectedApplication.status.replace('_', ' ')}</span>
              </Badge>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(selectedApplication.screening?.overallRisk || 'medium')}`}>
                    {selectedApplication.screening?.overallRisk?.toUpperCase() || 'PENDING'} RISK
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Overall Assessment</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(selectedApplication.employment.monthlyIncome)}
                  </p>
                  <p className="text-xs text-gray-500">Monthly Income</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedApplication.screening?.creditCheckScore || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">Credit Score</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="screening">Screening</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Full Name</p>
                      <p className="text-sm text-gray-900">
                        {selectedApplication.personalInfo.firstName} {selectedApplication.personalInfo.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                      <p className="text-sm text-gray-900">{formatDate(selectedApplication.personalInfo.dateOfBirth)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">ID Number</p>
                      <p className="text-sm text-gray-900">{selectedApplication.personalInfo.idNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Nationality</p>
                      <p className="text-sm text-gray-900">{selectedApplication.personalInfo.nationality}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedApplication.personalInfo.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedApplication.personalInfo.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-3">Emergency Contact</h4>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">{selectedApplication.personalInfo.emergencyContact.name}</span>
                        <span className="text-gray-600"> ({selectedApplication.personalInfo.emergencyContact.relationship})</span>
                      </p>
                      <p className="text-sm text-gray-600">{selectedApplication.personalInfo.emergencyContact.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Employment & Income</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Employment Status</p>
                      <p className="text-sm text-gray-900 capitalize">{selectedApplication.employment.status.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Income</p>
                      <p className="text-sm text-gray-900">{formatCurrency(selectedApplication.employment.monthlyIncome)}</p>
                    </div>
                    {selectedApplication.employment.employer && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Employer</p>
                          <p className="text-sm text-gray-900">{selectedApplication.employment.employer}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Job Title</p>
                          <p className="text-sm text-gray-900">{selectedApplication.employment.jobTitle}</p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Bank</p>
                      <p className="text-sm text-gray-900">{selectedApplication.financialInfo.bankName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
                      <p className="text-sm text-gray-900">{formatCurrency(selectedApplication.financialInfo.monthlyExpenses)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Existing Loans</p>
                      <p className="text-sm text-gray-900">{selectedApplication.financialInfo.hasExistingLoans ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Can Pay Deposit</p>
                      <p className="text-sm text-gray-900">{selectedApplication.financialInfo.canPayDeposit ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="screening" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Screening Results</CardTitle>
                  <CardDescription>Background checks and verification status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Credit Check</p>
                        <p className="text-sm text-gray-600">Score: {selectedApplication.screening?.creditCheckScore || 'Pending'}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={selectedApplication.screening?.creditCheckStatus === 'completed' ? 'default' : 'secondary'}>
                          {selectedApplication.screening?.creditCheckStatus || 'pending'}
                        </Badge>
                        {selectedApplication.screening?.creditCheckStatus !== 'completed' && (
                          <Button
                            size="sm"
                            onClick={() => handleScreeningCheck(selectedApplication.id, 'credit')}
                            disabled={processingScreening}
                          >
                            Run Check
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Background Check</p>
                        <p className="text-sm text-gray-600">Criminal history verification</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={selectedApplication.screening?.backgroundCheckStatus === 'completed' ? 'default' : 'secondary'}>
                          {selectedApplication.screening?.backgroundCheckStatus || 'pending'}
                        </Badge>
                        {selectedApplication.screening?.backgroundCheckStatus !== 'completed' && (
                          <Button
                            size="sm"
                            onClick={() => handleScreeningCheck(selectedApplication.id, 'background')}
                            disabled={processingScreening}
                          >
                            Run Check
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Income Verification</p>
                        <p className="text-sm text-gray-600">Employment and salary confirmation</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={selectedApplication.screening?.incomeVerificationStatus === 'verified' ? 'default' : 'secondary'}>
                          {selectedApplication.screening?.incomeVerificationStatus || 'pending'}
                        </Badge>
                        {selectedApplication.screening?.incomeVerificationStatus !== 'verified' && (
                          <Button
                            size="sm"
                            onClick={() => handleScreeningCheck(selectedApplication.id, 'income')}
                            disabled={processingScreening}
                          >
                            Verify
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Reference Check</p>
                        <p className="text-sm text-gray-600">Landlord and personal references</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={selectedApplication.screening?.referenceCheckStatus === 'completed' ? 'default' : 'secondary'}>
                          {selectedApplication.screening?.referenceCheckStatus || 'pending'}
                        </Badge>
                        {selectedApplication.screening?.referenceCheckStatus !== 'completed' && (
                          <Button
                            size="sm"
                            onClick={() => handleScreeningCheck(selectedApplication.id, 'references')}
                            disabled={processingScreening}
                          >
                            Check References
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedApplication.screening?.screeningNotes && (
                    <div className="pt-4 border-t">
                      <p className="font-medium text-gray-900 mb-2">Screening Notes</p>
                      <p className="text-sm text-gray-600">{selectedApplication.screening.screeningNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={selectedApplication.status === 'approved'}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                      disabled={selectedApplication.status === 'rejected'}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'under_review')}
                      disabled={selectedApplication.status === 'under_review'}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Under Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Submitted Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(selectedApplication.documents).map(([docType, docPath]) => (
                    docPath && (
                      <div key={docType} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium capitalize">{docType.replace(/([A-Z])/g, ' $1').trim()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    )
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Tenant Screening</h1>
              <p className="text-sm text-gray-500">Applications and background checks</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {statistics && (
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                    <p className="text-2xl font-bold text-green-600">{statistics.approvalRate.toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="units">Available Units</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <div className="flex items-center space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <Card key={application.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {application.personalInfo.firstName} {application.personalInfo.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">Unit {application.unitNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(application.status)}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Income</p>
                        <p className="font-medium">{formatCurrency(application.employment.monthlyIncome)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Submitted</p>
                        <p className="font-medium">{formatDate(application.submittedAt)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Risk Level</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(application.screening?.overallRisk || 'medium')}`}>
                          {application.screening?.overallRisk?.toUpperCase() || 'PENDING'}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="units" className="space-y-4">
            {units.map((unit) => (
              <Card key={unit.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">Unit {unit.unitNumber}</h3>
                      <p className="text-sm text-gray-600">{unit.bedrooms} bed, {unit.bathrooms} bath • {unit.squareFeet} sq ft</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(unit.rentAmount)}/month</p>
                      <p className="text-sm text-gray-600">Available {formatDate(unit.availableFrom)}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{unit.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {unit.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            {statistics && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Application Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(statistics.byStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{status.replace('_', ' ')}</span>
                        <div className="flex items-center space-x-3">
                          <Progress value={(count as number / statistics.total) * 100} className="w-20" />
                          <span className="text-sm font-medium">{count as number}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{statistics.avgProcessingTime.toFixed(1)}</p>
                        <p className="text-sm text-gray-600">Avg Processing Days</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{statistics.approvalRate.toFixed(1)}%</p>
                        <p className="text-sm text-gray-600">Approval Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Rejection Reasons</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {statistics.topRejectReasons.map((reason: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{reason.reason}</span>
                        <Badge variant="secondary">{reason.count}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}