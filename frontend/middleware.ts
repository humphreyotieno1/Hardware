import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the route is an admin route
  if (pathname.startsWith('/admin')) {
    // Get the token from cookies
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      // No token, redirect to login with redirect parameter
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // For now, we'll let the client-side handle role checking
    // In a production app, you'd verify the token and role server-side
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}