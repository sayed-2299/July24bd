"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Eye, CheckCircle2, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

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

export default function AdminNomineesPage() {
  const [statusFilter, setStatusFilter] = useState<"pending" | "verified" | "rejected">("pending")
  const [nominees, setNominees] = useState<Nominee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNominee, setSelectedNominee] = useState<Nominee | null>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const { toast } = useToast()

  // Fetch nominees for admin by status
  const fetchNominees = async (status: "pending" | "verified" | "rejected") => {
    try {
      setIsLoading(true)
      let apiStatus = status === "pending" ? "uno-verified" : status === "verified" ? "admin-verified" : "rejected";
      const response = await fetch(`/api/admin/nominees?status=${apiStatus}`, { credentials: "include" })
      const data = await response.json()
      if (data.success) {
        setNominees(data.data)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch nominees",
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

  useEffect(() => {
    fetchNominees(statusFilter)
  }, [statusFilter])

  // Admin verify/reject
  const handleAdminVerify = async (nomineeId: string, action: "approve" | "reject") => {
    try {
      const response = await fetch("/api/admin/nominees", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
          description: action === "approve" ? "Nominee verified by admin" : "Nominee rejected by admin"
        })
        setShowRejectDialog(false)
        setRejectionReason("")
        setSelectedNominee(null)
        fetchNominees(statusFilter)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update nominee",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update nominee",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Nominee Verification</h1>
      <Card>
        <CardHeader>
          <CardTitle>Nominee Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value={statusFilter}>
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : nominees.length === 0 ? (
                <div className="text-center py-4">No nominees found</div>
              ) : (
                <div className="grid gap-4">
                  {nominees.map((nominee) => (
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
                                  {/* Admin Verification Actions */}
                                  {statusFilter === "pending" && (
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
                                        onClick={() => handleAdminVerify(nominee._id, "approve")}
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
          </Tabs>
        </CardContent>
      </Card>
      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Nominee</DialogTitle>
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
                  handleAdminVerify(selectedNominee._id, "reject")
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