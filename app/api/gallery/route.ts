import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import GalleryItem from "@/models/GalleryItem"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const query = status ? { status } : {}

    const galleryItems = await GalleryItem.find(query).sort({ date: -1 })

    return NextResponse.json({ success: true, data: galleryItems })
  } catch (error) {
    console.error("Error fetching gallery items:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch gallery items" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()

    const galleryItem = await GalleryItem.create({
      ...body,
      status: "pending",
      date: new Date(),
    })

    return NextResponse.json({ success: true, data: galleryItem }, { status: 201 })
  } catch (error) {
    console.error("Error creating gallery item:", error)
    return NextResponse.json({ success: false, error: "Failed to create gallery item" }, { status: 500 })
  }
}
