"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, ImageIcon, DollarSign, AlertTriangle, CheckCircle, Clock, Activity, UserCog } from "lucide-react"
import Link from "next/link"

// Mock data for dashboard stats
const dashboardStats = {
  pendingVerifications: {
    victims: 24,
    nominees: 18,
    content: 12,
    donors: 8,
  },
  recentActivity: [
    { id: 1, action: "Victim record verified", user: "Admin", time: "10 minutes ago" },
    { id: 2, action: "New nominee submission", user: "System", time: "25 minutes ago" },
    { id: 3, action: "Article approved", user: "Admin", time: "1 hour ago" },
    { id: 4, action: "UNO account created", user: "Admin", time: "2 hours ago" },
    { id: 5, action: "Donation processed", user: "System", time: "3 hours ago" },
  ],
  systemAlerts: [
    { id: 1, message: "System backup scheduled for tonight at 2 AM", severity: "info" },
    { id: 2, message: "5 failed login attempts detected", severity: "warning" },
    { id: 3, message: "Database storage at 75% capacity", severity: "warning" },
  ],
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVictims: 0,
    totalNominees: 0,
    totalDonations: 0,
    totalContent: 0,
  })

  // Simulate data loading
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setStats({
        totalVictims: 156,
        totalNominees: 98,
        totalDonations: 245,
        totalContent: 87,
      })
    }, 1000)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Victims</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVictims}</div>
            <p className="text-xs text-gray-500">{dashboardStats.pendingVerifications.victims} pending verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Nominees</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNominees}</div>
            <p className="text-xs text-gray-500">{dashboardStats.pendingVerifications.nominees} pending verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDonations}</div>
            <p className="text-xs text-gray-500">{dashboardStats.pendingVerifications.donors} pending verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Content Items</CardTitle>
            <ImageIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContent}</div>
            <p className="text-xs text-gray-500">{dashboardStats.pendingVerifications.content} pending approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Verifications */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Verifications</CardTitle>
          <CardDescription>Items requiring your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/dashboard/victims">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Victim Records
                </span>
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {dashboardStats.pendingVerifications.victims}
                </span>
              </Button>
            </Link>

            <Link href="/admin/dashboard/nominees">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Nominee Records
                </span>
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {dashboardStats.pendingVerifications.nominees}
                </span>
              </Button>
            </Link>

            <Link href="/admin/dashboard/content">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Content Approval
                </span>
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {dashboardStats.pendingVerifications.content}
                </span>
              </Button>
            </Link>

            <Link href="/admin/dashboard/donors">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Donor Verification
                </span>
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {dashboardStats.pendingVerifications.donors}
                </span>
              </Button>
            </Link>

            {/* UNO Account Management */}
            <Link href="/admin/dashboard/uno-accounts">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center">
                  <UserCog className="h-4 w-4 mr-2" />
                  UNO Account Management
                </span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Activity and Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardStats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <Activity className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{activity.user}</span>
                      <span className="mx-1">•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Important notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardStats.systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    {alert.severity === "warning" ? (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    ) : alert.severity === "error" ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : alert.severity === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm">{alert.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
