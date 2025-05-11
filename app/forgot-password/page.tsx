"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Show success message without validation
    setSubmitted(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center py-4">
              <p className="text-green-600 mb-4">Password reset link has been sent to your email.</p>
              <Link href="/signin">
                <Button>Return to Sign In</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            </form>
          )}
        </CardContent>
        {!submitted && (
          <CardFooter className="text-center">
            <p>
              Remember your password?{" "}
              <Link href="/signin" className="text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
