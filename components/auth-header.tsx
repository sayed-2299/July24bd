"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserCircle } from "lucide-react"

export default function AuthHeader() {
  const router = useRouter()

  const handleSignOut = () => {
    // Simply redirect to sign in page without clearing any data
    router.push("/signin")
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">JULY 24</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/profile" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <UserCircle className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
