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

    // Find UNO user
    const uno = await User.findOne({ email: userEmail, role: "uno" })
    if (!uno) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 }
      )
    }

    // Get nominees in the same district and subdistrict
    const nominees = await Nominee.find({
      district: uno.district,
      subDistrict: uno.subDistrict,
      status: "pending"
    }).populate({
      path: "userId",
      select: "fullName email phone"
    }).populate({
      path: "victimId",
      select: "name age gender"
    })

    return NextResponse.json({
      success: true,
      data: nominees
    })
  } catch (error) {
    console.error("Error fetching nominees:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch nominees" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
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

    // Find UNO user
    const uno = await User.findOne({ email: userEmail, role: "uno" })
    if (!uno) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 }
      )
    }

    const { nomineeId, action, rejectionReason } = await req.json()

    if (!nomineeId || !action) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Find nominee
    const nominee = await Nominee.findOne({
      _id: nomineeId,
      district: uno.district,
      subDistrict: uno.subDistrict
    })

    if (!nominee) {
      return NextResponse.json(
        { success: false, error: "Nominee not found" },
        { status: 404 }
      )
    }

    // Update nominee verification status
    if (action === "verify") {
      nominee.unoVerification = {
        status: "verified",
        verifiedBy: uno._id,
        verifiedAt: new Date()
      }
      nominee.status = "uno-verified"
    } else if (action === "reject") {
      nominee.unoVerification = {
        status: "rejected",
        verifiedBy: uno._id,
        verifiedAt: new Date(),
        rejectionReason: rejectionReason || "Rejected by UNO"
      }
      nominee.status = "rejected"
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      )
    }

    await nominee.save()

    return NextResponse.json({
      success: true,
      data: nominee
    })
  } catch (error) {
    console.error("Error updating nominee:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update nominee" },
      { status: 500 }
    )
  }
} 