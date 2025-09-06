"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { 
  Building2, 
  Users, 
  Phone, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Home,
  TrendingUp,
  ChevronRight,
  User,
  Zap,
  Calendar,
  DollarSign,
  Smartphone,
  RefreshCw,
  History,
  BarChart3,
  Wrench,
  FileText,
  UserCheck,
  ClipboardList,
  Search
} from "lucide-react"
import SMSHistoryDashboard from "@/components/communication/sms-history-dashboard"
import BulkMessaging from "@/components/communication/bulk-messaging"
import TenantProfiles from "@/components/communication/tenant-profiles"
import SMSAnalytics from "@/components/communication/sms-analytics"
import MaintenanceDashboard from "@/components/maintenance/maintenance-dashboard"
import DocumentDashboard from "@/components/documents/document-dashboard"
import FinancialDashboard from "@/components/financial/financial-dashboard"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { ScreeningDashboard } from "@/components/screening/screening-dashboard"
import { LeaseDashboard } from "@/components/lease/lease-dashboard"
import { InspectionDashboard } from "@/components/inspections/inspection-dashboard"
import { 
  BUILDING_DATA, 
  APARTMENT_UNITS, 
  getBuildingOccupancyRate,
  getTotalMonthlyRent,
  getRentStatusCounts,
  getUnitsByFloor,
  type ApartmentUnit 
} from "@/lib/mock/building-data"

