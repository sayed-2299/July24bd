import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import FundApplication from "@/models/FundApplication"
import Fund from "@/models/Fund"
import { cookies } from "next/headers"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let session = await getServerSession(authOptions)
    let userId = session?.user?.id
    let userRole = session?.user?.role
    // Fallback: check for user_email cookie if session is not found
    if (!userId) {
      const cookieStore = cookies()
      const userEmail = cookieStore.get("user_email")?.value
      if (!userEmail) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
      }
      await dbConnect()
      const user = await (await import("@/models/User")).default.findOne({ email: userEmail })
      if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
      }
      userId = user._id.toString()
      userRole = user.role
    }

    const { status } = await req.json()
    await dbConnect()

    // Verify the application exists and belongs to the donor's fund
    const application = await FundApplication.findById(params.id)
    if (!application) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 })
    }

    const fund = await Fund.findById(application.fundId)
    if (!fund || fund.donorId.toString() !== userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Update application status
    const prevStatus = application.status;
    application.status = status;
    await application.save();

    // If approving and was not already approved, subtract from fund
    if (status === "approved" && prevStatus !== "approved") {
      fund.amount = Math.max(0, fund.amount - application.requestedAmount);
      await fund.save();
    }

    return NextResponse.json({ success: true, data: application })
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update application" },
      { status: 500 }
    )
  }
} 