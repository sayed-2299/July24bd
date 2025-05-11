import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Victim from "@/models/Victim"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import mongoose from "mongoose"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    const { status, rejectionReason } = await req.json()
    const victim = await Victim.findById(params.id)

    if (!victim) {
      return NextResponse.json({ success: false, error: "Victim not found" }, { status: 404 })
    }

    // Check user role and handle verification accordingly
    if (session.user.role === "uno") {
      // UNO can only verify victims in their district
      if (victim.district !== session.user.district || victim.subDistrict !== session.user.subDistrict) {
        return NextResponse.json(
          { success: false, error: "You can only verify victims in your assigned area" },
          { status: 403 }
        )
      }

      if (status === "uno-verified") {
        victim.verificationStatus = "uno-verified"
        victim.unoVerifiedBy = session.user.id
        victim.unoVerifiedAt = new Date()
      } else if (status === "rejected") {
        victim.verificationStatus = "rejected"
        victim.unoRejectionReason = rejectionReason
      }
    } else if (session.user.role === "admin") {
      // Admin can only verify victims that have been verified by UNO
      if (victim.verificationStatus !== "uno-verified") {
        return NextResponse.json(
          { success: false, error: "Victim must be verified by UNO first" },
          { status: 400 }
        )
      }

      if (status === "admin-verified") {
        victim.verificationStatus = "admin-verified"
        victim.verifiedBy = session.user.id
        victim.verifiedAt = new Date()
      } else if (status === "rejected") {
        victim.verificationStatus = "rejected"
        victim.rejectionReason = rejectionReason
      }
    } else {
      return NextResponse.json({ success: false, error: "Unauthorized role" }, { status: 403 })
    }

    await victim.save()
    return NextResponse.json({ success: true, data: victim })
  } catch (error) {
    console.error("Error updating victim:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update victim" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await context.params;
    let victim = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      victim = await Victim.findOne({ $or: [{ _id: id }, { victimId: id }] })
    } else {
      victim = await Victim.findOne({ victimId: id })
    }
    if (!victim) {
      return NextResponse.json(
        { success: false, error: "Victim not found" },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: victim })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch victim" },
      { status: 500 }
    )
  }
}
