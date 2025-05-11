import { NextResponse } from "next/server"

// This is a mock data structure. In a real application, this would come from a database
const DISTRICTS_AND_SUBDISTRICTS = {
  "Dhaka": ["Dhaka North", "Dhaka South", "Gazipur", "Narayanganj", "Narsingdi"],
  "Chittagong": ["Chittagong", "Cox's Bazar", "Rangamati", "Bandarban", "Khagrachari"],
  "Rajshahi": ["Rajshahi", "Natore", "Naogaon", "Chapainawabganj", "Pabna"],
  "Khulna": ["Khulna", "Bagerhat", "Satkhira", "Jessore", "Magura"],
  "Barishal": ["Barishal", "Bhola", "Pirojpur", "Barguna", "Patuakhali"],
  "Sylhet": ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  "Rangpur": ["Rangpur", "Dinajpur", "Kurigram", "Gaibandha", "Nilphamari"],
  "Mymensingh": ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"]
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: DISTRICTS_AND_SUBDISTRICTS
    })
  } catch (error) {
    console.error("Error fetching locations:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch locations" },
      { status: 500 }
    )
  }
} 