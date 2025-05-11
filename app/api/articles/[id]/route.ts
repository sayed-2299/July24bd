import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Article from "@/models/Article"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const { id } = params
    const { status } = await req.json()

    // Update article status
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { 
        status,
        updatedAt: new Date()
      },
      { new: true }
    )

    if (!updatedArticle) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: updatedArticle })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update article status" },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const { id } = params

    const article = await Article.findById(id)
    if (!article) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: article })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch article" },
      { status: 500 }
    )
  }
} 