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

export interface UpdateProfileRequest {
  full_name: string
  phone?: string
}

export interface RegisterRequest {
  email: string
  password: string
  full_name: string
  phone?: string
}

export interface AuthResponse {
  user: User
  token: string
  refresh_token: string
}

export interface RequestPasswordResetRequest {
  email: string
}

// Product Types
export interface Category {
  id: string
  name: string
  slug: string
}

export interface Product {
  ID: string
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
  ID: string
  product_id: string
  quantity: number
  unit_price: number
  product?: Product
}

export interface Cart {
  ID: string
  user_id: string
  cart_items: CartItem[]
}

export interface AddToCartRequest {
  product_id: string
  quantity: number
}

export interface UpdateCartItemRequest {
  quantity: number
}

// Wishlist Types
export interface WishlistItem {
  ID: string
  user_id: string
  product_id: string
  product?: Product
}

export interface AddToWishlistRequest {
  product_id: string
}

// Order Types
export interface Address {
  label: string
  line: string
  city: string
  country: string
}

export interface ServiceRequest {
  type: "installation" | "transport" | "cutting"
  details: Record<string, any>
}

export interface Order {
  ID: string
  user_id: string
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  address_json: Address
  placed_at: string
  order_items: OrderItem[]
}

export interface OrderItem {
  product_id: string
  quantity: number
  unit_price: number
  product?: Product
}

export interface CreateOrderRequest {
  address: Address
  service_request?: ServiceRequest
}

export interface CreateOrderResponse {
  message: string
  order_id: string
  total: number
}

// Checkout Types
export interface ShippingOption {
  id: string
  name: string
  price: number
  estimated_days: string
}

export interface PlaceOrderRequest {
  address: Address
  service_request?: ServiceRequest
  payment_method: string
}

export interface PlaceOrderResponse {
  message: string
  order_id: string
  payment_id: string
  total: number
}

// Service Request Types
export interface ServiceRequestDetails {
  type: "installation" | "transport" | "cutting"
  details: Record<string, any>
  location: string
  requested_date: string
  instructions?: string
}

export interface ServiceRequestResponse {
  ID: string
  user_id: string
  type: string
  details: Record<string, any>
  location: string
  requested_date: string
  instructions?: string
  status: "requested" | "quoted" | "accepted" | "completed"
}

export interface AcceptQuoteRequest {
  quote_id: string
}

// Payment Types
export interface Payment {
  ID: string
  order_id: string
  user_id: string
  provider: "paystack" | "mpesa" | "card"
  reference: string
  amount: number
  status: "pending" | "completed" | "failed"
}

export interface InitiatePaymentRequest {
  order_id: string
  payment_method: string
  amount: number
}

export interface InitiatePaymentResponse {
  message: string
  payment_id: string
  amount: number
  paystack?: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

// Notification Types
export interface Notification {
  ID: string
  user_id: string
  type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export interface NotificationsResponse {
  notifications: Notification[]
  limit: number
  offset: number
  count: number
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
