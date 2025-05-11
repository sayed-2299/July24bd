"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { districts, subDistricts } from "@/lib/location-data"
import Image from "next/image"

const ECONOMIC_CONDITIONS = [
  { value: "below-poverty", label: "Below Poverty Line" },
  { value: "lower-income", label: "Lower Income" },
  { value: "middle-income", label: "Middle Income" },
  { value: "upper-middle", label: "Upper Middle Income" },
  { value: "high-income", label: "High Income" },
]

const PROFESSIONS = [
  { value: "student", label: "Student" },
  { value: "business", label: "Business" },
  { value: "service", label: "Service" },
  { value: "agriculture", label: "Agriculture" },
  { value: "day-laborer", label: "Day Laborer" },
  { value: "housewife", label: "Housewife" },
  { value: "unemployed", label: "Unemployed" },
  { value: "other", label: "Other" },
]

interface FormData {
  fullName: string
  nationalId: string
  dateOfBirth: string
  gender: string
  district: string
  subDistrict: string
  address: string
  familyMembers: string
  fatherName: string
  motherName: string
  economicCondition: string
  profession: string
  status: string
  incidentPlace: string
  description: string
  applicantName: string
  applicantNationalId: string
  applicantEmail: string
  applicantPhone: string
  relationship: string
  causeOfDeath: string
  causeOfInjury: string
  institutionName: string
}

