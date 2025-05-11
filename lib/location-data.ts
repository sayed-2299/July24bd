export const districts = [
  "Dhaka",
  "Chittagong",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
] as const

export const subDistricts: Record<string, readonly string[]> = {
  Dhaka: ["Dhamrai", "Dohar", "Keraniganj", "Nawabganj", "Savar", "Tejgaon"],
  Chittagong: ["Anwara", "Banshkhali", "Boalkhali", "Chandanaish", "Fatikchhari", "Hathazari"],
  Rajshahi: ["Bagha", "Bagmara", "Charghat", "Durgapur", "Godagari", "Mohanpur"],
  // Add more sub-districts for other districts
} as const