export function LandlordDashboard() {
  const { user, signOut } = useAuth()
  const [activeView, setActiveView] = useState<"overview" | "units" | "tenants" | "automation" | "sms_history" | "bulk_messaging" | "tenant_profiles" | "sms_analytics" | "maintenance" | "documents" | "financial" | "analytics" | "screening" | "leases" | "inspections">("overview")
  const [selectedUnit, setSelectedUnit] = useState<ApartmentUnit | null>(null)
  const [isProcessingRentCycle, setIsProcessingRentCycle] = useState(false)

  const occupancyRate = getBuildingOccupancyRate()
  const totalMonthlyIncome = getTotalMonthlyRent()
  const rentStatusCounts = getRentStatusCounts()
  const unitsByFloor = getUnitsByFloor()

  const getRentStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "overdue":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Home className="w-4 h-4 text-gray-400" />
    }
  }

  const getRentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleUnitAction = (unit: ApartmentUnit, action: "call" | "message" | "details") => {
    if (!unit.tenant) return
    
    switch (action) {
      case "call":
        window.location.href = `tel:${unit.tenant.phone}`
        break
      case "message":
        window.location.href = `sms:${unit.tenant.phone}`
        break
      case "details":
        setSelectedUnit(unit)
        break
    }
  }

  const handleTriggerRentCycle = async () => {
    setIsProcessingRentCycle(true)
    try {
      const response = await fetch('/api/admin/rent-cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log("✅ Rent cycle triggered:", result.data)
        // In a real app, you'd show a success toast and refresh data
      } else {
        console.error("❌ Failed to trigger rent cycle:", result.message)
      }
    } catch (error) {
      console.error("❌ Error triggering rent cycle:", error)
    } finally {
      setIsProcessingRentCycle(false)
    }
  }

  const sendBulkReminder = async (type: "due_soon" | "overdue" | "all") => {
    try {
      // This would call your SMS service
      console.log(`📱 Sending bulk ${type} reminders...`)
      // In real implementation: await fetch('/api/admin/bulk-sms', { ... })
    } catch (error) {
      console.error("Failed to send bulk reminders:", error)
    }
  }

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* iOS-style Header */}
      <div className="safe-area-pt bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">{BUILDING_DATA.name}</h1>
                <p className="text-xs text-gray-600">{BUILDING_DATA.address}</p>
              </div>
            </div>
            <button 
              onClick={signOut}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center active:scale-95 transition-transform"
            >
              <User className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {activeView === "overview" && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="ios-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{occupancyRate}%</span>
                </div>
                <p className="text-sm text-gray-600">Occupancy Rate</p>
                <p className="text-xs text-gray-500">{BUILDING_DATA.occupiedUnits}/{BUILDING_DATA.totalUnits} units</p>
              </div>
              
              <div className="ios-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {(totalMonthlyIncome / 1000).toFixed(0)}K
                  </span>
                </div>
                <p className="text-sm text-gray-600">Monthly Income</p>
                <p className="text-xs text-gray-500">KES {totalMonthlyIncome.toLocaleString()}</p>
              </div>
            </div>

            {/* Rent Status Summary */}
            <div className="ios-card">
              <h3 className="font-semibold text-gray-900 mb-4">Rent Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-semibold text-gray-900">{rentStatusCounts.paid}</p>
                    <p className="text-sm text-gray-600">Paid</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-semibold text-gray-900">{rentStatusCounts.pending}</p>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-semibold text-gray-900">{rentStatusCounts.overdue}</p>
                    <p className="text-sm text-gray-600">Overdue</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Home className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-900">{rentStatusCounts.vacant}</p>
                    <p className="text-sm text-gray-600">Vacant</p>
                  </div>
                </div>
              </div>
            </div>

            {/* M-Pesa Automation Status */}
            <div className="ios-card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">M-Pesa Automation</h3>
                    <p className="text-sm text-green-700">Active & monitoring payments</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-600 font-medium">LIVE</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">174379</div>
                  <div className="text-gray-600">Paybill</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">Auto</div>
                  <div className="text-gray-600">Updates</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">SMS</div>
                  <div className="text-gray-600">Alerts</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <button 
                onClick={() => setActiveView("units")}
                className="ios-card w-full text-left active:scale-95 transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">View All Units</p>
                      <p className="text-sm text-gray-600">Manage apartments by floor</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
              
              <button 
                onClick={() => setActiveView("tenants")}
                className="ios-card w-full text-left active:scale-95 transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Tenant Directory</p>
                      <p className="text-sm text-gray-600">Contact info & rent status</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
              
              <button 
                onClick={() => setActiveView("automation")}
                className="ios-card w-full text-left active:scale-95 transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Payment Automation</p>
                      <p className="text-sm text-gray-600">M-Pesa & SMS controls</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
              
              <button 
                onClick={() => setActiveView("maintenance")}
                className="ios-card w-full text-left active:scale-95 transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Maintenance Requests</p>
                      <p className="text-sm text-gray-600">Track repairs & contractors</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
              
              <button 
                onClick={() => setActiveView("documents")}
                className="ios-card w-full text-left active:scale-95 transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Document Management</p>
                      <p className="text-sm text-gray-600">Leases, IDs & e-signatures</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
              
              <button 
                onClick={() => setActiveView("financial")}
                className="ios-card w-full text-left active:scale-95 transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Financial Management</p>
                      <p className="text-sm text-gray-600">Reports, P&L & expenses</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
              
              <button 
                onClick={() => setActiveView("analytics")}
                className="ios-card w-full text-left active:scale-95 transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Property Analytics</p>
                      <p className="text-sm text-gray-600">Market insights & trends</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
              
              <button 
                onClick={() => setActiveView("screening")}
                className="ios-card w-full text-left active:scale-95 transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Tenant Screening</p>
                      <p className="text-sm text-gray-600">Applications & background checks</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
              
              <button 
                onClick={() => setActiveView("leases")}
                className="ios-card w-full text-left active:scale-95 transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Lease Management</p>
                      <p className="text-sm text-gray-600">Digital leases & renewals</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
              
              <button 
                onClick={() => setActiveView("inspections")}
                className="ios-card w-full text-left active:scale-95 transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                      <Search className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Property Inspections</p>
                      <p className="text-sm text-gray-600">Schedule & track inspections</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            </div>
          </>
        )}

        {activeView === "units" && (
          <>
            <div className="flex items-center space-x-4 mb-6">
              <button 
                onClick={() => setActiveView("overview")}
                className="w-10 h-10 bg-white rounded-xl flex items-center justify-center active:scale-95 transition-transform"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">All Units</h2>
            </div>

            <div className="space-y-6">
              {Object.entries(unitsByFloor)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([floor, units]) => (
                <div key={floor} className="ios-card">
                  <h3 className="font-semibold text-gray-900 mb-4">Floor {floor}</h3>
                  <div className="space-y-3">
                    {units
                      .sort((a, b) => a.unitNumber.localeCompare(b.unitNumber))
                      .map((unit) => (
                      <div key={unit.id} className="ios-list-item">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-semibold text-gray-700">
                            {unit.unitNumber}
                          </div>
                          <div className="flex-1">
                            {unit.tenant ? (
                              <>
                                <p className="font-semibold text-gray-900">{unit.tenant.name}</p>
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRentStatusColor(unit.rent.status)}`}>
                                    {unit.rent.status === "paid" ? "Paid" : unit.rent.status === "pending" ? "Due Soon" : "Overdue"}
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    KES {unit.rent.amount.toLocaleString()}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <p className="font-semibold text-gray-500">Vacant</p>
                                <p className="text-sm text-gray-600">KES {unit.rent.amount.toLocaleString()}/month</p>
                              </>
                            )}
                          </div>
                        </div>
                        {unit.tenant && (
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleUnitAction(unit, "call")}
                              className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center active:scale-95 transition-transform"
                            >
                              <Phone className="w-4 h-4 text-green-600" />
                            </button>
                            <button 
                              onClick={() => handleUnitAction(unit, "message")}
                              className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center active:scale-95 transition-transform"
                            >
                              <MessageCircle className="w-4 h-4 text-blue-600" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeView === "tenants" && (
          <>
            <div className="flex items-center space-x-4 mb-6">
              <button 
                onClick={() => setActiveView("overview")}
                className="w-10 h-10 bg-white rounded-xl flex items-center justify-center active:scale-95 transition-transform"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">Tenants</h2>
            </div>

            <div className="space-y-3">
              {APARTMENT_UNITS.filter(unit => unit.tenant).map((unit) => (
                <div key={unit.id} className="ios-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{unit.tenant!.name}</p>
                        <p className="text-sm text-gray-600">Unit {unit.unitNumber}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 text-xs font-medium rounded-full flex items-center ${getRentStatusColor(unit.rent.status)}`}>
                      {getRentStatusIcon(unit.rent.status)}
                      <span className="ml-1">
                        {unit.rent.status === "paid" ? "Paid" : unit.rent.status === "pending" ? "Due" : "Overdue"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Monthly Rent</p>
                      <p className="font-semibold text-gray-900">KES {unit.rent.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-semibold text-gray-900">{unit.tenant!.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleUnitAction(unit, "call")}
                      className="flex-1 ios-button bg-green-500 py-2 flex items-center justify-center"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </button>
                    <button 
                      onClick={() => handleUnitAction(unit, "message")}
                      className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeView === "automation" && (
          <>
            <div className="flex items-center space-x-4 mb-6">
              <button 
                onClick={() => setActiveView("overview")}
                className="w-10 h-10 bg-white rounded-xl flex items-center justify-center active:scale-95 transition-transform"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">Payment Automation</h2>
            </div>

            {/* M-Pesa Status */}
            <div className="ios-card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">M-Pesa Integration</h3>
                    <p className="text-sm text-green-700">Automatic payment processing</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600 font-bold">ACTIVE</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">174379</div>
                  <div className="text-sm text-gray-600">Paybill Number</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">24/7</div>
                  <div className="text-sm text-gray-600">Monitoring</div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-green-700 bg-green-100 rounded-lg p-2">
                  ✅ Payments automatically update rent status<br/>
                  ✅ Instant SMS confirmations to tenants<br/>
                  ✅ Real-time dashboard updates
                </p>
              </div>
            </div>

            {/* Rent Cycle Management */}
            <div className="ios-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Rent Cycle</h3>
                    <p className="text-sm text-gray-600">Monthly automation controls</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={handleTriggerRentCycle}
                  disabled={isProcessingRentCycle}
                  className="ios-button w-full bg-blue-500 flex items-center justify-center space-x-2"
                >
                  {isProcessingRentCycle ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Trigger New Rent Cycle</span>
                    </>
                  )}
                </button>
                
                <div className="text-xs text-gray-500 text-center">
                  Resets all units to "pending", sends due date reminders
                </div>
              </div>
            </div>

            {/* SMS Controls */}
            <div className="ios-card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">SMS Notifications</h3>
                  <p className="text-sm text-gray-600">Bulk messaging controls</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => sendBulkReminder("due_soon")}
                  className="py-3 px-4 bg-yellow-100 text-yellow-800 rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center space-x-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>Remind Due Soon ({rentStatusCounts.pending})</span>
                </button>
                
                <button 
                  onClick={() => sendBulkReminder("overdue")}
                  className="py-3 px-4 bg-red-100 text-red-800 rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center space-x-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Overdue Notices ({rentStatusCounts.overdue})</span>
                </button>
                
                <button 
                  onClick={() => sendBulkReminder("all")}
                  className="py-3 px-4 bg-blue-100 text-blue-800 rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>General Announcement</span>
                </button>
                
                <button 
                  onClick={() => setActiveView("sms_history")}
                  className="py-3 px-4 bg-gray-100 text-gray-800 rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center space-x-2"
                >
                  <History className="w-4 h-4" />
                  <span>SMS History & Analytics</span>
                </button>
                
                <button 
                  onClick={() => setActiveView("bulk_messaging")}
                  className="py-3 px-4 bg-purple-100 text-purple-800 rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Bulk Messaging & Templates</span>
                </button>
                
                <button 
                  onClick={() => setActiveView("tenant_profiles")}
                  className="py-3 px-4 bg-indigo-100 text-indigo-800 rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Tenant Communication Profiles</span>
                </button>
                
                <button 
                  onClick={() => setActiveView("sms_analytics")}
                  className="py-3 px-4 bg-green-100 text-green-800 rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>SMS Analytics & Reports</span>
                </button>
              </div>
            </div>

            {/* Automation Settings */}
            <div className="ios-card">
              <h3 className="font-semibold text-gray-900 mb-4">Automation Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Auto SMS Reminders</p>
                    <p className="text-sm text-gray-600">7, 3, 1 days before due</p>
                  </div>
                  <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end pr-1">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Payment Confirmations</p>
                    <p className="text-sm text-gray-600">SMS when rent received</p>
                  </div>
                  <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end pr-1">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Grace Period</p>
                    <p className="text-sm text-gray-600">5 days before overdue</p>
                  </div>
                  <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end pr-1">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === "sms_history" && (
          <SMSHistoryDashboard onBack={() => setActiveView("automation")} />
        )}

        {activeView === "bulk_messaging" && (
          <BulkMessaging onBack={() => setActiveView("automation")} />
        )}

        {activeView === "tenant_profiles" && (
          <TenantProfiles onBack={() => setActiveView("automation")} />
        )}

        {activeView === "sms_analytics" && (
          <SMSAnalytics onBack={() => setActiveView("automation")} />
        )}

        {activeView === "maintenance" && (
          <MaintenanceDashboard onBack={() => setActiveView("overview")} />
        )}

        {activeView === "documents" && (
          <DocumentDashboard onBack={() => setActiveView("overview")} />
        )}

        {activeView === "financial" && (
          <FinancialDashboard onBack={() => setActiveView("overview")} />
        )}

        {activeView === "analytics" && (
          <AnalyticsDashboard onBack={() => setActiveView("overview")} />
        )}

        {activeView === "screening" && (
          <ScreeningDashboard onBack={() => setActiveView("overview")} />
        )}

        {activeView === "leases" && (
          <LeaseDashboard onBack={() => setActiveView("overview")} />
        )}

        {activeView === "inspections" && (
          <InspectionDashboard onBack={() => setActiveView("overview")} />
        )}
      </div>

      {/* Only show the container padding when not in full-screen views */}
      {(activeView === "sms_history" || activeView === "bulk_messaging" || activeView === "tenant_profiles" || activeView === "sms_analytics" || activeView === "maintenance" || activeView === "documents" || activeView === "financial" || activeView === "analytics" || activeView === "screening" || activeView === "leases" || activeView === "inspections") && (
        <style jsx>{`
          .px-4 { padding-left: 0; padding-right: 0; }
        `}</style>
      )}
    </div>
  )
}