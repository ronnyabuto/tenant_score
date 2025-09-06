"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Send, MessageSquare, Users, Target, Plus, Edit, Trash2, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface CommunicationTemplate {
  id: string
  name: string
  type: "payment_reminder" | "overdue_notice" | "general" | "maintenance" | "lease_renewal"
  subject: string
  message: string
  variables: string[]
  isActive: boolean
  createdAt: string
  lastUsed?: string
  usageCount: number
}

interface BulkCampaign {
  id: string
  name: string
  templateId: string
  targetCriteria: {
    unitStatus?: ("occupied" | "vacant")[]
    rentStatus?: ("paid" | "pending" | "overdue")[]
    floors?: number[]
    specificUnits?: string[]
  }
  scheduledAt?: string
  sentAt?: string
  status: "draft" | "scheduled" | "sending" | "completed" | "failed"
  results: {
    targeted: number
    sent: number
    delivered: number
    failed: number
    totalCost: number
  }
  createdBy: string
  createdAt: string
}

interface BulkMessagingProps {
  onBack: () => void
}

export default function BulkMessaging({ onBack }: BulkMessagingProps) {
  const [view, setView] = useState<"campaigns" | "templates" | "create_campaign" | "create_template">("campaigns")
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([])
  const [campaigns, setCampaigns] = useState<BulkCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<CommunicationTemplate | null>(null)

  // Campaign creation form state
  const [campaignName, setCampaignName] = useState("")
  const [selectedTemplateId, setSelectedTemplateId] = useState("")
  const [targetCriteria, setTargetCriteria] = useState({
    unitStatus: [] as string[],
    rentStatus: [] as string[],
    floors: [] as number[],
    specificUnits: [] as string[]
  })

  // Template creation form state
  const [templateForm, setTemplateForm] = useState({
    name: "",
    type: "general" as CommunicationTemplate['type'],
    subject: "",
    message: ""
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load templates
      const templatesRes = await fetch('/api/admin/communication/templates')
      const templatesData = await templatesRes.json()
      if (templatesData.success) {
        setTemplates(templatesData.data)
      }

      // Load campaigns
      const campaignsRes = await fetch('/api/admin/communication/bulk')
      const campaignsData = await campaignsRes.json()
      if (campaignsData.success) {
        setCampaigns(campaignsData.data)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCampaign = async () => {
    if (!campaignName || !selectedTemplateId) return

    try {
      const response = await fetch('/api/admin/communication/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campaignName,
          templateId: selectedTemplateId,
          targetCriteria: {
            unitStatus: targetCriteria.unitStatus.length > 0 ? targetCriteria.unitStatus : undefined,
            rentStatus: targetCriteria.rentStatus.length > 0 ? targetCriteria.rentStatus : undefined,
            floors: targetCriteria.floors.length > 0 ? targetCriteria.floors : undefined,
            specificUnits: targetCriteria.specificUnits.length > 0 ? targetCriteria.specificUnits : undefined
          }
        })
      })

      const result = await response.json()
      if (result.success) {
        setCampaigns([result.data, ...campaigns])
        setCampaignName("")
        setSelectedTemplateId("")
        setTargetCriteria({ unitStatus: [], rentStatus: [], floors: [], specificUnits: [] })
        setView("campaigns")
      }
    } catch (error) {
      console.error('Failed to create campaign:', error)
    }
  }

  const createTemplate = async () => {
    if (!templateForm.name || !templateForm.message) return

    try {
      const response = await fetch('/api/admin/communication/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateForm)
      })

      const result = await response.json()
      if (result.success) {
        setTemplates([result.data, ...templates])
        setTemplateForm({ name: "", type: "general", subject: "", message: "" })
        setView("templates")
      }
    } catch (error) {
      console.error('Failed to create template:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50"
      case "sending": return "text-blue-600 bg-blue-50"
      case "failed": return "text-red-600 bg-red-50"
      case "scheduled": return "text-yellow-600 bg-yellow-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed": return <AlertCircle className="w-4 h-4 text-red-500" />
      case "scheduled": return <Clock className="w-4 h-4 text-yellow-500" />
      default: return <MessageSquare className="w-4 h-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto ios-card animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
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
              onClick={view === "campaigns" || view === "templates" ? onBack : () => setView("campaigns")}
              className="flex items-center text-blue-600 font-medium"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {view === "campaigns" && "Bulk Campaigns"}
              {view === "templates" && "Message Templates"}
              {view === "create_campaign" && "New Campaign"}
              {view === "create_template" && "New Template"}
            </h1>
            <div className="w-12"></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Main Navigation */}
        {(view === "campaigns" || view === "templates") && (
          <div className="ios-card mb-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setView("campaigns")}
                className={`py-3 px-4 rounded-xl font-medium transition-all ${
                  view === "campaigns"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Campaigns
              </button>
              <button
                onClick={() => setView("templates")}
                className={`py-3 px-4 rounded-xl font-medium transition-all ${
                  view === "templates"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Templates
              </button>
            </div>
          </div>
        )}

        {/* Campaigns View */}
        {view === "campaigns" && (
          <div className="space-y-4">
            <button
              onClick={() => setView("create_campaign")}
              className="ios-button w-full bg-blue-500 flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>

            {campaigns.length === 0 ? (
              <div className="ios-card text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No campaigns created yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="ios-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(campaign.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                        {getStatusIcon(campaign.status)}
                        <span className="ml-1 capitalize">{campaign.status}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <div className="font-semibold text-gray-900">{campaign.results.targeted}</div>
                        <div className="text-gray-500">Targeted</div>
                      </div>
                      <div>
                        <div className="font-semibold text-green-600">{campaign.results.sent}</div>
                        <div className="text-gray-500">Sent</div>
                      </div>
                      <div>
                        <div className="font-semibold text-blue-600">KES {campaign.results.totalCost}</div>
                        <div className="text-gray-500">Cost</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Templates View */}
        {view === "templates" && (
          <div className="space-y-4">
            <button
              onClick={() => setView("create_template")}
              className="ios-button w-full bg-green-500 flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Template</span>
            </button>

            {templates.length === 0 ? (
              <div className="ios-card text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No templates created yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {templates.map((template) => (
                  <div key={template.id} className="ios-card">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded mt-1">
                          {template.type.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Used {template.usageCount} times
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {template.message}
                    </p>
                    
                    {template.variables.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {template.variables.map((variable) => (
                          <span key={variable} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                            {`{{${variable}}}`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Campaign Form */}
        {view === "create_campaign" && (
          <div className="space-y-4">
            <div className="ios-card">
              <h3 className="font-semibold text-gray-900 mb-4">Campaign Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g., Monthly Rent Reminders"
                    className="ios-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message Template</label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    className="ios-input"
                  >
                    <option value="">Select a template</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name} ({template.type.replace('_', ' ')})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="ios-card">
              <h3 className="font-semibold text-gray-900 mb-4">Target Criteria</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rent Status</label>
                  <div className="space-y-2">
                    {["paid", "pending", "overdue"].map((status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={targetCriteria.rentStatus.includes(status)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTargetCriteria({
                                ...targetCriteria,
                                rentStatus: [...targetCriteria.rentStatus, status]
                              })
                            } else {
                              setTargetCriteria({
                                ...targetCriteria,
                                rentStatus: targetCriteria.rentStatus.filter(s => s !== status)
                              })
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Floors</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3].map((floor) => (
                      <label key={floor} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={targetCriteria.floors.includes(floor)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTargetCriteria({
                                ...targetCriteria,
                                floors: [...targetCriteria.floors, floor]
                              })
                            } else {
                              setTargetCriteria({
                                ...targetCriteria,
                                floors: targetCriteria.floors.filter(f => f !== floor)
                              })
                            }
                          }}
                          className="mr-1"
                        />
                        <span className="text-sm">Floor {floor}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={createCampaign}
              disabled={!campaignName || !selectedTemplateId}
              className="ios-button w-full bg-blue-500 disabled:bg-gray-300 flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Campaign</span>
            </button>
          </div>
        )}

        {/* Create Template Form */}
        {view === "create_template" && (
          <div className="space-y-4">
            <div className="ios-card">
              <h3 className="font-semibold text-gray-900 mb-4">Template Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                  <input
                    type="text"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                    placeholder="e.g., Friendly Rent Reminder"
                    className="ios-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={templateForm.type}
                    onChange={(e) => setTemplateForm({...templateForm, type: e.target.value as CommunicationTemplate['type']})}
                    className="ios-input"
                  >
                    <option value="general">General</option>
                    <option value="payment_reminder">Payment Reminder</option>
                    <option value="overdue_notice">Overdue Notice</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="lease_renewal">Lease Renewal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={templateForm.subject}
                    onChange={(e) => setTemplateForm({...templateForm, subject: e.target.value})}
                    placeholder="Message subject"
                    className="ios-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={templateForm.message}
                    onChange={(e) => setTemplateForm({...templateForm, message: e.target.value})}
                    placeholder="Use {{variableName}} for dynamic content"
                    rows={6}
                    className="ios-input resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use variables like {{`{tenantName}`}}, {{`{unitNumber}`}}, {{`{amount}`}} for personalization
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={createTemplate}
              disabled={!templateForm.name || !templateForm.message}
              className="ios-button w-full bg-green-500 disabled:bg-gray-300 flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Template</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}