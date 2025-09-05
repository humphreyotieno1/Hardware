package middleware

import (
	"fmt"
	"os"
	"runtime/debug"
	"time"

	"github.com/gofiber/fiber/v2"
)

// ErrorHandler provides comprehensive error handling for production
func ErrorHandler() fiber.ErrorHandler {
	return func(c *fiber.Ctx, err error) error {
		// Get error code
		code := fiber.StatusInternalServerError
		if e, ok := err.(*fiber.Error); ok {
			code = e.Code
		}

		// Log error details
		errorDetails := map[string]interface{}{
			"timestamp":  time.Now().Unix(),
			"path":       c.Path(),
			"method":     c.Method(),
			"ip":         c.IP(),
			"user_agent": c.Get("User-Agent"),
			"error":      err.Error(),
			"code":       code,
		}

		// In development, include stack trace
		if os.Getenv("ENV") == "development" {
			errorDetails["stack_trace"] = string(debug.Stack())
		}

		// Log error (in production, use proper logging service)
		fmt.Printf("Error: %+v\n", errorDetails)

		// Don't expose internal errors in production
		message := "Internal server error"
		if os.Getenv("ENV") == "development" {
			message = err.Error()
		}

		// Custom error responses for specific status codes
		switch code {
		case fiber.StatusNotFound:
			return c.Status(code).JSON(fiber.Map{
				"error":   "Not Found",
				"message": "The requested resource was not found",
				"path":    c.Path(),
			})
		case fiber.StatusUnauthorized:
			return c.Status(code).JSON(fiber.Map{
				"error":   "Unauthorized",
				"message": "Authentication required",
			})
		case fiber.StatusForbidden:
			return c.Status(code).JSON(fiber.Map{
				"error":   "Forbidden",
				"message": "Access denied",
			})
		case fiber.StatusTooManyRequests:
			return c.Status(code).JSON(fiber.Map{
				"error":   "Too Many Requests",
				"message": "Rate limit exceeded. Please try again later.",
			})
		case fiber.StatusInternalServerError:
			return c.Status(code).JSON(fiber.Map{
				"error":      "Internal Server Error",
				"message":    message,
				"request_id": c.Get("X-Request-ID", "unknown"),
			})
		default:
			return c.Status(code).JSON(fiber.Map{
				"error":   "Error",
				"message": message,
				"code":    code,
			})
		}
	}
}

// RequestIDMiddleware adds a unique request ID to each request
func RequestIDMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Generate or get request ID
		requestID := c.Get("X-Request-ID")
		if requestID == "" {
			requestID = generateRequestID()
		}

		// Set request ID in context
		c.Set("X-Request-ID", requestID)

		return c.Next()
	}
}

// generateRequestID creates a unique request identifier
func generateRequestID() string {
	return fmt.Sprintf("req_%d", time.Now().UnixNano())
}

// RecoveryMiddleware recovers from panics
func RecoveryMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		defer func() {
			if r := recover(); r != nil {
				// Log panic details
				fmt.Printf("Panic recovered: %v\n", r)
				fmt.Printf("Stack trace: %s\n", debug.Stack())

				// Return error response
				c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error":      "Internal Server Error",
					"message":    "A panic occurred and was recovered",
					"request_id": c.Get("X-Request-ID", "unknown"),
				})
			}
		}()

		return c.Next()
	}
}
