"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "./login-form"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredUserType?: "tenant" | "landlord"
}

export function ProtectedRoute({ children, requiredUserType }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <LoginForm />
      </div>
    )
  }

  if (requiredUserType && user?.userType !== requiredUserType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
          <p className="text-muted-foreground">This page is only available for {requiredUserType}s.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
