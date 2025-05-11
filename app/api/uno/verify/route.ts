import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Victim from "@/models/Victim"
import Nominee from "@/models/Nominee"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    
    // Get user email from cookie
    const cookieStore = cookies()
    const userEmail = cookieStore.get("user_email")?.value

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      )
    }

    // Get request data
    const { type, id, action, reason } = await req.json()

    // Find UNO user
    const user = await User.findOne({ email: userEmail, role: "uno" })
    if (!user) {
      return NextResponse.json(
        { success: false, error: "UNO not found" },
        { status: 404 }
      )
    }

    // Update record based on type and action
    let record
    if (type === "nominee") {
      record = await Nominee.findById(id)
    } else {
      record = await Victim.findById(id)
    }

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Record not found" },
        { status: 404 }
      )
    }

    // Verify record belongs to UNO's jurisdiction
    if (record.subDistrict !== user.subDistrict || record.district !== user.district) {
      return NextResponse.json(
        { success: false, error: "Record does not belong to your jurisdiction" },
        { status: 403 }
      )
    }

    // Update record status
    const status = action === "approve" ? "verified" : "rejected"
    const updateData: any = {
      status,
      verifiedBy: user._id,
      verifiedAt: new Date()
    }

    if (action === "reject" && reason) {
      updateData.rejectionReason = reason
    }

    if (type === "nominee") {
      record = await Nominee.findByIdAndUpdate(id, updateData, { new: true })
    } else {
      record = await Victim.findByIdAndUpdate(id, updateData, { new: true })
    }

    return NextResponse.json({ success: true, data: record })
  } catch (error) {
    console.error("Error verifying record:", error)
    return NextResponse.json(
      { success: false, error: "Failed to verify record" },
      { status: 500 }
    )
  }
} 