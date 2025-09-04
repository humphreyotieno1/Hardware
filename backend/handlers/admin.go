package handlers

import (
	"backend/config"
	"backend/models"
	"github.com/gofiber/fiber/v2"
	uuid "github.com/satori/go.uuid"
)

// AdminGetProducts returns all products for admin management
func AdminGetProducts(c *fiber.Ctx) error {
	var products []models.Product
	
	query := config.DB.Preload("Category")
	
	// Filter by category
	if categorySlug := c.Query("category"); categorySlug != "" {
		query = query.Joins("JOIN categories ON categories.id = products.category_id").
			Where("categories.slug = ?", categorySlug)
	}
	
	// Search by name/description
	if searchTerm := c.Query("q"); searchTerm != "" {
		query = query.Where("products.name ILIKE ? OR products.description ILIKE ?", 
			"%"+searchTerm+"%", "%"+searchTerm+"%")
	}
	
	// Filter by active status
	if active := c.Query("active"); active != "" {
		query = query.Where("products.is_active = ?", active == "true")
	}
	
	// Sort options
	sortBy := c.Query("sort", "created_at")
	order := c.Query("order", "desc")
	if order != "asc" && order != "desc" {
		order = "desc"
	}
	query = query.Order("products." + sortBy + " " + order)
	
	// Pagination
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 20)
	offset := (page - 1) * limit
	
	if err := query.Offset(offset).Limit(limit).Find(&products).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch products",
		})
	}

	return c.JSON(fiber.Map{
		"products": products,
		"page":     page,
		"limit":    limit,
	})
}

// AdminCreateProduct creates a new product
func AdminCreateProduct(c *fiber.Ctx) error {
	var req struct {
		SKU           string      `json:"sku"`
		Name          string      `json:"name"`
		Slug          string      `json:"slug"`
		CategoryID    string      `json:"category_id"`
		Description   string      `json:"description"`
		Price         float64     `json:"price"`
		StockQuantity int         `json:"stock_quantity"`
		ImagesJSON    []string    `json:"images_json"`
		IsActive      bool        `json:"is_active"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Validate required fields
	if req.SKU == "" || req.Name == "" || req.Slug == "" || req.CategoryID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "SKU, name, slug, and category_id are required",
		})
	}

	if req.Price < 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Price must be non-negative",
		})
	}

	if req.StockQuantity < 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Stock quantity must be non-negative",
		})
	}

	// Check if SKU already exists
	var existingProduct models.Product
	if err := config.DB.Where("sku = ?", req.SKU).First(&existingProduct).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Product with this SKU already exists",
		})
	}

	// Check if slug already exists
	if err := config.DB.Where("slug = ?", req.Slug).First(&existingProduct).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Product with this slug already exists",
		})
	}

	// Verify category exists
	var category models.Category
	if err := config.DB.First(&category, "id = ?", req.CategoryID).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	// Create product
	product := models.Product{
		SKU:           req.SKU,
		Name:          req.Name,
		Slug:          req.Slug,
		CategoryID:    uuid.FromStringOrNil(req.CategoryID),
		Description:   req.Description,
		Price:         req.Price,
		StockQuantity: req.StockQuantity,
		ImagesJSON:    req.ImagesJSON,
		IsActive:      req.IsActive,
	}

	if err := config.DB.Create(&product).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create product",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(product)
}

// AdminUpdateProduct updates an existing product
func AdminUpdateProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Product ID is required",
		})
	}

	var req struct {
		SKU           *string   `json:"sku"`
		Name          *string   `json:"name"`
		Slug          *string   `json:"slug"`
		CategoryID    *string   `json:"category_id"`
		Description   *string   `json:"description"`
		Price         *float64  `json:"price"`
		StockQuantity *int      `json:"stock_quantity"`
		ImagesJSON    []string  `json:"images_json"`
		IsActive      *bool     `json:"is_active"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	var product models.Product
	if err := config.DB.First(&product, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}

	// Build updates map
	updates := map[string]interface{}{}
	
	if req.SKU != nil {
		// Check if new SKU already exists
		if *req.SKU != product.SKU {
			var existingProduct models.Product
			if err := config.DB.Where("sku = ? AND id != ?", *req.SKU, id).First(&existingProduct).Error; err == nil {
				return c.Status(fiber.StatusConflict).JSON(fiber.Map{
					"error": "Product with this SKU already exists",
				})
			}
		}
		updates["sku"] = *req.SKU
	}
	
	if req.Name != nil {
		updates["name"] = *req.Name
	}
	
	if req.Slug != nil {
		// Check if new slug already exists
		if *req.Slug != product.Slug {
			var existingProduct models.Product
			if err := config.DB.Where("slug = ? AND id != ?", *req.Slug, id).First(&existingProduct).Error; err == nil {
				return c.Status(fiber.StatusConflict).JSON(fiber.Map{
					"error": "Product with this slug already exists",
				})
			}
		}
		updates["slug"] = *req.Slug
	}
	
	if req.CategoryID != nil {
		// Verify category exists
		var category models.Category
		if err := config.DB.First(&category, "id = ?", *req.CategoryID).Error; err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Category not found",
			})
		}
		updates["category_id"] = *req.CategoryID
	}
	
	if req.Description != nil {
		updates["description"] = *req.Description
	}
	
	if req.Price != nil {
		if *req.Price < 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Price must be non-negative",
			})
		}
		updates["price"] = *req.Price
	}
	
	if req.StockQuantity != nil {
		if *req.StockQuantity < 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Stock quantity must be non-negative",
			})
		}
		updates["stock_quantity"] = *req.StockQuantity
	}
	
	if req.ImagesJSON != nil {
		updates["images_json"] = req.ImagesJSON
	}
	
	if req.IsActive != nil {
		updates["is_active"] = *req.IsActive
	}

	if err := config.DB.Model(&product).Updates(updates).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update product",
		})
	}

	return c.JSON(product)
}

