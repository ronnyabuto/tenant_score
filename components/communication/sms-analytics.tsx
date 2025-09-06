"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, TrendingUp, DollarSign, MessageSquare, Clock, BarChart3, PieChart, Calendar, Download } from "lucide-react"

interface AnalyticsData {
  totalMessages: number
  thisMonth: number
  deliveryRate: number
  totalCost: number
  topTemplates: { name: string; usage: number }[]
  responseRate: number
  tenantEngagement: {
    high: number
    medium: number
    low: number
  }
  dailyStats: { date: string; messages: number; cost: number }[]
  monthlyTrend: { month: string; messages: number; cost: number }[]
}

interface SMSAnalyticsProps {
  onBack: () => void
}

export default function SMSAnalytics({ onBack }: SMSAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d")

  useEffect(() => {
    loadAnalytics()
  }, [timeframe])

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/communication/analytics?timeframe=${timeframe}`)
      const data = await response.json()
      if (data.success) {
        setAnalytics(data.data)
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async () => {
    try {
      const response = await fetch('/api/admin/communication/analytics/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeframe })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `sms_analytics_${timeframe}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to export report:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto ios-card animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto ios-card text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Failed to load analytics data</p>
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
            <h1 className="text-lg font-semibold text-gray-900">SMS Analytics</h1>
            <button
              onClick={exportReport}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Timeframe Selector */}
        <div className="ios-card">
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Time Period:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: "7d", label: "7 Days" },
              { key: "30d", label: "30 Days" },
              { key: "90d", label: "90 Days" }
            ].map(option => (
              <button
                key={option.key}
                onClick={() => setTimeframe(option.key as any)}
                className={`py-2 px-3 text-sm rounded-lg font-medium transition-all ${
                  timeframe === option.key
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="ios-card text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{analytics.totalMessages}</div>
            <div className="text-sm text-gray-600">Total Messages</div>
            <div className="text-xs text-green-600 mt-1">+{analytics.thisMonth} this month</div>
          </div>

          <div className="ios-card text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">KES {analytics.totalCost}</div>
            <div className="text-sm text-gray-600">Total Cost</div>
            <div className="text-xs text-gray-500 mt-1">~KES {(analytics.totalCost / analytics.totalMessages).toFixed(1)}/msg</div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="ios-card text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">{analytics.deliveryRate}%</div>
            <div className="text-sm text-gray-600">Delivery Rate</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analytics.deliveryRate}%` }}
              ></div>
            </div>
          </div>

          <div className="ios-card text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{analytics.responseRate}%</div>
            <div className="text-sm text-gray-600">Response Rate</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analytics.responseRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Top Templates */}
        <div className="ios-card">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Top Message Templates</h3>
          </div>
          <div className="space-y-3">
            {analytics.topTemplates.map((template, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {template.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ 
                        width: `${(template.usage / Math.max(...analytics.topTemplates.map(t => t.usage))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 min-w-[2rem]">
                    {template.usage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tenant Engagement */}
        <div className="ios-card">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Tenant Engagement</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm font-medium text-gray-700">High Engagement</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-gray-900">{analytics.tenantEngagement.high}</span>
                <span className="text-xs text-gray-500">tenants</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm font-medium text-gray-700">Medium Engagement</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-gray-900">{analytics.tenantEngagement.medium}</span>
                <span className="text-xs text-gray-500">tenants</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm font-medium text-gray-700">Low Engagement</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-gray-900">{analytics.tenantEngagement.low}</span>
                <span className="text-xs text-gray-500">tenants</span>
              </div>
            </div>

            {/* Visual representation */}
            <div className="mt-4">
              <div className="flex w-full h-4 rounded-full overflow-hidden bg-gray-200">
                <div 
                  className="bg-green-500 transition-all duration-500"
                  style={{ 
                    width: `${(analytics.tenantEngagement.high / (analytics.tenantEngagement.high + analytics.tenantEngagement.medium + analytics.tenantEngagement.low)) * 100}%` 
                  }}
                ></div>
                <div 
                  className="bg-yellow-500 transition-all duration-500"
                  style={{ 
                    width: `${(analytics.tenantEngagement.medium / (analytics.tenantEngagement.high + analytics.tenantEngagement.medium + analytics.tenantEngagement.low)) * 100}%` 
                  }}
                ></div>
                <div 
                  className="bg-red-500 transition-all duration-500"
                  style={{ 
                    width: `${(analytics.tenantEngagement.low / (analytics.tenantEngagement.high + analytics.tenantEngagement.medium + analytics.tenantEngagement.low)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="ios-card">
          <h3 className="font-semibold text-gray-900 mb-4">Cost Analysis</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">KES {(analytics.totalCost / analytics.totalMessages).toFixed(2)}</div>
              <div className="text-xs text-gray-500">Cost per message</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">KES {(analytics.totalCost / 30).toFixed(0)}</div>
              <div className="text-xs text-gray-500">Daily average</div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">This month's projection:</span>
              <span className="font-bold text-gray-900">KES {(analytics.totalCost * 1.2).toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="ios-card bg-blue-50 border-blue-200">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Insights & Recommendations</h3>
          </div>
          
          <div className="space-y-2 text-sm">
            {analytics.deliveryRate > 95 && (
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                <p className="text-green-800">Excellent delivery rate! Your SMS gateway is performing well.</p>
              </div>
            )}
            
            {analytics.responseRate < 70 && (
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2"></div>
                <p className="text-yellow-800">Consider improving message timing or content to boost response rates.</p>
              </div>
            )}
            
            {analytics.tenantEngagement.low > analytics.tenantEngagement.high && (
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                <p className="text-red-800">Focus on re-engaging tenants with low communication scores.</p>
              </div>
            )}
            
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-blue-800">Peak messaging times: 9-11 AM and 2-4 PM show highest response rates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}