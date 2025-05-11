import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Nominee from "@/models/Nominee"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const query = status ? { verificationStatus: status } : {}

    const nominees = await Nominee.find(query).sort({ submissionDate: -1 })

    return NextResponse.json({ success: true, data: nominees })
  } catch (error) {
    console.error("Error fetching nominees:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch nominees" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()

    const nominee = await Nominee.create({
      ...body,
      verificationStatus: "pending",
    })

    return NextResponse.json({ success: true, data: nominee }, { status: 201 })
  } catch (error) {
    console.error("Error creating nominee:", error)
    return NextResponse.json({ success: false, error: "Failed to create nominee" }, { status: 500 })
  }
}
