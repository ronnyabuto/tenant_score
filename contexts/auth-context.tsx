"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type AuthState, authService } from "@/lib/auth"

interface AuthContextType extends AuthState {
  signIn: (phoneNumber: string) => Promise<void>
  signUp: (data: {
    nationalId: string
    fullName: string
    userType: "tenant" | "landlord" | "admin"
    idDocumentType: "national_id" | "passport"
    phoneNumber: string
    idDocumentFile: File
    selfieFile?: File
    email?: string
  }) => Promise<void>
  signOut: () => Promise<void>
  verifyPhone: (phoneNumber: string, code: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    const user = authService.getCurrentUser()
    setState({
      user,
      isLoading: false,
      isAuthenticated: !!user,
    })
  }, [])

  const signIn = async (phoneNumber: string) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const user = await authService.signIn(phoneNumber)
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const signUp = async (data: {
    nationalId: string
    fullName: string
    userType: "tenant" | "landlord" | "admin"
    idDocumentType: "national_id" | "passport"
    phoneNumber: string
    idDocumentFile: File
    selfieFile?: File
    email?: string
  }) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const user = await authService.signUp({
        phoneNumber: data.phoneNumber,
        fullName: data.fullName,
        userType: data.userType,
        idNumber: data.nationalId,
        email: data.email,
      })
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const signOut = async () => {
    await authService.signOut()
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  const verifyPhone = async (phoneNumber: string, code: string) => {
    return await authService.verifyPhone(phoneNumber, code)
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        verifyPhone,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