// AdminDeleteProduct deletes a product
func AdminDeleteProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Product ID is required",
		})
	}

	// Check if product has orders
	var orderCount int64
	if err := config.DB.Model(&models.OrderItem{}).Where("product_id = ?", id).Count(&orderCount).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to check product usage",
		})
	}

	if orderCount > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot delete product with existing orders",
		})
	}

	// Soft delete the product
	if err := config.DB.Delete(&models.Product{}, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete product",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Product deleted successfully",
	})
}

// AdminGetSalesReport returns sales report for admin
func AdminGetSalesReport(c *fiber.Ctx) error {
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")
	
	if startDate == "" || endDate == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Start date and end date are required",
		})
	}

	// Get total sales
	var totalSales float64
	if err := config.DB.Model(&models.Order{}).
		Where("status = ? AND placed_at BETWEEN ? AND ?", 
			models.OrderStatusDelivered, startDate, endDate).
		Select("COALESCE(SUM(total), 0)").
		Scan(&totalSales).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to calculate total sales",
		})
	}

	// Get order count
	var orderCount int64
	if err := config.DB.Model(&models.Order{}).
		Where("placed_at BETWEEN ? AND ?", startDate, endDate).
		Count(&orderCount).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to count orders",
		})
	}

	// Get top selling products
	var topProducts []struct {
		ProductName string  `json:"product_name"`
		TotalSold  int     `json:"total_sold"`
		Revenue    float64 `json:"revenue"`
	}

	if err := config.DB.Table("order_items").
		Select("products.name as product_name, SUM(order_items.quantity) as total_sold, SUM(order_items.quantity * order_items.unit_price) as revenue").
		Joins("JOIN products ON products.id = order_items.product_id").
		Joins("JOIN orders ON orders.id = order_items.order_id").
		Where("orders.placed_at BETWEEN ? AND ?", startDate, endDate).
		Group("products.id, products.name").
		Order("total_sold DESC").
		Limit(10).
		Scan(&topProducts).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch top products",
		})
	}

	return c.JSON(fiber.Map{
		"period":       fiber.Map{"start": startDate, "end": endDate},
		"total_sales":  totalSales,
		"order_count":  orderCount,
		"top_products": topProducts,
	})
}

