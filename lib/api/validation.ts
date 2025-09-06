import { z } from "zod"

export const ApiValidation = {
  phoneNumber: z.string().regex(/^254[0-9]{9}$/, "Invalid Kenyan phone number format"),

  nationalId: z
    .string()
    .min(7, "National ID must be at least 7 characters")
    .max(10, "National ID must not exceed 10 characters")
    .regex(/^[0-9A-Z]+$/, "National ID can only contain numbers and letters"),

  passport: z
    .string()
    .min(6, "Passport number must be at least 6 characters")
    .max(12, "Passport number must not exceed 12 characters")
    .regex(/^[A-Z0-9]+$/, "Passport number can only contain uppercase letters and numbers"),

  email: z.string().email("Invalid email format").optional(),

  amount: z.number().min(100, "Minimum amount is KES 100").max(1000000, "Maximum amount is KES 1,000,000"),

  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^[0-9]+$/, "OTP can only contain numbers"),

  userType: z.enum(["tenant", "landlord", "admin"]),

  pagination: z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20),
  }),
}

export function validatePagination(query: URLSearchParams) {
  const page = Number.parseInt(query.get("page") || "1")
  const limit = Number.parseInt(query.get("limit") || "20")

  return ApiValidation.pagination.parse({ page, limit })
}
