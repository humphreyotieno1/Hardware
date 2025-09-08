import { ApiClient } from "./client"

// Lazy initialization to avoid SSR issues
let apiClient: ApiClient | null = null

const getApiClient = () => {
  if (!apiClient) {
    apiClient = new ApiClient({
      baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://hardware-backend-ocgv.onrender.com/",
      timeout: 15000,
    })
  }
  return apiClient
}

// System Health
export interface SystemHealth {
  status: string
  timestamp: number
  duration: number
  services: {
    database: { status: string; error: string }
    redis: { status: string; error: string }
    external_services: {
      status: string
      services: string[]
    }
  }
}

// Categories
export interface Category {
  ID: string
  name: string
  slug: string
}

export interface CreateCategoryRequest {
  name: string
  slug: string
}

export interface UpdateCategoryRequest {
  name?: string
  slug?: string
}

// Products
export interface AdminProduct {
  ID: string
  sku: string
  name: string
  slug: string
  category_id: string
  description: string
  price: number
  stock_quantity: number
  images_json: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateProductRequest {
  sku: string
  name: string
  slug: string
  category_id: string
  description: string
  price: number
  stock_quantity: number
  images_json: string[]
  is_active: boolean
}

export interface UpdateProductRequest {
  sku?: string
  name?: string
  slug?: string
  category_id?: string
  description?: string
  price?: number
  stock_quantity?: number
  images_json?: string[]
  is_active?: boolean
}

export interface AdminProductsResponse {
  products: AdminProduct[]
  page: number
  limit: number
  total: number
}

// Inventory
export interface UpdateStockRequest {
  product_id: string
  quantity: number
  operation: "add" | "subtract" | "set"
}

export interface UpdateStockResponse {
  message: string
  product_id: string
  old_quantity: number
  new_quantity: number
}

export interface LowStockResponse {
  threshold: number
  products: AdminProduct[]
  count: number
}

// Orders
export interface AdminOrder {
  ID: string
  user_id: string
  total: number
  status: string
  user: {
    ID: string
    full_name: string
    email: string
    phone: string
  }
  order_items: Array<{
    ID: string
    product_id: string
    quantity: number
    price: number
    product: {
      ID: string
      name: string
      sku: string
    }
  }>
  payments: Array<{
    ID: string
    amount: number
    status: string
    method: string
  }>
  created_at: string
  updated_at: string
}

export interface AdminOrdersResponse {
  orders: AdminOrder[]
  page: number
  limit: number
  total: number
}

export interface UpdateOrderStatusRequest {
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
}

// Services
export interface ServiceRequest {
  ID: string
  user_id: string
  type: string
  status: string
  description: string
  user: {
    ID: string
    full_name: string
    email: string
    phone: string
  }
  created_at: string
  updated_at: string
}

export interface AdminServicesResponse {
  requests: ServiceRequest[]
  page: number
  limit: number
  total: number
}

export interface UpdateServiceStatusRequest {
  status: "requested" | "quoted" | "accepted" | "scheduled" | "in_progress" | "completed" | "billed" | "cancelled"
}

export interface CreateServiceQuoteRequest {
  amount: number
  assigned_to: string
  scheduled_date: string
  notes: string
}

// Users
export interface AdminUser {
  ID: string
  full_name: string
  email: string
  phone: string
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AdminUsersResponse {
  users: AdminUser[]
  page: number
  limit: number
  total: number
}

export interface UpdateUserRoleRequest {
  role: "customer" | "admin"
}

// Reports
export interface SalesReport {
  period: {
    start: string
    end: string
  }
  total_sales: number
  order_count: number
  top_products: Array<{
    product_name: string
    total_sold: number
    revenue: number
  }>
}

export interface InventoryReport {
  total_products: number
  total_inventory_value: number
  low_stock_products: AdminProduct[]
  low_stock_threshold: number
}

export interface UsersReport {
  total_users: number
  admin_users: number
  customer_users: number
  active_users: number
  inactive_users: number
  admin_percentage: number
  customer_percentage: number
}

// API Functions
export const adminApi = {
  // System Health
  getSystemHealth: async (): Promise<SystemHealth> => {
    const response = await getApiClient().get<SystemHealth>("/health/full")
    return response.data!
  },

  // Categories Management
  getCategories: async (): Promise<Category[]> => {
    const response = await getApiClient().get<Category[]>("/api/admin/categories")
    return response.data!
  },

  createCategory: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await getApiClient().post<Category>("/api/admin/categories", data)
    return response.data!
  },

  updateCategory: async (id: string, data: UpdateCategoryRequest): Promise<Category> => {
    const response = await getApiClient().put<Category>(`/api/admin/categories/${id}`, data)
    return response.data!
  },

  deleteCategory: async (id: string): Promise<{ message: string }> => {
    const response = await getApiClient().delete<{ message: string }>(`/api/admin/categories/${id}`)
    return response.data!
  },

