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
    <div className="ios-space-md">
      <div className="text-center ios-space-xs">
        <h2 className="ios-title">
          {step === "phone" ? "Sign In" : "Enter Code"}
        </h2>
        <p className="ios-caption">
          {step === "phone" 
            ? "Enter your phone number" 
            : `Code sent to ${phoneNumber}`}
        </p>
      </div>

      {step === "phone" ? (
        <form onSubmit={handlePhoneSubmit} className="ios-space-sm">
          <div className="ios-space-xs">
            <label className="block ios-caption font-medium">Phone Number</label>
            <input
              type="tel"
              placeholder="254712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="ios-input"
              required
            />
            <p className="ios-micro">Enter your Kenyan phone number starting with 254</p>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="ios-button"
          >
            {isLoading ? "Sending..." : "Send Code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifySubmit} className="ios-space-sm">
          <div className="ios-space-xs">
            <label className="block ios-caption font-medium">Verification Code</label>
            <input
              type="text"
              placeholder="1234"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={4}
              className="ios-input text-center text-xl font-mono tracking-widest"
              required
            />
            <p className="ios-micro text-center">Enter the 4-digit code sent to your phone</p>
          </div>
          
          <div className="ios-space-xs">
            <button 
              type="submit" 
              disabled={isLoading}
              className="ios-button"
            >
              {isLoading ? "Verifying..." : "Verify & Sign In"}
            </button>
            
            <button 
              type="button" 
              onClick={() => setStep("phone")}
              className="ios-button-secondary"
            >
              Change Phone Number
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
