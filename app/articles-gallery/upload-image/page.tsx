"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function UploadImagePage() {
  const [caption, setCaption] = useState("")
  const [source, setSource] = useState("")
  const [uploaderName, setUploaderName] = useState("")
  const [uploaderEmail, setUploaderEmail] = useState("")
  const [uploaderPhone, setUploaderPhone] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simply redirect back to the gallery page without validation
    router.push("/articles-gallery")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Upload New Image</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Image File</Label>
              <Input id="file" type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea id="caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input id="source" value={source} onChange={(e) => setSource(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uploaderName">Uploader Name</Label>
              <Input id="uploaderName" value={uploaderName} onChange={(e) => setUploaderName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uploaderEmail">Uploader Email</Label>
              <Input
                id="uploaderEmail"
                type="email"
                value={uploaderEmail}
                onChange={(e) => setUploaderEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uploaderPhone">Uploader Phone</Label>
              <Input
                id="uploaderPhone"
                type="tel"
                value={uploaderPhone}
                onChange={(e) => setUploaderPhone(e.target.value)}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => router.push("/articles-gallery")}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Submit for Approval
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
