import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Victim from "@/models/Victim"
import User from "@/models/User"
import mongoose from "mongoose"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Starting verification process...")
    
    // Get cookies from request headers
    const authToken = req.cookies.get("auth_token")?.value
    const userEmail = req.cookies.get("user_email")?.value

    console.log("Auth check:", { hasAuthToken: !!authToken, hasUserEmail: !!userEmail })

    if (!authToken || !userEmail) {
      console.log("Authentication failed - missing cookies")
      return NextResponse.json(
        { success: false, error: "Please login to verify victims" },
        { status: 401 }
      )
    }

    console.log("Connecting to database...")
    await dbConnect()
    console.log("Database connected successfully")

    // Find the user
    const user = await User.findOne({ email: userEmail })
    if (!user) {
      console.log("User not found")
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 401 }
      )
    }

    const data = await req.json()
    console.log("Request data:", data)
    const { status, rejectionReason } = data

    if (!status || !["uno-verified", "admin-verified", "rejected"].includes(status)) {
      console.log("Invalid status:", status)
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      )
    }

    console.log("Finding victim with ID:", params.id)
    const victim = await Victim.findById(params.id)
    if (!victim) {
      console.log("Victim not found")
      return NextResponse.json(
        { success: false, error: "Victim not found" },
        { status: 404 }
      )
    }
    console.log("Victim found:", victim.victimId)

    // Handle UNO verification
    if (user.role === "uno") {
      console.log("Processing UNO verification")
      // Check if victim is in UNO's district
      if (victim.district !== user.district || victim.subDistrict !== user.subDistrict) {
        return NextResponse.json(
          { success: false, error: "You can only verify victims in your assigned area" },
          { status: 403 }
        )
      }

      // Update UNO verification
      victim.verificationStatus = status
      victim.unoVerification = {
        status: status === "uno-verified" ? "verified" : status,
        verifiedBy: user._id,
        verifiedAt: new Date(),
        rejectionReason: status === "rejected" ? rejectionReason : undefined
      }
    }
    // Handle Admin verification
    else if (user.role === "admin") {
      console.log("Processing admin verification")
      // Check if UNO has verified first
      if (victim.verificationStatus !== "uno-verified") {
        console.log("UNO verification required first")
        return NextResponse.json(
          { success: false, error: "Victim report must be verified by UNO first" },
          { status: 400 }
        )
      }

      // Update admin verification
      victim.verificationStatus = status
      victim.adminVerification = {
        status: status === "admin-verified" ? "verified" : status,
        verifiedBy: new mongoose.Types.ObjectId(user._id),
        verifiedAt: new Date(),
        rejectionReason: status === "rejected" ? rejectionReason : undefined
      }
    } else {
      return NextResponse.json(
        { success: false, error: "Unauthorized role" },
        { status: 403 }
      )
    }

    console.log("Saving victim document...")
    await victim.save()
    console.log("Victim document saved successfully")

    return NextResponse.json({ success: true, data: victim })
  } catch (error) {
    console.error("Error updating victim:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update victim" },
      { status: 500 }
    )
  }
} 