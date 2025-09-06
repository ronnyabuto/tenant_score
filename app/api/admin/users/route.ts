import { type NextRequest, NextResponse } from "next/server"
import { getAllUsers, updateUserStatus } from "@/lib/auth"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 })
    }

    const admin = await verifyToken(token)
    if (!admin || admin.userType !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const users = await getAllUsers()

    return NextResponse.json({
      users: users.map((user) => ({
        id: user.tenantScoreId,
        name: user.name,
        userType: user.userType,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        lastActive: user.lastActive,
      })),
    })
  } catch (error) {
    console.error("User retrieval error:", error)
    return NextResponse.json({ error: "Failed to retrieve users" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const { userId, status, reason } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 })
    }

    const admin = await verifyToken(token)
    if (!admin || admin.userType !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    await updateUserStatus(userId, status, reason, admin.id)

    return NextResponse.json({ success: true, message: "User status updated" })
  } catch (error) {
    console.error("User update error:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
