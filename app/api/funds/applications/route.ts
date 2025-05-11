import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import FundApplication from "@/models/FundApplication"
import Fund from "@/models/Fund"
import { cookies } from "next/headers"

export async function GET(req: NextRequest) {
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

    await dbConnect()

    let applications
    if (userRole === "donor") {
      // For donors, get applications for their funds
      const funds = await Fund.find({ donorId: userId })
      const fundIds = funds.map(fund => fund._id)
      applications = await FundApplication.find({ fundId: { $in: fundIds } })
        .populate({
          path: "nomineeId",
          select: "name nid phone"
        })
        .populate("victimId", "fullName victimId")
        .populate("fundId", "title amount")

      // Manual lookup for extra nominee fields
      const Nominee = (await import("@/models/Nominee")).default;
      for (const app of applications) {
        if (app.nomineeId && app.nomineeId._id) {
          let nomineeProfile = await Nominee.findOne({ userId: app.nomineeId._id });
          if (nomineeProfile) {
            nomineeProfile = nomineeProfile.toObject();
            app.nomineeId.name = nomineeProfile.name || app.nomineeId.name || app.nomineeId.fullName || "N/A";
            app.nomineeId.nid = nomineeProfile.nid || app.nomineeId.nid || "N/A";
            app.nomineeId.relationship = nomineeProfile.relationship || "N/A";
            app.nomineeId.district = nomineeProfile.district || "N/A";
            app.nomineeId.subDistrict = nomineeProfile.subDistrict || "N/A";
            app.nomineeId.email = nomineeProfile.email || app.nomineeId.email || "N/A";
            app.nomineeId.address = nomineeProfile.address || app.nomineeId.address || "N/A";
            app.nomineeId.phone = nomineeProfile.phone || app.nomineeId.phone || "N/A";
          } else {
            app.nomineeId.name = app.nomineeId.name || app.nomineeId.fullName || "N/A";
            app.nomineeId.nid = app.nomineeId.nid || "N/A";
            app.nomineeId.relationship = app.nomineeId.relationship || "N/A";
            app.nomineeId.district = app.nomineeId.district || "N/A";
            app.nomineeId.subDistrict = app.nomineeId.subDistrict || "N/A";
            app.nomineeId.email = app.nomineeId.email || "N/A";
            app.nomineeId.address = app.nomineeId.address || "N/A";
            app.nomineeId.phone = app.nomineeId.phone || "N/A";
          }
        }
      }
    } else if (userRole === "nominee") {
      // For nominees, get their applications
      applications = await FundApplication.find({ nomineeId: userId })
        .populate("fundId", "title amount donorId")
        .populate("fundId.donorId", "name")
    }

    console.log('DEBUG FINAL APPLICATIONS:', JSON.stringify(applications, null, 2));
    return NextResponse.json({ success: true, data: applications })
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch applications" },
      { status: 500 }
    )
  }
} 