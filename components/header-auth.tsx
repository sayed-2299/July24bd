"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { UserCircle } from "lucide-react"
import { useState } from "react"

export default function HeaderAuth() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false) // In a real app, this would come from auth context

  const handleSignOut = () => {
    // Simply redirect to sign in page without clearing any data
    router.push("/signin")
  }

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <UserCircle className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem asChild>
            <Link href="/profile">Profile Settings</Link>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/admin/dashboard">Admin Dashboard</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
