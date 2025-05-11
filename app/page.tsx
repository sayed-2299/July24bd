"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"

const heroImages = [
  "/images/slide1.jpg",
  "/images/slide2.jpg",
  "/images/slide3.jpg",
]

// Slideshow images data
// const slideshowImages = [
//   {
//     src: "/placeholder.svg?height=600&width=800",
//     alt: "Supporting victims and their families",
//     caption: "Providing immediate relief to affected families",
//   },
//   {
//     src: "/placeholder.svg?height=600&width=800",
//     alt: "Community support initiatives",
//     caption: "Building stronger communities through unity",
//   },
//   {
//     src: "/placeholder.svg?height=600&width=800",
//     alt: "Medical support services",
//     caption: "Ensuring access to quality healthcare",
//   },
// ]

// Victim statistics
const victimStats = {
  deceased: 45,
  injured: 120,
  missing: 15,
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center">
        {/* Background Slideshow */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt="Hero background"
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}

        {/* Content */}
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Supporting Victims of JULY-24</h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Together we can provide comfort, support, and resources to those affected by this devastating event.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signin?role=donor">
                <Button size="lg" className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50">
                  Donate Now <Heart className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/support">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white hover:bg-white/10"
                >
                  Support Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Controls */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index ? "bg-white w-6" : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* About JULY-24 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About JULY-24</h2>
            <p className="text-lg text-gray-600">
              JULY-24 marks a tragic day in our history. We are committed to supporting the victims and their families,
              ensuring they receive the care and assistance they need during this difficult time.
            </p>
          </div>
        </div>
      </section>

      {/* Victim Statistics */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Impact Summary</h2>
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <p className="text-4xl font-bold text-red-600 mb-2">{victimStats.deceased}</p>
                <p className="text-gray-600">Deceased</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <p className="text-4xl font-bold text-orange-600 mb-2">{victimStats.injured}</p>
                <p className="text-gray-600">Injured</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <p className="text-4xl font-bold text-yellow-600 mb-2">{victimStats.missing}</p>
                <p className="text-gray-600">Missing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Remember the Victims */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Remember the Victims</h2>
            <p className="text-gray-600 mb-8">
              We honor the memory of those lost and support those who were injured or affected by the events of JULY-24.
            </p>
            <Link href="/victims">
              <Button size="lg" className="flex items-center mx-auto">
                View Victims List <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join Us in Making a Difference</h2>
            <p className="text-lg mb-8 text-blue-100">
              Your support can help provide comfort, healing, and hope to those affected by the JULY-24 tragedy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signin?role=donor">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-blue-50">
                  Donate Now
                </Button>
              </Link>
              <Link href="/volunteer">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white hover:bg-white/10"
                >
                  Volunteer
                </Button>
              </Link>
            </div>
            <div className="mt-8 text-xs text-blue-200">
              <Link href="/signin?role=admin" className="hover:underline">
                Administrator Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Events</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Community Healing Circle</h3>
                <p className="text-gray-600 mb-4">
                  Join us for a community gathering focused on healing and remembrance.
                </p>
                <Link href="/events/healing-circle" className="text-primary font-medium hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Fundraising Dinner</h3>
                <p className="text-gray-600 mb-4">
                  A special evening to raise funds for the long-term support of affected families.
                </p>
                <Link href="/events/fundraising-dinner" className="text-primary font-medium hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Memorial Service</h3>
                <p className="text-gray-600 mb-4">
                  A memorial service to honor those lost and affected by the JULY-24 tragedy.
                </p>
                <Link href="/events/memorial-service" className="text-primary font-medium hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
