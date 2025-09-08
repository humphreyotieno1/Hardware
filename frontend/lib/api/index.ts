// Export all API clients
export { authApi } from "./auth"
export { productsApi } from "./products"
export { cartApi } from "./cart"
export { wishlistApi } from "./wishlist"
export { ordersApi } from "./orders"
export { checkoutApi } from "./checkout"
export { servicesApi } from "./services"
export { paymentsApi } from "./payments"
export { notificationsApi } from "./notifications"

// Export types
export * from "./types"

// Export utilities
export { formatPrice, formatNumber } from "../utils/format"

// Export the main API client
export { default as apiClient } from "./client"