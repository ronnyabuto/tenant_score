"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot">("login")
  const { isAuthenticated, user, signOut } = useAuth()

  // Prioritize admin interface - route to admin dashboard if authenticated as admin
  if (isAuthenticated && user?.userType === "admin") {
    return <AdminDashboard />
  }

  // For now, other user types get a basic profile view until we implement their dashboards
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-mobile safe-area-top">
          <div className="card text-center space-element">
            <h1 className="text-title">Welcome, {user.fullName}</h1>
            <p className="text-caption">Account Type: {user.userType}</p>
            <div className="pt-4">
              <button onClick={signOut} className="btn-secondary">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-mobile safe-area-top">
        <div className="space-section">
          {/* App Branding */}
          <div className="text-center space-element">
            <h1 className="text-display text-gray-900">Tenant Score</h1>
          </div>

          {/* Auth Section */}
          <div className="card space-component">
            {authMode === "login" && <LoginForm />}
            {authMode === "signup" && <SignupForm />}
            {authMode === "forgot" && (
              <div className="space-element">
                <h2 className="text-title text-center mb-4">Forgot Password</h2>
                <input 
                  type="tel" 
                  placeholder="Enter your phone number"
                  className="input-field"
                />
                <button className="btn-primary">Send Reset Code</button>
              </div>
            )}

            {/* Auth Mode Toggle */}
            <div className="space-tight pt-4 border-t border-gray-100">
              {authMode === "login" && (
                <div className="space-tight text-center">
                  <button 
                    onClick={() => setAuthMode("signup")}
                    className="btn-text"
                  >
                    Create Account
                  </button>
                  <button 
                    onClick={() => setAuthMode("forgot")}
                    className="btn-text"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {authMode === "signup" && (
                <div className="text-center">
                  <button 
                    onClick={() => setAuthMode("login")}
                    className="btn-text"
                  >
                    Already have an account? Sign In
                  </button>
                </div>
              )}

              {authMode === "forgot" && (
                <div className="text-center">
                  <button 
                    onClick={() => setAuthMode("login")}
                    className="btn-text"
                  >
                    Back to Sign In
                  </button>
                </div>
              )}
            </div>

            {/* Admin Demo Access */}
            {authMode === "login" && (
              <div className="mt-4 p-3 bg-blue-50 rounded-2xl">
                <p className="text-micro text-center text-blue-600 mb-1">Admin Demo</p>
                <p className="text-micro text-center text-blue-700">254700000000 (code: 1234)</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
