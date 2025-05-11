import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Donation from "@/models/Donation"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const donorId = searchParams.get("donorId")
    const recipientId = searchParams.get("recipientId")

    const query: any = {}

    if (status) query.status = status
    if (donorId) query.donorId = donorId
    if (recipientId) query.recipientId = recipientId

    const donations = await Donation.find(query).sort({ date: -1 })

    return NextResponse.json({ success: true, data: donations })
  } catch (error) {
    console.error("Error fetching donations:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch donations" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()

    const donation = await Donation.create({
      ...body,
      status: "pending",
      date: new Date(),
    })

    return NextResponse.json({ success: true, data: donation }, { status: 201 })
  } catch (error) {
    console.error("Error creating donation:", error)
    return NextResponse.json({ success: false, error: "Failed to create donation" }, { status: 500 })
  }
}
