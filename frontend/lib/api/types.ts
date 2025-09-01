// API Response Types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

// Auth Types
export interface User {
  id: string
  email: string
  phone?: string
  full_name: string
  role: "customer" | "admin"
  created_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  phone?: string
  full_name: string
}

export interface AuthResponse {
  user: User
  token: string
  refresh_token: string
}

// Product Types
export interface Category {
  id: string
  name: string
  slug: string
}

export interface Product {
  id: string
  sku: string
  name: string
  slug: string
  category_id: string
  description: string
  price: number
  stock_quantity: number
  images_json: string[]
  category?: Category
}

export interface ProductSearchParams {
  category?: string
  q?: string
  page?: number
  limit?: number
  sort?: "price_asc" | "price_desc" | "name" | "newest"
}

// Cart Types
export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  quantity: number
  unit_price: number
  product?: Product
}

export interface Cart {
  id: string
  user_id?: string
  session_id?: string
  items: CartItem[]
  total: number
}

// Order Types
export interface Address {
  id?: string
  user_id?: string
  label: string
  line1: string
  city: string
  country: string
  is_default: boolean
}

export interface ServiceRequest {
  type: "transport" | "installation" | "cutting"
  details: string
  location?: string
  preferred_date?: string
}

export interface Order {
  id: string
  user_id?: string
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered"
  address_json: Address
  service_request?: ServiceRequest
  placed_at: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  product?: Product
}

// Payment Types
export interface Payment {
  id: string
  order_id: string
  provider: "M-Pesa" | "Card" | "Bank" | "Cash"
  reference: string
  amount: number
  status: "pending" | "completed" | "failed"
  paid_at?: string
}

// Admin Types
export interface AdminStats {
  total_orders: number
  total_revenue: number
  total_products: number
  low_stock_count: number
}

// API Error Types
export interface ApiError {
  message: string
  code?: string
  field?: string
}
