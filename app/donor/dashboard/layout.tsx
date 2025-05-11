"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, X, DollarSign, FileText } from "lucide-react"

export default function DonorDashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = () => {
    // In a real app, you would clear auth state/cookies
    router.push("/signin")
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/donor/dashboard",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      name: "My Donations",
      href: "/donor/dashboard/donations",
      icon: <FileText className="h-5 w-5" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg text-primary">JULY 24 Donor</span>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <span className="text-xl font-bold text-primary">JULY 24 Donor</span>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <Button variant={pathname === item.href ? "secondary" : "ghost"} className="w-full justify-start">
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-200 ${sidebarOpen ? "lg:ml-64" : ""}`}>
        <div className="min-h-screen pt-16 lg:pt-0">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
} 