import { type NextRequest, NextResponse } from "next/server"
import { createUser, hashPassword } from "@/lib/auth"
import { encryptSensitiveData } from "@/lib/encryption"

export async function POST(request: NextRequest) {
  try {
    const { nationalId, passportNumber, name, phoneNumber, password, userType, idDocument } = await request.json()

    if (!nationalId && !passportNumber) {
      return NextResponse.json({ error: "National ID or Passport Number is required" }, { status: 400 })
    }

    if (!name || !phoneNumber || !password || !userType) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Encrypt sensitive data
    const encryptedId = encryptSensitiveData(nationalId || passportNumber)
    const hashedPassword = await hashPassword(password)

    const user = await createUser({
      nationalId: nationalId || passportNumber,
      encryptedId,
      name,
      phoneNumber,
      password: hashedPassword,
      userType,
      idDocument,
    })

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Please verify your phone number.",
      tenantScoreId: user.tenantScoreId,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Account creation failed" }, { status: 500 })
  }
}
