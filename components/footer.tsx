import Link from "next/link"
import { Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">JULY 24</span>
              <span className="ml-2 text-sm text-muted-foreground">Project</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 max-w-md">
              Supporting victims and families affected by the events of July 24. Together we can make a difference in
              the lives of those impacted.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/victims" className="text-sm text-gray-600 hover:text-primary">
                  Victims List
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-gray-600 hover:text-primary">
                  Support Services
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-sm text-gray-600 hover:text-primary">
                  News & Updates
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-600 hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Connect</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className="text-sm text-gray-600 hover:text-primary">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-sm text-gray-600 hover:text-primary">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} JULY 24 Project. All rights reserved.
          </p>
          <p className="mt-4 md:mt-0 text-sm text-gray-500 flex items-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for the community
          </p>
        </div>
      </div>
    </footer>
  )
}
