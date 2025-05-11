"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDonorsDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/admin/reported-donations");
        const data = await res.json();
        if (data.success) {
          setReports(data.data);
        } else {
          setError(data.error || "Failed to fetch reports");
        }
      } catch (err) {
        setError("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Reported Donor Issues</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : reports.length === 0 ? (
        <div>No reported issues found.</div>
      ) : (
        <div className="space-y-4">
          {reports.map((tx) => (
            <Card key={tx._id}>
              <CardHeader>
                <CardTitle>Nominee Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <b>Nominee:</b> {tx.nomineeId?.fullName || tx.nomineeId?.name || "N/A"}
                </p>
                <p>
                  <b>Donor:</b> {tx.fundId?.donorId?.fullName || tx.fundId?.donorId?.name || "N/A"}
                </p>
                <p>
                  <b>Issue:</b> {tx.note || "No reason provided"}
                </p>
                <p>
                  <b>Date:</b> {new Date(tx.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 