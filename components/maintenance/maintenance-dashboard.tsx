"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Wrench, AlertTriangle, Clock, CheckCircle, User, Phone, Camera, Plus, Filter, Search } from "lucide-react"

interface MaintenanceRequest {
  id: string
  tenantId: string
  tenantName: string
  unitNumber: string
  phoneNumber: string
  title: string
  description: string
  category: "plumbing" | "electrical" | "appliances" | "structural" | "cleaning" | "other"
  priority: "low" | "normal" | "urgent"
  status: "submitted" | "acknowledged" | "in_progress" | "completed" | "cancelled"
  photos: string[]
  submittedAt: string
  acknowledgedAt?: string
  startedAt?: string
  completedAt?: string
  assignedContractor?: {
    id: string
    name: string
    phone: string
    specialties: string[]
  }
  estimatedCost?: number
  actualCost?: number
  adminNotes?: string
  tenantRating?: number
  createdAt: string
  updatedAt: string
}

interface MaintenanceDashboardProps {
  onBack: () => void
}

export default function MaintenanceDashboard({ onBack }: MaintenanceDashboardProps) {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      const response = await fetch('/api/admin/maintenance/requests')
      const data = await response.json()
      if (data.success) {
        setRequests(data.data)
      }
    } catch (error) {
      console.error('Failed to load maintenance requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (requestId: string, newStatus: string, notes?: string) => {
    try {
      const response = await fetch(`/api/admin/maintenance/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          adminNotes: notes 
        })
      })
      
      if (response.ok) {
        await loadRequests()
        if (selectedRequest?.id === requestId) {
          const updatedRequest = requests.find(r => r.id === requestId)
          if (updatedRequest) setSelectedRequest(updatedRequest)
        }
      }
    } catch (error) {
      console.error('Failed to update request:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800"
      case "normal": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800"
      case "in_progress": return "bg-blue-100 text-blue-800"
      case "acknowledged": return "bg-yellow-100 text-yellow-800"
      case "submitted": return "bg-gray-100 text-gray-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-500" />
      case "in_progress": return <Wrench className="w-4 h-4 text-blue-500" />
      case "acknowledged": return <Clock className="w-4 h-4 text-yellow-500" />
      case "submitted": return <AlertTriangle className="w-4 h-4 text-gray-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "plumbing": return "🔧"
      case "electrical": return "⚡"
      case "appliances": return "🏠"
      case "structural": return "🏗️"
      case "cleaning": return "🧹"
      default: return "🔨"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes}m ago`
    } else if (hours < 24) {
      return `${hours}h ago`
    } else {
      const days = Math.floor(hours / 24)
      return `${days}d ago`
    }
  }

  const filteredRequests = requests.filter(req => {
    const matchesStatus = statusFilter === "all" || req.status === statusFilter
    const matchesPriority = priorityFilter === "all" || req.priority === priorityFilter
    const matchesSearch = !searchTerm || 
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.unitNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesPriority && matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto ios-card animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (selectedRequest) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedRequest(null)}
                className="flex items-center text-blue-600 font-medium"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Request Details</h1>
              <div className="w-12"></div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto p-4 space-y-4">
          {/* Request Info */}
          <div className="ios-card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getCategoryIcon(selectedRequest.category)}</div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedRequest.title}</h2>
                  <p className="text-sm text-gray-600">Unit {selectedRequest.unitNumber} • {selectedRequest.tenantName}</p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedRequest.priority)}`}>
                  {selectedRequest.priority.toUpperCase()}
                </span>
                <span className={`flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedRequest.status)}`}>
                  {getStatusIcon(selectedRequest.status)}
                  <span className="ml-1 capitalize">{selectedRequest.status.replace('_', ' ')}</span>
                </span>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{selectedRequest.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Submitted:</span>
                <p className="font-medium">{formatDate(selectedRequest.submittedAt)}</p>
              </div>
              <div>
                <span className="text-gray-500">Category:</span>
                <p className="font-medium capitalize">{selectedRequest.category}</p>
              </div>
            </div>
          </div>

          {/* Photos */}
          {selectedRequest.photos.length > 0 && (
            <div className="ios-card">
              <h3 className="font-semibold text-gray-900 mb-3">Photos</h3>
              <div className="grid grid-cols-2 gap-3">
                {selectedRequest.photos.map((photo, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                    <span className="text-xs text-gray-500 ml-2">Photo {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tenant Contact */}
          <div className="ios-card">
            <div className="flex items-center space-x-3 mb-3">
              <User className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Tenant Contact</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{selectedRequest.tenantName}</p>
                <p className="text-sm text-gray-600">{selectedRequest.phoneNumber}</p>
              </div>
              <button className="ios-button bg-green-500 py-2 px-4 flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </button>
            </div>
          </div>

          {/* Contractor Info */}
          {selectedRequest.assignedContractor && (
            <div className="ios-card">
              <h3 className="font-semibold text-gray-900 mb-3">Assigned Contractor</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{selectedRequest.assignedContractor.name}</p>
                  <p className="text-sm text-gray-600">{selectedRequest.assignedContractor.phone}</p>
                  <p className="text-xs text-gray-500">
                    {selectedRequest.assignedContractor.specialties.join(', ')}
                  </p>
                </div>
                <button className="ios-button bg-blue-500 py-2 px-4 flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </button>
              </div>
            </div>
          )}

          {/* Cost Info */}
          {(selectedRequest.estimatedCost || selectedRequest.actualCost) && (
            <div className="ios-card">
              <h3 className="font-semibold text-gray-900 mb-3">Cost Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {selectedRequest.estimatedCost && (
                  <div>
                    <span className="text-sm text-gray-500">Estimated Cost</span>
                    <p className="font-bold text-gray-900">KES {selectedRequest.estimatedCost.toLocaleString()}</p>
                  </div>
                )}
                {selectedRequest.actualCost && (
                  <div>
                    <span className="text-sm text-gray-500">Actual Cost</span>
                    <p className="font-bold text-green-600">KES {selectedRequest.actualCost.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Admin Notes */}
          <div className="ios-card">
            <h3 className="font-semibold text-gray-900 mb-3">Admin Notes</h3>
            <textarea
              value={selectedRequest.adminNotes || ""}
              onChange={(e) => setSelectedRequest({
                ...selectedRequest,
                adminNotes: e.target.value
              })}
              placeholder="Add notes about this request..."
              rows={3}
              className="ios-input resize-none"
            />
          </div>

          {/* Status Actions */}
          <div className="ios-card">
            <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
            <div className="grid grid-cols-2 gap-3">
              {selectedRequest.status === "submitted" && (
                <button
                  onClick={() => updateRequestStatus(selectedRequest.id, "acknowledged", selectedRequest.adminNotes)}
                  className="ios-button bg-yellow-500 py-2 flex items-center justify-center space-x-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>Acknowledge</span>
                </button>
              )}
              
              {(selectedRequest.status === "acknowledged" || selectedRequest.status === "submitted") && (
                <button
                  onClick={() => updateRequestStatus(selectedRequest.id, "in_progress", selectedRequest.adminNotes)}
                  className="ios-button bg-blue-500 py-2 flex items-center justify-center space-x-2"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Start Work</span>
                </button>
              )}
              
              {selectedRequest.status === "in_progress" && (
                <button
                  onClick={() => updateRequestStatus(selectedRequest.id, "completed", selectedRequest.adminNotes)}
                  className="ios-button bg-green-500 py-2 flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete</span>
                </button>
              )}
              
              {selectedRequest.status !== "completed" && selectedRequest.status !== "cancelled" && (
                <button
                  onClick={() => updateRequestStatus(selectedRequest.id, "cancelled", selectedRequest.adminNotes)}
                  className="ios-button bg-red-500 py-2 flex items-center justify-center space-x-2"
                >
                  <span>Cancel</span>
                </button>
              )}
            </div>
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
            <button 
              onClick={onBack}
              className="flex items-center text-blue-600 font-medium"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Maintenance</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="ios-card text-center">
            <div className="text-2xl font-bold text-gray-900">{requests.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="ios-card text-center">
            <div className="text-2xl font-bold text-red-600">
              {requests.filter(r => r.priority === "urgent").length}
            </div>
            <div className="text-sm text-gray-600">Urgent</div>
          </div>
          <div className="ios-card text-center">
            <div className="text-2xl font-bold text-blue-600">
              {requests.filter(r => r.status === "in_progress").length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="ios-card">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ios-input pl-10"
            />
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="ios-input text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="acknowledged">Acknowledged</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="ios-input text-sm"
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Requests List */}
        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="ios-card text-center py-8">
              <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No maintenance requests found</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <button
                key={request.id}
                onClick={() => setSelectedRequest(request)}
                className="ios-card w-full text-left active:scale-95 transition-transform"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="text-xl">{getCategoryIcon(request.category)}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{request.title}</h3>
                      <p className="text-sm text-gray-600">
                        Unit {request.unitNumber} • {request.tenantName}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(request.priority)}`}>
                      {request.priority.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(request.submittedAt)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700 line-clamp-1">{request.description}</p>
                  <span className={`flex items-center px-2 py-1 text-xs font-medium rounded-full ml-2 ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    <span className="ml-1 capitalize">{request.status.replace('_', ' ')}</span>
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}