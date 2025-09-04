package middleware

import (
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
)

// RateLimitMiddleware provides rate limiting for API endpoints
func RateLimitMiddleware() fiber.Handler {
	// Get rate limit configuration from environment
	maxRequestsStr := os.Getenv("RATE_LIMIT_REQUESTS")
	if maxRequestsStr == "" {
		maxRequestsStr = "100" // Default: 100 requests
	}
	
	windowStr := os.Getenv("RATE_LIMIT_WINDOW")
	if windowStr == "" {
		windowStr = "1m" // Default: 1 minute
	}
	
	maxRequests, err := strconv.Atoi(maxRequestsStr)
	if err != nil {
		maxRequests = 100
	}
	
	window, err := time.ParseDuration(windowStr)
	if err != nil {
		window = time.Minute
	}
	
	return limiter.New(limiter.Config{
		Max:        maxRequests,
		Expiration: window,
		KeyGenerator: func(c *fiber.Ctx) string {
			// Use IP address as key, but in production you might want to use user ID
			return c.IP()
		},
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "Rate limit exceeded",
				"message": "Too many requests. Please try again later.",
				"retry_after": window.Seconds(),
			})
		},
		SkipSuccessfulRequests: false,
		SkipFailedRequests:     false,
	})
}

// StrictRateLimitMiddleware provides stricter rate limiting for sensitive endpoints
func StrictRateLimitMiddleware() fiber.Handler {
	return limiter.New(limiter.Config{
		Max:        10, // Only 10 requests
		Expiration: 1 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "Rate limit exceeded",
				"message": "Too many requests to this sensitive endpoint. Please try again later.",
				"retry_after": 60,
			})
		},
	})
}
