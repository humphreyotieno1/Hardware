export * from "./api"

// Additional UI-specific types
export interface SearchFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  brands?: string[]
}

export interface ServiceRequest {
  id?: string
  type: "transport" | "installation" | "cutting" | "consultation"
  title?: string
  details: string
  location?: string
  preferred_date?: string
  urgency?: "standard" | "priority" | "emergency"
  status?: "requested" | "confirmed" | "scheduled" | "in_progress" | "completed" | "cancelled"
  customer_info?: {
    name: string
    phone: string
    email?: string
  }
  technician_id?: string
  estimated_cost?: number
  actual_cost?: number
  created_at?: string
  updated_at?: string
  items?: {
    product_id: string
    quantity: number
  }[]
}

export interface CartSummary {
  subtotal: number
  tax: number
  shipping: number
  total: number
  itemCount: number
}

export interface AdminStats {
  totalSales: number
  totalOrders: number
  lowStockCount: number
  pendingOrders: number
}
