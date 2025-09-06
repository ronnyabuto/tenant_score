export interface MockProperty {
  id: number
  name: string
  location: string
  monthlyRent: number
  currentTenant?: {
    name: string
    phone: string
    score: number
    startDate: string
    status: string
  } | null
}

export interface MockTenancy {
  propertyName: string
  location: string
  monthlyRent: number
  startDate: string
  landlordName: string
  landlordPhone: string
}

export const MOCK_PROPERTIES: MockProperty[] = [
  {
    id: 1,
    name: "Sunrise Apartments Unit 2B",
    location: "Westlands, Nairobi",
    monthlyRent: 45000,
    currentTenant: {
      name: "Peter Kiprotich",
      phone: "254734567890",
      score: 750,
      startDate: "2024-01-01",
      status: "active",
    },
  },
  {
    id: 2,
    name: "Garden View Studio",
    location: "Westlands, Nairobi",
    monthlyRent: 35000,
    currentTenant: null,
  },
  {
    id: 3,
    name: "Green Valley House",
    location: "Karen, Nairobi",
    monthlyRent: 65000,
    currentTenant: {
      name: "Grace Achieng",
      phone: "254745678901",
      score: 680,
      startDate: "2024-02-01",
      status: "active",
    },
  },
]

export const mockProperties = MOCK_PROPERTIES

export const MOCK_CURRENT_TENANCY: MockTenancy = {
  propertyName: "Sunrise Apartments Unit 2B",
  location: "Westlands, Nairobi",
  monthlyRent: 45000,
  startDate: "2024-01-01",
  landlordName: "John Mwangi",
  landlordPhone: "254712345678",
}
