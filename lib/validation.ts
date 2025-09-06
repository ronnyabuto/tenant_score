// Comprehensive validation utilities for TenantScore
import { z } from "zod"
import { File } from "formdata-node"

// Phone number validation for Kenya
export const kenyaPhoneSchema = z
  .string()
  .regex(/^254[0-9]{9}$/, "Please enter a valid Kenyan phone number (254XXXXXXXXX)")

// National ID validation
export const nationalIdSchema = z
  .string()
  .min(7, "National ID must be at least 7 characters")
  .max(10, "National ID must not exceed 10 characters")
  .regex(/^[0-9A-Z]+$/, "National ID can only contain numbers and letters")

// Passport validation
export const passportSchema = z
  .string()
  .min(6, "Passport number must be at least 6 characters")
  .max(12, "Passport number must not exceed 12 characters")
  .regex(/^[A-Z0-9]+$/, "Passport number can only contain uppercase letters and numbers")

// User registration schema
export const userRegistrationSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

  nationalId: z.union([nationalIdSchema, passportSchema]),

  phoneNumber: kenyaPhoneSchema,

  userType: z.enum(["tenant", "landlord", "admin"], {
    errorMap: () => ({ message: "Please select a valid user type" }),
  }),

  idDocumentType: z.enum(["national_id", "passport"], {
    errorMap: () => ({ message: "Please select a valid document type" }),
  }),

  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
})

// Login schema
export const loginSchema = z.object({
  identifier: z.string().min(1, "Please enter your phone number or ID"),
  identifierType: z.enum(["phone", "national_id", "tenant_score_id"]),
})

// OTP verification schema
export const otpSchema = z.object({
  phoneNumber: kenyaPhoneSchema,
  otpCode: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^[0-9]+$/, "OTP can only contain numbers"),
})

// Payment amount validation
export const paymentAmountSchema = z
  .number()
  .min(100, "Minimum payment amount is KES 100")
  .max(1000000, "Maximum payment amount is KES 1,000,000")

// File upload validation
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      "Only JPEG and PNG files are allowed",
    ),
})

// Tenant score validation
export const tenantScoreSchema = z.number().min(0, "Score cannot be negative").max(1000, "Score cannot exceed 1000")

// Custom validation functions
export const validateKenyaPhone = (phone: string): boolean => {
  return kenyaPhoneSchema.safeParse(phone).success
}

export const validateNationalId = (id: string): boolean => {
  return nationalIdSchema.safeParse(id).success || passportSchema.safeParse(id).success
}

export const validateEmail = (email: string): boolean => {
  if (!email) return true // Email is optional
  return z.string().email().safeParse(email).success
}

// Form validation helper
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): {\
  success: boolean
  data?: T\
  errors?: Record<string, string>
} => {\
  const result = schema.safeParse(data)
  
  if (result.success) {\
    return { success: true, data: result.data }
  }
  \
  const errors: Record<string, string> = {}
  result.error.errors.forEach((error) => {\
    const path = error.path.join(".")
    errors[path] = error.message
  })
  \
  return { success: false, errors }
}

// Sanitization utilities
export const sanitizeInput = (input: string): string => {\
  return input.trim().replace(/[<>]/g, "")
}

export const sanitizePhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters and ensure Kenya format\
  const cleaned = phone.replace(/\D/g, "")
  
  if (cleaned.startsWith("0")) {\
    return "254" + cleaned.substring(1)
  }
  
  if (cleaned.startsWith("254")) {\
    return cleaned
  }
  
  if (cleaned.length === 9) {\
    return "254" + cleaned
  }
  
  return cleaned\
}
