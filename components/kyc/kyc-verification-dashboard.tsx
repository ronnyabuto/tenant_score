"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Shield, Phone, Upload, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"

interface KYCStatus {
  documentVerification: "pending" | "verified" | "rejected"
  phoneVerification: "pending" | "verified" | "rejected"
  overallStatus: "pending" | "verified" | "rejected"
  rejectionReason?: string
  verifiedAt?: string
}

export function KYCVerificationDashboard() {
  const [kycStatus, setKycStatus] = useState<KYCStatus>({
    documentVerification: "pending",
    phoneVerification: "pending",
    overallStatus: "pending",
  })
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load KYC status from API
    loadKYCStatus()
  }, [])

  const loadKYCStatus = async () => {
    try {
      // Mock API call - replace with actual API
      const mockStatus: KYCStatus = {
        documentVerification: "verified",
        phoneVerification: "pending",
        overallStatus: "pending",
      }
      setKycStatus(mockStatus)
    } catch (error) {
      console.error("Failed to load KYC status:", error)
    }
  }

  const sendOTP = async () => {
    if (!phoneNumber.match(/^254[0-9]{9}$/)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid Kenyan phone number (254XXXXXXXXX)",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Mock API call to send OTP
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsOtpSent(true)
      toast({
        title: "OTP Sent",
        description: "Please check your SMS for the verification code",
      })
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOTP = async () => {
    if (otpCode.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Mock API call to verify OTP
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setKycStatus((prev) => ({
        ...prev,
        phoneVerification: "verified",
        overallStatus: prev.documentVerification === "verified" ? "verified" : "pending",
        verifiedAt: prev.documentVerification === "verified" ? new Date().toISOString() : undefined,
      }))

      toast({
        title: "Phone Verified",
        description: "Your phone number has been successfully verified",
      })
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Invalid OTP code. Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: "pending" | "verified" | "rejected") => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: "pending" | "verified" | "rejected") => {
    const variants = {
      verified: "default",
      rejected: "destructive",
      pending: "secondary",
    } as const

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-2">KYC Verification</h1>
        <p className="text-gray-600">Complete your identity verification to access all TenantScore features</p>
      </div>

      {/* Overall Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-green-600" />
            <span>Verification Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(kycStatus.overallStatus)}
              <div>
                <div className="font-semibold">
                  {kycStatus.overallStatus === "verified"
                    ? "Fully Verified"
                    : kycStatus.overallStatus === "rejected"
                      ? "Verification Failed"
                      : "Verification In Progress"}
                </div>
                <div className="text-sm text-gray-600">
                  {kycStatus.verifiedAt && `Verified on ${new Date(kycStatus.verifiedAt).toLocaleDateString()}`}
                </div>
              </div>
            </div>
            {getStatusBadge(kycStatus.overallStatus)}
          </div>

          {kycStatus.rejectionReason && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Rejection Reason:</span>
              </div>
              <p className="text-sm text-red-700 mt-1">{kycStatus.rejectionReason}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents">Document Verification</TabsTrigger>
          <TabsTrigger value="phone">Phone Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Identity Documents</span>
                {getStatusIcon(kycStatus.documentVerification)}
              </CardTitle>
              <CardDescription>Upload clear photos of your government-issued ID for verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium">National ID / Passport</p>
                  <p className="text-xs text-gray-500 mt-1">Front side, clear and readable</p>
                  {kycStatus.documentVerification === "verified" && (
                    <div className="mt-2">
                      <CheckCircle className="h-6 w-6 text-green-600 mx-auto" />
                      <p className="text-xs text-green-600 mt-1">Document verified</p>
                    </div>
                  )}
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium">Selfie with ID</p>
                  <p className="text-xs text-gray-500 mt-1">Hold your ID next to your face</p>
                  {kycStatus.documentVerification === "verified" && (
                    <div className="mt-2">
                      <CheckCircle className="h-6 w-6 text-green-600 mx-auto" />
                      <p className="text-xs text-green-600 mt-1">Selfie verified</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Document Requirements:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Clear, high-resolution photos</li>
                  <li>• All text must be readable</li>
                  <li>• No glare or shadows</li>
                  <li>• Document must be valid and not expired</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phone" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Phone Number Verification</span>
                {getStatusIcon(kycStatus.phoneVerification)}
              </CardTitle>
              <CardDescription>
                Verify your phone number to secure your account and receive important notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {kycStatus.phoneVerification === "verified" ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-800">Phone Number Verified</h3>
                  <p className="text-green-600">Your phone number has been successfully verified</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {!isOtpSent ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="254712345678"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                      <Button onClick={sendOTP} disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700">
                        {isLoading ? "Sending..." : "Send Verification Code"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="otp">Enter Verification Code</Label>
                        <div className="flex justify-center mt-2">
                          <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        <p className="text-sm text-gray-500 text-center mt-2">Code sent to {phoneNumber}</p>
                      </div>
                      <div className="space-y-2">
                        <Button
                          onClick={verifyOTP}
                          disabled={isLoading || otpCode.length !== 6}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          {isLoading ? "Verifying..." : "Verify Code"}
                        </Button>
                        <Button variant="outline" onClick={() => setIsOtpSent(false)} className="w-full">
                          Change Phone Number
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
