import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Fund from "@/models/Fund"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    let session = await getServerSession(authOptions)
    let userId = session?.user?.id
    let donorName = session?.user?.name
    // Fallback: check for user_email cookie if session is not found
    if (!userId) {
      const cookieStore = await cookies()
      const allCookies = await cookieStore
      const userEmail = allCookies.get("user_email")?.value
      if (!userEmail) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
      }
      await dbConnect()
      const user = await (await import("@/models/User")).default.findOne({ email: userEmail })
      if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
      }
      userId = user._id.toString()
      donorName = user.fullName
    }

    const { title, amount, description } = await req.json()
    await dbConnect()

    const fund = await Fund.create({
      donorId: userId,
      donorName,
      title,
      amount,
      description
    })
    console.log('Created fund:', fund);

    return NextResponse.json({ success: true, data: fund })
  } catch (error) {
    console.error("Error creating fund:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create fund" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    let session = await getServerSession(authOptions)
    let userId = session?.user?.id
    if (!userId) {
      const cookieStore = await cookies()
      const allCookies = await cookieStore
      const userEmail = allCookies.get("user_email")?.value
      if (!userEmail) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
      }
      await dbConnect()
      const user = await (await import("@/models/User")).default.findOne({ email: userEmail })
      if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
      }
      userId = user._id.toString()
    }

    await dbConnect()
    const funds = await Fund.find().populate("donorId", "name")

    return NextResponse.json({ success: true, data: funds })
  } catch (error) {
    console.error("Error fetching funds:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch funds" },
      { status: 500 }
    )
  }
} 