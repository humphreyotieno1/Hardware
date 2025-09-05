package handlers

import (
	"backend/config"
	"backend/models"

	"github.com/gofiber/fiber/v2"
	uuid "github.com/satori/go.uuid"
)

// PlaceOrder handles the checkout process and order placement
func PlaceOrder(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	var req struct {
		Address        map[string]interface{}  `json:"address"`
		ServiceRequest *map[string]interface{} `json:"service_request,omitempty"`
		PaymentMethod  string                  `json:"payment_method"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Validate required fields
	if req.Address == nil || req.PaymentMethod == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Address and payment method are required",
		})
	}

	// Get user's cart
	var cart models.Cart
	if err := config.DB.Preload("CartItems.Product").Where("user_id = ?", userID).First(&cart).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Cart not found",
		})
	}

	if len(cart.CartItems) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cart is empty",
		})
	}

	// Calculate total and validate stock
	var total float64
	for _, item := range cart.CartItems {
		if item.Product.StockQuantity < item.Quantity {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Insufficient stock for " + item.Product.Name,
			})
		}
		total += float64(item.Quantity) * item.Product.Price
	}

	// Create order
	userUUID := uuid.FromStringOrNil(userID.(string))
	order := models.Order{
		UserID: &userUUID,
		Total:  total,
		Status: models.OrderStatusPending,
		AddressJSON: models.AddressData{
			Label:   req.Address["label"].(string),
			Line:    req.Address["line"].(string),
			City:    req.Address["city"].(string),
			Country: req.Address["country"].(string),
		},
		ServiceRequest: func() *models.ServiceData {
			if req.ServiceRequest == nil {
				return nil
			}
			return &models.ServiceData{
				Type:    (*req.ServiceRequest)["type"].(string),
				Details: *req.ServiceRequest,
			}
		}(),
	}

	if err := config.DB.Create(&order).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create order",
		})
	}

	// Create order items
	for _, item := range cart.CartItems {
		orderItem := models.OrderItem{
			OrderID:   order.ID,
			ProductID: item.ProductID,
			Quantity:  item.Quantity,
			UnitPrice: item.UnitPrice,
		}
		if err := config.DB.Create(&orderItem).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create order item",
			})
		}

		// Update product stock
		if err := config.DB.Model(&item.Product).Update("stock_quantity",
			item.Product.StockQuantity-item.Quantity).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to update product stock",
			})
		}
	}

	// Clear cart
	if err := config.DB.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to clear cart",
		})
	}

	// Create payment record
	payment := models.Payment{
		OrderID:  order.ID,
		Provider: req.PaymentMethod,
		Amount:   total,
		Status:   models.PaymentStatusPending,
	}

	if err := config.DB.Create(&payment).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create payment record",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message":    "Order placed successfully",
		"order_id":   order.ID,
		"payment_id": payment.ID,
		"total":      total,
	})
}

// GetShippingOptions returns available shipping options
func GetShippingOptions(c *fiber.Ctx) error {
	// TODO: In production, integrate with real shipping providers like:
	// - FedEx API
	// - UPS API
	// - DHL API
	// - Local courier services
	// - Calculate real-time shipping rates based on weight, dimensions, and destination
	shippingOptions := []map[string]interface{}{
		{
			"id":             "standard",
			"name":           "Standard Delivery",
			"price":          500,
			"estimated_days": "3-5 business days",
		},
		{
			"id":             "express",
			"name":           "Express Delivery",
			"price":          1000,
			"estimated_days": "1-2 business days",
		},
		{
			"id":             "pickup",
			"name":           "Store Pickup",
			"price":          0,
			"estimated_days": "Same day",
		},
	}

	return c.JSON(shippingOptions)
}
