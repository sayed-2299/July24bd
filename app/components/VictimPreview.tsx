import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface VictimPreviewProps {
  victim: {
    _id: string
    victimId: string
    fullName: string
    age: number
    gender: string
    nationalId: string
    district: string
    subDistrict: string
    status: "deceased" | "injured" | "missing"
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
    applicant: {
      fullName: string
      id: string
      email: string
      phone: string
      relationship: string
    }
  }
  onApprove?: () => void
  onReject?: () => void
  role: "uno" | "admin"
}

export default function VictimPreview({ victim, onApprove, onReject, role }: VictimPreviewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <Card>
        <CardHeader>
          <CardTitle>Victim's Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video w-full max-w-2xl mx-auto">
            <Image
              src={victim.image || "/placeholder.svg"}
              alt={victim.fullName}
              fill
              className="object-cover rounded-lg cursor-pointer"
              onClick={() => setSelectedImage(victim.image || null)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Supporting Documents */}
      {victim.supportingDocuments && victim.supportingDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Supporting Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {victim.supportingDocuments.map((doc, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={doc.url}
                    alt={doc.name}
                    fill
                    className="object-cover rounded-lg cursor-pointer"
                    onClick={() => setSelectedImage(doc.url)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Victim Information */}
      <Card>
        <CardHeader>
          <CardTitle>Victim Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p>{victim.fullName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Age</p>
              <p>{victim.age}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Gender</p>
              <p className="capitalize">{victim.gender}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">National ID</p>
              <p>{victim.nationalId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="capitalize">{victim.status}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Location</p>
              <p>{victim.district}, {victim.subDistrict}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="mt-1">{victim.description}</p>
          </div>

          {victim.status === "deceased" && victim.causeOfDeath && (
            <div>
              <p className="text-sm font-medium text-gray-500">Cause of Death</p>
              <p className="mt-1">{victim.causeOfDeath}</p>
            </div>
          )}

          {victim.status === "injured" && victim.causeOfInjury && (
            <div>
              <p className="text-sm font-medium text-gray-500">Cause of Injury</p>
              <p className="mt-1">{victim.causeOfInjury}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Applicant Information */}
      <Card>
        <CardHeader>
          <CardTitle>Applicant Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p>{victim.applicant.fullName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ID</p>
              <p>{victim.applicant.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p>{victim.applicant.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p>{victim.applicant.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Relationship</p>
              <p>{victim.applicant.relationship}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {(onApprove || onReject) && (
        <div className="flex justify-end gap-4">
          {onReject && (
            <Button variant="destructive" onClick={onReject}>
              Reject
            </Button>
          )}
          {onApprove && (
            <Button onClick={onApprove}>
              Approve
            </Button>
          )}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-4xl h-[80vh] mx-4">
            <Image
              src={selectedImage}
              alt="Full size preview"
              fill
              className="object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 