// AdminGetInventoryReport returns inventory report for admin
func AdminGetInventoryReport(c *fiber.Ctx) error {
	// Get low stock products (less than 10 items)
	var lowStockProducts []models.Product
	if err := config.DB.Preload("Category").
		Where("stock_quantity < 10 AND is_active = ?", true).
		Order("stock_quantity ASC").
		Find(&lowStockProducts).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch low stock products",
		})
	}

	// Get total inventory value
	var totalValue float64
	if err := config.DB.Model(&models.Product{}).
		Where("is_active = ?", true).
		Select("COALESCE(SUM(stock_quantity * price), 0)").
		Scan(&totalValue).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to calculate inventory value",
		})
	}

	// Get total products count
	var totalProducts int64
	if err := config.DB.Model(&models.Product{}).
		Where("is_active = ?", true).
		Count(&totalProducts).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to count products",
		})
	}

	return c.JSON(fiber.Map{
		"total_products":      totalProducts,
		"total_inventory_value": totalValue,
		"low_stock_products":   lowStockProducts,
		"low_stock_threshold":  10,
	})
}

// AdminUpdateStock updates product stock levels
func AdminUpdateStock(c *fiber.Ctx) error {
	var req struct {
		ProductID string `json:"product_id"`
		Quantity  int    `json:"quantity"`
		Operation string `json:"operation"` // "add", "subtract", "set"
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if req.ProductID == "" || req.Operation == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Product ID and operation are required",
		})
	}

	var product models.Product
	if err := config.DB.First(&product, "id = ?", req.ProductID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}

	var newQuantity int
	switch req.Operation {
	case "add":
		newQuantity = product.StockQuantity + req.Quantity
	case "subtract":
		newQuantity = product.StockQuantity - req.Quantity
		if newQuantity < 0 {
			newQuantity = 0
		}
	case "set":
		newQuantity = req.Quantity
		if newQuantity < 0 {
			newQuantity = 0
		}
	default:
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid operation. Use 'add', 'subtract', or 'set'",
		})
	}

	if err := config.DB.Model(&product).Update("stock_quantity", newQuantity).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update stock",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Stock updated successfully",
		"product_id": product.ID,
		"old_quantity": product.StockQuantity,
		"new_quantity": newQuantity,
	})
}

// AdminGetLowStockItems returns products with low stock
func AdminGetLowStockItems(c *fiber.Ctx) error {
	threshold := c.QueryInt("threshold", 10)

	var products []models.Product
	if err := config.DB.Preload("Category").
		Where("stock_quantity <= ?", threshold).
		Order("stock_quantity ASC").
		Find(&products).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch low stock items",
		})
	}

	return c.JSON(fiber.Map{
		"threshold": threshold,
		"products": products,
		"count": len(products),
	})
}

// AdminGetOrderDetails returns detailed information about a specific order
func AdminGetOrderDetails(c *fiber.Ctx) error {
	orderID := c.Params("id")
	if orderID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Order ID is required",
		})
	}

	var order models.Order
	if err := config.DB.Preload("OrderItems.Product.Category").
		Preload("User").
		Preload("Payments").
		Where("id = ?", orderID).
		First(&order).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Order not found",
		})
	}

	return c.JSON(order)
}

// AdminGetServiceRequests returns all service requests for admin
func AdminGetServiceRequests(c *fiber.Ctx) error {
	var requests []models.ServiceRequest

	query := config.DB.Preload("User")

	// Filter by status
	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}

	// Filter by type
	if serviceType := c.Query("type"); serviceType != "" {
		query = query.Where("type = ?", serviceType)
	}

	// Pagination
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 20)
	offset := (page - 1) * limit

	if err := query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&requests).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch service requests",
		})
	}

	return c.JSON(fiber.Map{
		"requests": requests,
		"page":     page,
		"limit":    limit,
	})
}

// AdminUpdateServiceStatus updates the status of a service request
func AdminUpdateServiceStatus(c *fiber.Ctx) error {
	requestID := c.Params("id")
	if requestID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Request ID is required",
		})
	}

	var req struct {
		Status string `json:"status"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Validate status
	validStatuses := []string{
		"requested", "quoted", "accepted", "scheduled", 
		"in_progress", "completed", "billed", "cancelled",
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

	var request models.ServiceRequest
	if err := config.DB.First(&request, "id = ?", requestID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Service request not found",
		})
	}

	// Update status
	if err := config.DB.Model(&request).Update("status", req.Status).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update service status",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Service status updated successfully",
		"status":  req.Status,
	})
}

// AdminCreateServiceQuote creates a quote for a service request
func AdminCreateServiceQuote(c *fiber.Ctx) error {
	requestID := c.Params("id")
	if requestID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Request ID is required",
		})
	}

	var req struct {
		Amount        float64 `json:"amount"`
		AssignedTo    string  `json:"assigned_to,omitempty"`
		ScheduledDate string  `json:"scheduled_date,omitempty"`
		Notes         string  `json:"notes,omitempty"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if req.Amount <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Amount must be greater than 0",
		})
	}

	var request models.ServiceRequest
	if err := config.DB.First(&request, "id = ?", requestID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Service request not found",
		})
	}

	// Update service request with quote
	updates := map[string]interface{}{
		"status":       "quoted",
		"quote_amount": req.Amount,
	}

	if req.AssignedTo != "" {
		updates["assigned_to"] = req.AssignedTo
	}
	if req.ScheduledDate != "" {
		updates["scheduled_date"] = req.ScheduledDate
	}

	if err := config.DB.Model(&request).Updates(updates).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create quote",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Service quote created successfully",
		"amount":  req.Amount,
	})
}

