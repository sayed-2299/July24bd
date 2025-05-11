"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, DollarSign } from "lucide-react"
import { useEffect, useState, use } from "react"

export default function FinancialSupportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params as Promise<{ id: string }>);
  const [financialData, setFinancialData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/victims/${id}/financial-support`)
        const data = await res.json()
        if (data.success) {
          setFinancialData(data.data)
        } else {
          setError(data.error || "Failed to fetch data")
        }
      } catch (err) {
        setError("Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>
  if (!financialData) return null

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 flex items-center">
            <Link href={`/victims/${id}`} className="mr-4">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Profile
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">Financial Support for {id}</h1>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" /> Financial Support Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">
                Total Amount Received: ৳{financialData.totalReceived.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Donor</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.transactions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center text-gray-500 py-4">
                          No transactions found.
                        </td>
                      </tr>
                    ) : (
                      financialData.transactions.map((tx: any) => (
                        <tr key={tx._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{new Date(tx.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-4">৳{tx.amount.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            {tx.fundId?.donorId?.name || tx.fundId?.donorName || "-"}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              tx.status === "received"
                                ? "bg-green-100 text-green-800"
                                : tx.status === "approved"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}>
                              {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
