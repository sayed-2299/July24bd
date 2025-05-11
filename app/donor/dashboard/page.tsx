"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface DonorInfo {
  donorType?: "individual" | "organization"
  fullName: string
  email: string
  phone: string
  district: string
  subDistrict: string
  address?: string
  nid?: string
  organizationName?: string
  registrationNo?: string
  status?: string
}

interface Fund {
  _id: string
  title: string
  amount: number
  description: string
  createdAt: string
}

interface FundTransaction {
  _id: string
  fundId: string
  nomineeName: string
  amount: number
  date: string
  note?: string
}

interface FundApplication {
  _id: string
  fundId: {
    _id: string
    title: string
    amount: number
  }
  nomineeId: {
    name: string
    nid: string
    phone: string
    relationship: string
    district: string
    subDistrict: string
  }
  victimId: {
    fullName: string
    victimId: string
  }
  nomineeSnapshot?: {
    name?: string
    nid?: string
    phone?: string
    email?: string
    district?: string
    subDistrict?: string
    relationship?: string
    address?: string
  }
  victimSnapshot?: {
    victimId?: string
    fullName?: string
  }
  requestedAmount: number
  note?: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

// Placeholder data for demonstration (replace with real API data)
const donationHistory = [
  { id: 1, date: "2023-08-01", amount: 1000, recipient: "Victim Support Fund" },
  { id: 2, date: "2023-08-15", amount: 500, recipient: "Community Rebuilding Project" },
  { id: 3, date: "2023-09-01", amount: 750, recipient: "Medical Aid Initiative" },
]

const pendingDonations = [
  { id: 1, date: "2023-09-10", amount: 1200, recipient: "John Doe", recipientId: "JD001", status: "Pending Approval" },
  { id: 2, date: "2023-09-12", amount: 300, recipient: "Jane Smith", recipientId: "JS002", status: "Pending Approval" },
]

const createdFunds = [
  { id: 1, title: "Emergency Relief Fund", totalAmount: 5000, availableAmount: 3500 },
  { id: 2, title: "Children's Education Support", totalAmount: 10000, availableAmount: 8000 },
]

export default function DonorDashboard() {
  const [donorInfo, setDonorInfo] = useState<DonorInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newFund, setNewFund] = useState({
    title: "",
    amount: "",
    description: ""
  })
  const router = useRouter()
  const { toast } = useToast()
  const [funds, setFunds] = useState<Fund[]>([])
  const [applications, setApplications] = useState<FundApplication[]>([])
  const [fundCreated, setFundCreated] = useState(false)
  const [fundTransactions, setFundTransactions] = useState<{ [fundId: string]: FundTransaction[] }>({})

  useEffect(() => {
    const fetchDonorInfo = async () => {
      try {
        const response = await fetch("/api/donors")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch donor information")
        }

        setDonorInfo(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch donor information")
      } finally {
        setLoading(false)
      }
    }

    fetchDonorInfo()
  }, [])

  useEffect(() => {
    fetchFunds()
    fetchApplications()
    fetchFundTransactions()
  }, [])

