import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Landmark, Users, Clock, HandHeart, Phone } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">How You Can Help</h1>
          <p className="text-lg text-gray-600 mb-8">
            There are many ways to support the July 24 Project and the affected community. Every contribution makes a
            difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signin?role=donor">
              <Button size="lg" className="w-full sm:w-auto">
                Donate Now <Heart className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/volunteer">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Volunteer
              </Button>
            </Link>
          </div>
        </div>

        {/* Ways to Support */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Financial Donations</h3>
            <p className="text-gray-600 mb-4">
              Your financial contribution helps provide immediate and long-term support to victims and their families.
            </p>
            <Link href="/donate">
              <Button variant="outline" className="w-full">
                Donate
              </Button>
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Volunteer Your Time</h3>
            <p className="text-gray-600 mb-4">
              Join our volunteer network to help with events, outreach, and support services for affected families.
            </p>
            <Link href="/volunteer">
              <Button variant="outline" className="w-full">
                Volunteer
              </Button>
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Landmark className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Corporate Partnerships</h3>
            <p className="text-gray-600 mb-4">
              Businesses can partner with us to provide resources, services, or financial support to the July 24
              Project.
            </p>
            <Link href="/partners">
              <Button variant="outline" className="w-full">
                Partner With Us
              </Button>
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <HandHeart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">In-Kind Donations</h3>
            <p className="text-gray-600 mb-4">
              Donate goods, services, or professional expertise to help victims and families rebuild their lives.
            </p>
            <Link href="/in-kind">
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fundraising Events</h3>
            <p className="text-gray-600 mb-4">
              Organize or participate in fundraising events to support the July 24 Project's mission and initiatives.
            </p>
            <Link href="/events">
              <Button variant="outline" className="w-full">
                View Events
              </Button>
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Spread Awareness</h3>
            <p className="text-gray-600 mb-4">
              Help spread awareness about the July 24 Project by sharing our mission and stories on social media.
            </p>
            <Link href="/share">
              <Button variant="outline" className="w-full">
                Share Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Verification & Authenticity Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Verified & Trustworthy Information</h2>
            <div className="prose prose-gray mx-auto text-center">
              <p className="text-gray-600 mb-4">
                Every piece of information on this platform undergoes rigorous verification through multiple authorities
                and checkpoints. Our commitment to authenticity ensures that all victim records, claims, and
                transactions are thoroughly validated.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <h3 className="font-semibold text-primary mb-2">Multi-Level Verification</h3>
                  <p className="text-sm text-gray-600">Each record is verified by multiple government authorities</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-primary mb-2">Transparent Process</h3>
                  <p className="text-sm text-gray-600">
                    Complete transparency in verification and transaction tracking
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-primary mb-2">Secure Records</h3>
                  <p className="text-sm text-gray-600">All information is securely maintained and regularly audited</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="max-w-3xl mx-auto mb-16">
          <blockquote className="italic text-lg text-gray-600 text-center">
            "The support from the July 24 Project has been a lifeline for our family during this difficult time. The
            financial assistance helped with medical bills, and the community support has given us strength to keep
            going."
          </blockquote>
          <p className="text-center mt-4 font-medium">— Sarah K., family member of a victim</p>
        </div>

        {/* CTA */}
        <div className="bg-primary text-white rounded-lg p-8 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="mb-6">
            Join us in supporting the victims and families affected by the July 24 tragedy. Every contribution, no
            matter the size, helps provide comfort, healing, and hope.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signin?role=donor">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-blue-50">
                Donate Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white/10"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
