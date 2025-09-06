"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { TenantDashboard } from "@/components/tenant/tenant-dashboard"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot">("login")
  const { isAuthenticated, user, signOut } = useAuth()

  // Debug logging
  console.log("Auth Debug:", { isAuthenticated, userType: user?.userType, user })

  // Route authenticated users to their respective dashboards
  if (isAuthenticated && user) {
    switch (user.userType) {
      case "admin":
        return <AdminDashboard />
      case "tenant":
        return <TenantDashboard />
      case "landlord":
        // TODO: Implement landlord dashboard
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="ios-container safe-area-pt">
              <div className="ios-card text-center mt-8 ios-space-sm">
                <h1 className="ios-title">Welcome, {user.fullName}</h1>
                <p className="ios-caption">Landlord Dashboard Coming Soon</p>
                <div className="pt-4">
                  <button onClick={signOut} className="ios-button-secondary">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="ios-container safe-area-pt">
              <div className="ios-card text-center mt-8 ios-space-sm">
                <h1 className="ios-title">Welcome, {user.fullName}</h1>
                <p className="ios-caption">Account Type: {user.userType}</p>
                <div className="pt-4">
                  <button onClick={signOut} className="ios-button-secondary">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="ios-container ios-safe-top">
        <div className="ios-space-lg">
          {/* App Branding */}
          <div className="text-center ios-space-sm">
            <h1 className="ios-display text-gray-900">Tenant Score</h1>
          </div>

          {/* Auth Section */}
          <div className="ios-card ios-space-md">
            {authMode === "login" && <LoginForm />}
            {authMode === "signup" && <SignupForm />}
            {authMode === "forgot" && (
              <div className="ios-space-sm">
                <h2 className="ios-title text-center mb-4">Forgot Password</h2>
                <input 
                  type="tel" 
                  placeholder="Enter your phone number"
                  className="ios-input"
                />
                <button className="ios-button">Send Reset Code</button>
              </div>
            )}

            {/* Auth Mode Toggle */}
            <div className="ios-space-xs pt-4 border-t border-gray-100">
              {authMode === "login" && (
                <div className="ios-space-xs text-center">
                  <button 
                    onClick={() => setAuthMode("signup")}
                    className="ios-button-text"
                  >
                    Create Account
                  </button>
                  <button 
                    onClick={() => setAuthMode("forgot")}
                    className="ios-button-text"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {authMode === "signup" && (
                <div className="text-center">
                  <button 
                    onClick={() => setAuthMode("login")}
                    className="ios-button-text"
                  >
                    Already have an account? Sign In
                  </button>
                </div>
              )}

              {authMode === "forgot" && (
                <div className="text-center">
                  <button 
                    onClick={() => setAuthMode("login")}
                    className="ios-button-text"
                  >
                    Back to Sign In
                  </button>
                </div>
              )}
            </div>

            {/* Demo Access */}
            {authMode === "login" && (
              <div className="mt-4 space-y-2">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <p className="ios-micro text-center text-blue-600 mb-1">Admin Demo</p>
                  <p className="ios-micro text-center text-blue-700">254700000000 (code: 1234)</p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <p className="ios-micro text-center text-green-600 mb-1">Tenant Demo</p>
                  <p className="ios-micro text-center text-green-700">254712345678 (code: 1234)</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
