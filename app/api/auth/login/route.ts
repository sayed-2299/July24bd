import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    console.log("Starting login process...")
    await dbConnect()
    console.log("Database connected successfully")

    const { email, password } = await req.json()
    console.log("Attempting login for email:", email)

    // Find user by email
    const user = await User.findOne({ email })
    console.log("User lookup result:", user ? "User found" : "User not found")

    if (!user) {
      console.log("Login failed: User not found")
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    // Check if user is active
    console.log("User status:", user.status)
    if (user.status !== "active") {
      console.log("Login failed: Account is not active")
      return NextResponse.json({ success: false, error: "Account is not active" }, { status: 401 })
    }

    // Check password
    console.log("Verifying password...")
    const isMatch = await bcrypt.compare(password, user.password)
    console.log("Password verification result:", isMatch ? "Password correct" : "Password incorrect")

    if (!isMatch) {
      console.log("Login failed: Invalid password")
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()
    console.log("Last login updated")

    // Create response with cookies
    const response = NextResponse.json({
      success: true,
      data: {
        user: user.toObject()
      }
    })

    // Set cookies for authentication
    response.cookies.set("auth_token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    response.cookies.set("user_email", user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    if (user.role === "admin") {
      response.cookies.set("is_admin", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })
    }
    console.log("Authentication cookies set")

    console.log("Login successful for user:", user.email)
    return response
  } catch (error) {
    console.error("Error logging in:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to login",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
