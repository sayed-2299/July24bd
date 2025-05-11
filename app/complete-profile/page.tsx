"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { districts, subDistricts } from "@/lib/location-data"

export default function CompleteProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"role" | "form">("role")
  const [role, setRole] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    district: "",
    subDistrict: "",
    address: "",
    nid: "",
    organizationName: "",
    registrationNo: "",
    donorType: "individual",
    // Nominee specific fields
    victimId: "",
    relationship: "",
    bankDetails: {
      fullName: "",
      accountNo: "",
      branchName: "",
      mobileProvider: "",
      mobileAccountNo: ""
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.startsWith("bankDetails.")) {
      const bankField = name.split(".")[1]
      setFormData(prev => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [bankField]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole)
    setStep("form")
  }

  const validateForm = () => {
    if (!formData.fullName || !formData.phone || !formData.nid || !formData.district || !formData.subDistrict) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return false
    }

    if (role === "nominee") {
      if (!formData.victimId || !formData.relationship) {
        toast({
          title: "Error",
          description: "Please fill in all required nominee fields",
          variant: "destructive",
        })
        return false
      }

      if (!formData.bankDetails.fullName || !formData.bankDetails.accountNo || !formData.bankDetails.branchName) {
        toast({
          title: "Error",
          description: "Please fill in all required bank details",
          variant: "destructive",
        })
        return false
      }
    }

    if (role === "donor" && formData.donorType === "organization") {
      if (!formData.organizationName || !formData.registrationNo) {
        toast({
          title: "Error",
          description: "Please fill in all required organization details",
          variant: "destructive",
        })
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Prepare the data based on role
      const submitData = {
        ...formData,
        role,
        // Only include role-specific fields if they are relevant
        ...(role === "donor" ? {
          donorType: formData.donorType,
          organizationName: formData.organizationName || undefined,
          registrationNo: formData.registrationNo || undefined
        } : {}),
        ...(role === "nominee" ? {
          victimId: formData.victimId,
          relationship: formData.relationship,
          bankDetails: {
            fullName: formData.bankDetails.fullName,
            accountNo: formData.bankDetails.accountNo,
            branchName: formData.bankDetails.branchName,
            mobileProvider: formData.bankDetails.mobileProvider || undefined,
            mobileAccountNo: formData.bankDetails.mobileAccountNo || undefined
          }
        } : {})
      }

      const response = await fetch("/api/users/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Profile completed successfully",
          description: "Please sign in to continue",
        })
        router.push("/signin")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to complete profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting profile:", error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (step === "role") {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-8">
              <h1 className="text-2xl font-bold mb-6">Select Your Role</h1>
              <p className="text-gray-600 mb-6">Please select your role to continue with profile completion</p>
              
              <RadioGroup
                value={role}
                onValueChange={handleRoleSelect}
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="donor"
                    id="donor"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="donor"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span>Donor</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="admin"
                    id="admin"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="admin"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span>Admin</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="nominee"
                    id="nominee"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="nominee"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span>Nominee</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Complete Your Profile</h1>
              <Button
                variant="outline"
                onClick={() => setStep("role")}
              >
                Change Role
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="nid">National ID</Label>
                  <Input
                    id="nid"
                    name="nid"
                    value={formData.nid}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="district">District</Label>
                  <Select
                    value={selectedDistrict}
                    onValueChange={(value) => {
                      setSelectedDistrict(value)
                      setFormData(prev => ({ ...prev, district: value, subDistrict: "" }))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district, index) => (
                        <SelectItem key={`${district}-${index}`} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subDistrict">Sub District</Label>
                  <Select
                    value={formData.subDistrict}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, subDistrict: value }))}
                    disabled={!selectedDistrict}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub-district" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedDistrict && subDistricts[selectedDistrict]?.map((subDistrict, index) => (
                        <SelectItem key={`${subDistrict}-${index}`} value={subDistrict}>
                          {subDistrict}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Role-specific fields */}
              {role === "donor" && (
                <div className="space-y-4">
                  <div>
                    <Label>Donor Type</Label>
                    <RadioGroup
                      value={formData.donorType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, donorType: value }))}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <RadioGroupItem
                          value="individual"
                          id="individual"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="individual"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span>Individual</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem
                          value="organization"
                          id="organization"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="organization"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span>Organization</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.donorType === "organization" && (
                    <>
                      <div>
                        <Label htmlFor="organizationName">Organization Name</Label>
                        <Input
                          id="organizationName"
                          name="organizationName"
                          value={formData.organizationName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="registrationNo">Registration Number</Label>
                        <Input
                          id="registrationNo"
                          name="registrationNo"
                          value={formData.registrationNo}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Nominee specific fields */}
              {role === "nominee" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="victimId">Referenced Victim ID</Label>
                    <Input
                      id="victimId"
                      name="victimId"
                      value={formData.victimId}
                      onChange={handleInputChange}
                      placeholder="e.g. VIC-2024-001"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter the Victim ID of the person you are representing as a nominee. This ID can be found on the victim's profile page.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="relationship">Relationship with Victim</Label>
                    <Input
                      id="relationship"
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label>Profile Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">No file chosen</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Banking Details</h3>
                    <div>
                      <Label htmlFor="bankDetails.fullName">Full Name (as per bank account)</Label>
                      <Input
                        id="bankDetails.fullName"
                        name="bankDetails.fullName"
                        value={formData.bankDetails.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="bankDetails.accountNo">Account Number</Label>
                      <Input
                        id="bankDetails.accountNo"
                        name="bankDetails.accountNo"
                        value={formData.bankDetails.accountNo}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="bankDetails.branchName">Branch Name</Label>
                      <Input
                        id="bankDetails.branchName"
                        name="bankDetails.branchName"
                        value={formData.bankDetails.branchName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="bankDetails.mobileProvider">Mobile Banking Provider</Label>
                      <Select
                        value={formData.bankDetails.mobileProvider}
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          bankDetails: { ...prev.bankDetails, mobileProvider: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bKash">bKash</SelectItem>
                          <SelectItem value="Nagad">Nagad</SelectItem>
                          <SelectItem value="Rocket">Rocket</SelectItem>
                          <SelectItem value="Upay">Upay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.bankDetails.mobileProvider && (
                      <div>
                        <Label htmlFor="bankDetails.mobileAccountNo">Mobile Account Number</Label>
                        <Input
                          id="bankDetails.mobileAccountNo"
                          name="bankDetails.mobileAccountNo"
                          value={formData.bankDetails.mobileAccountNo}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Supporting Documents</Label>
                    <Input
                      type="file"
                      multiple
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">No file chosen</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Please upload documents that prove your relationship with the victim
                    </p>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Completing Profile..." : "Complete Profile"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 