// AdminGetUsers returns all users for admin management
func AdminGetUsers(c *fiber.Ctx) error {
	var users []models.User

	query := config.DB

	// Filter by role
	if role := c.Query("role"); role != "" {
		query = query.Where("role = ?", role)
	}

	// Search by name or email
	if search := c.Query("search"); search != "" {
		query = query.Where("full_name ILIKE ? OR email ILIKE ?", 
			"%"+search+"%", "%"+search+"%")
	}

	// Pagination
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 20)
	offset := (page - 1) * limit

	if err := query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&users).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch users",
		})
	}

	// Clear sensitive information
	for i := range users {
		users[i].PasswordHash = ""
	}

	return c.JSON(fiber.Map{
		"users": users,
		"page":  page,
		"limit": limit,
	})
}

// AdminUpdateUserRole updates a user's role
func AdminUpdateUserRole(c *fiber.Ctx) error {
	userID := c.Params("id")
	if userID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User ID is required",
		})
	}

	var req struct {
		Role string `json:"role"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Validate role
	if req.Role != "customer" && req.Role != "admin" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid role. Use 'customer' or 'admin'",
		})
	}

	var user models.User
	if err := config.DB.First(&user, "id = ?", userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Update role
	if err := config.DB.Model(&user).Update("role", req.Role).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update user role",
		})
	}

	return c.JSON(fiber.Map{
		"message": "User role updated successfully",
		"role":    req.Role,
	})
}

// AdminDeleteUser deletes a user
func AdminDeleteUser(c *fiber.Ctx) error {
	userID := c.Params("id")
	if userID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User ID is required",
		})
	}

	var user models.User
	if err := config.DB.First(&user, "id = ?", userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Check if user has active orders
	var orderCount int64
	if err := config.DB.Model(&models.Order{}).Where("user_id = ?", userID).Count(&orderCount).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to check user orders",
		})
	}

	if orderCount > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot delete user with active orders",
		})
	}

	// Delete user (this will cascade to related records)
	if err := config.DB.Delete(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete user",
		})
	}

	return c.JSON(fiber.Map{
		"message": "User deleted successfully",
	})
}

// AdminGetUsersReport returns a report of user statistics
func AdminGetUsersReport(c *fiber.Ctx) error {
	var totalUsers int64
	var adminUsers int64
	var customerUsers int64
	var activeUsers int64

	// Get total users
	if err := config.DB.Model(&models.User{}).Count(&totalUsers).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to count total users",
		})
	}

	// Get admin users
	if err := config.DB.Model(&models.User{}).Where("role = ?", "admin").Count(&adminUsers).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to count admin users",
		})
	}

	// Get customer users
	if err := config.DB.Model(&models.User{}).Where("role = ?", "customer").Count(&customerUsers).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to count customer users",
		})
	}

	// Get active users (users with orders in last 30 days)
	if err := config.DB.Model(&models.User{}).
		Joins("JOIN orders ON orders.user_id = users.id").
		Where("orders.placed_at >= NOW() - INTERVAL '30 days'").
		Distinct("users.id").
		Count(&activeUsers).Error; err != nil {
		// If no orders, set to 0
		activeUsers = 0
	}

	return c.JSON(fiber.Map{
		"total_users":     totalUsers,
		"admin_users":     adminUsers,
		"customer_users":  customerUsers,
		"active_users":    activeUsers,
		"inactive_users":  totalUsers - activeUsers,
		"admin_percentage": float64(adminUsers) / float64(totalUsers) * 100,
		"customer_percentage": float64(customerUsers) / float64(totalUsers) * 100,
	})
}
