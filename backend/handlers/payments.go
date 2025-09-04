package handlers

import (
	"backend/config"
	"backend/models"
	"github.com/gofiber/fiber/v2"
	"github.com/satori/go.uuid"
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
		OrderID      string `json:"order_id"`
		PaymentMethod string `json:"payment_method"`
		Amount       float64 `json:"amount"`
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

	// In production, this would integrate with Paystack or other payment providers
	// For now, we'll simulate a payment initiation
	paymentURL := "/payment/" + payment.ID.String() + "/complete"

	return c.JSON(fiber.Map{
		"message": "Payment initiated successfully",
		"payment_id": payment.ID,
		"payment_url": paymentURL,
		"amount": req.Amount,
	})
}

// PaymentWebhook handles payment provider webhooks
func PaymentWebhook(c *fiber.Ctx) error {
	// In production, this would verify the webhook signature from Paystack
	// For now, we'll just return a success message
	return c.JSON(fiber.Map{
		"message": "Webhook received successfully",
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
