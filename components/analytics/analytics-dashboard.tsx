"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Home, 
  AlertTriangle,
  Target,
  Calendar,
  MapPin,
  Star,
  ArrowLeft,
  RefreshCw
} from "lucide-react"
import {
  getOccupancyTrends,
  getRentAnalysis,
  getMaintenanceCostPatterns,
  getPropertyMetrics,
  getMarketInsights,
  forecastOccupancy,
  getCompetitorAnalysis,
  type OccupancyTrend,
  type RentAnalysis,
  type MaintenanceCostPattern,
  type PropertyMetrics,
  type MarketInsight
} from "@/lib/services/analytics-service"

interface AnalyticsDashboardProps {
  onBack: () => void
}

export function AnalyticsDashboard({ onBack }: AnalyticsDashboardProps) {
  const [occupancyData, setOccupancyData] = useState<OccupancyTrend[]>([])
  const [rentAnalysis, setRentAnalysis] = useState<RentAnalysis[]>([])
  const [maintenanceCosts, setMaintenanceCosts] = useState<MaintenanceCostPattern[]>([])
  const [propertyMetrics, setPropertyMetrics] = useState<PropertyMetrics | null>(null)
  const [marketInsights, setMarketInsights] = useState<MarketInsight[]>([])
  const [occupancyForecast, setOccupancyForecast] = useState<{month: string, predicted: number, confidence: number}[]>([])
  const [competitors, setCompetitors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)
      const [
        occupancy,
        rent,
        maintenance,
        metrics,
        insights,
        forecast,
        competitorData
      ] = await Promise.all([
        getOccupancyTrends(6),
        getRentAnalysis(),
        getMaintenanceCostPatterns(),
        getPropertyMetrics(),
        getMarketInsights(),
        forecastOccupancy(6),
        getCompetitorAnalysis()
      ])

      setOccupancyData(occupancy)
      setRentAnalysis(rent)
      setMaintenanceCosts(maintenance)
      setPropertyMetrics(metrics)
      setMarketInsights(insights)
      setOccupancyForecast(forecast)
      setCompetitors(competitorData)
    } catch (error) {
      console.error("Failed to load analytics data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAnalyticsData()
    setRefreshing(false)
  }

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <Target className="h-4 w-4 text-green-600" />
      case "risk":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "trend":
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      default:
        return <BarChart3 className="h-4 w-4" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "opportunity":
        return "bg-green-50 border-green-200 text-green-800"
      case "risk":
        return "bg-red-50 border-red-200 text-red-800"
      case "trend":
        return "bg-blue-50 border-blue-200 text-blue-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  const getRentRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "increase":
        return "text-green-600 bg-green-50"
      case "decrease":
        return "text-red-600 bg-red-50"
      default:
        return "text-blue-600 bg-blue-50"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
              <h1 className="text-xl font-semibold text-gray-900">Property Analytics</h1>
              <p className="text-sm text-gray-500">Market insights and performance metrics</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Key Metrics */}
        {propertyMetrics && (
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">NOI</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${propertyMetrics.netOperatingIncome.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cap Rate</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {propertyMetrics.capRate.toFixed(1)}%
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Occupancy</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {propertyMetrics.occupancyRate}%
                    </p>
                  </div>
                  <Home className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cash Return</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {propertyMetrics.cashOnCashReturn.toFixed(1)}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Market Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Market Insights</CardTitle>
            <CardDescription>Key opportunities and risks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {marketInsights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start space-x-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{insight.title}</h3>
                      <Badge variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'}>
                        {insight.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm mb-2">{insight.description}</p>
                    {insight.recommendation && (
                      <div className="bg-white/50 p-3 rounded border">
                        <p className="text-xs font-medium text-gray-700">Recommendation:</p>
                        <p className="text-sm">{insight.recommendation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tabs for detailed analytics */}
        <Tabs defaultValue="occupancy" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
            <TabsTrigger value="rent">Rent Analysis</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
          </TabsList>

          {/* Occupancy Trends */}
          <TabsContent value="occupancy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Occupancy Trends</CardTitle>
                <CardDescription>Historical and forecasted occupancy rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {occupancyData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{data.month} {data.year}</p>
                      <p className="text-sm text-gray-600">
                        {data.occupiedUnits}/{data.totalUnits} units occupied
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{data.occupancyRate}%</p>
                      <p className="text-xs text-gray-500">{data.avgDaysToFill} days avg fill time</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6-Month Forecast</CardTitle>
                <CardDescription>Predicted occupancy rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {occupancyForecast.map((forecast, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{forecast.month}</span>
                    <div className="flex items-center space-x-3">
                      <Progress value={forecast.predicted} className="w-20" />
                      <span className="text-sm font-medium">{forecast.predicted}%</span>
                      <span className="text-xs text-gray-500">({forecast.confidence}% confidence)</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rent Analysis */}
          <TabsContent value="rent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rent vs Market Analysis</CardTitle>
                <CardDescription>Compare your rates with market averages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {rentAnalysis.map((rent, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{rent.unitType}</h3>
                      <Badge className={getRentRecommendationColor(rent.recommendation)}>
                        {rent.recommendation}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Your Rate</p>
                        <p className="text-lg font-semibold">${rent.currentAvgRent}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Market Rate</p>
                        <p className="text-lg font-semibold">${rent.marketAvgRent}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Difference</span>
                        <span className={`text-sm font-medium ${rent.difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {rent.difference > 0 ? '+' : ''}${rent.difference} ({rent.differencePercentage.toFixed(1)}%)
                        </span>
                      </div>
                      {rent.suggestedRent && (
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-gray-600">Suggested Rate</span>
                          <span className="text-sm font-medium text-blue-600">${rent.suggestedRent}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Costs */}
          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Cost Patterns</CardTitle>
                <CardDescription>Analyze spending trends by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {maintenanceCosts.map((cost, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{cost.category}</h3>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(cost.trend)}
                        <span className="text-sm text-gray-500 capitalize">{cost.trend}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">Total Cost</p>
                        <p className="text-lg font-semibold">${cost.totalCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Requests</p>
                        <p className="text-lg font-semibold">{cost.frequency}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Cost</p>
                        <p className="text-lg font-semibold">${cost.avgCostPerRequest}</p>
                      </div>
                    </div>
                    {cost.seasonalPattern && (
                      <div className="mt-4 pt-3 border-t">
                        <p className="text-sm text-gray-600 mb-2">Seasonal Pattern</p>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          {Object.entries(cost.seasonalPattern).map(([season, amount]) => (
                            <div key={season} className="text-center">
                              <p className="text-gray-500 capitalize">{season}</p>
                              <p className="font-medium">${amount}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Competitors */}
          <TabsContent value="competitors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Competitor Analysis</CardTitle>
                <CardDescription>Compare with nearby properties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {competitors.map((competitor, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{competitor.propertyName}</h3>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span>{competitor.distance}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{competitor.rating}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Avg Rent</p>
                        <p className="text-lg font-semibold">${competitor.avgRent}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Occupancy</p>
                        <p className="text-lg font-semibold">{competitor.occupancyRate}%</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Amenities</p>
                      <div className="flex flex-wrap gap-1">
                        {competitor.amenities.map((amenity: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}