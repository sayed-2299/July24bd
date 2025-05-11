import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Clear authentication cookies
    cookies().delete("auth_token")
    cookies().delete("is_admin")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging out:", error)
    return NextResponse.json({ success: false, error: "Failed to logout" }, { status: 500 })
  }
}
