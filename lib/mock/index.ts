export * from "./users"
export * from "./payments"
export * from "./properties"
export * from "./scores"
export * from "./admin"

// Central mock data configuration
export const MOCK_CONFIG = {
  VERIFICATION_CODE: "1234",
  PAYBILL_NUMBER: "174379",
  BASE_SCORE: 500,
  SCORE_RANGES: {
    EXCEPTIONAL: 850,
    EXCELLENT: 750,
    GOOD: 650,
    FAIR: 550,
    POOR: 400,
  },
}
