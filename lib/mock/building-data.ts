// Mock data for single apartment building management

export interface ApartmentUnit {
  id: string
  unitNumber: string
  floor: number
  tenant: {
    name: string
    phone: string
    email?: string
    moveInDate: string
  } | null
  rent: {
    amount: number
    dueDate: string
    status: "paid" | "pending" | "overdue"
    lastPaymentDate?: string
  }
  lease: {
    startDate: string
    endDate: string
    depositAmount: number
    depositStatus: "held" | "returned" | "partial"
  } | null
}

export interface Building {
  id: string
  name: string
  address: string
  totalUnits: number
  occupiedUnits: number
  manager: {
    name: string
    phone: string
  }
}

// Mock building data
export const BUILDING_DATA: Building = {
  id: "building-1",
  name: "Sunset Apartments",
  address: "Westlands, Nairobi",
  totalUnits: 8,
  occupiedUnits: 6,
  manager: {
    name: "David Mutua",
    phone: "254712345678"
  }
}

// Mock apartment units data
export const APARTMENT_UNITS: ApartmentUnit[] = [
  {
    id: "unit-1a",
    unitNumber: "1A",
    floor: 1,
    tenant: {
      name: "John Kamau",
      phone: "254712345678",
      email: "john.kamau@email.com",
      moveInDate: "2024-01-15"
    },
    rent: {
      amount: 45000,
      dueDate: "2024-12-01",
      status: "paid",
      lastPaymentDate: "2024-11-28"
    },
    lease: {
      startDate: "2024-01-15",
      endDate: "2024-12-31",
      depositAmount: 90000,
      depositStatus: "held"
    }
  },
  {
    id: "unit-1b",
    unitNumber: "1B",
    floor: 1,
    tenant: {
      name: "Mary Wanjiku",
      phone: "254798765432",
      email: "mary.wanjiku@email.com",
      moveInDate: "2024-03-01"
    },
    rent: {
      amount: 45000,
      dueDate: "2024-12-01",
      status: "pending",
    },
    lease: {
      startDate: "2024-03-01",
      endDate: "2025-02-28",
      depositAmount: 90000,
      depositStatus: "held"
    }
  },
  {
    id: "unit-2a",
    unitNumber: "2A",
    floor: 2,
    tenant: {
      name: "Peter Kipchoge",
      phone: "254723456789",
      moveInDate: "2024-02-10"
    },
    rent: {
      amount: 50000,
      dueDate: "2024-11-01",
      status: "overdue",
      lastPaymentDate: "2024-10-15"
    },
    lease: {
      startDate: "2024-02-10",
      endDate: "2025-01-31",
      depositAmount: 100000,
      depositStatus: "held"
    }
  },
  {
    id: "unit-2b",
    unitNumber: "2B",
    floor: 2,
    tenant: {
      name: "Grace Achieng",
      phone: "254756789012",
      email: "grace.achieng@email.com",
      moveInDate: "2024-04-20"
    },
    rent: {
      amount: 50000,
      dueDate: "2024-12-01",
      status: "paid",
      lastPaymentDate: "2024-11-30"
    },
    lease: {
      startDate: "2024-04-20",
      endDate: "2025-03-31",
      depositAmount: 100000,
      depositStatus: "held"
    }
  },
  {
    id: "unit-3a",
    unitNumber: "3A",
    floor: 3,
    tenant: {
      name: "Samuel Ochieng",
      phone: "254734567891",
      moveInDate: "2024-06-01"
    },
    rent: {
      amount: 55000,
      dueDate: "2024-12-01",
      status: "pending",
    },
    lease: {
      startDate: "2024-06-01",
      endDate: "2025-05-31",
      depositAmount: 110000,
      depositStatus: "held"
    }
  },
  {
    id: "unit-3b",
    unitNumber: "3B",
    floor: 3,
    tenant: {
      name: "Agnes Muthoni",
      phone: "254765432198",
      email: "agnes.muthoni@email.com",
      moveInDate: "2024-05-15"
    },
    rent: {
      amount: 55000,
      dueDate: "2024-12-01",
      status: "paid",
      lastPaymentDate: "2024-11-29"
    },
    lease: {
      startDate: "2024-05-15",
      endDate: "2025-04-30",
      depositAmount: 110000,
      depositStatus: "held"
    }
  },
  {
    id: "unit-4a",
    unitNumber: "4A",
    floor: 4,
    tenant: null,
    rent: {
      amount: 60000,
      dueDate: "",
      status: "pending"
    },
    lease: null
  },
  {
    id: "unit-4b",
    unitNumber: "4B",
    floor: 4,
    tenant: null,
    rent: {
      amount: 60000,
      dueDate: "",
      status: "pending"
    },
    lease: null
  }
]

// Helper functions
export function getBuildingOccupancyRate(): number {
  const occupiedUnits = APARTMENT_UNITS.filter(unit => unit.tenant !== null).length
  return Math.round((occupiedUnits / APARTMENT_UNITS.length) * 100)
}

export function getTotalMonthlyRent(): number {
  return APARTMENT_UNITS
    .filter(unit => unit.tenant !== null)
    .reduce((total, unit) => total + unit.rent.amount, 0)
}

export function getRentStatusCounts() {
  const occupied = APARTMENT_UNITS.filter(unit => unit.tenant !== null)
  return {
    paid: occupied.filter(unit => unit.rent.status === "paid").length,
    pending: occupied.filter(unit => unit.rent.status === "pending").length,
    overdue: occupied.filter(unit => unit.rent.status === "overdue").length,
    vacant: APARTMENT_UNITS.filter(unit => unit.tenant === null).length
  }
}

export function getUnitsByFloor() {
  const floors: Record<number, ApartmentUnit[]> = {}
  APARTMENT_UNITS.forEach(unit => {
    if (!floors[unit.floor]) floors[unit.floor] = []
    floors[unit.floor].push(unit)
  })
  return floors
}