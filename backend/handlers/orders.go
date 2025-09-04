package handlers

import (
	"backend/config"
	"backend/models"
	"time"

	"github.com/gofiber/fiber/v2"
	uuid "github.com/satori/go.uuid"
)

// CreateOrder creates a new order from the user's cart
func CreateOrder(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	var req struct {
		Address        models.AddressData  `json:"address"`
		ServiceRequest *models.ServiceData `json:"service_request,omitempty"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Get user's cart
	var cart models.Cart
	if err := config.DB.Preload("CartItems.Product").
		Where("user_id = ?", userID).First(&cart).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cart is empty",
		})
	}

	if len(cart.CartItems) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cart is empty",
		})
	}

	// Calculate total and validate stock
	var total float64
	var orderItems []models.OrderItem

	for _, cartItem := range cart.CartItems {
		// Check stock availability
		if cartItem.Product.StockQuantity < cartItem.Quantity {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Insufficient stock for " + cartItem.Product.Name,
			})
		}

		// Calculate item total
		itemTotal := cartItem.UnitPrice * float64(cartItem.Quantity)
		total += itemTotal

		// Create order item
		orderItem := models.OrderItem{
			ProductID: cartItem.ProductID,
			Quantity:  cartItem.Quantity,
			UnitPrice: cartItem.UnitPrice,
		}
		orderItems = append(orderItems, orderItem)
	}

	// Convert userID string to UUID and take address
	userUUID := uuid.FromStringOrNil(userID.(string))
	if userUUID == uuid.Nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID",
		})
	}

	// Create order
	order := models.Order{
		UserID:         &userUUID,
		Total:          total,
		Status:         models.OrderStatusPending,
		AddressJSON:    req.Address,
		ServiceRequest: req.ServiceRequest,
		PlacedAt:       time.Now(),
	}

	// Start transaction
	tx := config.DB.Begin()

	if err := tx.Create(&order).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create order",
		})
	}

	// Create order items
	for i := range orderItems {
		orderItems[i].OrderID = order.ID
		if err := tx.Create(&orderItems[i]).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create order items",
			})
		}
	}

	// Update product stock
	for _, cartItem := range cart.CartItems {
		if err := tx.Model(&models.Product{}).
			Where("id = ?", cartItem.ProductID).
			Update("stock_quantity", cartItem.Product.StockQuantity-cartItem.Quantity).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to update product stock",
			})
		}
	}

	// Clear cart
	if err := tx.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to clear cart",
		})
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to commit order",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message":  "Order created successfully",
		"order_id": order.ID,
		"total":    order.Total,
	})
}

// GetUserOrders returns all orders for the current user
func GetUserOrders(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	var orders []models.Order
	if err := config.DB.Preload("OrderItems.Product.Category").
		Where("user_id = ?", userID).
		Order("placed_at DESC").
		Find(&orders).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch orders",
		})
	}

	return c.JSON(orders)
}

// GetOrderDetails returns details of a specific order
func GetOrderDetails(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	orderID := c.Params("id")
	if orderID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Order ID is required",
		})
	}

	var order models.Order
	if err := config.DB.Preload("OrderItems.Product.Category").
		Where("id = ? AND user_id = ?", orderID, userID).First(&order).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Order not found",
		})
	}

	return c.JSON(order)
}

// AdminGetOrders returns all orders for admin
func AdminGetOrders(c *fiber.Ctx) error {
	var orders []models.Order

	query := config.DB.Preload("OrderItems.Product.Category").Preload("User")

	// Filter by status
	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}

	// Filter by date range
	if startDate := c.Query("start_date"); startDate != "" {
		query = query.Where("placed_at >= ?", startDate)
	}
	if endDate := c.Query("end_date"); endDate != "" {
		query = query.Where("placed_at <= ?", endDate)
	}

	// Pagination
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 20)
	offset := (page - 1) * limit

	if err := query.Offset(offset).Limit(limit).Order("placed_at DESC").Find(&orders).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch orders",
		})
	}

	return c.JSON(fiber.Map{
		"orders": orders,
		"page":   page,
		"limit":  limit,
	})
}

// AdminUpdateOrderStatus updates the status of an order
func AdminUpdateOrderStatus(c *fiber.Ctx) error {
	orderID := c.Params("id")
	if orderID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Order ID is required",
		})
	}

	var req struct {
		Status models.OrderStatus `json:"status"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Validate status
	validStatuses := []models.OrderStatus{
		models.OrderStatusPending,
		models.OrderStatusConfirmed,
		models.OrderStatusShipped,
		models.OrderStatusDelivered,
		models.OrderStatusCancelled,
	}

	validStatus := false
	for _, status := range validStatuses {
		if req.Status == status {
			validStatus = true
			break
		}
	}

	if !validStatus {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid status",
		})
	}

	var order models.Order
	if err := config.DB.First(&order, "id = ?", orderID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Order not found",
		})
	}

	// Update status
	if err := config.DB.Model(&order).Update("status", req.Status).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update order status",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Order status updated successfully",
		"status":  req.Status,
	})
}

// CancelOrder allows users to cancel their own orders
func CancelOrder(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	orderID := c.Params("id")
	if orderID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Order ID is required",
		})
	}

	// Find order and verify ownership
	var order models.Order
	if err := config.DB.Preload("OrderItems.Product").Where("id = ? AND user_id = ?", orderID, userID).First(&order).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Order not found",
		})
	}

	// Check if order can be cancelled
	if order.Status != models.OrderStatusPending && order.Status != models.OrderStatusConfirmed {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Order cannot be cancelled in current status",
		})
	}

	// Update order status
	if err := config.DB.Model(&order).Update("status", models.OrderStatusCancelled).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to cancel order",
		})
	}

	// Restore product stock
	for _, item := range order.OrderItems {
		if err := config.DB.Model(&item.Product).Update("stock_quantity",
			item.Product.StockQuantity+item.Quantity).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to restore product stock",
			})
		}
	}

	return c.JSON(fiber.Map{
		"message": "Order cancelled successfully",
	})
}
