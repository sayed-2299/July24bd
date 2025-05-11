import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Article from "@/models/Article"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")

    // Build query based on status
    const query = status ? { status } : { status: "approved" }

    const articles = await Article.find(query).sort({ createdAt: -1 })

    return NextResponse.json({ success: true, data: articles })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch articles" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const data = await req.json()
    
    // Count existing articles to generate new ID
    const count = await Article.countDocuments()
    const articleId = `ART-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`

    // Create new article with pending status
    const article = await Article.create({
      ...data,
      articleId,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    return NextResponse.json({ success: true, data: article })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create article" },
      { status: 500 }
    )
  }
}
