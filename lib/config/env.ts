/**
 * Environment configuration
 * All environment variables should be accessed through this file
 */

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development'

// Get the API URL based on environment
// In development, ALWAYS use the Next.js proxy route to avoid CORS issues
// In production, use the direct backend URL or the public API URL
function getApiUrl(): string {
  // In development, ALWAYS use the proxy route (even if NEXT_PUBLIC_API_URL is set)
  // This ensures CORS is bypassed by proxying through Next.js server
  if (isDevelopment) {
    return '/api/backend'
  }
  
  // Production: use NEXT_PUBLIC_API_URL if set, otherwise fallback
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  
  // Production fallback
  return 'https://www.api.grahadventures.co.ke/api'
}

// Get the actual backend URL (for server-side use, like in the proxy route)
function getBackendApiUrl(): string {
  return process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
}

export const env = {
  // API Configuration
  // This is the URL the frontend client should use
  API_URL: getApiUrl(),
  
  // Backend API URL (for server-side proxying)
  BACKEND_API_URL: getBackendApiUrl(),
  
  // Frontend URL
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
  
  // Contact Information
  CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "grahadventureslimited@gmail.com",
  CONTACT_PHONE: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+254 720 911 762",
  
  // WhatsApp Configuration
  WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254720911762",
  
  // Helper to get API base URL without /api suffix (for health checks)
  getApiBaseUrl(): string {
    // In development with proxy, we need to use the actual backend URL for health checks
    if (isDevelopment && this.API_URL.startsWith('/api/backend')) {
      return getBackendApiUrl().replace(/\/api\/?$/, "").replace(/\/$/, "")
    }
    return this.API_URL.replace(/\/api\/?$/, "").replace(/\/$/, "")
  },
  
  // Helper to format phone number for tel: links
  getTelLink(): string {
    const phone = this.CONTACT_PHONE.replace(/\s+/g, "").replace(/^\+/, "")
    return `tel:+${phone}`
  },
  
  // Helper to get WhatsApp URL
  getWhatsAppUrl(message: string = "Hello! I'm interested in your hardware products."): string {
    return `https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  },
  
  // Check if we're in development
  isDevelopment,
}

