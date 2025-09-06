"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, MessageSquare, Clock, CheckCircle, XCircle, Search, Filter } from "lucide-react"

interface SMSMessage {
  id: string
  recipient: string
  recipientName?: string
  message: string
  templateType?: string
  status: "sent" | "delivered" | "failed" | "pending"
  sentAt: string
  cost?: number
}

interface SMSHistoryDashboardProps {
  onBack: () => void
}

export default function SMSHistoryDashboard({ onBack }: SMSHistoryDashboardProps) {
  const [messages, setMessages] = useState<SMSMessage[]>([])
  const [filteredMessages, setFilteredMessages] = useState<SMSMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadSMSHistory()
  }, [])

  useEffect(() => {
    filterMessages()
  }, [messages, searchTerm, statusFilter])

  const loadSMSHistory = async () => {
    try {
      const response = await fetch('/api/admin/sms/history')
      const data = await response.json()
      if (data.success) {
        setMessages(data.data)
      }
    } catch (error) {
      console.error('Failed to load SMS history:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterMessages = () => {
    let filtered = messages

    if (searchTerm) {
      filtered = filtered.filter(msg => 
        msg.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.recipient.includes(searchTerm) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(msg => msg.status === statusFilter)
    }

    setFilteredMessages(filtered)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed": return <XCircle className="w-4 h-4 text-red-500" />
      case "pending": return <Clock className="w-4 h-4 text-yellow-500" />
      default: return <MessageSquare className="w-4 h-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "text-green-600 bg-green-50"
      case "failed": return "text-red-600 bg-red-50"
      case "pending": return "text-yellow-600 bg-yellow-50"
      default: return "text-blue-600 bg-blue-50"
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
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const totalCost = messages.reduce((sum, msg) => sum + (msg.cost || 0), 0)
  const deliveryRate = messages.length > 0 
    ? Math.round((messages.filter(m => m.status === "delivered").length / messages.length) * 100)
    : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="ios-card animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
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
            <h1 className="text-lg font-semibold text-gray-900">SMS History</h1>
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
        {/* Stats Summary */}
        <div className="ios-card">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{messages.length}</div>
              <div className="text-sm text-gray-500">Total Messages</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{deliveryRate}%</div>
              <div className="text-sm text-gray-500">Delivered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">KES {totalCost.toFixed(0)}</div>
              <div className="text-sm text-gray-500">Total Cost</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="ios-card">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ios-input pl-10"
            />
          </div>

          {showFilters && (
            <div className="border-t border-gray-100 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="ios-input"
              >
                <option value="all">All Messages</option>
                <option value="delivered">Delivered</option>
                <option value="sent">Sent</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          )}
        </div>

        {/* Messages List */}
        <div className="space-y-3">
          {filteredMessages.length === 0 ? (
            <div className="ios-card text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all" 
                  ? "No messages match your filters" 
                  : "No SMS messages found"
                }
              </p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div key={message.id} className="ios-card">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(message.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {message.recipientName || message.recipient}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(message.status)}`}>
                        {message.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {message.message}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatDate(message.sentAt)}</span>
                      {message.cost && (
                        <span>KES {message.cost.toFixed(2)}</span>
                      )}
                    </div>
                    {message.templateType && (
                      <div className="mt-2">
                        <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {message.templateType.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}