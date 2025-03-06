import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // In a real app, you would fetch stats from a database
  // This is just a mock implementation
  return NextResponse.json({
    users: 1024,
    orders: 256,
    revenue: 12480,
    activeSessions: 42,
  })
}

