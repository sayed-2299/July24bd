import { mockVictims } from "./mock-data"
import clientPromise from "./mongodb"

// Helper to determine if we should use mock data
export const useMockData = () => {
  return process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"
}

// Define types
interface Reporter {
  firstName: string
  lastName: string
  id: string
  email: string
  phone: string
  relationship: string
}

interface VictimData {
  victimId?: string
  firstName: string
  lastName: string
  nationalId: string
  image?: string
  dateOfBirth?: Date | string
  fatherName?: string
  motherName?: string
  district: string
  subDistrict: string
  address?: string
  familyMembers?: number
  economicCondition?: string
  profession?: string
  institutionName?: string
  status: string
  causeOfDeath?: string
  incidentPlace: string
  description?: string
  story?: string
  articles?: string[]
  verificationStatus?: string
  submissionDate?: Date
  reporter?: Reporter
}

// Victims data service
export const VictimsService = {
  // Get all victims
  getAll: async () => {
    if (useMockData()) {
      return mockVictims
    }

    try {
      const client = await clientPromise
      const db = client.db()
      return await db.collection("victims").find({}).toArray()
    } catch (error) {
      console.error("Error fetching victims:", error)
      return []
    }
  },

  // Get victims by status
  getByStatus: async (status: string) => {
    if (useMockData()) {
      return mockVictims.filter((victim) => victim.status === status)
    }

    try {
      const client = await clientPromise
      const db = client.db()
      return await db.collection("victims").find({ status }).toArray()
    } catch (error) {
      console.error(`Error fetching ${status} victims:`, error)
      return []
    }
  },

  // Get victim by ID
  getById: async (id: string) => {
    if (useMockData()) {
      return mockVictims.find((victim) => victim.victimId === id || victim._id === id)
    }

    try {
      const client = await clientPromise
      const db = client.db()
      return await db.collection("victims").findOne({
        $or: [{ _id: id }, { victimId: id }]
      })
    } catch (error) {
      console.error(`Error fetching victim ${id}:`, error)
      return null
    }
  },

  // Create a new victim
  create: async (victimData: any) => {
    if (useMockData()) {
      console.log("Mock create victim:", victimData)
      return {
        ...victimData,
        _id: `mock-${Date.now()}`,
        victimId: `VIC-2024-${mockVictims.length + 1}`,
        submissionDate: new Date().toISOString(),
        verificationStatus: "pending",
      }
    }

    try {
      const client = await clientPromise
      const db = client.db()
      
      // Get count for victim ID
      const count = await db.collection("victims").countDocuments()
      const victimId = `VIC-2024-${(count + 1).toString().padStart(3, "0")}`

      // Create new victim document
      const newVictim = {
        victimId,
        firstName: victimData.firstName || "",
        lastName: victimData.lastName || "",
        nationalId: victimData.nationalId || "",
        image: victimData.image || "",
        dateOfBirth: victimData.dateOfBirth ? new Date(victimData.dateOfBirth) : null,
        fatherName: victimData.fatherName || "",
        motherName: victimData.motherName || "",
        district: victimData.district || "",
        subDistrict: victimData.subDistrict || "",
        address: victimData.address || "",
        familyMembers: typeof victimData.familyMembers === "number" ? victimData.familyMembers : 0,
        economicCondition: victimData.economicCondition || "",
        profession: victimData.profession || "",
        institutionName: victimData.institutionName || "",
        status: victimData.status || "missing",
        causeOfDeath: victimData.causeOfDeath || "",
        incidentPlace: victimData.incidentPlace || "",
        description: victimData.description || "",
        story: victimData.story || "",
        articles: Array.isArray(victimData.articles) ? victimData.articles : [],
        verificationStatus: "pending",
        submissionDate: new Date(),
        reporter: victimData.reporter || {}
      }

      const result = await db.collection("victims").insertOne(newVictim)
      return { ...newVictim, _id: result.insertedId }
    } catch (error) {
      console.error("Error creating victim:", error)
      throw error
    }
  },
}

// Add other services (donations, articles, etc.) as needed
