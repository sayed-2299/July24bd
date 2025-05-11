"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, XCircle, Eye } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Article {
  _id: string
  articleId: string
  title: string
  content: string
  author: {
    name: string
    email: string
    phone?: string
    organization?: string
  }
  category: string
  tags: string[]
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export default function AdminContentPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")
  const { toast } = useToast()
  const [showPreview, setShowPreview] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  useEffect(() => {
    fetchArticles()
  }, [activeTab])

  const fetchArticles = async () => {
    try {
      const response = await fetch(`/api/articles?status=${activeTab}`)
      const data = await response.json()
      if (data.success) {
        setArticles(data.data)
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
      toast({
        title: "Error",
        description: "Failed to fetch articles",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (articleId: string, status: "approved" | "rejected") => {
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: `Article ${status === "approved" ? "approved" : "rejected"} successfully`
        })
        fetchArticles()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update article status",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error updating article status:", error)
      toast({
        title: "Error",
        description: "Failed to update article status",
        variant: "destructive"
      })
    }
  }

  const openPreview = (article: Article) => {
    setSelectedArticle(article)
    setShowPreview(true)
  }
  const closePreview = () => {
    setShowPreview(false)
    setSelectedArticle(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : articles.length === 0 ? (
                <div className="text-center py-4">No articles found</div>
              ) : (
                <div className="grid gap-4">
                  {articles.map((article) => (
                    <Card key={article._id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{article.title}</h3>
                            <p className="text-sm text-gray-500">ID: {article.articleId}</p>
                            <p className="text-sm">Author: {article.author.name}</p>
                            <p className="text-sm">Category: {article.category}</p>
                            <p className="text-sm">Tags: {article.tags.join(", ")}</p>
                            <p className="text-sm text-gray-500">
                              Submitted: {new Date(article.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Link href="#" onClick={() => openPreview(article)}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={closePreview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Article Preview</DialogTitle>
          </DialogHeader>
          {selectedArticle && (
            <div className="space-y-2">
              <h3 className="font-bold text-lg">{selectedArticle.title}</h3>
              <p className="text-sm text-gray-500">ID: {selectedArticle.articleId}</p>
              <p className="text-sm">Author: {selectedArticle.author.name}</p>
              <p className="text-sm">Category: {selectedArticle.category}</p>
              <p className="text-sm">Tags: {selectedArticle.tags.join(", ")}</p>
              <p className="text-sm text-gray-500">
                Submitted: {new Date(selectedArticle.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-4">
                <p>{selectedArticle.content}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedArticle && activeTab === "pending" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { handleVerification(selectedArticle._id, "approved"); closePreview(); }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { handleVerification(selectedArticle._id, "rejected"); closePreview(); }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
