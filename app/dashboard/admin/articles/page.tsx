import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// This would typically come from a database or API
const pendingArticles = [
  {
    id: 2,
    title: "Community Resilience in the Face of Adversity",
    excerpt: "How local communities have come together to support one another in the aftermath of July 24.",
    author: "John Doe",
    date: "2023-08-15",
    image: "/placeholder.svg?height=200&width=300",
    status: "pending",
  },
  {
    id: 3,
    title: "The Road to Recovery: Rebuilding After July 24",
    excerpt: "An in-depth look at the ongoing efforts to rebuild and heal in the wake of the tragedy.",
    author: "Alice Johnson",
    date: "2023-08-20",
    image: "/placeholder.svg?height=200&width=300",
    status: "pending",
  },
  // Add more pending articles as needed
]

export default function AdminArticlesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard - Pending Articles</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingArticles.map((article) => (
          <Card key={article.id}>
            <CardContent className="p-0">
              <div className="relative h-48 w-full">
                <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{article.excerpt}</p>
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-2">
              <div className="text-sm text-gray-500">
                By {article.author} on {article.date}
              </div>
              <div className="flex justify-between items-center w-full">
                <Badge variant="secondary">Pending</Badge>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                  <Button variant="default" size="sm">
                    Approve
                  </Button>
                  <Button variant="destructive" size="sm">
                    Reject
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
