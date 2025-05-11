"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function WriteArticlePage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [authorEmail, setAuthorEmail] = useState("")
  const [authorPhone, setAuthorPhone] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare article data
      const articleData = {
        title,
        content,
        author: {
          name: author,
          email: authorEmail,
          phone: authorPhone
        },
        category,
        tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        status: "pending"
      }

      // Send data to API
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(articleData)
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Article submitted successfully and pending approval"
        })
        router.push("/articles-gallery")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit article. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error submitting article:", error)
      toast({
        title: "Error",
        description: "Failed to submit article. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Write New Article</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select a category</option>
                <option value="news">News</option>
                <option value="story">Story</option>
                <option value="report">Report</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input 
                id="tags" 
                value={tags} 
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. news, community, support"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author Name</Label>
              <Input 
                id="author" 
                value={author} 
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authorEmail">Author Email</Label>
              <Input
                id="authorEmail"
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authorPhone">Author Phone</Label>
              <Input 
                id="authorPhone" 
                type="tel" 
                value={authorPhone} 
                onChange={(e) => setAuthorPhone(e.target.value)}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button 
            variant="outline" 
            onClick={() => router.push("/articles-gallery")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit for Approval"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
