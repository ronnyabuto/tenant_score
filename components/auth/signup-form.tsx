"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Upload, Camera, Shield } from "lucide-react"

export function SignupForm() {
  const [formData, setFormData] = useState({
    nationalId: "",
    fullName: "",
    userType: "" as "tenant" | "landlord" | "admin" | "",
    idDocumentType: "" as "national_id" | "passport" | "",
    phoneNumber: "",
    email: "",
  })

  const [idDocumentFile, setIdDocumentFile] = useState<File | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [step, setStep] = useState(1) // Multi-step form

  const { signUp, isLoading } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nationalId || formData.nationalId.length < 7) {
      toast({
        title: "Invalid ID Number",
        description: "Please enter a valid National ID or Passport Number",
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

    if (!formData.userType || !formData.idDocumentType) {
      toast({
        title: "Missing information",
        description: "Please complete all required fields",
        variant: "destructive",
      })
      return
    }

    if (!idDocumentFile) {
      toast({
        title: "ID Document Required",
        description: "Please upload a clear photo of your ID or Passport",
        variant: "destructive",
      })
      return
    }

    try {
      await signUp({
        nationalId: formData.nationalId,
        fullName: formData.fullName,
        userType: formData.userType,
        idDocumentType: formData.idDocumentType,
        phoneNumber: formData.phoneNumber,
        idDocumentFile,
        selfieFile: selfieFile || undefined,
        email: formData.email || undefined,
      })

      toast({
        title: "Account created!",
        description: "Your account is under review. You'll receive an SMS when verified.",
      })
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = (file: File, type: "id" | "selfie") => {
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    if (type === "id") {
      setIdDocumentFile(file)
    } else {
      setSelfieFile(file)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-green-600">Join TenantScore</CardTitle>
        <CardDescription>Create your secure account with government ID verification</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationalId" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              National ID / Passport Number
            </Label>
            <Input
              id="nationalId"
              type="text"
              placeholder="12345678 or A1234567"
              value={formData.nationalId}
              onChange={(e) => setFormData((prev) => ({ ...prev, nationalId: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idDocumentType">ID Document Type</Label>
            <Select
              onValueChange={(value: "national_id" | "passport") =>
                setFormData((prev) => ({ ...prev, idDocumentType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="national_id">National ID</SelectItem>
                <SelectItem value="passport">Passport</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="254712345678"
              value={formData.phoneNumber}
              onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userType">I am a</Label>
            <Select
              onValueChange={(value: "tenant" | "landlord" | "admin") =>
                setFormData((prev) => ({ ...prev, userType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tenant">Tenant</SelectItem>
                <SelectItem value="landlord">Landlord</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload ID Document *
            </Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file, "id")
              }}
              required
            />
            {idDocumentFile && <p className="text-sm text-green-600">✓ {idDocumentFile.name}</p>}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Upload Selfie (Optional)
            </Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file, "selfie")
              }}
            />
            {selfieFile && <p className="text-sm text-green-600">✓ {selfieFile.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Your ID information is encrypted and stored securely in compliance with Kenya's Data Protection Act (2019)
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
