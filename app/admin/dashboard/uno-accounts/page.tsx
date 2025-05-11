"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Trash2, UserPlus, Key } from "lucide-react"
import { districts, subDistricts } from "@/lib/location-data"
import { useToast } from "@/components/ui/use-toast"

// Mock data for UNO accounts
const mockUNOAccounts = [
  {
    id: 1,
    username: "uno_dhaka_savar",
    district: "Dhaka",
    subDistrict: "Savar",
    status: "active",
    lastLogin: "2023-08-15 14:30",
    createdAt: "2023-07-01",
  },
  {
    id: 2,
    username: "uno_chittagong_anwara",
    district: "Chittagong",
    subDistrict: "Anwara",
    status: "active",
    lastLogin: "2023-08-14 09:15",
    createdAt: "2023-07-02",
  },
  {
    id: 3,
    username: "uno_rajshahi_bagha",
    district: "Rajshahi",
    subDistrict: "Bagha",
    status: "inactive",
    lastLogin: "2023-08-10 11:45",
    createdAt: "2023-07-03",
  },
]

export default function UNOAccountsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false)
  const [selectedUNO, setSelectedUNO] = useState<any>(null)
  const [unoAccounts, setUnoAccounts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const [newUNOData, setNewUNOData] = useState({
    district: "",
    subDistrict: "",
    password: "",
    confirmPassword: "",
  })

  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  })

  // Generate username and email
  const generatedUsername = newUNOData.district && newUNOData.subDistrict
    ? `uno_${newUNOData.district.toLowerCase().replace(/\s+/g, "_")}_${newUNOData.subDistrict.toLowerCase().replace(/\s+/g, "_")}`
    : ""
  const generatedEmail = generatedUsername ? `${generatedUsername}@gmail.com` : ""

  // Fetch UNO accounts
  const fetchUNOAccounts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/users/uno')
      const data = await response.json()
      if (data.success) {
        setUnoAccounts(data.data)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch UNO accounts",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch UNO accounts",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUNOAccounts()
  }, [])

  // Filter UNO accounts based on search query
  const filteredUNOAccounts = unoAccounts.filter(
    (account) =>
      account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.subDistrict.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateUNO = async () => {
    try {
      setIsCreating(true);
      
      // Validate password match
      if (newUNOData.password !== newUNOData.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive"
        });
        return;
      }

      // Validate password length
      if (newUNOData.password.length < 6) {
        toast({
          title: "Error",
          description: "Password must be at least 6 characters long",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch("/api/users/uno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          district: newUNOData.district,
          subDistrict: newUNOData.subDistrict,
          password: newUNOData.password,
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: `UNO account created successfully. Email: ${data.data.email}`
        });
        setShowCreateDialog(false);
        setNewUNOData({ district: "", subDistrict: "", password: "", confirmPassword: "" });
        fetchUNOAccounts();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create UNO account",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create UNO account",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleResetPassword = () => {
    // In a real app, this would be an API call
    console.log("Resetting password for UNO:", selectedUNO?.id, "New password:", resetPasswordData.newPassword)
    setShowResetPasswordDialog(false)
    // Reset form
    setResetPasswordData({
      newPassword: "",
      confirmPassword: "",
    })
  }

  const openResetPasswordDialog = (uno: any) => {
    setSelectedUNO(uno)
    setShowResetPasswordDialog(true)
  }

  const handleDistrictChange = (value: string) => {
    setNewUNOData({
      ...newUNOData,
      district: value,
      subDistrict: "", // Reset sub-district when district changes
    })
  }

  const handleSubDistrictChange = (value: string) => {
    setNewUNOData({
      ...newUNOData,
      subDistrict: value,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">UNO Account Management</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Create UNO Account
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by username, district, or sub-district..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>UNO Accounts</CardTitle>
          <CardDescription>
            Manage UNO (Upazila Nirbahi Officer) accounts for district-level administration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Sub-District</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUNOAccounts.map((account) => (
                  <TableRow key={account._id}>
                    <TableCell className="font-medium">{account.username}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{account.district}</TableCell>
                    <TableCell>{account.subDistrict}</TableCell>
                    <TableCell>
                      <Badge variant={account.status === "active" ? "success" : "secondary"}>
                        {account.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(account.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openResetPasswordDialog(account)}>
                          <Key className="h-4 w-4" />
                          <span className="sr-only">Reset Password</span>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create UNO Account Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create UNO Account</DialogTitle>
            <DialogDescription>
              Create a new UNO account for district-level administration
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <Select value={newUNOData.district} onValueChange={handleDistrictChange}>
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

            {newUNOData.district && (
              <div className="space-y-2">
                <Label htmlFor="subDistrict">Sub-District</Label>
                <Select value={newUNOData.subDistrict} onValueChange={handleSubDistrictChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub-district" />
                  </SelectTrigger>
                  <SelectContent>
                    {subDistricts[newUNOData.district]?.map((subDistrict) => (
                      <SelectItem key={subDistrict} value={subDistrict}>
                        {subDistrict}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={generatedUsername} disabled />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={generatedEmail} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={newUNOData.password}
                onChange={(e) => setNewUNOData({ ...newUNOData, password: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={newUNOData.confirmPassword}
                onChange={(e) => setNewUNOData({ ...newUNOData, confirmPassword: e.target.value })}
              />
              {newUNOData.password &&
                newUNOData.confirmPassword &&
                newUNOData.password !== newUNOData.confirmPassword && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateUNO}
              disabled={
                isCreating ||
                !newUNOData.district ||
                !newUNOData.subDistrict ||
                !newUNOData.password ||
                newUNOData.password !== newUNOData.confirmPassword ||
                newUNOData.password.length < 6
              }
            >
              {isCreating ? "Creating..." : "Create Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={showResetPasswordDialog} onOpenChange={setShowResetPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Reset password for UNO account: {selectedUNO?.username}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={resetPasswordData.newPassword}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={resetPasswordData.confirmPassword}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })}
              />
              {resetPasswordData.newPassword &&
                resetPasswordData.confirmPassword &&
                resetPasswordData.newPassword !== resetPasswordData.confirmPassword && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetPasswordDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleResetPassword}
              disabled={
                !resetPasswordData.newPassword || resetPasswordData.newPassword !== resetPasswordData.confirmPassword
              }
            >
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
