"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// This would typically come from an API call
const getRecipientData = (id: string) => ({
  id,
  name: "John Doe",
  age: 35,
  occupation: "Teacher",
  reason: "Lost home in recent disaster",
  requestedAmount: 1200,
  applicationDate: "2023-09-10",
})

export default function RecipientPage({ params }: { params: { id: string } }) {
  const [recipientData, setRecipientData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // In a real application, this would be an API call
    const data = getRecipientData(params.id)
    setRecipientData(data)
  }, [params.id])

  const handleApprove = () => {
    // Handle approval logic here
    console.log("Approving request for", recipientData.id)
    router.push("/dashboard/donor")
  }

  const handleDecline = () => {
    // Handle decline logic here
    console.log("Declining request for", recipientData.id)
    router.push("/dashboard/donor")
  }

  if (!recipientData) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Recipient Application Form</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>Name:</strong> {recipientData.name}
            </div>
            <div>
              <strong>Age:</strong> {recipientData.age}
            </div>
            <div>
              <strong>Occupation:</strong> {recipientData.occupation}
            </div>
            <div>
              <strong>Reason for Request:</strong> {recipientData.reason}
            </div>
            <div>
              <strong>Requested Amount:</strong> ${recipientData.requestedAmount}
            </div>
            <div>
              <strong>Application Date:</strong> {recipientData.applicationDate}
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <Button onClick={handleApprove}>Approve</Button>
            <Button onClick={handleDecline} variant="destructive">
              Decline
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
