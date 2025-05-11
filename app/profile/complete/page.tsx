"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CompleteProfilePage() {
  const [profileData, setProfileData] = useState({
    fullName: "",
    image: null as File | null,
    idNumber: "",
    type: "individual",
    professionOrType: "",
    supportingDocs: null as FileList | null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if donor profile is already completed
    const checkProfile = async () => {
      try {
        const response = await fetch("/api/users/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "donor" }),
        })
        const data = await response.json()
        if (data.alreadyCompleted) {
          router.push("/donor/dashboard")
        } else {
          setLoading(false)
        }
      } catch (err) {
        setLoading(false)
      }
    }
    checkProfile()
  }, [router])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const response = await fetch("/api/users/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "donor",
          ...profileData,
        }),
      })
      const data = await response.json()
      if (data.success) {
        router.push("/donor/dashboard")
      } else {
        setError(data.error || "Failed to complete profile")
      }
    } catch (err) {
      setError("Failed to complete profile")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Complete Your Donor Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Profile Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setProfileData({ ...profileData, image: e.target.files?.[0] || null })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idNumber">National Identity / Registration Number</Label>
              <Input
                id="idNumber"
                value={profileData.idNumber}
                onChange={(e) => setProfileData({ ...profileData, idNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Donor Type</Label>
              <Select
                value={profileData.type}
                onValueChange={(value) => setProfileData({ ...profileData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select donor type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="organization">Organization</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="professionOrType">
                {profileData.type === "individual" ? "Profession" : "Organization Type"}
              </Label>
              <Input
                id="professionOrType"
                value={profileData.professionOrType}
                onChange={(e) => setProfileData({ ...profileData, professionOrType: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documents">Supporting Documents</Label>
              <Input
                id="documents"
                type="file"
                multiple
                onChange={(e) => setProfileData({ ...profileData, supportingDocs: e.target.files || null })}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              Complete Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
