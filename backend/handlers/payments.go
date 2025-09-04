package handlers

import (
	"backend/config"
	"backend/models"
	"backend/services"
	"fmt"

	"github.com/gofiber/fiber/v2"
	uuid "github.com/satori/go.uuid"
)

// InitiatePayment starts a payment process
func InitiatePayment(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	var req struct {
		OrderID       string  `json:"order_id"`
		PaymentMethod string  `json:"payment_method"`
		Amount        float64 `json:"amount"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Validate required fields
	if req.OrderID == "" || req.PaymentMethod == "" || req.Amount <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Order ID, payment method, and amount are required",
		})
	}

	// Verify order exists and belongs to user
	var order models.Order
	if err := config.DB.Where("id = ? AND user_id = ?", req.OrderID, userID).First(&order).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Order not found",
		})
	}

	// Create or update payment record
	var payment models.Payment
	if err := config.DB.Where("order_id = ?", req.OrderID).First(&payment).Error; err != nil {
		// Create new payment
		payment = models.Payment{
			OrderID:  uuid.FromStringOrNil(req.OrderID),
			Provider: req.PaymentMethod,
			Amount:   req.Amount,
			Status:   models.PaymentStatusPending,
		}
		if err := config.DB.Create(&payment).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create payment record",
			})
		}
	} else {
		// Update existing payment
		if err := config.DB.Model(&payment).Updates(map[string]interface{}{
			"provider": req.PaymentMethod,
			"amount":   req.Amount,
			"status":   models.PaymentStatusPending,
		}).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to update payment record",
			})
		}
	}

	// Initialize Paystack payment
	paystackService := services.NewPaystackService()

	// Get order with user details for Paystack
	var orderWithUser models.Order
	if err := config.DB.Preload("User").Where("id = ?", req.OrderID).First(&orderWithUser).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get order details",
		})
	}

	paystackResponse, err := paystackService.InitiatePayment(&orderWithUser, orderWithUser.User)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to initiate payment with Paystack",
		})
	}

	return c.JSON(fiber.Map{
		"message":    "Payment initiated successfully",
		"payment_id": payment.ID,
		"amount":     req.Amount,
		"paystack": fiber.Map{
			"authorization_url": paystackResponse.Data.AuthorizationURL,
			"access_code":       paystackResponse.Data.AccessCode,
			"reference":         paystackResponse.Data.Reference,
		},
	})
}

// PaymentWebhook handles payment provider webhooks
func PaymentWebhook(c *fiber.Ctx) error {
	// Get the webhook payload
	payload := c.Body()

	// Get the signature header
	signature := c.Get("X-Paystack-Signature")
	if signature == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing webhook signature",
		})
	}

	// Process the webhook using Paystack service
	paystackService := services.NewPaystackService()
	err := paystackService.ProcessWebhook(payload, signature)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": fmt.Sprintf("Webhook processing failed: %v", err),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Webhook processed successfully",
	})
}

// GetPaymentStatus returns the status of a payment
func GetPaymentStatus(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	paymentID := c.Params("id")
	if paymentID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Payment ID is required",
		})
	}

	// Find payment and verify ownership through order
	var payment models.Payment
	if err := config.DB.Joins("JOIN orders ON orders.id = payments.order_id").
		Where("payments.id = ? AND orders.user_id = ?", paymentID, userID).
		First(&payment).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Payment not found",
		})
	}

	return c.JSON(payment)
}
