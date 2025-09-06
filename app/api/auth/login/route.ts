import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { nationalId, phoneNumber, password } = await request.json()

    if (!nationalId || !password) {
      return NextResponse.json({ error: "National ID and password are required" }, { status: 400 })
    }

    const user = await authenticateUser(nationalId, password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = generateToken(user.id)

    return NextResponse.json({
      success: true,
      user: {
        id: user.tenantScoreId,
        nationalId: user.nationalId,
        name: user.name,
        userType: user.userType,
        phoneNumbers: user.phoneNumbers,
        isVerified: user.isVerified,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
