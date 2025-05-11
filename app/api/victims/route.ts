import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Victim from "@/models/Victim"
import { cookies } from "next/headers"
import User from "@/models/User"
import mongoose from "mongoose"
import cloudinary from "@/lib/cloudinary"

export async function GET(req: NextRequest) {
  try {
    console.log("Starting GET request for victims")
    
    await dbConnect()
    console.log("Database connected successfully")
    
    // Get user email from cookie
    const cookieStore = await cookies()
    const userEmail = cookieStore.get("user_email")?.value
    console.log("User email from cookie:", userEmail)

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    console.log("Requested status:", status)

    if (!status) {
      console.log("No status parameter provided")
      return NextResponse.json(
        { success: false, error: "Missing status parameter" },
        { status: 400 }
      )
    }

    let query: any = {}

    // If no user is logged in, only show admin-verified victims
    if (!userEmail) {
      query = {
        verificationStatus: "admin-verified"
      }
    } else {
      // Find user
      const user = await User.findOne({ email: userEmail })
      console.log("Found user:", user ? { email: user.email, role: user.role } : "Not found")

      if (!user) {
        console.log("User not found in database")
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        )
      }

      if (!user.role) {
        console.log("User has no role assigned")
        return NextResponse.json(
          { success: false, error: "User role not assigned" },
          { status: 400 }
        )
      }

      console.log("Building query for:", { status, role: user.role })

      // Build query based on role and status
      if (user.role === "uno") {
        if (!user.district || !user.subDistrict) {
          console.log("UNO user profile incomplete - missing district or sub-district")
          return NextResponse.json(
            { success: false, error: "UNO user profile incomplete" },
            { status: 400 }
          )
        }
        query = {
          district: user.district,
          subDistrict: user.subDistrict,
          verificationStatus: status === "verified" ? "uno-verified" : status
        }
      } else if (user.role === "admin") {
        // For admin users, show victims based on verification status
        if (status === "uno-verified") {
          // In pending tab, show only UNO-verified victims that need admin verification
          query = {
            verificationStatus: "uno-verified",
            "adminVerification.status": "pending"
          }
        } else if (status === "admin-verified") {
          // In verified tab, show admin-verified victims
          query = {
            verificationStatus: "admin-verified"
          }
        } else if (status === "rejected") {
          // In rejected tab, show rejected victims
          query = {
            verificationStatus: "rejected"
          }
        }
      } else {
        // Public can only see admin verified reports
        query = {
          verificationStatus: "admin-verified"
        }
      }
    }

    console.log("Final query:", JSON.stringify(query, null, 2))
    
    // First, check if there are any victims with this status
    const count = await Victim.countDocuments(query)
    console.log("Total victims found:", count)

    const victims = await Victim.find(query)
      .sort({ createdAt: -1 })
      .populate("unoVerification.verifiedBy", "fullName")
      .populate("adminVerification.verifiedBy", "fullName")
    
    console.log("Successfully fetched victims:", victims.length)
    
    // Log a sample victim if available
    if (victims.length > 0) {
      console.log("Sample victim data:", JSON.stringify(victims[0], null, 2))
    }

    return NextResponse.json({ success: true, data: victims })
  } catch (error) {
    console.error("Error in GET /api/victims:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch victims",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const formData = await req.formData()
    
    // Extract file data
    const victimImage = formData.get('victimImage') as File
    const supportingDocs = formData.getAll('supportingDocs') as File[]
    
    // Extract other form data
    const data = JSON.parse(formData.get('data') as string)
    
    // Log the incoming data
    console.log("Incoming API Data:", JSON.stringify(data, null, 2))
    
    // Validate required fields
    const requiredFields = [
      'fullName', 'nationalId', 'dateOfBirth', 'gender',
      'district', 'subDistrict', 'address', 'fatherName', 'motherName',
      'economicCondition', 'profession', 'status', 'incidentPlace', 'description'
    ]

    const missingFields = requiredFields.filter(field => !data[field])
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      )
    }

    // Validate applicant information
    if (!data.applicant) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing applicant information' 
        },
        { status: 400 }
      )
    }

    // Log applicant data
    console.log("Applicant Data:", JSON.stringify(data.applicant, null, 2))

    // Validate each applicant field
    const applicantFields = ['fullName', 'id', 'email', 'phone', 'relationship']
    const missingApplicantFields = applicantFields.filter(field => !data.applicant[field])
    
    if (missingApplicantFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required applicant fields: ${missingApplicantFields.join(', ')}` 
        },
        { status: 400 }
      )
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/
    if (!phoneRegex.test(data.applicant.phone)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid phone number format' 
        },
        { status: 400 }
      )
    }

    // Validate date format
    const birthDate = new Date(data.dateOfBirth)
    if (isNaN(birthDate.getTime())) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid date of birth format' 
        },
        { status: 400 }
      )
    }

    // Validate enum values
    const validGenders = ["male", "female", "other"]
    if (!validGenders.includes(data.gender)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid gender. Must be one of: ${validGenders.join(', ')}` 
        },
        { status: 400 }
      )
    }

    const validStatuses = ["deceased", "injured", "missing"]
    if (!validStatuses.includes(data.status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
        },
        { status: 400 }
      )
    }

    const validEconomicConditions = ["below-poverty", "lower-income", "middle-income", "upper-middle", "high-income"]
    if (!validEconomicConditions.includes(data.economicCondition)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid economic condition. Must be one of: ${validEconomicConditions.join(', ')}` 
        },
        { status: 400 }
      )
    }

    const validProfessions = ["student", "business", "service", "agriculture", "day-laborer", "housewife", "unemployed", "other"]
    if (!validProfessions.includes(data.profession)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid profession. Must be one of: ${validProfessions.join(', ')}` 
        },
        { status: 400 }
      )
    }
    
    // Upload victim image if provided
    let imageUrl = null
    if (victimImage) {
      const bytes = await victimImage.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "victims",
            resource_type: "auto"
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(buffer)
      })
      
      imageUrl = (result as any).secure_url
    }

    // Upload supporting documents if provided
    const uploadedDocs = []
    if (supportingDocs && supportingDocs.length > 0) {
      console.log("Processing supporting documents:", supportingDocs.length)
      for (const doc of supportingDocs) {
        try {
          console.log("Processing document:", doc.name, doc.type, doc.size)
          const bytes = await doc.arrayBuffer()
          const buffer = Buffer.from(bytes)
          
          // Upload to Cloudinary
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder: "victims/documents",
                resource_type: "auto"
              },
              (error, result) => {
                if (error) {
                  console.error("Cloudinary upload error:", error)
                  reject(error)
                } else {
                  console.log("Document uploaded successfully:", doc.name)
                  resolve(result)
                }
              }
            ).end(buffer)
          })
          
          uploadedDocs.push({
            name: doc.name,
            type: doc.type,
            url: (result as any).secure_url
          })
        } catch (error) {
          console.error("Error uploading document:", doc.name, error)
          throw new Error(`Failed to upload document ${doc.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
    }

    // Remove supportingDocuments from data if it exists
    if ('supportingDocuments' in data) {
      delete data.supportingDocuments;
    }
    // Create victim with image and document URLs
    const victimData = {
      ...data,
      image: imageUrl,
      supportingDocuments: uploadedDocs
    }

    // Generate victim ID
    const victimId = `V${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

    console.log("Creating victim with data:", JSON.stringify(victimData, null, 2))

    const victim = await Victim.create({
      ...victimData,
      victimId
    })

    console.log("Victim created successfully:", victim._id)

    return NextResponse.json({ 
      success: true, 
      data: victim 
    })
  } catch (error) {
    console.error("Error in POST /api/victims:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to create victim",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 