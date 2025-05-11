"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle2, XCircle, KeyRound, User, FileText, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

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
  rejectionReason?: string
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
  unoVerifiedBy?: {
    fullName: string
  }
  unoVerifiedAt?: string
  unoRejectionReason?: string
  applicant: {
    fullName: string
    id: string
    email: string
    phone: string
    relationship: string
  }
}

interface Nominee {
  _id: string
  name: string
  nid: string
  phone: string
  email: string
  relationship: string
  district: string
  subDistrict: string
  status: "pending" | "uno-verified" | "admin-verified" | "rejected"
  bankDetails: {
    fullName: string
    accountNo: string
    branchName: string
    mobileProvider?: string
    mobileAccountNo?: string
  }
  victimId: string
  userId: {
    fullName: string
    email: string
    phone: string
  }
}

interface UNOProfile {
  fullName: string
  email: string
  district: string
  subDistrict: string
  phone?: string
  address?: string
}

export default function UNODashboard() {
  const [activeTab, setActiveTab] = useState("victims")
  const [statusFilter, setStatusFilter] = useState<"pending" | "verified" | "rejected">("pending")
  const [victims, setVictims] = useState<Victim[]>([])
  const [nominees, setNominees] = useState<Nominee[]>([])
  const [unoProfile, setUnoProfile] = useState<UNOProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNominee, setSelectedNominee] = useState<Nominee | null>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const { toast } = useToast()

  // Fetch victims
  const fetchVictims = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/uno/records?type=victims&status=${statusFilter}`, {
        credentials: "include"
      })
      const data = await response.json()
      
      if (data.success) {
        setVictims(data.data)
      } else {
        if (data.code === "UNO_LOCATION_MISSING") {
          toast({
            title: "Profile Update Required",
            description: data.error,
            variant: "destructive"
          })
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to fetch victims",
            variant: "destructive"
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch victims",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch nominees
  const fetchNominees = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/uno/records?type=nominees&status=${statusFilter}`, {
        credentials: "include"
      })
      const data = await response.json()
      
      if (data.success) {
        setNominees(data.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch nominees",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch nominees",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch UNO profile
  const fetchUnoProfile = async () => {
    try {
      const response = await fetch("/api/users/profile", {
        credentials: "include"
      })
      const data = await response.json()
      if (data.success) {
        setUnoProfile(data.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile",
        variant: "destructive"
      })
    }
  }

  // Handle victim verification
  const handleVictimVerify = async (victimId: string, action: "approve" | "reject") => {
    try {
      const response = await fetch(`/api/victims/${victimId}/verify`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          status: action === "approve" ? "uno-verified" : "rejected",
          rejectionReason: action === "reject" ? rejectionReason : undefined,
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: action === "approve" ? "Victim verified successfully" : "Victim rejected"
        })
        fetchVictims()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to verify victim",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify victim",
        variant: "destructive"
      })
    }
  }

  // Handle nominee verification
  const handleNomineeVerify = async (nomineeId: string, action: "approve" | "reject") => {
    try {
      const response = await fetch("/api/uno/nominees", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          nomineeId,
          action: action === "approve" ? "verify" : "reject",
          rejectionReason: action === "reject" ? rejectionReason : undefined,
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: action === "approve" ? "Nominee verified successfully" : "Nominee rejected"
        })
        setShowRejectDialog(false)
        setRejectionReason("")
        setSelectedNominee(null)
        fetchNominees()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to verify nominee",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify nominee",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    fetchUnoProfile()
  }, [])

  useEffect(() => {
    if (activeTab === "victims") {
      fetchVictims()
    } else if (activeTab === "nominees") {
      fetchNominees()
    }
  }, [activeTab, statusFilter])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">UNO Dashboard</h1>
        <p className="text-gray-600">Manage and verify records for your sub-district</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>UNO Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="victims">Victim Reports</TabsTrigger>
              <TabsTrigger value="nominees">Nominees</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="victims">
              <div className="mb-4">
                <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as "pending" | "verified" | "rejected")}>
                  <TabsList>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="verified">Verified</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
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
                            <p className="text-sm text-gray-500">Location: {victim.district}, {victim.subDistrict}</p>
                            <p className="text-sm text-gray-500">Status: {victim.status}</p>
                            {victim.description && (
                              <p className="mt-2 text-sm">{victim.description}</p>
                            )}
                            {victim.rejectionReason && (
                              <p className="mt-2 text-sm text-red-500">
                                <span className="font-medium">Rejection Reason:</span> {victim.rejectionReason}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>Victim Details</DialogTitle>
                                  <DialogDescription>
                                    Review the victim's information before verification
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6">
                                  {/* Basic Information */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Basic Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p><span className="font-medium">Name:</span> {victim.fullName}</p>
                                        <p><span className="font-medium">Age:</span> {victim.age}</p>
                                        <p><span className="font-medium">Gender:</span> {victim.gender}</p>
                                        <p><span className="font-medium">NID:</span> {victim.nationalId}</p>
                                        <p><span className="font-medium">Date of Birth:</span> {victim.dateOfBirth}</p>
                                      </div>
                                      <div>
                                        <p><span className="font-medium">Father's Name:</span> {victim.fatherName}</p>
                                        <p><span className="font-medium">Mother's Name:</span> {victim.motherName}</p>
                                        <p><span className="font-medium">Family Members:</span> {victim.familyMembers}</p>
                                        <p><span className="font-medium">Economic Condition:</span> {victim.economicCondition}</p>
                                        <p><span className="font-medium">Profession:</span> {victim.profession}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Incident Information */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Incident Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p><span className="font-medium">Status:</span> {victim.status}</p>
                                        <p><span className="font-medium">Incident Place:</span> {victim.incidentPlace}</p>
                                        {victim.status === "deceased" && (
                                          <p><span className="font-medium">Cause of Death:</span> {victim.causeOfDeath}</p>
                                        )}
                                        {victim.status === "injured" && (
                                          <p><span className="font-medium">Cause of Injury:</span> {victim.causeOfInjury}</p>
                                        )}
                                      </div>
                                      <div>
                                        <p><span className="font-medium">Address:</span> {victim.address}</p>
                                        <p><span className="font-medium">District:</span> {victim.district}</p>
                                        <p><span className="font-medium">Sub-District:</span> {victim.subDistrict}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Applicant Information */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Applicant Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p><span className="font-medium">Name:</span> {victim.applicant.fullName}</p>
                                        <p><span className="font-medium">Phone:</span> {victim.applicant.phone}</p>
                                        <p><span className="font-medium">Email:</span> {victim.applicant.email}</p>
                                      </div>
                                      <div>
                                        <p><span className="font-medium">Relationship:</span> {victim.applicant.relationship}</p>
                                        <p><span className="font-medium">ID:</span> {victim.applicant.id}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Supporting Documents */}
                                  {victim.supportingDocuments && victim.supportingDocuments.length > 0 && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Supporting Documents</h4>
                                      <div className="grid grid-cols-2 gap-4">
                                        {victim.supportingDocuments.map((doc, index) => (
                                          <div key={index} className="flex items-center space-x-2">
                                            <span className="font-medium">{doc.name}:</span>
                                            <a
                                              href={doc.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-500 hover:underline"
                                            >
                                              View Document
                                            </a>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Verification Actions */}
                                  {victim.verificationStatus === "pending" && (
                                    <DialogFooter className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setSelectedNominee(null)
                                          setRejectionReason("")
                                          setShowRejectDialog(true)
                                          handleVictimVerify(victim._id, "reject")
                                        }}
                                      >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                      </Button>
                                      <Button
                                        onClick={() => handleVictimVerify(victim._id, "approve")}
                                      >
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Verify
                                      </Button>
                                    </DialogFooter>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="nominees">
              <div className="mb-4">
                <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as "pending" | "verified" | "rejected")}> 
                  <TabsList>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="verified">Verified</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : nominees.filter(nominee => {
                if (statusFilter === "verified") return nominee.status === "uno-verified";
                if (statusFilter === "pending") return nominee.status === "pending";
                if (statusFilter === "rejected") return nominee.status === "rejected";
                return true;
              }).length === 0 ? (
                <div className="text-center py-4">No nominees found</div>
              ) : (
                <div className="grid gap-4">
                  {nominees.filter(nominee => {
                    if (statusFilter === "verified") return nominee.status === "uno-verified";
                    if (statusFilter === "pending") return nominee.status === "pending";
                    if (statusFilter === "rejected") return nominee.status === "rejected";
                    return true;
                  }).map((nominee) => (
                    <Card key={nominee._id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">{nominee.name}</h3>
                            <p className="text-sm text-gray-500">NID: {nominee.nid}</p>
                            <p className="text-sm text-gray-500">Phone: {nominee.phone}</p>
                            <p className="text-sm text-gray-500">Email: {nominee.email}</p>
                            <p className="text-sm text-gray-500">Relationship: {nominee.relationship}</p>
                            <p className="text-sm text-gray-500">District: {nominee.district}</p>
                            <p className="text-sm text-gray-500">Sub-District: {nominee.subDistrict}</p>
                            <p className="text-sm text-gray-500">Victim ID: {nominee.victimId}</p>
                            <p className="text-sm text-gray-500">Status: {nominee.status}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>Nominee Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6">
                                  <div>
                                    <h4 className="font-semibold mb-2">Basic Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p><span className="font-medium">Name:</span> {nominee.name}</p>
                                        <p><span className="font-medium">NID:</span> {nominee.nid}</p>
                                        <p><span className="font-medium">Phone:</span> {nominee.phone}</p>
                                        <p><span className="font-medium">Email:</span> {nominee.email}</p>
                                        <p><span className="font-medium">Relationship:</span> {nominee.relationship}</p>
                                      </div>
                                      <div>
                                        <p><span className="font-medium">District:</span> {nominee.district}</p>
                                        <p><span className="font-medium">Sub-District:</span> {nominee.subDistrict}</p>
                                        <p><span className="font-medium">Victim ID:</span> {nominee.victimId}</p>
                                        <p><span className="font-medium">Status:</span> {nominee.status}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-2">Bank Details</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p><span className="font-medium">Account Name:</span> {nominee.bankDetails.fullName}</p>
                                        <p><span className="font-medium">Account Number:</span> {nominee.bankDetails.accountNo}</p>
                                        <p><span className="font-medium">Branch:</span> {nominee.bankDetails.branchName}</p>
                                      </div>
                                      {nominee.bankDetails.mobileProvider && (
                                        <div>
                                          <p><span className="font-medium">Mobile Provider:</span> {nominee.bankDetails.mobileProvider}</p>
                                          <p><span className="font-medium">Mobile Account:</span> {nominee.bankDetails.mobileAccountNo}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Verification Actions */}
                                  {nominee.status === "pending" && (
                                    <DialogFooter className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setSelectedNominee(nominee)
                                          setShowRejectDialog(true)
                                        }}
                                      >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                      </Button>
                                      <Button
                                        onClick={() => handleNomineeVerify(nominee._id, "approve")}
                                      >
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Verify
                                      </Button>
                                    </DialogFooter>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="profile">
              {unoProfile ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Profile Information</h3>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p><span className="font-medium">Name:</span> {unoProfile.fullName}</p>
                        <p><span className="font-medium">Email:</span> {unoProfile.email}</p>
                        <p><span className="font-medium">Phone:</span> {unoProfile.phone}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">District:</span> {unoProfile.district}</p>
                        <p><span className="font-medium">Sub-District:</span> {unoProfile.subDistrict}</p>
                        <p><span className="font-medium">Address:</span> {unoProfile.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">Loading profile...</div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject {selectedNominee ? "Nominee" : "Victim"}</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false)
                setRejectionReason("")
                setSelectedNominee(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedNominee) {
                  handleNomineeVerify(selectedNominee._id, "reject")
                }
              }}
              disabled={!rejectionReason.trim()}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
