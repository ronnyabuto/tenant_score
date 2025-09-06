"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { TenantDashboard } from "@/components/tenant/tenant-dashboard"
import { LandlordDashboard } from "@/components/landlord/landlord-dashboard"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Building2, Smartphone, Users, ChevronRight } from "lucide-react"

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true)
  const { isAuthenticated, user } = useAuth()

  // Route to appropriate dashboard based on user type
  if (isAuthenticated && user?.userType === "tenant") {
    return <TenantDashboard />
  }

  if (isAuthenticated && user?.userType === "landlord") {
    return <LandlordDashboard />
  }

  if (isAuthenticated && user?.userType === "admin") {
    return <AdminDashboard />
  }

  if (isAuthenticated && user) {
    return (
      <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="safe-area-pt px-4">
          <div className="ios-card mt-8 text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to RentManager!</h1>
            <p className="text-gray-600 mb-6">Your mobile rental management solution</p>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <Users className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">{user.fullName}</p>
                  <p className="text-sm text-gray-600">{user.phoneNumber}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-3 h-3 rounded-full ${user.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <div>
                  <p className="font-medium text-gray-900 capitalize">{user.userType} Account</p>
                  <p className="text-sm text-gray-600">{user.isVerified ? "Verified" : "Pending Verification"}</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => {}} 
              className="w-full mt-6 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium transition-all active:scale-95"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="safe-area-pt px-4">
        {/* Header */}
        <div className="text-center pt-12 pb-8">
          <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">RentManager</h1>
          <p className="text-gray-600 text-lg">Property management made simple</p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
          <div className="ios-card">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Mobile First</h3>
                <p className="text-sm text-gray-600">Designed for your phone</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <div className="ios-card">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Property Management</h3>
                <p className="text-sm text-gray-600">Track rent, tenants & more</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <div className="ios-card">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Multi-Role Support</h3>
                <p className="text-sm text-gray-600">Landlords, tenants & admins</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Auth Forms */}
        <div className="ios-card">
          {isLogin ? <LoginForm /> : <SignupForm />}
          
          <div className="text-center mt-6">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 font-medium text-sm active:text-blue-700 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Demo credentials */}
          <div className="mt-4 p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 text-center mb-1">Demo Credentials:</p>
            <p className="text-xs text-gray-600 text-center">Admin: 254700000000 (code: 1234)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
