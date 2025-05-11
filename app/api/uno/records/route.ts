import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Nominee from "@/models/Nominee"
import User from "@/models/User"
import Victim from "@/models/Victim"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    
    // Get user email from cookie
    const userEmail = req.cookies.get("user_email")?.value

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      )
    }

    // First, get UNO's location
    const uno = await User.findOne({ email: userEmail, role: "uno" })
    if (!uno) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 }
      )
    }

    // Log UNO's location for debugging
    console.log("UNO Location:", {
      district: uno.district,
      subDistrict: uno.subDistrict
    })

    // Get query parameters
    const searchParams = req.nextUrl.searchParams
    const type = searchParams.get("type")
    const status = searchParams.get("status")

    if (!type || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 }
      )
    }

    let data
    if (type === "victims") {
      // Fetch victims in UNO's area with the requested status
      data = await Victim.find({
        district: uno.district,
        subDistrict: uno.subDistrict,
        verificationStatus: status
      });
    } else if (type === "nominees") {
      // First, get all nominees to check their locations
      const allNominees = await Nominee.find({})
      console.log("All Nominees:", allNominees.map(n => ({
        name: n.name,
        district: n.district,
        subDistrict: n.subDistrict
      })))

      // Then filter nominees by UNO's location
      data = allNominees.filter(nominee => 
        nominee.district === uno.district && 
        nominee.subDistrict === uno.subDistrict
      )

      console.log("Filtered Nominees:", data.map(n => ({
        name: n.name,
        district: n.district,
        subDistrict: n.subDistrict
      })))
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid record type" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      unoLocation: {
        district: uno.district,
        subDistrict: uno.subDistrict
      }
    })
  } catch (error) {
    console.error("Error fetching records:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch records" },
      { status: 500 }
    )
  }
} 