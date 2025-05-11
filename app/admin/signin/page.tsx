"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminSignIn() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // In a real application, you would validate credentials against a backend
    // For demo purposes, we'll use a simple check
    if (username === "admin" && password === "password") {
      // Simulate API call delay
      setTimeout(() => {
        router.push("/admin/dashboard")
      }, 1000)
    } else {
      setError("Invalid username or password")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative h-16 w-16">
              <Image src="/placeholder.svg?height=64&width=64" alt="JULY 24 Logo" fill className="object-contain" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">JULY 24 Admin Portal</h1>
          <p className="text-gray-600">Sign in to access the admin dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              For security reasons, there is no sign-up option. Contact the system administrator for access.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
