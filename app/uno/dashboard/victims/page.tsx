"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, XCircle, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import VictimPreview from "@/../../components/VictimPreview"

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

export default function UNOVictimsPage() {
  const [victims, setVictims] = useState<Victim[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedVictim, setSelectedVictim] = useState<Victim | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchVictims()
  }, [activeTab])

  const fetchVictims = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching victims with status:", activeTab)
      
      // Map the tab status to the actual verification status for UNO
      let status = activeTab
      if (activeTab === "pending") {
        status = "pending" // Show pending victims that need UNO verification
      } else if (activeTab === "verified") {
        status = "uno-verified" // Show UNO-verified victims
      } else if (activeTab === "rejected") {
        status = "rejected" // Show rejected victims
      }
      
      const response = await fetch(`/api/victims?status=${status}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      })
      
      const data = await response.json()
      console.log("API Response:", data)
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }
      
      if (data.success) {
        setVictims(data.data || [])
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch victims",
          variant: "destructive"
        })
        setVictims([])
      }
    } catch (error) {
      console.error("Error fetching victims:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch victims",
        variant: "destructive"
      })
      setVictims([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (victimId: string, status: "uno-verified" | "rejected") => {
    try {
      const response = await fetch(`/api/victims/${victimId}/verify`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          status,
          rejectionReason: status === "rejected" ? rejectionReason : undefined,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to update victim status")
      }

      toast({
        title: "Success",
        description: `Victim ${status === "uno-verified" ? "verified" : "rejected"} successfully`,
      })

      // Refresh the victims list
      fetchVictims()
    } catch (error) {
      console.error("Error updating victim status:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update victim status",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Victim Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : victims.length === 0 ? (
                <div className="text-center py-4">No victims found</div>
              ) : (
                <div className="grid gap-4">
                  {victims.map((victim) => (
                    <Card key={victim._id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">{victim.fullName}</h3>
                            <p className="text-sm text-gray-500">ID: {victim.victimId}</p>
                            <p className="text-sm text-gray-500">Status: {victim.status}</p>
                          </div>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Victim Details</DialogTitle>
                                  <DialogDescription>
                                    Review all information and documents before verification
                                  </DialogDescription>
                                </DialogHeader>
                                <VictimPreview
                                  victim={victim}
                                  role="uno"
                                  onApprove={activeTab === "pending" ? () => handleVerification(victim._id, "uno-verified") : undefined}
                                  onReject={activeTab === "pending" ? () => {
                                    setSelectedVictim(victim)
                                    setRejectionReason("")
                                  } : undefined}
                                />
                              </DialogContent>
                            </Dialog>
                            {activeTab === "pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700"
                                  onClick={() => handleVerification(victim._id, "uno-verified")}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Verify
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => {
                                    setSelectedVictim(victim)
                                    setRejectionReason("")
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      <Dialog open={!!selectedVictim} onOpenChange={() => setSelectedVictim(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Victim Report</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this victim report.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReason">Reason for Rejection</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="mt-2"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedVictim(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (selectedVictim) {
                    handleVerification(selectedVictim._id, "rejected")
                    setSelectedVictim(null)
                  }
                }}
                disabled={!rejectionReason.trim()}
              >
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 