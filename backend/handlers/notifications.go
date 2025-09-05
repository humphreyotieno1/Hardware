package handlers

import (
	"backend/services"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// GetUserNotifications retrieves notifications for the current user
func GetUserNotifications(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	// Get query parameters
	limitStr := c.Query("limit", "20")
	offsetStr := c.Query("offset", "0")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 20
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 0 {
		offset = 0
	}

	// Get notifications
	notificationService := services.NewNotificationService()
	notifications, err := notificationService.GetUserNotifications(userID.(string), limit, offset)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch notifications",
		})
	}

	return c.JSON(fiber.Map{
		"notifications": notifications,
		"limit":         limit,
		"offset":        offset,
		"count":         len(notifications),
	})
}

// MarkNotificationAsRead marks a notification as read
func MarkNotificationAsRead(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	notificationID := c.Params("id")
	if notificationID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Notification ID is required",
		})
	}

	// Mark notification as read
	notificationService := services.NewNotificationService()
	err := notificationService.MarkNotificationAsRead(notificationID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to mark notification as read",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Notification marked as read",
		"id":      notificationID,
	})
}
