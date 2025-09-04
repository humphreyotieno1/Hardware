package handlers

import (
	"backend/config"
	"backend/models"

	"github.com/gofiber/fiber/v2"
)

// GetCategories returns all categories
func GetCategories(c *fiber.Ctx) error {
	var categories []models.Category
	if err := config.DB.Find(&categories).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch categories",
		})
	}

	return c.JSON(categories)
}

// GetProducts returns products with optional filtering
func GetProducts(c *fiber.Ctx) error {
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

	// Filter by price range
	if minPrice := c.Query("min_price"); minPrice != "" {
		query = query.Where("products.price >= ?", minPrice)
	}
	if maxPrice := c.Query("max_price"); maxPrice != "" {
		query = query.Where("products.price <= ?", maxPrice)
	}

	// Sort options
	sortBy := c.Query("sort", "name")
	order := c.Query("order", "asc")
	if order != "asc" && order != "desc" {
		order = "asc"
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

// GetProductDetails returns a specific product by slug
func GetProductDetails(c *fiber.Ctx) error {
	slug := c.Params("slug")
	if slug == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Product slug is required",
		})
	}

	var product models.Product
	if err := config.DB.Preload("Category").Where("slug = ? AND is_active = ?", slug, true).First(&product).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}

	return c.JSON(product)
}

// AdminGetCategories returns all categories for admin
func AdminGetCategories(c *fiber.Ctx) error {
	var categories []models.Category
	if err := config.DB.Find(&categories).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch categories",
		})
	}

	return c.JSON(categories)
}

// AdminCreateCategory creates a new category
func AdminCreateCategory(c *fiber.Ctx) error {
	var req struct {
		Name string `json:"name"`
		Slug string `json:"slug"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if req.Name == "" || req.Slug == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Name and slug are required",
		})
	}

	// Check if slug already exists
	var existingCategory models.Category
	if err := config.DB.Where("slug = ?", req.Slug).First(&existingCategory).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Category with this slug already exists",
		})
	}

	category := models.Category{
		Name: req.Name,
		Slug: req.Slug,
	}

	if err := config.DB.Create(&category).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create category",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(category)
}

// AdminUpdateCategory updates an existing category
func AdminUpdateCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category ID is required",
		})
	}

	var req struct {
		Name string `json:"name"`
		Slug string `json:"slug"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	var category models.Category
	if err := config.DB.First(&category, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	updates := map[string]interface{}{}
	if req.Name != "" {
		updates["name"] = req.Name
	}
	if req.Slug != "" {
		updates["slug"] = req.Slug
	}

	if err := config.DB.Model(&category).Updates(updates).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update category",
		})
	}

	return c.JSON(category)
}

// AdminDeleteCategory deletes a category
func AdminDeleteCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category ID is required",
		})
	}

	// Check if category has products
	var productCount int64
	if err := config.DB.Model(&models.Product{}).Where("category_id = ?", id).Count(&productCount).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to check category usage",
		})
	}

	if productCount > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot delete category with existing products",
		})
	}

	if err := config.DB.Delete(&models.Category{}, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete category",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Category deleted successfully",
	})
}

// SearchProducts handles product search with advanced filtering
func SearchProducts(c *fiber.Ctx) error {
	var products []models.Product






















	

	query := config.DB.Preload("Category")

	// Search by keywords
	if searchTerm := c.Query("q"); searchTerm != "" {
		query = query.Where("products.name ILIKE ? OR products.description ILIKE ? OR products.sku ILIKE ?",
			"%"+searchTerm+"%", "%"+searchTerm+"%", "%"+searchTerm+"%")
	}

	// Filter by category
	if categorySlug := c.Query("category"); categorySlug != "" {
		query = query.Joins("JOIN categories ON categories.id = products.category_id").
			Where("categories.slug = ?", categorySlug)
	}

	// Filter by price range
	if minPrice := c.Query("min_price"); minPrice != "" {
		query = query.Where("products.price >= ?", minPrice)
	}
	if maxPrice := c.Query("max_price"); maxPrice != "" {
		query = query.Where("products.price <= ?", maxPrice)
	}

	// Filter by availability
	if inStock := c.Query("in_stock"); inStock == "true" {
		query = query.Where("products.stock_quantity > 0")
	}

	// Sort options
	sortBy := c.Query("sort", "name")
	order := c.Query("order", "asc")
	if order != "asc" && order != "desc" {
		order = "asc"
	}
	query = query.Order("products." + sortBy + " " + order)

	// Pagination
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 20)
	offset := (page - 1) * limit

	if err := query.Offset(offset).Limit(limit).Find(&products).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to search products",
		})
	}

	// Get total count for pagination
	var total int64
	query.Model(&models.Product{}).Count(&total)

	return c.JSON(fiber.Map{
		"products": products,
		"total":    total,
		"page":     page,
		"limit":    limit,
		"pages":    (total + int64(limit) - 1) / int64(limit),
	})
}
