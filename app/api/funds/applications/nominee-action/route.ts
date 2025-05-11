import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import FundApplication from "@/models/FundApplication"
import FundTransaction from "@/models/FundTransaction"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    let session = await getServerSession(authOptions)
    let userId = session?.user?.id
    let userRole = session?.user?.role
    if (!userId || userRole !== "nominee") {
      const cookieStore = cookies()
      const userEmail = cookieStore.get("user_email")?.value
      if (!userEmail) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
      }
      await dbConnect()
      const user = await (await import("@/models/User")).default.findOne({ email: userEmail })
      if (!user || user.role !== "nominee") {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
      }
      userId = user._id.toString()
    }

    const { applicationId, action, reportReason } = await req.json()
    if (!applicationId || !["received", "reported"].includes(action)) {
      return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
    }
    await dbConnect()
    const application = await FundApplication.findById(applicationId)
    if (!application) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 })
    }
    if (application.nomineeId.toString() !== userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    if (application.status !== "approved") {
      return NextResponse.json({ success: false, error: "Action not allowed in current status" }, { status: 400 })
    }

    // Create FundTransaction
    const transaction = await FundTransaction.create({
      fundId: application.fundId,
      applicationId: application._id,
      nomineeId: application.nomineeId,
      victimId: application.victimId,
      amount: application.requestedAmount,
      note: action === "reported" ? reportReason : application.note,
      status: action,
    })
    application.status = action
    application.transactionId = transaction._id
    await application.save()

    return NextResponse.json({ success: true, data: application })
  } catch (error) {
    console.error("Error in nominee-action:", error)
    return NextResponse.json({ success: false, error: "Failed to process action" }, { status: 500 })
  }
} 