"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false) // In a real app, this would come from auth context

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">JULY 24</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary font-medium">
              Home
            </Link>
            <Link href="/victims" className="text-gray-700 hover:text-primary font-medium">
              Victims
            </Link>
            <Link href="/articles-gallery" className="text-gray-700 hover:text-primary font-medium">
              Articles & Gallery
            </Link>
            <Link href="/support" className="text-gray-700 hover:text-primary font-medium">
              Support
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary font-medium">
              About
            </Link>
            {isAdmin && (
              <Link href="/admin/dashboard" className="text-primary hover:text-primary/80 font-medium">
                Admin
              </Link>
            )}
          </nav>

          {/* Sign In/Sign Out and Donate buttons */}
          <div className="hidden md:flex space-x-4">
            <Link href="/donate">
              <Button variant="default">Donate Now</Button>
            </Link>
            <Link href="/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b border-gray-200">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/victims"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Victims
            </Link>
            <Link
              href="/articles-gallery"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Articles & Gallery
            </Link>
            <Link
              href="/support"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Support
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-primary/80 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            <Link
              href="/donate"
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary hover:bg-primary/90"
              onClick={() => setIsMenuOpen(false)}
            >
              Donate Now
            </Link>
            <Link
              href="/signin"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
