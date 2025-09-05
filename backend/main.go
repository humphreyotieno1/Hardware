package main

import (
	"log"
	"os"
	"time"

	"backend/config"
	"backend/middleware"
	"backend/routes"
	"backend/seeders"
	"backend/services"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// initializeServices initializes all external service connections
func initializeServices() {
	log.Println("Initializing external services...")

	// Initialize Redis service
	redisService := services.NewRedisService()
	if err := redisService.HealthCheck(); err != nil {
		log.Printf("Warning: Redis connection failed: %v", err)
	} else {
		log.Println("✓ Redis service connected")
	}

	// Initialize SendGrid service
	_ = services.NewSendGridService()
	log.Println("✓ SendGrid service initialized")

	// Initialize Twilio service
	_ = services.NewTwilioService()
	log.Println("✓ Twilio service initialized")

	// Initialize Cloudinary service
	_ = services.NewCloudinaryService()
	log.Println("✓ Cloudinary service initialized")

	// Initialize Paystack service
	_ = services.NewPaystackService()
	log.Println("✓ Paystack service initialized")

	// Initialize Notification service
	_ = services.NewNotificationService()
	log.Println("✓ Notification service initialized")

	log.Println("All services initialized successfully!")
}

func main() {
	// Load environment variables
	config.LoadEnv()

	// Initialize database
	config.InitDB()

	// Initialize services
	initializeServices()

	// Run seeder
	seeders.SeedDatabase()

	// Create Fiber app with production configuration
	app := fiber.New(fiber.Config{
		ErrorHandler: middleware.ErrorHandler(),
		AppName:      "Hardware Store Backend",
		ServerHeader: "Hardware-Store-API",
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  120 * time.Second,
	})

	// Production middleware
	app.Use(middleware.RecoveryMiddleware())
	app.Use(middleware.RequestIDMiddleware())

	// CORS middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins:     os.Getenv("CORS_ALLOWED_ORIGINS"),
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization,X-Request-ID",
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Setup all routes
	routes.SetupRoutes(app)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
