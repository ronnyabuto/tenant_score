"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, User, MessageSquare, Phone, Mail, Settings, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface TenantCommunication {
  tenantId: string
  tenantName: string
  phoneNumber: string
  unitNumber: string
  totalMessages: number
  lastContact: string
  messageHistory: any[]
  preferences: {
    reminderDays: number[]
    language: "en" | "sw"
    optOut: boolean
  }
  communicationScore: number
}

interface TenantProfilesProps {
  onBack: () => void
}

export default function TenantProfiles({ onBack }: TenantProfilesProps) {
  const [profiles, setProfiles] = useState<TenantCommunication[]>([])
  const [selectedProfile, setSelectedProfile] = useState<TenantCommunication | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"name" | "score" | "activity">("score")

  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = async () => {
    try {
      const response = await fetch('/api/admin/communication/profiles')
      const data = await response.json()
      if (data.success) {
        setProfiles(data.data)
      }
    } catch (error) {
      console.error('Failed to load tenant profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const updatePreferences = async (tenantId: string, preferences: any) => {
    try {
      const response = await fetch(`/api/admin/communication/profiles/${tenantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences })
      })
      
      if (response.ok) {
        // Update local state
        setProfiles(profiles.map(p => 
          p.tenantId === tenantId ? { ...p, preferences } : p
        ))
        if (selectedProfile?.tenantId === tenantId) {
          setSelectedProfile({ ...selectedProfile, preferences })
        }
      }
    } catch (error) {
      console.error('Failed to update preferences:', error)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50"
    if (score >= 50) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 50) return "Good"
    return "Needs Attention"
  }

  const sortedProfiles = [...profiles].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.tenantName.localeCompare(b.tenantName)
      case "score":
        return b.communicationScore - a.communicationScore
      case "activity":
        return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime()
      default:
        return 0
    }
  })

  const formatLastContact = (dateString: string) => {
    if (dateString === "Never") return "Never"
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return `${Math.floor(days / 30)} months ago`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto ios-card animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (selectedProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedProfile(null)}
                className="flex items-center text-blue-600 font-medium"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Tenant Profile</h1>
              <div className="w-12"></div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto p-4 space-y-4">
          {/* Profile Header */}
          <div className="ios-card">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{selectedProfile.tenantName}</h2>
                <p className="text-gray-600">Unit {selectedProfile.unitNumber}</p>
                <p className="text-sm text-gray-500">{selectedProfile.phoneNumber}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className={`inline-flex px-3 py-2 rounded-full text-sm font-semibold ${getScoreColor(selectedProfile.communicationScore)}`}>
                  {selectedProfile.communicationScore}/100
                </div>
                <p className="text-xs text-gray-500 mt-1">Communication Score</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{selectedProfile.totalMessages}</div>
                <p className="text-xs text-gray-500">Total Messages</p>
              </div>
            </div>
          </div>

          {/* Communication Stats */}
          <div className="ios-card">
            <h3 className="font-semibold text-gray-900 mb-4">Communication Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Contact</span>
                <span className="font-medium text-gray-900">{formatLastContact(selectedProfile.lastContact)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Response Rate</span>
                <span className="font-medium text-green-600">85%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Response Time</span>
                <span className="font-medium text-gray-900">2.5 hours</span>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="ios-card">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Communication Preferences</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={selectedProfile.preferences.language}
                  onChange={(e) => updatePreferences(selectedProfile.tenantId, {
                    ...selectedProfile.preferences,
                    language: e.target.value as "en" | "sw"
                  })}
                  className="ios-input"
                >
                  <option value="en">English</option>
                  <option value="sw">Swahili</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Schedule</label>
                <div className="space-y-2">
                  {[7, 3, 1].map(days => (
                    <label key={days} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedProfile.preferences.reminderDays.includes(days)}
                        onChange={(e) => {
                          const newDays = e.target.checked
                            ? [...selectedProfile.preferences.reminderDays, days]
                            : selectedProfile.preferences.reminderDays.filter(d => d !== days)
                          updatePreferences(selectedProfile.tenantId, {
                            ...selectedProfile.preferences,
                            reminderDays: newDays.sort((a, b) => b - a)
                          })
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{days} days before due</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedProfile.preferences.optOut}
                    onChange={(e) => updatePreferences(selectedProfile.tenantId, {
                      ...selectedProfile.preferences,
                      optOut: e.target.checked
                    })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Opt out of non-essential messages</span>
                </label>
              </div>
            </div>
          </div>

          {/* Recent Messages */}
          <div className="ios-card">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Messages</h3>
            {selectedProfile.messageHistory.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No messages yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedProfile.messageHistory.slice(0, 5).map((message, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                    <p className="text-sm text-gray-700 line-clamp-2">{message.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(message.sentAt).toLocaleDateString()}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                        message.status === "delivered" ? "bg-green-50 text-green-600" :
                        message.status === "failed" ? "bg-red-50 text-red-600" :
                        "bg-yellow-50 text-yellow-600"
                      }`}>
                        {message.status === "delivered" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {message.status === "failed" && <AlertCircle className="w-3 h-3 mr-1" />}
                        {message.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                        {message.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button className="ios-button bg-green-500 flex items-center justify-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </button>
            <button className="ios-button bg-blue-500 flex items-center justify-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Message</span>
            </button>
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
            <h1 className="text-lg font-semibold text-gray-900">Tenant Profiles</h1>
            <div className="w-12"></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Sort Controls */}
        <div className="ios-card">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: "score", label: "Score" },
              { key: "name", label: "Name" },
              { key: "activity", label: "Activity" }
            ].map(option => (
              <button
                key={option.key}
                onClick={() => setSortBy(option.key as any)}
                className={`py-2 px-3 text-xs rounded-lg font-medium transition-all ${
                  sortBy === option.key
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Profiles List */}
        <div className="space-y-3">
          {sortedProfiles.map((profile) => (
            <button
              key={profile.tenantId}
              onClick={() => setSelectedProfile(profile)}
              className="ios-card w-full text-left active:scale-95 transition-transform"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{profile.tenantName}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getScoreColor(profile.communicationScore)}`}>
                      {profile.communicationScore}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Unit {profile.unitNumber} • {profile.totalMessages} messages</p>
                  <p className="text-xs text-gray-500">Last contact: {formatLastContact(profile.lastContact)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {profiles.length === 0 && (
          <div className="ios-card text-center py-8">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No tenant profiles found</p>
          </div>
        )}
      </div>
    </div>
  )
}