import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // In a real app, you would fetch user data from a database
  // This is just a mock implementation
  return NextResponse.json({
    id: "1",
    name: "John Doe",
    email: "user@example.com",
    bio: "Software developer with a passion for building great products.",
    website: "https://johndoe.com",
    avatar: "/placeholder.svg?height=40&width=40",
  })
}

export async function PUT(request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, email, bio, website } = body

    // In a real app, you would update user data in a database
    // This is just a mock implementation
    return NextResponse.json({
      id: "1",
      name,
      email,
      bio,
      website,
      avatar: "/placeholder.svg?height=40&width=40",
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

