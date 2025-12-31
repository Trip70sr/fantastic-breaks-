import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if accessing employee management routes
  if (pathname.startsWith("/api/employees") || pathname.startsWith("/management")) {
    // In production, this would verify JWT token and check role
    // For now, we check localStorage-based session via headers
    const sessionHeader = request.headers.get("x-admin-session")

    if (!sessionHeader) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    try {
      const session = JSON.parse(sessionHeader)

      const allowedRoles = ["manager", "hr_admin", "admin", "director"]

      if (!allowedRoles.includes(session.role)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }
    } catch {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Handle shared access routes
  if (pathname.startsWith("/shared/")) {
    // Allow shared routes to proceed
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/shared/:path*", "/api/employees/:path*", "/management/:path*"],
}
