import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

// This would typically come from a database or API
const galleryItems = [
  {
    id: 1,
    src: "/placeholder.svg?height=300&width=300",
    caption: "Memorial service for the victims of July 24",
    date: "2023-08-01",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=300&width=300",
    caption: "Community volunteers helping with relief efforts",
    date: "2023-08-15",
  },
  // Add more gallery items as needed
]

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gallery</h1>
        <Link href="/gallery/upload">
          <Button>Upload New Image</Button>
        </Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-0">
              <div className="relative h-64 w-full">
                <Image src={item.src || "/placeholder.svg"} alt={item.caption} fill className="object-cover" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <p className="text-sm text-gray-600 mb-2">{item.caption}</p>
              <p className="text-xs text-gray-500">Uploaded on {item.date}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
