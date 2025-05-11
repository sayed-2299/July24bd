"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

interface VictimInfo {
  _id: string
  fullName: string
  age: number
  gender: string
  district: string
  subDistrict: string
  nationalId: string
}

interface UnoVerification {
  status: string
  verifiedBy?: string
  verifiedAt?: Date
  rejectionReason?: string
}

interface AdminVerification {
  status: string
  verifiedBy?: string
  verifiedAt?: Date
  rejectionReason?: string
}

interface AssignedUno {
  unoId?: string
  district: string
  subDistrict: string
}

interface NomineeProfile {
  _id: string
  userId: string
  victimId: string
  name: string
  nid: string
  phone: string
  email: string
  relationship: string
  district: string
  subDistrict: string
  status: "pending" | "uno-verified" | "admin-verified" | "rejected"
  unoVerification: UnoVerification
  adminVerification: AdminVerification
  assignedUno?: AssignedUno
  victim?: VictimInfo
  bankDetails?: {
    fullName: string
    accountNo: string
    branchName: string
    mobileProvider?: string
    mobileAccountNo?: string
  }
  documents?: Array<{
    name: string
    type: string
    url: string
  }>
}

interface Fund {
  _id: string
  title: string
  amount: number
  description: string
  donorId: {
    name: string
  }
  donorName?: string
  createdAt: string
}

interface FundApplication {
  _id: string
  fundId: {
    _id: string
    title: string
    amount: number
    donorId: {
      name: string
    }
  }
  requestedAmount: number
  note?: string
  status: "pending" | "approved" | "rejected" | "received" | "reported"
  createdAt: string
}

