"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export function SignupForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    userType: "admin" as "tenant" | "landlord" | "admin", // Default to admin as requested
  })

  const { signUp, isLoading } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.fullName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name",
        variant: "destructive",
      })
      return
    }

    if (!formData.phoneNumber.match(/^254[0-9]{9}$/)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid Kenyan phone number (254XXXXXXXXX)",
        variant: "destructive",
      })
      return
    }

    try {
      await signUp({
        nationalId: "temp_id", // Simplified for demo
        fullName: formData.fullName,
        userType: formData.userType,
        idDocumentType: "national_id" as const,
        phoneNumber: formData.phoneNumber,
        idDocumentFile: new File([""], "temp.jpg"), // Simplified for demo
      })

      toast({
        title: "Account created!",
        description: "You can now sign in with your phone number.",
      })
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-component">
      <div className="text-center space-tight">
        <h2 className="text-title">Create Account</h2>
        <p className="text-caption">Join Tenant Score today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-element">
        <div className="space-tight">
          <label className="block text-caption font-medium">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
            className="input-field"
            required
          />
        </div>

        <div className="space-tight">
          <label className="block text-caption font-medium">Phone Number</label>
          <input
            type="tel"
            placeholder="254712345678"
            value={formData.phoneNumber}
            onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
            className="input-field"
            required
          />
          <p className="text-micro">Your phone number will be used for verification</p>
        </div>

        <div className="space-tight">
          <label className="block text-caption font-medium">Account Type</label>
          <select
            value={formData.userType}
            onChange={(e) => setFormData((prev) => ({ ...prev, userType: e.target.value as "tenant" | "landlord" | "admin" }))}
            className="input-field"
            required
          >
            <option value="admin">Property Administrator</option>
            <option value="landlord">Landlord</option>
            <option value="tenant">Tenant</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="btn-primary"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  )
}
