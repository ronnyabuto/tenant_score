"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [step, setStep] = useState<"phone" | "verify">("phone")
  const { signIn, verifyPhone, isLoading } = useAuth()
  const { toast } = useToast()

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!phoneNumber.match(/^254[0-9]{9}$/)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid Kenyan phone number (254XXXXXXXXX)",
        variant: "destructive",
      })
      return
    }

    try {
      // In real implementation, this would send SMS
      setStep("verify")
      toast({
        title: "Verification code sent",
        description: "Please check your SMS for the verification code",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code",
        variant: "destructive",
      })
    }
  }

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const isValid = await verifyPhone(phoneNumber, verificationCode)
      if (isValid) {
        await signIn(phoneNumber)
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in",
        })
      } else {
        toast({
          title: "Invalid code",
          description: "Please check your verification code and try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {step === "phone" ? "Sign In" : "Enter Code"}
        </h2>
        <p className="text-gray-600 text-sm">
          {step === "phone" 
            ? "Enter your phone number to access the building" 
            : `Code sent to ${phoneNumber}`}
        </p>
      </div>

      {step === "phone" ? (
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              placeholder="254712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="ios-input"
              required
            />
            <p className="text-xs text-gray-500">Enter your Kenyan phone number starting with 254</p>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="ios-button w-full"
          >
            {isLoading ? "Sending..." : "Send Code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifySubmit} className="space-y-4">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Verification Code</label>
            <input
              type="text"
              placeholder="1234"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={4}
              className="ios-input text-center text-xl font-mono tracking-widest"
              required
            />
            <p className="text-xs text-gray-500 text-center">Enter the 4-digit code sent to your phone</p>
          </div>
          
          <div className="space-y-3">
            <button 
              type="submit" 
              disabled={isLoading}
              className="ios-button w-full"
            >
              {isLoading ? "Verifying..." : "Verify & Login"}
            </button>
            
            <button 
              type="button" 
              onClick={() => setStep("phone")}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium transition-all active:scale-95"
            >
              Change Phone Number
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