export default function NomineeDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<NomineeProfile | null>(null)
  const [availableFunds, setAvailableFunds] = useState<Fund[]>([])
  const [fundApplications, setFundApplications] = useState<FundApplication[]>([])
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null)
  const [applicationForm, setApplicationForm] = useState({
    requestedAmount: "",
    note: ""
  })
  const [reportReason, setReportReason] = useState("")
  const [victimInfo, setVictimInfo] = useState<VictimInfo | null>(null)

  useEffect(() => {
    fetchProfile()
    fetchAvailableFunds()
    fetchFundApplications()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/nominees/profile", {
        credentials: "include"
      })
      const data = await response.json()
      
      if (data.success) {
        setProfile(data.data.nominee)
        // Fetch victim information if victimId exists
        if (data.data.nominee.victimId) {
          fetchVictimInfo(data.data.nominee.victimId)
        }
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchVictimInfo = async (victimId: string) => {
    try {
      console.log(`Fetching victim info for ID: ${victimId}`);
      const response = await fetch(`/api/victims/${victimId}`, {
        credentials: "include"
      });
      const data = await response.json();
      console.log('Victim info response:', data);
      
      if (data.success) {
        setVictimInfo(data.data);
      } else {
        console.error('Failed to fetch victim info:', data.error);
        toast({
          title: "Error",
          description: data.error || "Failed to fetch victim information",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching victim info:', error);
      toast({
        title: "Error",
        description: "Failed to fetch victim information",
        variant: "destructive",
      });
    }
  };

  const fetchAvailableFunds = async () => {
    try {
      const response = await fetch("/api/funds", {
        credentials: "include"
      })
      const data = await response.json()
      if (data.success) {
        setAvailableFunds(data.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch available funds",
        variant: "destructive",
      })
    }
  }

  const fetchFundApplications = async () => {
    try {
      const response = await fetch("/api/funds/applications", {
        credentials: "include"
      })
      const data = await response.json()
      if (data.success) {
        setFundApplications(data.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch fund applications",
        variant: "destructive",
      })
    }
  }

  const handleApplyFund = async () => {
    console.log('Apply for fund clicked');
    console.log('selectedFund:', selectedFund);
    console.log('applicationForm:', applicationForm);
    if (!selectedFund) return;

    try {
      const response = await fetch("/api/funds/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fundId: selectedFund._id,
          requestedAmount: Number(applicationForm.requestedAmount),
          note: applicationForm.note
        }),
      })
      const data = await response.json()
      console.log('Fund apply API response:', data);
      if (data.success) {
        toast({
          title: "Success",
          description: "Fund application submitted successfully",
        })
        setSelectedFund(null)
        setApplicationForm({ requestedAmount: "", note: "" })
        fetchFundApplications()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to apply for fund",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error applying for fund:', error);
      toast({
        title: "Error",
        description: "Failed to apply for fund",
        variant: "destructive",
      })
    }
  }

  const handleNomineeAction = async (application: FundApplication, action: "received" | "reported", reportReason?: string) => {
    try {
      const response = await fetch("/api/funds/applications/nominee-action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          applicationId: application._id,
          action,
          reportReason,
        }),
      })
      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: action === "received" ? "Donation marked as received." : "Report submitted.",
        })
        fetchFundApplications()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to process action",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process action",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <p>Loading your profile...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <p>Profile not found. Please complete your profile first.</p>
              <Button 
                className="mt-4"
                onClick={() => router.push("/complete-profile")}
              >
                Complete Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Pending State
  if (profile.status === "pending") {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile is Pending Verification</CardTitle>
            <CardDescription>
              Your profile is currently in the verification queue. Please wait while we process your application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Verification Steps</h3>
                <ol className="list-decimal list-inside mt-2">
                  <li>UNO Verification</li>
                  <li>Admin Verification</li>
                </ol>
              </div>
              {profile.assignedUno && (
                <div>
                  <h3 className="font-medium">Contact Information</h3>
                  <p className="mt-2">
                    For any queries, please contact your local UNO office in {profile.assignedUno.district}, {profile.assignedUno.subDistrict}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // UNO Verification State
  if (profile.status === "uno-verified") {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile is Under Admin Verification</CardTitle>
            <CardDescription>
              Your profile has been verified by UNO and is now under admin review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Current Status</h3>
                <p className="mt-2">Waiting for admin verification</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Rejected State
  if (profile.status === "rejected") {
    const rejectionReason = profile.unoVerification?.rejectionReason || 
                          profile.adminVerification?.rejectionReason || 
                          "No specific reason provided"

    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Rejected</CardTitle>
            <CardDescription>
              Your profile has been rejected. Please review the reason below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Rejection Reason</h3>
                <p className="mt-2">{rejectionReason}</p>
              </div>
              <Button onClick={() => router.push("/complete-profile")}>
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Active State (After both verifications)
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Nominee Dashboard</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="funds">Available Funds</TabsTrigger>
          <TabsTrigger value="donations">Donation Track</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nominee Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Nominee Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-sm font-medium">{profile.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">NID</p>
                    <p className="text-sm font-medium">{profile.nid}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-sm font-medium">{profile.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Relationship</p>
                    <p className="text-sm font-medium">{profile.relationship}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-sm font-medium">{profile.district}, {profile.subDistrict}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Associated Victim Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Associated Victim</CardTitle>
              </CardHeader>
              <CardContent>
                {victimInfo ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Victim ID</p>
                      <p className="text-sm font-medium">{profile?.victimId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-sm font-medium">{victimInfo.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">NID</p>
                      <p className="text-sm font-medium">{victimInfo.nationalId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="text-sm font-medium">{victimInfo.age}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="text-sm font-medium">{victimInfo.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-sm font-medium">{victimInfo.district}, {victimInfo.subDistrict}</p>
                    </div>
                    <div className="col-span-2">
                      <Button 
                        className="w-full"
                        onClick={() => router.push(`/nominee/victim/${profile?.victimId}`)}
                      >
                        View Full Details
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">Loading victim information...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Available Funds Tab */}
        <TabsContent value="funds">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Available Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableFunds.map((fund) => (
                  <div key={fund._id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{fund.title}</h3>
                      <span className="text-sm font-medium text-primary">৳{fund.amount.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">Donor: {fund.donorName || (fund.donorId && fund.donorId.name) || 'N/A'}</p>
                    <p className="text-sm mb-3">{fund.description}</p>
                    <Button 
                      className="w-full"
                      onClick={() => setSelectedFund(fund)}
                    >
                      Apply for Fund
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fund Application Dialog */}
          {selectedFund && (
            <AlertDialog open={!!selectedFund} onOpenChange={() => setSelectedFund(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apply for Fund</AlertDialogTitle>
                  <AlertDialogDescription>
                    Please provide the requested amount and any additional notes.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Requested Amount (৳)</label>
                    <Input
                      type="number"
                      value={applicationForm.requestedAmount}
                      onChange={(e) => setApplicationForm({ ...applicationForm, requestedAmount: e.target.value })}
                      required
                      max={selectedFund.amount}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Note (Optional)</label>
                    <Textarea
                      value={applicationForm.note}
                      onChange={(e) => setApplicationForm({ ...applicationForm, note: e.target.value })}
                      placeholder="Add any additional information..."
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleApplyFund}>Submit Application</AlertDialogAction>
                  </AlertDialogFooter>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </TabsContent>

        {/* Donation Track Tab */}
        <TabsContent value="donations">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Donation Track</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fundApplications.map((application) => (
                  <div key={application._id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{application.fundId.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        application.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : application.status === "received"
                            ? "bg-blue-100 text-blue-800"
                            : application.status === "reported"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                      }`}>
                        {application.status}
                      </span>
                    </div>
                    {application.note && (
                      <p className="text-sm text-gray-500 mb-3">{application.note}</p>
                    )}
                    {application.status === "approved" && (
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="default" onClick={() => handleNomineeAction(application, "received")}>Approve</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">Report</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Report Non-Receipt</AlertDialogTitle>
                              <AlertDialogDescription>
                                Please provide a reason for reporting this donation.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <Textarea
                              value={reportReason}
                              onChange={e => setReportReason(e.target.value)}
                              placeholder="Enter reason..."
                            />
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleNomineeAction(application, "reported", reportReason)}>
                                Submit Report
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                    <p className="text-sm text-gray-500">Amount: ৳{application.requestedAmount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 