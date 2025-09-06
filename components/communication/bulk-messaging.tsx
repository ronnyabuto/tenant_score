"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"

interface BulkMessagingProps {
  onBack: () => void
}

export default function BulkMessaging({ onBack }: BulkMessagingProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center text-blue-600 font-medium"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Bulk Messaging</h1>
            <div className="w-12"></div>
          </div>
        </div>
      </div>
      
      <div className="max-w-md mx-auto px-4 py-6">
        <p className="text-gray-600">Bulk messaging functionality coming soon...</p>
      </div>
    </div>
  )
}