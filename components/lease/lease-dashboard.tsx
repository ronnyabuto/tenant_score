"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Send,
  Download,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Plus,
  Users,
  Home,
  DollarSign,
  PenTool
} from "lucide-react"
import {
  getLeaseAgreements,
  getLeaseStatistics,
  getLeaseRenewals,
  updateLeaseAgreement,
  signLease,
  sendLeaseForSignature,
  createLeaseRenewal,
  respondToRenewal,
  checkExpiringLeases,
  type LeaseAgreement,
  type LeaseRenewal
} from "@/lib/services/lease-service"

interface LeaseDashboardProps {
  onBack: () => void
}

export function LeaseDashboard({ onBack }: LeaseDashboardProps) {
  const [leases, setLeases] = useState<LeaseAgreement[]>([])
  const [renewals, setRenewals] = useState<LeaseRenewal[]>([])
  const [statistics, setStatistics] = useState<any>(null)
  const [expiringLeases, setExpiringLeases] = useState<LeaseAgreement[]>([])
  const [selectedLease, setSelectedLease] = useState<LeaseAgreement | null>(null)
  const [activeTab, setActiveTab] = useState("active")
  const [showRenewalForm, setShowRenewalForm] = useState(false)
  const [renewalForm, setRenewalForm] = useState({
    proposedStartDate: "",
    proposedEndDate: "",
    proposedRentAmount: "",
    responseDeadline: ""
  })
  const [loading, setLoading] = useState(true)
  const [processingAction, setProcessingAction] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [leasesData, renewalsData, statsData, expiringData] = await Promise.all([
        getLeaseAgreements(),
        getLeaseRenewals(),
        getLeaseStatistics(),
        checkExpiringLeases(60)
      ])
      
      setLeases(leasesData)
      setRenewals(renewalsData)
      setStatistics(statsData)
      setExpiringLeases(expiringData)
    } catch (error) {
      console.error("Failed to load lease data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "fully_signed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "sent_for_signature":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "partially_signed":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "terminated":
        return "bg-red-100 text-red-800 border-red-200"
      case "expired":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "draft":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "terminated":
      case "expired":
        return <XCircle className="h-4 w-4" />
      case "sent_for_signature":
      case "partially_signed":
        return <Clock className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getRenewalStatusColor = (status: string) => {
    switch (status) {
      case "tenant_accepted":
        return "bg-green-100 text-green-800"
      case "tenant_declined":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredLeases = leases.filter(lease => {
    switch (activeTab) {
      case "active":
        return lease.status === "active"
      case "pending":
        return ["sent_for_signature", "partially_signed", "draft"].includes(lease.status)
      case "expiring":
        return expiringLeases.some(el => el.id === lease.id)
      case "all":
      default:
        return true
    }
  })

  const handleSendForSignature = async (leaseId: string) => {
    try {
      setProcessingAction(true)
      await sendLeaseForSignature(leaseId)
      await loadData()
    } catch (error) {
      console.error("Failed to send lease for signature:", error)
    } finally {
      setProcessingAction(false)
    }
  }

  const handleSignLease = async (leaseId: string, signatureType: 'tenant' | 'landlord') => {
    try {
      setProcessingAction(true)
      await signLease(leaseId, signatureType, {
        ipAddress: "192.168.1.100",
        signatureImage: "/signatures/sample.png"
      })
      await loadData()
      
      if (selectedLease && selectedLease.id === leaseId) {
        const updatedLease = leases.find(l => l.id === leaseId)
        if (updatedLease) setSelectedLease(updatedLease)
      }
    } catch (error) {
      console.error("Failed to sign lease:", error)
    } finally {
      setProcessingAction(false)
    }
  }

  const handleCreateRenewal = async (leaseId: string) => {
    try {
      setProcessingAction(true)
      
      await createLeaseRenewal(leaseId, {
        proposedStartDate: renewalForm.proposedStartDate,
        proposedEndDate: renewalForm.proposedEndDate,
        proposedRentAmount: Number(renewalForm.proposedRentAmount),
        responseDeadline: renewalForm.responseDeadline
      })
      
      await loadData()
      setShowRenewalForm(false)
      setRenewalForm({
        proposedStartDate: "",
        proposedEndDate: "",
        proposedRentAmount: "",
        responseDeadline: ""
      })
    } catch (error) {
      console.error("Failed to create renewal:", error)
    } finally {
      setProcessingAction(false)
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

  const getDaysUntilExpiry = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading lease agreements...</p>
          </div>
        </div>
      </div>
    )
  }

  if (selectedLease) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedLease(null)}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {selectedLease.tenantName} - Unit {selectedLease.unitNumber}
                </h1>
                <p className="text-sm text-gray-500">Lease Agreement {selectedLease.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(selectedLease.status)}>
                {getStatusIcon(selectedLease.status)}
                <span className="ml-1 capitalize">{selectedLease.status.replace('_', ' ')}</span>
              </Badge>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedLease.rentAmount)}</p>
                  <p className="text-xs text-gray-500">Monthly Rent</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {getDaysUntilExpiry(selectedLease.endDate)}
                  </p>
                  <p className="text-xs text-gray-500">Days Until Expiry</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lease Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tenant</p>
                  <p className="text-sm text-gray-900">{selectedLease.tenantName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Unit</p>
                  <p className="text-sm text-gray-900">Unit {selectedLease.unitNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Start Date</p>
                  <p className="text-sm text-gray-900">{formatDate(selectedLease.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">End Date</p>
                  <p className="text-sm text-gray-900">{formatDate(selectedLease.endDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Lease Type</p>
                  <p className="text-sm text-gray-900 capitalize">{selectedLease.leaseType.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Security Deposit</p>
                  <p className="text-sm text-gray-900">{formatCurrency(selectedLease.depositAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Signature Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Tenant Signature</p>
                      <p className="text-sm text-gray-600">{selectedLease.tenantName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedLease.signatures.tenant.signed ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Signed {selectedLease.signatures.tenant.signedAt && formatDate(selectedLease.signatures.tenant.signedAt)}
                      </Badge>
                    ) : (
                      <>
                        <Badge className="bg-gray-100 text-gray-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => handleSignLease(selectedLease.id, 'tenant')}
                          disabled={processingAction}
                        >
                          <PenTool className="h-4 w-4 mr-1" />
                          Sign
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Home className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Landlord Signature</p>
                      <p className="text-sm text-gray-600">Property Management</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedLease.signatures.landlord.signed ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Signed {selectedLease.signatures.landlord.signedAt && formatDate(selectedLease.signatures.landlord.signedAt)}
                      </Badge>
                    ) : (
                      <>
                        <Badge className="bg-gray-100 text-gray-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => handleSignLease(selectedLease.id, 'landlord')}
                          disabled={processingAction}
                        >
                          <PenTool className="h-4 w-4 mr-1" />
                          Sign
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {selectedLease.status === "draft" && (
                <Button
                  onClick={() => handleSendForSignature(selectedLease.id)}
                  disabled={processingAction}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send for Signature
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Lease Terms
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowRenewalForm(true)}
                  disabled={selectedLease.status !== "active"}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Renewal
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Pet Policy</p>
                  <p className="font-medium capitalize">{selectedLease.terms.petPolicy.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-gray-600">Max Occupants</p>
                  <p className="font-medium">{selectedLease.terms.maxOccupants}</p>
                </div>
                <div>
                  <p className="text-gray-600">Late Fee</p>
                  <p className="font-medium">{formatCurrency(selectedLease.lateFeeAmount)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Grace Period</p>
                  <p className="font-medium">{selectedLease.gracePeriodDays} days</p>
                </div>
              </div>

              <div className="pt-3 border-t">
                <p className="text-sm font-medium text-gray-600 mb-2">Utilities Included</p>
                <div className="flex flex-wrap gap-2">
                  {selectedLease.terms.utilitiesIncluded.map((utility, index) => (
                    <Badge key={index} variant="secondary" className="text-xs capitalize">
                      {utility}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(selectedLease.documents).map(([docType, docPath]) => (
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
        </div>

        {showRenewalForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Create Lease Renewal</CardTitle>
                <CardDescription>Propose new lease terms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="proposedStartDate">Start Date</Label>
                  <Input
                    id="proposedStartDate"
                    type="date"
                    value={renewalForm.proposedStartDate}
                    onChange={(e) => setRenewalForm({...renewalForm, proposedStartDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="proposedEndDate">End Date</Label>
                  <Input
                    id="proposedEndDate"
                    type="date"
                    value={renewalForm.proposedEndDate}
                    onChange={(e) => setRenewalForm({...renewalForm, proposedEndDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="proposedRentAmount">New Rent Amount</Label>
                  <Input
                    id="proposedRentAmount"
                    type="number"
                    placeholder="Enter new rent amount"
                    value={renewalForm.proposedRentAmount}
                    onChange={(e) => setRenewalForm({...renewalForm, proposedRentAmount: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="responseDeadline">Response Deadline</Label>
                  <Input
                    id="responseDeadline"
                    type="date"
                    value={renewalForm.responseDeadline}
                    onChange={(e) => setRenewalForm({...renewalForm, responseDeadline: e.target.value})}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleCreateRenewal(selectedLease.id)}
                    disabled={processingAction}
                    className="flex-1"
                  >
                    Create Renewal
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRenewalForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
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
              <h1 className="text-xl font-semibold text-gray-900">Lease Management</h1>
              <p className="text-sm text-gray-500">Digital lease agreements and renewals</p>
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
                    <p className="text-sm font-medium text-gray-600">Active Leases</p>
                    <p className="text-2xl font-bold text-gray-900">{statistics.totalActive}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                    <p className="text-2xl font-bold text-yellow-600">{statistics.expiringIn60Days}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Signatures</p>
                    <p className="text-2xl font-bold text-orange-600">{statistics.pendingSignatures}</p>
                  </div>
                  <PenTool className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Lease Length</p>
                    <p className="text-2xl font-bold text-green-600">{statistics.avgLeaseLength}d</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="expiring">Expiring</TabsTrigger>
            <TabsTrigger value="renewals">Renewals</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {filteredLeases.map((lease) => (
              <Card key={lease.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{lease.tenantName}</h3>
                        <p className="text-sm text-gray-600">Unit {lease.unitNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(lease.status)}>
                        {getStatusIcon(lease.status)}
                        <span className="ml-1 capitalize">{lease.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600">Rent</p>
                      <p className="font-medium">{formatCurrency(lease.rentAmount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">End Date</p>
                      <p className="font-medium">{formatDate(lease.endDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Days Left</p>
                      <p className="font-medium">{getDaysUntilExpiry(lease.endDate)}</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => setSelectedLease(lease)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {filteredLeases.map((lease) => (
              <Card key={lease.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{lease.tenantName}</h3>
                        <p className="text-sm text-gray-600">Unit {lease.unitNumber}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(lease.status)}>
                      {getStatusIcon(lease.status)}
                      <span className="ml-1 capitalize">{lease.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600">Tenant Signed</p>
                      <p className="font-medium">{lease.signatures.tenant.signed ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Landlord Signed</p>
                      <p className="font-medium">{lease.signatures.landlord.signed ? 'Yes' : 'No'}</p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    {lease.status === "draft" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendForSignature(lease.id)}
                        disabled={processingAction}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Send
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => setSelectedLease(lease)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="expiring" className="space-y-4">
            {filteredLeases.map((lease) => (
              <Card key={lease.id} className="cursor-pointer hover:shadow-md transition-shadow border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{lease.tenantName}</h3>
                        <p className="text-sm text-gray-600">Unit {lease.unitNumber}</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Expiring Soon
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600">End Date</p>
                      <p className="font-medium">{formatDate(lease.endDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Days Remaining</p>
                      <p className="font-medium text-yellow-600">{getDaysUntilExpiry(lease.endDate)}</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => setSelectedLease(lease)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Create Renewal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="renewals" className="space-y-4">
            {renewals.map((renewal) => (
              <Card key={renewal.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">Renewal Proposal</h3>
                      <p className="text-sm text-gray-600">Lease {renewal.leaseId}</p>
                    </div>
                    <Badge className={getRenewalStatusColor(renewal.status)}>
                      {renewal.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600">New Rent</p>
                      <p className="font-medium">{formatCurrency(renewal.proposedRentAmount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Increase</p>
                      <p className="font-medium text-green-600">+{renewal.rentIncreasePercentage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Response Due</p>
                      <p className="font-medium">{formatDate(renewal.responseDeadline)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Proposed Start</p>
                      <p className="font-medium">{formatDate(renewal.proposedStartDate)}</p>
                    </div>
                  </div>

                  {renewal.tenantResponse && (
                    <div className="pt-3 border-t">
                      <p className="text-sm">
                        <span className="font-medium">Tenant Response:</span> 
                        <span className="capitalize ml-2">{renewal.tenantResponse}</span>
                      </p>
                      {renewal.negotiationNotes && (
                        <p className="text-sm text-gray-600 mt-1">{renewal.negotiationNotes}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}