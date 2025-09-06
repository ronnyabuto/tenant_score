export interface OccupancyTrend {
  month: string
  year: number
  occupancyRate: number
  totalUnits: number
  occupiedUnits: number
  vacantUnits: number
  newTenants: number
  movedOut: number
  avgDaysToFill: number
}

export interface RentAnalysis {
  unitType: string
  currentAvgRent: number
  marketAvgRent: number
  difference: number
  differencePercentage: number
  recommendation: "increase" | "maintain" | "decrease"
  suggestedRent?: number
}

export interface MaintenanceCostPattern {
  category: string
  totalCost: number
  frequency: number
  avgCostPerRequest: number
  trend: "increasing" | "stable" | "decreasing"
  seasonalPattern?: {
    spring: number
    summer: number
    fall: number
    winter: number
  }
}

export interface PropertyMetrics {
  totalRevenue: number
  totalExpenses: number
  netOperatingIncome: number
  capRate: number
  cashOnCashReturn: number
  occupancyRate: number
  avgRentPerSqFt: number
}

export interface MarketInsight {
  type: "opportunity" | "risk" | "trend"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  actionable: boolean
  recommendation?: string
}

const mockOccupancyData: OccupancyTrend[] = [
  {
    month: "January",
    year: 2024,
    occupancyRate: 92,
    totalUnits: 50,
    occupiedUnits: 46,
    vacantUnits: 4,
    newTenants: 2,
    movedOut: 3,
    avgDaysToFill: 18
  },
  {
    month: "February", 
    year: 2024,
    occupancyRate: 94,
    totalUnits: 50,
    occupiedUnits: 47,
    vacantUnits: 3,
    newTenants: 3,
    movedOut: 2,
    avgDaysToFill: 15
  },
  {
    month: "March",
    year: 2024,
    occupancyRate: 96,
    totalUnits: 50,
    occupiedUnits: 48,
    vacantUnits: 2,
    newTenants: 1,
    movedOut: 0,
    avgDaysToFill: 12
  },
  {
    month: "April",
    year: 2024,
    occupancyRate: 98,
    totalUnits: 50,
    occupiedUnits: 49,
    vacantUnits: 1,
    newTenants: 1,
    movedOut: 0,
    avgDaysToFill: 8
  },
  {
    month: "May",
    year: 2024,
    occupancyRate: 100,
    totalUnits: 50,
    occupiedUnits: 50,
    vacantUnits: 0,
    newTenants: 1,
    movedOut: 0,
    avgDaysToFill: 0
  },
  {
    month: "June",
    year: 2024,
    occupancyRate: 98,
    totalUnits: 50,
    occupiedUnits: 49,
    vacantUnits: 1,
    newTenants: 0,
    movedOut: 1,
    avgDaysToFill: 14
  }
]

const mockRentAnalysis: RentAnalysis[] = [
  {
    unitType: "1 Bedroom",
    currentAvgRent: 1200,
    marketAvgRent: 1350,
    difference: -150,
    differencePercentage: -11.1,
    recommendation: "increase",
    suggestedRent: 1300
  },
  {
    unitType: "2 Bedroom",
    currentAvgRent: 1650,
    marketAvgRent: 1600,
    difference: 50,
    differencePercentage: 3.1,
    recommendation: "maintain"
  },
  {
    unitType: "3 Bedroom",
    currentAvgRent: 2100,
    marketAvgRent: 2200,
    difference: -100,
    differencePercentage: -4.5,
    recommendation: "increase",
    suggestedRent: 2150
  },
  {
    unitType: "Studio",
    currentAvgRent: 900,
    marketAvgRent: 950,
    difference: -50,
    differencePercentage: -5.3,
    recommendation: "increase",
    suggestedRent: 925
  }
]

const mockMaintenanceCosts: MaintenanceCostPattern[] = [
  {
    category: "Plumbing",
    totalCost: 8500,
    frequency: 24,
    avgCostPerRequest: 354,
    trend: "increasing",
    seasonalPattern: {
      spring: 1800,
      summer: 2100,
      fall: 2200,
      winter: 2400
    }
  },
  {
    category: "Electrical",
    totalCost: 4200,
    frequency: 12,
    avgCostPerRequest: 350,
    trend: "stable",
    seasonalPattern: {
      spring: 1000,
      summer: 1200,
      fall: 1000,
      winter: 1000
    }
  },
  {
    category: "HVAC",
    totalCost: 12000,
    frequency: 18,
    avgCostPerRequest: 667,
    trend: "increasing",
    seasonalPattern: {
      spring: 2000,
      summer: 4500,
      fall: 2500,
      winter: 3000
    }
  },
  {
    category: "Appliances",
    totalCost: 3600,
    frequency: 9,
    avgCostPerRequest: 400,
    trend: "decreasing",
    seasonalPattern: {
      spring: 900,
      summer: 800,
      fall: 1000,
      winter: 900
    }
  }
]

