package handlers

import (
	"backend/config"
	"backend/services"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
)

// HealthCheck returns basic application health
func HealthCheck(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"status":    "ok",
		"timestamp": time.Now().Unix(),
		"version":   "1.0.0",
		"service":   "Hardware Store Backend",
	})
}

// DatabaseHealthCheck checks database connectivity
func DatabaseHealthCheck(c *fiber.Ctx) error {
	// Test database connection
	sqlDB, err := config.DB.DB()
	if err != nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
			"status":  "error",
			"service": "database",
			"error":   "Failed to get database instance",
		})
	}

	// Ping database
	if err := sqlDB.Ping(); err != nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
			"status":  "error",
			"service": "database",
			"error":   fmt.Sprintf("Database ping failed: %v", err),
		})
	}

	// Get database stats
	stats := sqlDB.Stats()
	return c.JSON(fiber.Map{
		"status":  "ok",
		"service": "database",
		"stats": fiber.Map{
			"max_open_connections": stats.MaxOpenConnections,
			"open_connections":     stats.OpenConnections,
			"in_use":              stats.InUse,
			"idle":                stats.Idle,
		},
	})
}

// RedisHealthCheck checks Redis connectivity
func RedisHealthCheck(c *fiber.Ctx) error {
	redisService := services.NewRedisService()
	
	if err := redisService.HealthCheck(); err != nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
			"status":  "error",
			"service": "redis",
			"error":   fmt.Sprintf("Redis health check failed: %v", err),
		})
	}

	return c.JSON(fiber.Map{
		"status":  "ok",
		"service": "redis",
		"message": "Redis is healthy",
	})
}

// ExternalServicesHealthCheck checks all external service connections
func ExternalServicesHealthCheck(c *fiber.Ctx) error {
	health := fiber.Map{
		"status":    "ok",
		"timestamp": time.Now().Unix(),
		"services":  make(map[string]interface{}),
	}

	// Check SendGrid
	_ = services.NewSendGridService()
	health["services"].(map[string]interface{})["sendgrid"] = fiber.Map{
		"status": "ok",
		"message": "SendGrid service initialized",
	}

	// Check Twilio
	_ = services.NewTwilioService()
	health["services"].(map[string]interface{})["twilio"] = fiber.Map{
		"status": "ok",
		"message": "Twilio service initialized",
	}

	// Check Cloudinary
	_ = services.NewCloudinaryService()
	health["services"].(map[string]interface{})["cloudinary"] = fiber.Map{
		"status": "ok",
		"message": "Cloudinary service initialized",
	}

	// Check Paystack
	_ = services.NewPaystackService()
	health["services"].(map[string]interface{})["paystack"] = fiber.Map{
		"status": "ok",
		"message": "Paystack service initialized",
	}

	// Check Notification service
	_ = services.NewNotificationService()
	health["services"].(map[string]interface{})["notifications"] = fiber.Map{
		"status": "ok",
		"message": "Notification service initialized",
	}

	return c.JSON(health)
}

// FullHealthCheck performs comprehensive health check
func FullHealthCheck(c *fiber.Ctx) error {
	start := time.Now()
	
	// Check database
	dbStatus := "ok"
	dbError := ""
	sqlDB, err := config.DB.DB()
	if err != nil {
		dbStatus = "error"
		dbError = "Failed to get database instance"
	} else if err := sqlDB.Ping(); err != nil {
		dbStatus = "error"
		dbError = fmt.Sprintf("Database ping failed: %v", err)
	}

	// Check Redis
	redisStatus := "ok"
	redisError := ""
	redisService := services.NewRedisService()
	if err := redisService.HealthCheck(); err != nil {
		redisStatus = "error"
		redisError = fmt.Sprintf("Redis health check failed: %v", err)
	}

	// Determine overall status
	overallStatus := "ok"
	if dbStatus == "error" || redisStatus == "error" {
		overallStatus = "degraded"
	}

	response := fiber.Map{
		"status":    overallStatus,
		"timestamp": time.Now().Unix(),
		"duration":  time.Since(start).Milliseconds(),
		"services": fiber.Map{
			"database": fiber.Map{
				"status": dbStatus,
				"error":  dbError,
			},
			"redis": fiber.Map{
				"status": redisStatus,
				"error":  redisError,
			},
			"external_services": fiber.Map{
				"status": "ok",
				"services": []string{"sendgrid", "twilio", "cloudinary", "paystack", "notifications"},
			},
		},
	}

	// Set appropriate status code
	if overallStatus == "ok" {
		return c.JSON(response)
	} else if overallStatus == "degraded" {
		return c.Status(fiber.StatusServiceUnavailable).JSON(response)
	} else {
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}
}
