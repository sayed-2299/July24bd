import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// This would typically come from a database or API
const articles = [
  {
    id: 1,
    title: "The Heroes of July 24: Remembering the Victims",
    excerpt: "A tribute to those who lost their lives and the brave individuals who stepped up during the tragedy.",
    author: "Jane Smith",
    date: "2023-08-01",
  },
  {
    id: 2,
    title: "Community Resilience in the Face of Adversity",
    excerpt: "How local communities have come together to support one another in the aftermath of July 24.",
    author: "John Doe",
    date: "2023-08-15",
  },
  // Add more articles as needed
]

export default function ArticlesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Link href="/articles/new">
          <Button>Write New Article</Button>
        </Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{article.excerpt}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500">
                By {article.author} on {article.date}
              </div>
              <Link href={`/articles/${article.id}`}>
                <Button variant="outline">Read More</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
