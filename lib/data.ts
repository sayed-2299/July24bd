// Mock data for preview environment
export const mockVictims = [
  {
    _id: "1",
    victimId: "VIC-2024-001",
    firstName: "John",
    lastName: "Doe",
    // ... other fields
  },
  // ... more mock data
]

export async function getVictims(useRealData = true) {
  // If in preview or we explicitly want mock data, return mock data
  if (!useRealData || process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
    return mockVictims
  }

  // Otherwise try to fetch from the real API
  try {
    const response = await fetch("/api/victims")
    const data = await response.json()
    return data.success ? data.data : []
  } catch (error) {
    console.error("Error fetching victims:", error)
    return []
  }
}