export async function getOccupancyTrends(months: number = 6): Promise<OccupancyTrend[]> {
  await new Promise(resolve => setTimeout(resolve, 800))
  return mockOccupancyData.slice(-months)
}

export async function getRentAnalysis(): Promise<RentAnalysis[]> {
  await new Promise(resolve => setTimeout(resolve, 600))
  return mockRentAnalysis
}

export async function getMaintenanceCostPatterns(): Promise<MaintenanceCostPattern[]> {
  await new Promise(resolve => setTimeout(resolve, 700))
  return mockMaintenanceCosts
}

export async function getPropertyMetrics(): Promise<PropertyMetrics> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const totalRevenue = 82500 // Monthly rent revenue
  const totalExpenses = 28000 // Operating expenses
  const propertyValue = 2500000
  const cashInvested = 500000
  
  return {
    totalRevenue,
    totalExpenses,
    netOperatingIncome: totalRevenue - totalExpenses,
    capRate: ((totalRevenue - totalExpenses) * 12) / propertyValue * 100,
    cashOnCashReturn: ((totalRevenue - totalExpenses) * 12) / cashInvested * 100,
    occupancyRate: 96,
    avgRentPerSqFt: 1.85
  }
}

export async function getMarketInsights(): Promise<MarketInsight[]> {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  return [
    {
      type: "opportunity",
      title: "Rent Increase Opportunity",
      description: "1-bedroom units are 11% below market rate. Consider gradual increases upon lease renewal.",
      impact: "high",
      actionable: true,
      recommendation: "Increase 1-bedroom rents to $1,300 over next 6 months"
    },
    {
      type: "risk",
      title: "Rising Maintenance Costs",
      description: "HVAC and plumbing costs have increased 15% year-over-year. Consider preventive maintenance program.",
      impact: "medium",
      actionable: true,
      recommendation: "Implement quarterly HVAC inspections and pipe maintenance program"
    },
    {
      type: "trend",
      title: "Seasonal Occupancy Pattern",
      description: "Occupancy peaks in spring/summer months. Plan maintenance and renovations for winter periods.",
      impact: "medium",
      actionable: true,
      recommendation: "Schedule major renovations between November-February"
    },
    {
      type: "opportunity",
      title: "Above Market Performance",
      description: "Your 96% occupancy rate exceeds the local average of 89%. Strong tenant retention.",
      impact: "high",
      actionable: false
    },
    {
      type: "risk",
      title: "Market Saturation",
      description: "New apartment complex opening 2 blocks away may impact rental demand in Q3 2024.",
      impact: "medium",
      actionable: true,
      recommendation: "Consider offering lease renewal incentives to retain tenants"
    }
  ]
}

export async function forecastOccupancy(months: number = 6): Promise<{month: string, predicted: number, confidence: number}[]> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const baseOccupancy = 96
  const seasonalFactors = [0.95, 0.92, 0.98, 1.02, 1.05, 1.03] // Seasonal multipliers
  
  return Array.from({length: months}, (_, i) => {
    const futureMonth = new Date()
    futureMonth.setMonth(futureMonth.getMonth() + i + 1)
    
    const seasonalFactor = seasonalFactors[i % seasonalFactors.length]
    const predicted = Math.min(100, Math.max(85, baseOccupancy * seasonalFactor))
    
    return {
      month: futureMonth.toLocaleDateString('en-US', {month: 'short'}),
      predicted: Math.round(predicted),
      confidence: Math.max(70, 95 - (i * 8)) // Confidence decreases over time
    }
  })
}

export async function getCompetitorAnalysis(): Promise<{
  propertyName: string
  distance: string
  avgRent: number
  occupancyRate: number
  amenities: string[]
  rating: number
}[]> {
  await new Promise(resolve => setTimeout(resolve, 700))
  
  return [
    {
      propertyName: "Sunset Heights",
      distance: "0.3 miles",
      avgRent: 1450,
      occupancyRate: 89,
      amenities: ["Pool", "Gym", "Parking"],
      rating: 4.2
    },
    {
      propertyName: "Metro Plaza",
      distance: "0.5 miles", 
      avgRent: 1380,
      occupancyRate: 94,
      amenities: ["Gym", "Parking", "Laundry"],
      rating: 4.0
    },
    {
      propertyName: "Garden View",
      distance: "0.7 miles",
      avgRent: 1520,
      occupancyRate: 87,
      amenities: ["Pool", "Gym", "Parking", "Pet-Friendly"],
      rating: 4.5
    }
  ]
}