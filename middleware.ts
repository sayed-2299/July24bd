import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Add paths that don't require authentication
const publicPaths = [
  "/",
  "/signin",
  "/signup",
  "/forgot-password",
  "/api/auth/login",
  "/api/users",
  "/api/users/profile",
]

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Allow access to public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // If user is not logged in, redirect to sign in
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url))
  }

  // Get user's profile completion status
  const response = await fetch(`${request.nextUrl.origin}/api/users/profile`, {
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  })
  
  const data = await response.json()
  
  // If profile is not completed and not already on the complete-profile page
  if (!data.success || !data.data?.profileCompleted) {
    if (!pathname.startsWith("/complete-profile")) {
      return NextResponse.redirect(new URL("/complete-profile", request.url))
    }
  }

  // If profile is completed, check role-based access
  if (data.success && data.data?.profileCompleted) {
    const userRole = data.data.role

    // Redirect to appropriate dashboard if trying to access complete-profile
    if (pathname === "/complete-profile") {
      switch (userRole) {
        case "admin":
          return NextResponse.redirect(new URL("/admin/dashboard", request.url))
        case "donor":
          return NextResponse.redirect(new URL("/donor/dashboard", request.url))
        case "reporter":
          return NextResponse.redirect(new URL("/reporter/dashboard", request.url))
        case "nominee":
          return NextResponse.redirect(new URL("/nominee/dashboard", request.url))
        default:
          return NextResponse.redirect(new URL("/", request.url))
      }
    }

    // Check role-based access for protected routes
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }
    if (pathname.startsWith("/donor") && userRole !== "donor") {
      return NextResponse.redirect(new URL("/", request.url))
    }
    if (pathname.startsWith("/reporter") && userRole !== "reporter") {
      return NextResponse.redirect(new URL("/", request.url))
    }
    if (pathname.startsWith("/dashboard/uno") && userRole !== "uno") {
      return NextResponse.redirect(new URL("/", request.url))
    }
    if (pathname.startsWith("/nominee") && userRole !== "nominee") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/admin/:path*",
    "/donor/:path*",
    "/reporter/:path*",
    "/nominee/:path*",
    "/complete-profile",
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
