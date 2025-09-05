// Main API exports
export { default as apiClient, apiClient as apiClientNamed, ApiClient } from "./client"
export type * from "./types"
export { authApi } from "./auth"
export { productsApi } from "./products"
export { cartApi } from "./cart"
export { ordersApi } from "./orders"
export { wishlistApi } from "./wishlist"
export { adminApi } from "./admin"
export * from "./services"

// Type exports
export type * from "./types"

// Utility functions
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(price)
}

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

export const formatDateTime = (date: string): string => {
  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}
