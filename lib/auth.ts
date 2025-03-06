import { cookies } from "next/headers"
import { jwtDecode } from "jwt-decode"

export type User = {
  login: string
  permissions: string[]
}

export type Session = {
  user: User
}

export async function getServerSession(): Promise<Session | null> {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    return null
  }

  try {
    const decoded: any = jwtDecode(token)

    // Check if the token is expired
    const currentTime = Date.now() / 1000
    if (decoded.exp && decoded.exp < currentTime) {
      return null
    }

    return {
      user: {
        login: decoded.sub || "",
        permissions: decoded.permissions || [],
      },
    }
  } catch (error) {
    console.error("Error decoding token:", error)
    return null
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession()
  return session !== null
}