  // Products Management
  getProducts: async (params?: {
    page?: number
    limit?: number
    category?: string
    q?: string
    active?: boolean
    sort?: string
    order?: string
  }): Promise<AdminProductsResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.category) searchParams.append("category", params.category)
    if (params?.q) searchParams.append("q", params.q)
    if (params?.active !== undefined) searchParams.append("active", params.active.toString())
    if (params?.sort) searchParams.append("sort", params.sort)
    if (params?.order) searchParams.append("order", params.order)

    const response = await getApiClient().get<AdminProductsResponse>(`/api/admin/products${searchParams.toString()}`)
    return response.data!
  },

  createProduct: async (data: CreateProductRequest): Promise<AdminProduct> => {
    const response = await getApiClient().post<AdminProduct>("/api/admin/products", data)
    return response.data!
  },

  updateProduct: async (id: string, data: UpdateProductRequest): Promise<AdminProduct> => {
    const response = await getApiClient().put<AdminProduct>(`/api/admin/products/${id}`, data)
    return response.data!
  },

  deleteProduct: async (id: string): Promise<{ message: string }> => {
    const response = await getApiClient().delete<{ message: string }>(`/api/admin/products/${id}`)
    return response.data!
  },

  // Inventory Management
  updateStock: async (data: UpdateStockRequest): Promise<UpdateStockResponse> => {
    const response = await getApiClient().put<UpdateStockResponse>("/api/admin/inventory/stock", data)
    return response.data!
  },

  getLowStockItems: async (threshold?: number): Promise<LowStockResponse> => {
    const searchParams = new URLSearchParams()
    if (threshold) searchParams.append("threshold", threshold.toString())

    const response = await getApiClient().get<LowStockResponse>(`/api/admin/inventory/low-stock?${searchParams.toString()}`)
    return response.data!
  },

  // Orders Management
  getOrders: async (params?: {
    page?: number
    limit?: number
    status?: string
    start_date?: string
    end_date?: string
  }): Promise<AdminOrdersResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.status) searchParams.append("status", params.status)
    if (params?.start_date) searchParams.append("start_date", params.start_date)
    if (params?.end_date) searchParams.append("end_date", params.end_date)

    const response = await getApiClient().get<AdminOrdersResponse>(`/api/admin/orders?${searchParams.toString()}`)
    return response.data!
  },

  updateOrderStatus: async (id: string, data: UpdateOrderStatusRequest): Promise<{ message: string; status: string }> => {
    const response = await getApiClient().put<{ message: string; status: string }>(`/api/admin/orders/${id}/status`, data)
    return response.data!
  },

  getOrderDetails: async (id: string): Promise<AdminOrder> => {
    const response = await getApiClient().get<AdminOrder>(`/api/admin/orders/${id}`)
    return response.data!
  },

  // Service Management
  getServiceRequests: async (params?: {
    page?: number
    limit?: number
    status?: string
    type?: string
  }): Promise<AdminServicesResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.status) searchParams.append("status", params.status)
    if (params?.type) searchParams.append("type", params.type)

    const response = await getApiClient().get<AdminServicesResponse>(`/api/admin/services/requests?${searchParams.toString()}`)
    return response.data!
  },

  updateServiceStatus: async (id: string, data: UpdateServiceStatusRequest): Promise<{ message: string; status: string }> => {
    const response = await getApiClient().put<{ message: string; status: string }>(`/api/admin/services/requests/${id}/status`, data)
    return response.data!
  },

  createServiceQuote: async (id: string, data: CreateServiceQuoteRequest): Promise<{ message: string; amount: number }> => {
    const response = await getApiClient().post<{ message: string; amount: number }>(`/api/admin/services/requests/${id}/quote`, data)
    return response.data!
  },

  // User Management
  getUsers: async (params?: {
    page?: number
    limit?: number
    role?: string
    search?: string
  }): Promise<AdminUsersResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.role) searchParams.append("role", params.role)
    if (params?.search) searchParams.append("search", params.search)

    const response = await getApiClient().get<AdminUsersResponse>(`/api/admin/users?${searchParams.toString()}`)
    return response.data!
  },

  updateUserRole: async (id: string, data: UpdateUserRoleRequest): Promise<{ message: string; role: string }> => {
    const response = await getApiClient().put<{ message: string; role: string }>(`/api/admin/users/${id}/role`, data)
    return response.data!
  },

  deleteUser: async (id: string): Promise<{ message: string }> => {
    const response = await getApiClient().delete<{ message: string }>(`/api/admin/users/${id}`)
    return response.data!
  },

  // Reports
  getSalesReport: async (params?: {
    start_date?: string
    end_date?: string
  }): Promise<SalesReport> => {
    const searchParams = new URLSearchParams()
    if (params?.start_date) searchParams.append("start_date", params.start_date)
    if (params?.end_date) searchParams.append("end_date", params.end_date)

    const response = await getApiClient().get<SalesReport>(`/api/admin/reports/sales?${searchParams.toString()}`)
    return response.data!
  },

  getInventoryReport: async (): Promise<InventoryReport> => {
    const response = await getApiClient().get<InventoryReport>("/api/admin/reports/inventory")
    return response.data!
  },

  getUsersReport: async (): Promise<UsersReport> => {
    const response = await getApiClient().get<UsersReport>("/api/admin/reports/users")
    return response.data!
  },
}