interface VictimData {
  fullName: string
  nationalId: string
  dateOfBirth: string
  age: number
  gender: string
  district: string
  subDistrict: string
  address: string
  familyMembers: number
  fatherName: string
  motherName: string
  economicCondition: string
  profession: string
  status: string
  incidentPlace: string
  description: string
  causeOfDeath?: string
  causeOfInjury?: string
  institutionName?: string
  image?: string
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

function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

export default function ReportPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState("")
  const [victimImage, setVictimImage] = useState<File | null>(null)
  const [supportingDocs, setSupportingDocs] = useState<FileList | null>(null)
  const [profession, setProfession] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    nationalId: "",
    dateOfBirth: "",
    gender: "",
    district: "",
    subDistrict: "",
    address: "",
    familyMembers: "",
    fatherName: "",
    motherName: "",
    economicCondition: "",
    profession: "",
    status: "",
    incidentPlace: "",
    description: "",
    applicantName: "",
    applicantNationalId: "",
    applicantEmail: "",
    applicantPhone: "",
    relationship: "",
    causeOfDeath: "",
    causeOfInjury: "",
    institutionName: "",
  })

  const [selectedDistrict, setSelectedDistrict] = useState("")

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value)
    setFormData((prev) => ({ ...prev, district: value, subDistrict: "" }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (field === "profession") {
      setProfession(value)
    }

    if (field === "status") {
      setStatus(value)
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setVictimImage(event.target.files[0])
    }
  }

  const handleDocsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSupportingDocs(event.target.files)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Create form data
      const formDataToSend = new FormData()
      
      // Add the victim image if selected
      if (victimImage) {
        formDataToSend.append('victimImage', victimImage)
      }
      
      // Add supporting documents if selected
      if (supportingDocs) {
        Array.from(supportingDocs).forEach((doc) => {
          formDataToSend.append('supportingDocs', doc)
        })
      }
      
      // Add the rest of the form data
      const victimData: VictimData = {
        fullName: formData.fullName,
        nationalId: formData.nationalId,
        dateOfBirth: formData.dateOfBirth,
        age: calculateAge(formData.dateOfBirth),
        gender: formData.gender,
        district: formData.district,
        subDistrict: formData.subDistrict,
        address: formData.address,
        familyMembers: parseInt(formData.familyMembers),
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        economicCondition: formData.economicCondition,
        profession: formData.profession,
        status: formData.status,
        incidentPlace: formData.incidentPlace,
        description: formData.description,
        applicant: {
          fullName: formData.applicantName,
          id: formData.applicantNationalId,
          email: formData.applicantEmail,
          phone: formData.applicantPhone,
          relationship: formData.relationship
        }
      }

      // Add conditional fields
      if (formData.status === "deceased") {
        victimData.causeOfDeath = formData.causeOfDeath
      }

      if (formData.status === "injured") {
        victimData.causeOfInjury = formData.causeOfInjury
      }

      if (formData.profession === "student") {
        victimData.institutionName = formData.institutionName
      }

      // Add the JSON data to form data
      formDataToSend.append('data', JSON.stringify(victimData))

      console.log("Sending form data:", {
        victimImage: victimImage?.name,
        supportingDocs: supportingDocs ? Array.from(supportingDocs).map(doc => doc.name) : [],
        victimData
      })

      const response = await fetch("/api/victims", {
        method: "POST",
        body: formDataToSend
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit report")
      }

      toast({
        title: "Success",
        description: "Victim report submitted successfully",
      })

      router.push("/victims")
    } catch (err) {
      console.error("Error submitting form:", err)
      setError(err instanceof Error ? err.message : "Failed to submit report")
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to submit report",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">Report an Affected Person</h1>
          <p className="text-gray-600 text-center mb-8">
            Please provide accurate information to help us document and verify the affected person's case.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Applicant's Information */}
            <Card>
              <CardHeader>
                <CardTitle>Applicant's Information</CardTitle>
                <CardDescription>Please provide your contact information for verification purposes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="applicantName">Full Name</Label>
                    <Input
                      id="applicantName"
                      value={formData.applicantName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="applicantNationalId">National ID/Birth Certificate</Label>
                    <Input
                      id="applicantNationalId"
                      value={formData.applicantNationalId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="applicantEmail">Email</Label>
                    <Input
                      id="applicantEmail"
                      type="email"
                      value={formData.applicantEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="applicantPhone">Phone Number</Label>
                    <Input
                      id="applicantPhone"
                      type="tel"
                      value={formData.applicantPhone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="relationship">Relationship with Victim</Label>
                    <Input
                      id="relationship"
                      value={formData.relationship}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Affected Person's Information */}
            <Card>
              <CardHeader>
                <CardTitle>Affected Person's Information</CardTitle>
                <CardDescription>Please provide detailed information about the affected person.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Basic Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={formData.fullName} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationalId">National ID/Birth Certificate No.</Label>
                    <Input id="nationalId" value={formData.nationalId} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleSelectChange("gender", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Victim's Image</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <Input
                      id="victim-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <Label htmlFor="victim-image" className="cursor-pointer flex flex-col items-center">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload image</span>
                      {victimImage && <span className="text-sm text-primary mt-2">{victimImage.name}</span>}
                    </Label>
                  </div>
                </div>

                {/* Family Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Family Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fatherName">Father's Name</Label>
                      <Input id="fatherName" value={formData.fatherName} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="motherName">Mother's Name</Label>
                      <Input id="motherName" value={formData.motherName} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="familyMembers">Number of Family Members</Label>
                    <Input
                      id="familyMembers"
                      type="number"
                      min="1"
                      value={formData.familyMembers}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Location Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Select
                        value={formData.district}
                        onValueChange={handleDistrictChange}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subDistrict">Sub-District</Label>
                      <Select
                        value={formData.subDistrict}
                        onValueChange={(value) => handleSelectChange("subDistrict", value)}
                        required
                        disabled={!formData.district}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sub-district" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.district && subDistricts[formData.district]?.map((subDistrict) => (
                            <SelectItem key={subDistrict} value={subDistrict}>
                              {subDistrict}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Village/Street Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Provide detailed address including village name, street number, etc."
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Economic & Professional Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Economic & Professional Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="economicCondition">Economic Condition</Label>
                      <Select
                        value={formData.economicCondition}
                        onValueChange={(value) => handleSelectChange("economicCondition", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {ECONOMIC_CONDITIONS.map((condition) => (
                            <SelectItem key={condition.value} value={condition.value}>
                              {condition.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profession">Profession</Label>
                      <Select
                        value={profession}
                        onValueChange={(value) => {
                          setProfession(value)
                          handleSelectChange("profession", value)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select profession" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROFESSIONS.map((profession) => (
                            <SelectItem key={profession.value} value={profession.value}>
                              {profession.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {profession === "student" && (
                      <div className="space-y-2">
                        <Label htmlFor="institutionName">Institution Name</Label>
                        <Input
                          id="institutionName"
                          placeholder="Enter school/college/university name"
                          value={formData.institutionName}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Incident Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Incident Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="status">Current Status</Label>
                    <Select
                      value={status}
                      onValueChange={(value) => {
                        setStatus(value)
                        handleSelectChange("status", value)
                      }}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deceased">Deceased</SelectItem>
                        <SelectItem value="injured">Injured</SelectItem>
                        <SelectItem value="missing">Missing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {status === "deceased" && (
                    <div className="space-y-2">
                      <Label htmlFor="causeOfDeath">Cause of Death</Label>
                      <Textarea id="causeOfDeath" value={formData.causeOfDeath} onChange={handleInputChange} />
                    </div>
                  )}

                  {status === "injured" && (
                    <div className="space-y-2">
                      <Label htmlFor="causeOfInjury">Cause of Injury</Label>
                      <Textarea id="causeOfInjury" value={formData.causeOfInjury} onChange={handleInputChange} />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="incidentPlace">Incident Place</Label>
                    <Input id="incidentPlace" value={formData.incidentPlace} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Short Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a brief description of what happened"
                      className="h-32"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Supporting Documents */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Supporting Documents</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <Input
                      id="supporting-docs"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleDocsChange}
                    />
                    <Label htmlFor="supporting-docs" className="cursor-pointer flex flex-col items-center">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload supporting images</span>
                      <span className="text-xs text-gray-500 mt-1">(Only images are accepted)</span>
                      {supportingDocs && Array.from(supportingDocs).map((doc, index) => (
                        <div key={index} className="text-sm text-primary mt-2">
                          {doc.name} ({Math.round(doc.size / 1024)} KB)
                        </div>
                      ))}
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button type="submit" size="lg" disabled={loading}>
                {loading ? "Submitting..." : "Submit Report"}
              </Button>
              <Link href="/victims">
                <Button variant="outline" size="lg">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

