"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Search } from "lucide-react"
import { CardContent } from "@/components/ui/card"

interface Victim {
  _id: string
  victimId: string
  fullName: string
  age: number
  gender: string
  nationalId: string
  district: string
  subDistrict: string
  status: "deceased" | "injured" | "missing"
  createdAt: string
  description?: string
  image?: string
  address?: string
  familyMembers?: number
  dateOfBirth?: string
  fatherName?: string
  motherName?: string
  economicCondition?: string
  profession?: string
  institutionName?: string
  causeOfDeath?: string
  causeOfInjury?: string
  incidentPlace?: string
  supportingDocuments?: Array<{
    name: string
    type: string
    url: string
  }>
  verificationStatus: "pending" | "uno-verified" | "admin-verified" | "rejected"
  unoVerification: {
    status: "pending" | "verified" | "rejected"
    verifiedBy?: {
      fullName: string
    }
    verifiedAt?: string
    rejectionReason?: string
  }
  adminVerification: {
    status: "pending" | "verified" | "rejected"
    verifiedBy?: {
      fullName: string
    }
    verifiedAt?: string
    rejectionReason?: string
  }
  applicant: {
    fullName: string
    id: string
    email: string
    phone: string
    relationship: string
  }
}

export default function VictimsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSections, setExpandedSections] = useState({
    deceased: false,
    injured: false,
    missing: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [victims, setVictims] = useState<Victim[]>([])

  useEffect(() => {
    fetchVictims()
  }, [])

  const fetchVictims = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching verified victims for public view")
      
      const response = await fetch("/api/victims?status=admin-verified")
      const data = await response.json()
      
      console.log("API Response:", data)
      
      if (data.success) {
        setVictims(data.data)
      } else {
        console.error("Failed to fetch victims:", data.error)
      }
    } catch (error) {
      console.error("Error fetching victims:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterVictims = (victims: Victim[], status: string) => {
    return victims.filter(
      (victim) =>
        victim.status === status &&
        (victim.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (victim.description && victim.description.toLowerCase().includes(searchQuery.toLowerCase())))
    )
  }

  const getDisplayVictims = (victims: Victim[], status: string) => {
    const filtered = filterVictims(victims, status)
    return filtered.slice(0, expandedSections[status as keyof typeof expandedSections] ? filtered.length : 6)
  }

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p>Loading victims data...</p>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Remembering the Victims</h1>
          <p className="text-lg text-gray-600 mb-8">
            We honor the memory of those lost and support those who were injured or affected by the events of July 24.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="search"
                placeholder="Search by name or description..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <Link href="/donate">
              <Button className="flex items-center">
                Support the Families <Heart className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="deceased" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deceased">Deceased</TabsTrigger>
            <TabsTrigger value="injured">Injured</TabsTrigger>
            <TabsTrigger value="missing">Missing</TabsTrigger>
          </TabsList>

          <TabsContent value="deceased">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getDisplayVictims(victims, "deceased").map((victim) => (
                <VictimCard key={victim._id} victim={victim} />
              ))}
            </div>
            {filterVictims(victims, "deceased").length > 6 && !expandedSections.deceased && (
              <div className="text-center mt-8">
                <Button variant="outline" onClick={() => setExpandedSections((prev) => ({ ...prev, deceased: true }))}>
                  See More
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="injured">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getDisplayVictims(victims, "injured").map((victim) => (
                <VictimCard key={victim._id} victim={victim} />
              ))}
            </div>
            {filterVictims(victims, "injured").length > 6 && !expandedSections.injured && (
              <div className="text-center mt-8">
                <Button variant="outline" onClick={() => setExpandedSections((prev) => ({ ...prev, injured: true }))}>
                  See More
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="missing">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getDisplayVictims(victims, "missing").map((victim) => (
                <VictimCard key={victim._id} victim={victim} />
              ))}
            </div>
            {filterVictims(victims, "missing").length > 6 && !expandedSections.missing && (
              <div className="text-center mt-8">
                <Button variant="outline" onClick={() => setExpandedSections((prev) => ({ ...prev, missing: true }))}>
                  See More
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-16 bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Do You Know Someone Affected?</h2>
          <p className="text-gray-600 mb-6 text-center">
            If you know someone who was affected by the July 24 events and would like to add them to our memorial page,
            please help us document their story.
          </p>
          <div className="flex justify-center">
            <Link href="/victims/report">
              <Button>Report an Affected Person</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function VictimCard({ victim }: { victim: Victim }) {
  const [imageError, setImageError] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="relative h-64 w-full bg-gray-100">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        <Image
          src={imageError ? "/placeholder.svg" : (victim.image || "/placeholder.svg")}
          alt={victim.fullName}
          fill
          className={`object-cover ${isImageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onError={() => setImageError(true)}
          onLoad={() => setIsImageLoading(false)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <div className="mb-3">
          <span className="text-sm text-gray-500 font-mono">ID: {victim.victimId}</span>
        </div>
        <h3 className="text-xl font-semibold mb-1">{victim.fullName}</h3>
        <p className="text-gray-500 mb-3">Age: {victim.age}</p>
        <p className="text-gray-600 mb-4 line-clamp-3">{victim.description}</p>
        <Link href={`/victims/${victim.victimId}`} className="text-primary font-medium hover:underline">
          Read full story →
        </Link>
      </div>
    </div>
  )
}
