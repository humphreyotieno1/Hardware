// CRUD Service Layer for Admin Operations
// This service layer handles all Create, Read, Update, Delete operations
// Ready for backend API integration

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface Product {
  id: string
  name: string
  description: string
  shortDescription: string
  sku: string
  category: string
  subcategory: string
  price: number
  comparePrice?: number
  cost?: number
  stock: number
  minStock: number
  weight?: number
  dimensions: {
    length?: number
    width?: number
    height?: number
  }
  supplier?: string
  brand?: string
  tags: string[]
  status: 'draft' | 'active' | 'inactive'
  featured: boolean
  taxable: boolean
  requiresShipping: boolean
  images: string[]
  variants: ProductVariant[]
  seo: {
    title?: string
    description?: string
    keywords?: string
  }
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  attributes: Record<string, string>
}

export interface Order {
  id: string
  customer: Customer
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: OrderItem[]
  priority: 'high' | 'medium' | 'normal'
  deliveryAddress: string
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed'
  shippingMethod: string
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  name: string
  quantity: number
  price: number
  image?: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  type: 'individual' | 'contractor' | 'business' | 'government'
  orders: number
  totalSpent: number
  joinDate: string
  status: 'active' | 'inactive' | 'suspended'
  lastOrder?: string
  location: string
  rating: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  children?: Category[]
  productCount: number
  status: 'active' | 'inactive'
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  contactPerson: string
  products: number
  status: 'active' | 'inactive'
  notes?: string
  createdAt: string
  updatedAt: string
}

// Generic CRUD Operations
export class CrudService<T> {
  private baseUrl: string
  private endpoint: string

  constructor(endpoint: string) {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api'
    this.endpoint = endpoint
  }

  // Create
  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header when ready
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  // Read All with pagination and filters
  async getAll(params?: {
    page?: number
    limit?: number
    search?: string
    filters?: Record<string, any>
    sort?: { field: string; direction: 'asc' | 'desc' }
  }): Promise<ApiResponse<T[]>> {
    try {
      const searchParams = new URLSearchParams()
      
      if (params?.page) searchParams.append('page', params.page.toString())
      if (params?.limit) searchParams.append('limit', params.limit.toString())
      if (params?.search) searchParams.append('search', params.search)
      if (params?.sort) {
        searchParams.append('sortField', params.sort.field)
        searchParams.append('sortDirection', params.sort.direction)
      }
      
      if (params?.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value.toString())
          }
        })
      }

      const url = `${this.baseUrl}/${this.endpoint}?${searchParams.toString()}`
      const response = await fetch(url, {
        headers: {
          // Add authorization header when ready
          // 'Authorization': `Bearer ${token}`
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  // Read One
  async getById(id: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.endpoint}/${id}`, {
        headers: {
          // Add authorization header when ready
          // 'Authorization': `Bearer ${token}`
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  // Update
  async update(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header when ready
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  // Delete
  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          // Add authorization header when ready
          // 'Authorization': `Bearer ${token}`
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  // Bulk operations
  async bulkDelete(ids: string[]): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.endpoint}/bulk-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header when ready
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  async bulkUpdate(ids: string[], updates: Partial<T>): Promise<ApiResponse<T[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.endpoint}/bulk-update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header when ready
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids, updates }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  // Export data
  async exportData(format: 'csv' | 'excel' | 'json', filters?: Record<string, any>): Promise<Blob> {
    try {
      const searchParams = new URLSearchParams()
      searchParams.append('format', format)
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value.toString())
          }
        })
      }

      const response = await fetch(`${this.baseUrl}/${this.endpoint}/export?${searchParams.toString()}`, {
        headers: {
          // Add authorization header when ready
          // 'Authorization': `Bearer ${token}`
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.blob()
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Export failed')
    }
  }

  // Import data
  async importData(file: File, options?: { updateExisting?: boolean; skipErrors?: boolean }): Promise<ApiResponse<{ success: number; failed: number; errors: string[] }>> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      if (options) {
        formData.append('updateExisting', options.updateExisting?.toString() || 'false')
        formData.append('skipErrors', options.skipErrors?.toString() || 'false')
      }

      const response = await fetch(`${this.baseUrl}/${this.endpoint}/import`, {
        method: 'POST',
        headers: {
          // Add authorization header when ready
          // 'Authorization': `Bearer ${token}`
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Import failed',
      }
    }
  }
}

// Specific service instances
export const productService = new CrudService<Product>('products')
export const orderService = new CrudService<Order>('orders')
export const customerService = new CrudService<Customer>('customers')
export const categoryService = new CrudService<Category>('categories')
export const supplierService = new CrudService<Supplier>('suppliers')

// Utility functions for common operations
export const adminUtils = {
  // Format currency
  formatCurrency: (amount: number, currency: string = 'KES'): string => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  },

  // Format date
  formatDate: (date: string | Date): string => {
    return new Intl.DateTimeFormat('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date))
  },

  // Format date time
  formatDateTime: (date: string | Date): string => {
    return new Intl.DateTimeFormat('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  },

  // Generate SKU
  generateSKU: (category: string, brand?: string): string => {
    const timestamp = Date.now().toString().slice(-6)
    const categoryCode = category.substring(0, 3).toUpperCase()
    const brandCode = brand ? brand.substring(0, 2).toUpperCase() : 'XX'
    return `${categoryCode}-${brandCode}-${timestamp}`
  },

  // Validate email
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Validate phone
  validatePhone: (phone: string): boolean => {
    const phoneRegex = /^(\+254|0)[17]\d{8}$/
    return phoneRegex.test(phone)
  },

  // Calculate pagination
  calculatePagination: (total: number, page: number, limit: number) => {
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    
    return {
      currentPage: page,
      totalPages,
      hasNextPage,
      hasPrevPage,
      startIndex: (page - 1) * limit + 1,
      endIndex: Math.min(page * limit, total),
    }
  },

  // Debounce function
  debounce: <T extends (...args: any[]) => any>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },

  // Throttle function
  throttle: <T extends (...args: any[]) => any>(func: T, limit: number): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },
}
