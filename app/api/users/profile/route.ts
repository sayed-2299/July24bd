import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import Donor from "@/models/Donor"
import Nominee from "@/models/Nominee"

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const data = await req.json()
    
    // Get user email from cookie
    const userEmail = req.cookies.get("user_email")?.value

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      )
    }

    // Find user
    const user = await User.findOne({ email: userEmail })
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    // Validate required fields
    const requiredFields = ["fullName", "phone", "nid", "district", "subDistrict"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Update user profile
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      {
        role: data.role,
        fullName: data.fullName,
        phone: data.phone,
        district: data.district,
        subDistrict: data.subDistrict,
        address: data.address || "",
        nid: data.nid,
        profileCompleted: true
      },
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "Failed to update user profile" },
        { status: 500 }
      )
    }

    // If user is a donor, create/update donor profile
    if (data.role === "donor") {
      const donorData = {
        donorType: data.donorType,
        name: data.fullName,
        identificationNumber: data.nid,
        phone: data.phone,
        district: data.district,
        subDistrict: data.subDistrict,
        status: "active"
      }

      // Add organization fields only if donor type is organization
      if (data.donorType === "organization") {
        if (!data.organizationName || !data.registrationNo) {
          return NextResponse.json(
            { success: false, error: "Organization name and registration number are required for organization donors" },
            { status: 400 }
          )
        }
        Object.assign(donorData, {
          organizationName: data.organizationName,
          registrationNo: data.registrationNo
        })
      }

      const donor = await Donor.findOneAndUpdate(
        { userId: user._id },
        donorData,
        { upsert: true, new: true }
      )

      if (!donor) {
        return NextResponse.json(
          { success: false, error: "Failed to update donor profile" },
          { status: 500 }
        )
      }
    }

    // If user is a nominee, create/update nominee profile
    if (data.role === "nominee") {
      // Validate nominee-specific required fields
      if (!data.victimId || !data.relationship) {
        return NextResponse.json(
          { success: false, error: "Victim ID and relationship are required for nominees" },
          { status: 400 }
        )
      }

      if (!data.bankDetails?.fullName || !data.bankDetails?.accountNo || !data.bankDetails?.branchName) {
        return NextResponse.json(
          { success: false, error: "Bank details (full name, account number, and branch name) are required for nominees" },
          { status: 400 }
        )
      }

      const nomineeData = {
        name: data.fullName,
        nid: data.nid,
        phone: data.phone,
        email: userEmail,
        district: data.district,
        subDistrict: data.subDistrict,
        victimId: data.victimId,
        relationship: data.relationship,
        bankDetails: {
          fullName: data.bankDetails.fullName,
          accountNo: data.bankDetails.accountNo,
          branchName: data.bankDetails.branchName,
          mobileProvider: data.bankDetails.mobileProvider || undefined,
          mobileAccountNo: data.bankDetails.mobileAccountNo || undefined
        },
        status: "pending"
      }

      const nominee = await Nominee.findOneAndUpdate(
        { userId: user._id },
        nomineeData,
        { upsert: true, new: true }
      )

      if (!nominee) {
        return NextResponse.json(
          { success: false, error: "Failed to update nominee profile" },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ success: true, data: updatedUser })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    )
  }
}

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

    const user = await User.findOne({ email: userEmail }).select("-password")
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    // If user is a nominee, fetch nominee profile
    if (user.role === "nominee") {
      const nominee = await Nominee.findOne({ userId: user._id })
      return NextResponse.json({ success: true, data: { ...user.toObject(), nominee } })
    }

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
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

    const updates = await req.json()
    
    // Only allow updating specific fields
    const allowedUpdates = ["fullName", "phone", "address"]
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {} as Record<string, any>)

    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { $set: filteredUpdates },
      { new: true }
    ).select("-password")

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    )
  }
} 