import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const role = searchParams.get("role")
    const status = searchParams.get("status")

    const query: any = {}

    if (role) query.role = role
    if (status) query.status = status

    const users = await User.find(query).select("-password").sort({ createdAt: -1 })

    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("Starting user creation process...")
    await dbConnect()
    console.log("Database connected successfully")

    const body = await req.json()
    console.log("Received request body:", { ...body, password: "[REDACTED]" })

    const { fullName, email, username, password, role } = body

    // Validate required fields
    if (!fullName || !email || !username || !password) {
      console.log("Missing required fields:", { fullName: !!fullName, email: !!email, username: !!username, password: !!password })
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user already exists
    console.log("Checking for existing user...")
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      console.log("User already exists:", { email, username })
      return NextResponse.json(
        { success: false, error: "User with this email or username already exists" },
        { status: 400 }
      )
    }

    // Hash password
    console.log("Hashing password...")
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    console.log("Creating new user...")
    const userData = {
      fullName,
      email,
      username,
      password: hashedPassword,
      role: role || "donor",
      status: "active",
      profileCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    console.log("User data prepared:", { ...userData, password: "[REDACTED]" })

    // Force schema validation
    const user = new User(userData)
    await user.validate()
    await user.save()

    console.log("User created successfully:", { id: user._id, email: user.email })

    // Remove password from response
    const userResponse = user.toObject()
    delete userResponse.password

    return NextResponse.json({ success: true, data: userResponse })
  } catch (error) {
    console.error("Error creating user:", error)
    // Log the full error details
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to create user",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
