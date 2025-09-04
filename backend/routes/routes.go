package routes

import (
	"backend/handlers"
	"backend/middleware"

	"github.com/gofiber/fiber/v2"
)

// SetupRoutes configures all the application routes
func SetupRoutes(app *fiber.App) {
	// Health check endpoints
	app.Get("/health", handlers.HealthCheck)
	app.Get("/health/db", handlers.DatabaseHealthCheck)
	app.Get("/health/redis", handlers.RedisHealthCheck)
	app.Get("/health/services", handlers.ExternalServicesHealthCheck)
	app.Get("/health/full", handlers.FullHealthCheck)

	// API routes
	api := app.Group("/api")

	// Apply rate limiting to all API routes
	api.Use(middleware.RateLimitMiddleware())

	{
		// Auth routes (public) - with stricter rate limiting
		auth := api.Group("/auth")
		auth.Use(middleware.StrictRateLimitMiddleware())
		{
			auth.Post("/register", handlers.Register)
			auth.Post("/login", handlers.Login)
			auth.Post("/logout", handlers.Logout)
			auth.Post("/password/reset", handlers.RequestPasswordReset)
			auth.Post("/password/reset/confirm", handlers.ConfirmPasswordReset)
		}

		// Public catalog routes
		catalog := api.Group("/catalog")
		{
			catalog.Get("/categories", handlers.GetCategories)
			catalog.Get("/products", handlers.GetProducts)
			catalog.Get("/products/:slug", handlers.GetProductDetails)
			catalog.Get("/search", handlers.SearchProducts)
		}

		// Protected routes
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			// User profile
			protected.Get("/profile", handlers.GetProfile)
			protected.Put("/profile", handlers.UpdateProfile)

			// Cart routes
			cart := protected.Group("/cart")
			{
				cart.Get("", handlers.GetCart)
				cart.Post("/items", handlers.AddCartItem)
				cart.Put("/items/:id", handlers.UpdateCartItem)
				cart.Delete("/items/:id", handlers.RemoveCartItem)
				cart.Delete("", handlers.ClearCart)
			}

			// Wishlist routes
			wishlist := protected.Group("/wishlist")
			{
				wishlist.Get("", handlers.GetWishlist)
				wishlist.Post("/items", handlers.AddWishlistItem)
				wishlist.Delete("/items/:id", handlers.RemoveWishlistItem)
			}

			// Checkout routes
			checkout := protected.Group("/checkout")
			{
				checkout.Post("/place", handlers.PlaceOrder)
				checkout.Get("/shipping-options", handlers.GetShippingOptions)
			}

			// Order routes
			orders := protected.Group("/orders")
			{
				orders.Get("", handlers.GetUserOrders)
				orders.Get("/:id", handlers.GetOrderDetails)
				orders.Post("", handlers.CreateOrder)
				orders.Post("/:id/cancel", handlers.CancelOrder)
			}

			// Service routes
			services := protected.Group("/services")
			{
				services.Post("/request", handlers.RequestService)
				services.Get("/requests", handlers.GetUserServiceRequests)
				services.Get("/requests/:id", handlers.GetServiceRequestDetails)
				services.Post("/requests/:id/accept-quote", handlers.AcceptServiceQuote)
			}

			// Payment routes
			payments := protected.Group("/payments")
			{
				payments.Post("/initiate", handlers.InitiatePayment)
				payments.Post("/webhook", handlers.PaymentWebhook)
				payments.Get("/:id/status", handlers.GetPaymentStatus)
			}

			// File upload routes
			upload := protected.Group("/upload")
			{
				upload.Post("/file", handlers.UploadFile)
				upload.Post("/files", handlers.UploadMultipleFiles)
				upload.Delete("/file/:public_id", handlers.DeleteFile)
				upload.Get("/file/:public_id", handlers.GetFileInfo)
				upload.Get("/file/:public_id/urls", handlers.GenerateImageURLs)
			}

			// Notification routes
			notifications := protected.Group("/notifications")
			{
				notifications.Get("", handlers.GetUserNotifications)
				notifications.Put("/:id/read", handlers.MarkNotificationAsRead)
			}
		}

		// Admin routes
		admin := api.Group("/admin")
		admin.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
		{
			// Categories management
			admin.Get("/categories", handlers.AdminGetCategories)
			admin.Post("/categories", handlers.AdminCreateCategory)
			admin.Put("/categories/:id", handlers.AdminUpdateCategory)
			admin.Delete("/categories/:id", handlers.AdminDeleteCategory)

			// Products management
			admin.Get("/products", handlers.AdminGetProducts)
			admin.Post("/products", handlers.AdminCreateProduct)
			admin.Put("/products/:id", handlers.AdminUpdateProduct)
			admin.Delete("/products/:id", handlers.AdminDeleteProduct)

			// Inventory management
			admin.Put("/inventory/stock", handlers.AdminUpdateStock)
			admin.Get("/inventory/low-stock", handlers.AdminGetLowStockItems)

			// Orders management
			admin.Get("/orders", handlers.AdminGetOrders)
			admin.Put("/orders/:id/status", handlers.AdminUpdateOrderStatus)
			admin.Get("/orders/:id", handlers.AdminGetOrderDetails)

			// Service management
			admin.Get("/services/requests", handlers.AdminGetServiceRequests)
			admin.Put("/services/requests/:id/status", handlers.AdminUpdateServiceStatus)
			admin.Post("/services/requests/:id/quote", handlers.AdminCreateServiceQuote)

			// User management
			admin.Get("/users", handlers.AdminGetUsers)
			admin.Put("/users/:id/role", handlers.AdminUpdateUserRole)
			admin.Delete("/users/:id", handlers.AdminDeleteUser)

			// Reports
			admin.Get("/reports/sales", handlers.AdminGetSalesReport)
			admin.Get("/reports/inventory", handlers.AdminGetInventoryReport)
			admin.Get("/reports/users", handlers.AdminGetUsersReport)
		}
	}
}
