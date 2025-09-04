package handlers

import (
	"backend/config"
	"backend/models"

	"github.com/gofiber/fiber/v2"
	uuid "github.com/satori/go.uuid"
)

// RequestService handles service requests from users
func RequestService(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	var req struct {
		Type          string                 `json:"type"`
		Details       map[string]interface{} `json:"details"`
		Location      string                 `json:"location"`
		RequestedDate string                 `json:"requested_date"`
		Instructions  string                 `json:"instructions"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Validate required fields
	if req.Type == "" || req.Location == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Service type and location are required",
		})
	}

	// Create service request
	serviceRequest := models.ServiceRequest{
		UserID:        uuid.FromStringOrNil(userID.(string)),
		Type:          req.Type,
		Details:       req.Details,
		Location:      req.Location,
		RequestedDate: req.RequestedDate,
		Instructions:  req.Instructions,
		Status:        models.ServiceStatusRequested,
	}

	if err := config.DB.Create(&serviceRequest).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create service request",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message":    "Service request created successfully",
		"request_id": serviceRequest.ID,
	})
}

// GetUserServiceRequests returns all service requests for the current user
func GetUserServiceRequests(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	var requests []models.ServiceRequest
	if err := config.DB.Where("user_id = ?", userID).Order("created_at DESC").Find(&requests).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch service requests",
		})
	}

	return c.JSON(requests)
}

// GetServiceRequestDetails returns details of a specific service request
func GetServiceRequestDetails(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	requestID := c.Params("id")
	if requestID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Request ID is required",
		})
	}

	var request models.ServiceRequest
	if err := config.DB.Where("id = ? AND user_id = ?", requestID, userID).First(&request).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Service request not found",
		})
	}

	return c.JSON(request)
}

// AcceptServiceQuote accepts a quote for a service request
func AcceptServiceQuote(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	requestID := c.Params("id")
	if requestID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Request ID is required",
		})
	}

	var req struct {
		QuoteID string `json:"quote_id"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Find service request and verify ownership
	var request models.ServiceRequest
	if err := config.DB.Where("id = ? AND user_id = ?", requestID, userID).First(&request).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Service request not found",
		})
	}

	// Update status to accepted
	if err := config.DB.Model(&request).Update("status", models.ServiceStatusAccepted).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to accept quote",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Service quote accepted successfully",
	})
}
