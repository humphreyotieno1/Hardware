import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return handleRequest(request, resolvedParams, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return handleRequest(request, resolvedParams, 'POST')
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return handleRequest(request, resolvedParams, 'PUT')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return handleRequest(request, resolvedParams, 'DELETE')
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return handleRequest(request, resolvedParams, 'PATCH')
}

async function handleRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string
) {
  try {
    const path = params.path.join('/')
    const url = new URL(request.url)
    const searchParams = url.searchParams.toString()
    
    // Handle special case for health endpoint (it's at root level, not under /api)
    let backendUrl: string
    if (path === 'health' || path === '../health') {
      // Health endpoint is at /health (root level)
      const backendBase = BACKEND_API_URL.replace(/\/api\/?$/, "").replace(/\/$/, "")
      backendUrl = `${backendBase}/health${searchParams ? `?${searchParams}` : ''}`
    } else {
      // Normal API endpoints under /api
      backendUrl = `${BACKEND_API_URL}/${path}${searchParams ? `?${searchParams}` : ''}`
    }

    // Get headers from request
    const headers: HeadersInit = {}
    
    // Forward authorization header if present
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      headers['authorization'] = authHeader
    }
    
    // Forward content-type if present
    const contentType = request.headers.get('content-type')
    if (contentType) {
      headers['content-type'] = contentType
    }
    
    // Forward ngrok-skip-browser-warning if present (to avoid ngrok warnings)
    const ngrokSkip = request.headers.get('ngrok-skip-browser-warning')
    if (ngrokSkip) {
      headers['ngrok-skip-browser-warning'] = ngrokSkip
    }
    
    // Always set ngrok-skip-browser-warning when proxying to ngrok
    if (BACKEND_API_URL.includes('ngrok')) {
      headers['ngrok-skip-browser-warning'] = 'true'
    }

    // Get request body if present
    let body: BodyInit | undefined
    if (method !== 'GET' && method !== 'DELETE') {
      const contentTypeHeader = request.headers.get('content-type')
      if (contentTypeHeader?.includes('application/json')) {
        body = await request.text()
      } else if (contentTypeHeader?.includes('multipart/form-data')) {
        body = await request.formData()
      } else {
        body = await request.blob()
      }
    }

    // Make request to backend
    const response = await fetch(backendUrl, {
      method,
      headers,
      body,
    })

    // Get response data
    const responseData = await response.text()
    let parsedData: any
    try {
      parsedData = JSON.parse(responseData)
    } catch {
      parsedData = responseData
    }

    // Return response with appropriate status and headers
    return NextResponse.json(parsedData, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Proxy request failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

