import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // In a real app, you would create a user in the database
    // This is just a mock implementation to match the expected response format
    const mockToken =
      "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhcmFmYXQuY3NlZHUuNTdAZ21haWwuY29tIiwiaWF0IjoxNzQwOTM5MTE0LCJleHAiOjE3NDEwMjU1MTR9.zGDe3YxYMXnfA23E8omgXcNg7I8l5cipP5AtsG66SrrU4kwPZ65Po-YLDa7dFnG9tpRzJgd0qjzSEfZcZg0WKw"

    const response = NextResponse.json({
      success: true,
      message: "User registered successfully",
      data: {
        token: mockToken,
        permissions: [],
      },
    })

    response.cookies.set({
      name: "auth-token",
      value: mockToken,
      httpOnly: true,
      path: "/",
    })

    return response
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        data: null,
      },
      { status: 500 },
    )
  }
}

