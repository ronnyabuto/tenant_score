"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { calculateTenantScore, generateMockScoreData, getScoreCategory } from "@/lib/scoring-algorithm"
import { TrendingUp, Clock, CreditCard, Calendar, Info } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function ScoreBreakdownComponent() {
  const { user } = useAuth()

  // Generate mock data for demonstration
  const mockData = generateMockScoreData(user?.phoneNumber || "254700000000")
  const scoreBreakdown = calculateTenantScore(mockData)
  const scoreCategory = getScoreCategory(scoreBreakdown.totalScore)

  const components = [
    {
      key: "paymentTimeliness",
      icon: Clock,
      title: "Payment Timeliness",
      description: scoreBreakdown.breakdown.paymentTimeliness.description,
    },
    {
      key: "paymentConsistency",
      icon: TrendingUp,
      title: "Payment Consistency",
      description: scoreBreakdown.breakdown.paymentConsistency.description,
    },
    {
      key: "paymentVolume",
      icon: CreditCard,
      title: "Payment Volume",
      description: scoreBreakdown.breakdown.paymentVolume.description,
    },
    {
      key: "tenancyStability",
      icon: Calendar,
      title: "Tenancy Stability",
      description: scoreBreakdown.breakdown.tenancyStability.description,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Score Breakdown</span>
          </CardTitle>
          <CardDescription>Detailed analysis of your TenantScore components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className={`text-4xl font-bold ${scoreCategory.color}`}>{scoreBreakdown.totalScore}</div>
              <div className="text-lg font-medium">{scoreCategory.category}</div>
              <div className="text-sm text-gray-600">{scoreCategory.description}</div>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="mb-2">
                Score Range: 0-1000
              </Badge>
              <Progress value={(scoreBreakdown.totalScore / 1000) * 100} className="w-32" />
            </div>
          </div>

          {/* Score Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {components.map((component) => {
              const data = scoreBreakdown.breakdown[component.key as keyof typeof scoreBreakdown.breakdown]
              const Icon = component.icon

              return (
                <div key={component.key} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Icon className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">{component.title}</div>
                      <div className="text-sm text-gray-600">Weight: {Math.round(data.weight * 100)}%</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">{data.score}</span>
                      <Progress value={(data.score / 1000) * 100} className="w-20" />
                    </div>
                    <div className="text-sm text-gray-600">{component.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-600" />
            <span>Recommendations</span>
          </CardTitle>
          <CardDescription>Ways to improve your TenantScore</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {scoreCategory.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm">{recommendation}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Score History Simulation */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Statistics</CardTitle>
          <CardDescription>Your rental payment performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{mockData.onTimePayments}</div>
              <div className="text-sm text-gray-600">On-time Payments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{mockData.latePayments}</div>
              <div className="text-sm text-gray-600">Late Payments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">KES {mockData.totalRentPaid.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Rent Paid</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{mockData.averageDaysLate.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg. Days Late</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
