"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Plus,
  RefreshCw,
  AlertTriangle,
  Users,
  Home,
  ClipboardCheck
} from "lucide-react"
import {
  getPropertyInspections,
  getInspectionStatistics,
  getUpcomingInspections,
  type PropertyInspection
} from "@/lib/services/inspection-service"

interface InspectionDashboardProps {
  onBack: () => void
}

export function InspectionDashboard({ onBack }: InspectionDashboardProps) {
  const [inspections, setInspections] = useState<PropertyInspection[]>([])
  const [statistics, setStatistics] = useState<any>(null)
  const [upcomingInspections, setUpcomingInspections] = useState<PropertyInspection[]>([])
  const [activeTab, setActiveTab] = useState("upcoming")
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)
      const [inspectionsData, statsData, upcomingData] = await Promise.all([
        getPropertyInspections(),
        getInspectionStatistics(),
        getUpcomingInspections(7)
      ])
      
      setInspections(inspectionsData)
      setStatistics(statsData)
      setUpcomingInspections(upcomingData)
    } catch (error) {
      console.error("Failed to load inspection data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "scheduled":
        return <Calendar className="h-4 w-4" />
      default:
        return <ClipboardCheck className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "move_in":
        return "bg-blue-50 text-blue-700"
      case "move_out":
        return "bg-purple-50 text-purple-700"
      case "routine":
        return "bg-green-50 text-green-700"
      case "maintenance":
        return "bg-orange-50 text-orange-700"
      case "emergency":
        return "bg-red-50 text-red-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  const filteredInspections = inspections.filter(inspection => {
    switch (activeTab) {
      case "upcoming":
        return inspection.status === "scheduled"
      case "completed":
        return inspection.status === "completed"
      case "all":
      default:
        return true
    }
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading inspections...</p>
          </div>
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
              <h1 className="text-xl font-semibold text-gray-900">Property Inspections</h1>
              <p className="text-sm text-gray-500">Schedule and track property inspections</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {statistics && (
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Week</p>
                    <p className="text-2xl font-bold text-gray-900">{statistics.upcomingThisWeek}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{statistics.completedThisMonth}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Follow-up Needed</p>
                    <p className="text-2xl font-bold text-orange-600">{statistics.followUpRequired}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-red-600">{statistics.overdueInspections}</p>
                  </div>
                  <Clock className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Inspections</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredInspections.map((inspection) => (
              <Card key={inspection.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Home className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Unit {inspection.unitNumber}</h3>
                        <p className="text-sm text-gray-600">{inspection.tenantName || 'Vacant Unit'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getTypeColor(inspection.inspectionType)}>
                        {inspection.inspectionType.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(inspection.status)}>
                        {getStatusIcon(inspection.status)}
                        <span className="ml-1 capitalize">{inspection.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600">Inspector</p>
                      <p className="font-medium">{inspection.inspectorName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        {inspection.status === 'completed' ? 'Completed' : 'Scheduled'}
                      </p>
                      <p className="font-medium">
                        {inspection.status === 'completed' && inspection.completedDate
                          ? formatDate(inspection.completedDate)
                          : formatDate(inspection.scheduledDate)}
                      </p>
                    </div>
                  </div>

                  {inspection.purpose && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 italic">{inspection.purpose}</p>
                    </div>
                  )}

                  {inspection.status === 'completed' && (
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3 pt-3 border-t">
                      <div>
                        <p className="text-gray-600">Overall Condition</p>
                        <p className="font-medium capitalize">{inspection.overall.overallCondition}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Follow-up Required</p>
                        <p className="font-medium">{inspection.followUpRequired ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {inspection.status === 'scheduled' && (
                      <Button size="sm">
                        Start Inspection
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredInspections.length === 0 && (
              <div className="text-center py-8">
                <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No inspections found for this category.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {upcomingInspections.length > 0 && activeTab !== 'upcoming' && (
          <Card>
            <CardHeader>
              <CardTitle>Upcoming This Week</CardTitle>
              <CardDescription>Inspections scheduled for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingInspections.slice(0, 3).map((inspection) => (
                <div key={inspection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">Unit {inspection.unitNumber}</p>
                      <p className="text-xs text-gray-600">{formatDate(inspection.scheduledDate)}</p>
                    </div>
                  </div>
                  <Badge className={getTypeColor(inspection.inspectionType)} variant="secondary">
                    {inspection.inspectionType.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}