  const fetchFunds = async () => {
    try {
      const response = await fetch("/api/funds", {
        credentials: "include"
      })
      const data = await response.json()
      if (data.success) {
        setFunds(data.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch funds",
        variant: "destructive",
      })
    }
  }

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/funds/applications", {
        credentials: "include"
      })
      const data = await response.json()
      if (data.success) {
        setApplications(data.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchFundTransactions = async () => {
    try {
      const response = await fetch("/api/funds/applications", {
        credentials: "include"
      })
      const data = await response.json()
      if (data.success) {
        // Include both approved and received applications
        const txs: { [fundId: string]: FundTransaction[] } = {}
        data.data.forEach((app: any) => {
          if (app.status === "approved" || app.status === "received") {
            const fundId = app.fundId._id || app.fundId;
            if (!txs[fundId]) txs[fundId] = [];
            txs[fundId].push({
              _id: app._id,
              fundId,
              nomineeName: app.nomineeSnapshot?.name || app.nomineeId?.name || "",
              amount: app.requestedAmount,
              date: app.createdAt,
              note: app.note
            })
          }
        })
        setFundTransactions(txs)
      }
    } catch {}
  }

  const handleCreateFund = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/funds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...newFund,
          amount: Number(newFund.amount)
        }),
      })
      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Fund created successfully",
        })
        setNewFund({ title: "", amount: "", description: "" })
        setFundCreated(true)
        fetchFunds()
        setTimeout(() => setFundCreated(false), 3000)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create fund",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create fund",
        variant: "destructive",
      })
    }
  }

  const handleUpdateApplicationStatus = async (applicationId: string, status: "approved" | "rejected") => {
    try {
      const response = await fetch(`/api/funds/applications/${applicationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status }),
      })
      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: `Application ${status} successfully`,
        })
        fetchApplications()
      } else {
        toast({
          title: "Error",
          description: data.error || `Failed to ${status} application`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${status} application`,
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
              <p>Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Donor Dashboard</h1>
      <Tabs defaultValue="history">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending Donations</TabsTrigger>
          <TabsTrigger value="funds">My Funds</TabsTrigger>
          <TabsTrigger value="create">Create Fund</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Donation Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.length === 0 ? (
                  <p className="text-center text-gray-500">No pending applications</p>
                ) : (
                  applications.map((application) => (
                    <div key={application._id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-medium">{application.fundId.title}</h3>
                          <p className="text-sm text-gray-500">Amount: ৳{application.fundId.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">Requested: ৳{application.requestedAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Nominee Information</h4>
                          <p className="text-sm">Name: {application.nomineeSnapshot?.name || "N/A"}</p>
                          <p className="text-sm">NID: {application.nomineeSnapshot?.nid || "N/A"}</p>
                          <p className="text-sm">Phone: {application.nomineeSnapshot?.phone || "N/A"}</p>
                          <p className="text-sm">Email: {application.nomineeSnapshot?.email || "N/A"}</p>
                          <p className="text-sm">Relation with Victim: {application.nomineeSnapshot?.relationship || "N/A"}</p>
                          <p className="text-sm">Address: {application.nomineeSnapshot ? `${application.nomineeSnapshot.district}, ${application.nomineeSnapshot.subDistrict}` : "N/A"}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Victim Information</h4>
                          <p className="text-sm">Name: {application.victimSnapshot?.fullName || "N/A"}</p>
                          <p className="text-sm">Victim ID: {application.victimSnapshot?.victimId || "N/A"}</p>
                        </div>
                        {application.note && (
                          <div>
                            <h4 className="font-medium">Note</h4>
                            <p className="text-sm">{application.note}</p>
                          </div>
                        )}
                      </div>
                      {application.status === "pending" && (
                        <div className="mt-4 flex gap-2">
                          <Button
                            onClick={() => handleUpdateApplicationStatus(application._id, "approved")}
                            className="flex-1"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleUpdateApplicationStatus(application._id, "rejected")}
                            variant="destructive"
                            className="flex-1"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {application.status !== "pending" && (
                        <div className="mt-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            application.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {application.status}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="funds">
          <Card>
            <CardHeader>
              <CardTitle>My Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Fund Title</th>
                    <th className="text-left">Available Amount</th>
                    <th className="text-left">Transaction History</th>
                  </tr>
                </thead>
                <tbody>
                  {funds.map((fund) => (
                    <tr key={fund._id}>
                      <td>{fund.title}</td>
                      <td>৳{fund.amount.toLocaleString()}</td>
                      <td>
                        {fundTransactions[fund._id] && fundTransactions[fund._id].length > 0 ? (
                          <details>
                            <summary className="cursor-pointer">Show Transactions</summary>
                            <table className="w-full text-xs mt-2">
                              <thead>
                                <tr>
                                  <th className="px-4 py-2 text-left">Nominee</th>
                                  <th className="px-4 py-2 text-left">Amount</th>
                                  <th className="px-4 py-2 text-left">Date</th>
                                  <th className="px-4 py-2 text-left">Note</th>
                                </tr>
                              </thead>
                              <tbody>
                                {fundTransactions[fund._id].map((tx) => (
                                  <tr key={tx._id}>
                                    <td className="px-4 py-2">{tx.nomineeName}</td>
                                    <td className="px-4 py-2">৳{tx.amount.toLocaleString()}</td>
                                    <td className="px-4 py-2">{new Date(tx.date).toLocaleString()}</td>
                                    <td className="px-4 py-2">{tx.note || "-"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </details>
                        ) : (
                          <span className="text-gray-400">No transactions</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="create">
          {fundCreated && (
            <div className="mb-4 p-3 rounded bg-green-100 text-green-800 text-center font-medium">
              Fund created successfully!
            </div>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Create a New Fund</CardTitle>
              <CardDescription>
                Create a new fund to help victims in need.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateFund} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    type="text"
                    value={newFund.title}
                    onChange={(e) => setNewFund({ ...newFund, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Amount (৳)</label>
                  <Input
                    type="number"
                    value={newFund.amount}
                    onChange={(e) => setNewFund({ ...newFund, amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newFund.description}
                    onChange={(e) => setNewFund({ ...newFund, description: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Fund
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              {donorInfo && (
                <div className="grid gap-4">
                  <div>
                    <p className="font-semibold">Name</p>
                    <p>{donorInfo.fullName}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p>{donorInfo.email}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Contact Information</p>
                    <p>Phone: {donorInfo.phone}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Location</p>
                    <p>{donorInfo.district}, {donorInfo.subDistrict}</p>
                  </div>
                  {donorInfo.address && (
                    <div>
                      <p className="font-semibold">Address</p>
                      <p>{donorInfo.address}</p>
                    </div>
                  )}
                  {donorInfo.nid && (
                    <div>
                      <p className="font-semibold">National ID</p>
                      <p>{donorInfo.nid}</p>
                    </div>
                  )}
                  {donorInfo.organizationName && (
                    <div>
                      <p className="font-semibold">Organization Name</p>
                      <p>{donorInfo.organizationName}</p>
                    </div>
                  )}
                  {donorInfo.registrationNo && (
                    <div>
                      <p className="font-semibold">Registration No</p>
                      <p>{donorInfo.registrationNo}</p>
                    </div>
                  )}
                  {donorInfo.donorType && (
                    <div>
                      <p className="font-semibold">Donor Type</p>
                      <p className="capitalize">{donorInfo.donorType}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
