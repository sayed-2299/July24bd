import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import Nominee from "@/models/Nominee"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    
    // Get user email from cookie
    const userEmail = req.cookies.get("user_email")?.value

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      )
    }

    // Find user
    const user = await User.findOne({ email: userEmail })
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    // Verify user is a nominee
    if (user.role !== "nominee") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 }
      )
    }

    // Find nominee profile
    const nominee = await Nominee.findOne({ userId: user._id })
    if (!nominee) {
      return NextResponse.json(
        { success: false, error: "Nominee profile not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          status: user.status,
          profileCompleted: user.profileCompleted
        },
        nominee: nominee
      }
    })
  } catch (error) {
    console.error("Error fetching nominee profile:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch nominee profile" },
      { status: 500 }
    )
  }
} 