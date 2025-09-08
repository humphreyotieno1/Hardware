import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the route is an admin route
  if (pathname.startsWith('/admin')) {
    // Get the token from cookies
    const token = request.cookies.get('auth-token')?.value
    
    console.log('Middleware: Checking admin route:', pathname)
    console.log('Middleware: Auth token found:', !!token)
    console.log('Middleware: Token value:', token ? `${token.substring(0, 20)}...` : 'none')
    console.log('Middleware: All cookies:', request.cookies.getAll().map(c => c.name))
    
    if (!token) {
      // No token, redirect to login with redirect parameter
      console.log('Middleware: No token found, redirecting to login')
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    console.log('Middleware: Token found, allowing access')
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