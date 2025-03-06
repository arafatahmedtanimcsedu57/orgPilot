import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // In a real app, you would fetch activity from a database
  // This is just a mock implementation
  return NextResponse.json([
    {
      id: "1",
      description: "John Doe updated their profile",
      time: "2 hours ago",
      user: {
        id: "1",
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "2",
      description: "Jane Smith placed a new order",
      time: "3 hours ago",
      user: {
        id: "2",
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "3",
      description: "Bob Johnson registered a new account",
      time: "5 hours ago",
      user: {
        id: "3",
        name: "Bob Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "4",
      description: "Alice Williams updated their payment method",
      time: "1 day ago",
      user: {
        id: "4",
        name: "Alice Williams",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "5",
      description: "Charlie Brown submitted a support ticket",
      time: "2 days ago",
      user: {
        id: "5",
        name: "Charlie Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
  ])
}

