"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Image from "next/image"

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

interface GalleryItem {
  _id: string
  caption: string
  src: string
  photographer?: string
  source?: string
  uploaderName?: string
  uploaderEmail?: string
  uploaderPhone?: string
  status: "pending" | "approved" | "declined"
  date: string
}

export default function ArticlesGalleryPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [isLoadingArticles, setIsLoadingArticles] = useState(true)
  const [isLoadingGallery, setIsLoadingGallery] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("articles")

  useEffect(() => {
    fetchArticles()
    fetchGallery()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/articles?status=approved")
      const data = await response.json()
      if (data.success) {
        setArticles(data.data)
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
    } finally {
      setIsLoadingArticles(false)
    }
  }

  const fetchGallery = async () => {
    try {
      const response = await fetch("/api/gallery?status=approved")
      const data = await response.json()
      if (data.success) {
        setGalleryItems(data.data)
      }
    } catch (error) {
      console.error("Error fetching gallery items:", error)
    } finally {
      setIsLoadingGallery(false)
    }
  }

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Articles & Gallery</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore stories, experiences, and insights shared by our community members about the events of July 24.
        </p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>
        <TabsContent value="articles">
          <div className="flex justify-between items-center mb-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search articles..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link href="/articles-gallery/write-article">
              <Button>Write an Article</Button>
            </Link>
          </div>
          {isLoadingArticles ? (
            <div className="text-center py-8">Loading articles...</div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No articles found</p>
              <Link href="/articles-gallery/write-article">
                <Button variant="outline" className="mt-4">
                  Be the first to write an article
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <Link key={article._id} href={`/articles-gallery/${article.articleId}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-2">By {article.author.name}</p>
                      <p className="text-sm text-gray-500 mb-4">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600 line-clamp-3">{article.content}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="gallery">
          <div className="flex justify-end mb-8">
            <Link href="/articles-gallery/upload-image">
              <Button>Upload New Image</Button>
            </Link>
          </div>
          {isLoadingGallery ? (
            <div className="text-center py-8">Loading gallery...</div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No gallery items found</p>
              <Link href="/articles-gallery/upload-image">
                <Button variant="outline" className="mt-4">
                  Be the first to upload an image
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((item) => (
                <Card key={item._id}>
                  <CardContent className="p-0">
                    <div className="relative h-64 w-full">
                      <Image src={item.src || "/placeholder.svg"} alt={item.caption} fill className="object-cover" />
                    </div>
                  </CardContent>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{item.caption}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-2">{item.photographer || item.uploaderName}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {item.date ? new Date(item.date).toLocaleDateString() : ""}
                    </p>
                    <p className="text-gray-600 line-clamp-3">{item.source}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
