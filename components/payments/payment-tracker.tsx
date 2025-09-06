"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Smartphone, Search, CheckCircle, AlertCircle, Clock } from "lucide-react"

interface PaymentRecord {
  id: string
  transactionId: string
  amount: number
  phoneNumber: string
  date: string
  status: "pending" | "verified" | "failed"
  daysLate: number
}

// Mock payment data
const mockPayments: PaymentRecord[] = [
  {
    id: "1",
    transactionId: "QK7X8M9N2P",
    amount: 45000,
    phoneNumber: "254734567890",
    date: "2024-11-01",
    status: "verified",
    daysLate: 0,
  },
  {
    id: "2",
    transactionId: "RL8Y9N0Q3R",
    amount: 45000,
    phoneNumber: "254734567890",
    date: "2024-10-03",
    status: "verified",
    daysLate: 2,
  },
  {
    id: "3",
    transactionId: "SM9Z0P1R4S",
    amount: 45000,
    phoneNumber: "254734567890",
    date: "2024-09-01",
    status: "verified",
    daysLate: 0,
  },
]

export function PaymentTracker() {
  const [payments] = useState<PaymentRecord[]>(mockPayments)
  const [searchTransactionId, setSearchTransactionId] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const { toast } = useToast()

  const handleVerifyPayment = async () => {
    if (!searchTransactionId.trim()) {
      toast({
        title: "Transaction ID required",
        description: "Please enter a valid M-Pesa transaction ID",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)

    try {
      const response = await fetch("/api/mpesa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transactionId: searchTransactionId }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Payment verified",
          description: `Transaction ${searchTransactionId} has been verified and processed`,
        })
      } else {
        toast({
          title: "Verification failed",
          description: result.error || "Could not verify the transaction",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Payment Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5 text-green-600" />
            <span>M-Pesa Payment Verification</span>
          </CardTitle>
          <CardDescription>Verify M-Pesa payments manually using transaction ID</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="transactionId">M-Pesa Transaction ID</Label>
              <Input
                id="transactionId"
                placeholder="e.g., QK7X8M9N2P"
                value={searchTransactionId}
                onChange={(e) => setSearchTransactionId(e.target.value.toUpperCase())}
                maxLength={10}
              />
              <p className="text-sm text-gray-600 mt-1">Enter the 10-character transaction ID from M-Pesa SMS</p>
            </div>
            <div className="flex items-end">
              <Button onClick={handleVerifyPayment} disabled={isVerifying} className="bg-green-600 hover:bg-green-700">
                <Search className="h-4 w-4 mr-2" />
                {isVerifying ? "Verifying..." : "Verify Payment"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent M-Pesa Payments</CardTitle>
          <CardDescription>Automatically detected rent payments from M-Pesa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(payment.status)}
                  <div>
                    <div className="font-medium">KES {payment.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Transaction: {payment.transactionId}</div>
                    <div className="text-sm text-gray-600">From: {payment.phoneNumber}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={getStatusColor(payment.status) as any}>{payment.status}</Badge>
                  <div className="text-sm text-gray-600 mt-1">{new Date(payment.date).toLocaleDateString()}</div>
                  {payment.daysLate > 0 && <div className="text-sm text-orange-600">{payment.daysLate} days late</div>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* M-Pesa Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Pay Rent via M-Pesa</CardTitle>
          <CardDescription>Step-by-step instructions for tenants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <div className="font-medium">Open M-Pesa menu</div>
                <div className="text-gray-600">Dial *334# or use M-Pesa app</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <div className="font-medium">Select "Pay Bill"</div>
                <div className="text-gray-600">Choose option 4 for Pay Bill</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <div className="font-medium">Enter Business Number: 174379</div>
                <div className="text-gray-600">TenantScore paybill number</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                4
              </div>
              <div>
                <div className="font-medium">Enter Account Number</div>
                <div className="text-gray-600">Use your phone number (254XXXXXXXXX)</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                5
              </div>
              <div>
                <div className="font-medium">Enter Amount and PIN</div>
                <div className="text-gray-600">Enter your monthly rent amount and M-Pesa PIN</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
