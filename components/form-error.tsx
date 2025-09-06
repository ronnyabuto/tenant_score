import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormErrorProps {
  message?: string
  className?: string
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null

  return (
    <div className={cn("flex items-center space-x-2 text-sm text-red-600", className)}>
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  )
}

interface FormFieldErrorProps {
  errors?: Record<string, string>
  field: string
  className?: string
}

export function FormFieldError({ errors, field, className }: FormFieldErrorProps) {
  const message = errors?.[field]
  return <FormError message={message} className={className} />
}
