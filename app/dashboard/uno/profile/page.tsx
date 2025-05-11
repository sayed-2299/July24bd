"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface UNOProfile {
  fullName: string
  email: string
  district: string
  subDistrict: string
  phone?: string
  address?: string
  status: string
  createdAt: string
  lastLogin?: string
}

export default function UNOProfilePage() {
  const [profile, setProfile] = useState<UNOProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<Partial<UNOProfile>>({})
  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/users/profile")
      const data = await response.json()
      if (data.success) {
        setProfile(data.data)
        setEditedProfile(data.data)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch profile",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedProfile(profile || {})
  }

  const handleSave = async () => {
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProfile),
      })

      const data = await response.json()
      if (data.success) {
        setProfile(data.data)
        setIsEditing(false)
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update profile",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">UNO Profile</h1>
        <p className="text-gray-600">View and manage your profile information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="fullName"
                    value={editedProfile.fullName || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile, fullName: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-700">{profile?.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <p className="text-gray-700">{profile?.email}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <p className="text-gray-700">{profile?.district}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subDistrict">Sub-District</Label>
                <p className="text-gray-700">{profile?.subDistrict}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editedProfile.phone || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-700">{profile?.phone || "Not provided"}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={editedProfile.address || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-700">{profile?.address || "Not provided"}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <p className="text-gray-700">{profile?.status}</p>
              </div>

              <div className="space-y-2">
                <Label>Account Created</Label>
                <p className="text-gray-700">{new Date(profile?.createdAt || "").toLocaleDateString()}</p>
              </div>

              {profile?.lastLogin && (
                <div className="space-y-2">
                  <Label>Last Login</Label>
                  <p className="text-gray-700">{new Date(profile.lastLogin).toLocaleString()}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </>
              ) : (
                <Button onClick={handleEdit}>Edit Profile</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 