import { decrypt } from '@/lib/jwt'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Check if the route is in the dashboard group
  if (
    request.nextUrl.pathname.startsWith('/(dashboard)') ||
    request.nextUrl.pathname.startsWith('/my-account')
  ) {
    const session = request.cookies.get('session')?.value

    try {
      // Verify JWT token
      const payload = await decrypt(session)

      if (!payload) {
        // Redirect to home page if no valid session
        return NextResponse.redirect(new URL('/', request.url))
      }

      // Valid session, continue to protected route
      return NextResponse.next()
    } catch (error) {
      console.error('Middleware auth error:', error)
      // Redirect to home page on auth error
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Continue for non-protected routes
  return NextResponse.next()
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    // Match all dashboard routes
    '/(dashboard)/:path*',
    // Match my-account routes
    '/my-account/:path*',
  ],
}
