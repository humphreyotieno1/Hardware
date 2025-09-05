package handlers

import (
	"backend/config"
	"backend/models"

	"github.com/gofiber/fiber/v2"
	uuid "github.com/satori/go.uuid"
)

// GetCart returns the user's cart
func GetCart(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	// Convert userID string to UUID
	userUUID := uuid.FromStringOrNil(userID.(string))
	if userUUID == uuid.Nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID",
		})
	}

	var cart models.Cart
	if err := config.DB.Preload("CartItems.Product.Category").
		Where("user_id = ?", userUUID).First(&cart).Error; err != nil {
		// Create new cart if none exists
		cart = models.Cart{
			UserID: &userUUID,
		}
		if err := config.DB.Create(&cart).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create cart",
			})
		}
	}

	return c.JSON(cart)
}

// AddCartItem adds an item to the cart
func AddCartItem(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	// Convert userID string to UUID
	userUUID := uuid.FromStringOrNil(userID.(string))
	if userUUID == uuid.Nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID",
		})
	}

	var req struct {
		ProductID string `json:"product_id"`
		Quantity  int    `json:"quantity"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if req.Quantity <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Quantity must be greater than 0",
		})
	}

	// Get or create cart
	var cart models.Cart
	if err := config.DB.Where("user_id = ?", userUUID).First(&cart).Error; err != nil {
		cart = models.Cart{
			UserID: &userUUID,
		}
		if err := config.DB.Create(&cart).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create cart",
			})
		}
	}

	// Check if product exists and has stock
	var product models.Product
	if err := config.DB.Where("id = ? AND is_active = ?", req.ProductID, true).First(&product).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}

	if product.StockQuantity < req.Quantity {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Insufficient stock",
		})
	}

	// Check if item already exists in cart
	var existingItem models.CartItem
	if err := config.DB.Where("cart_id = ? AND product_id = ?", cart.ID, req.ProductID).First(&existingItem).Error; err == nil {
		// Update quantity
		newQuantity := existingItem.Quantity + req.Quantity
		if err := config.DB.Model(&existingItem).Update("quantity", newQuantity).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to update cart item",
			})
		}
	} else {
		// Create new cart item
		cartItem := models.CartItem{
			CartID:    cart.ID,
			ProductID: uuid.FromStringOrNil(req.ProductID),
			Quantity:  req.Quantity,
			UnitPrice: product.Price,
		}
		if err := config.DB.Create(&cartItem).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to add item to cart",
			})
		}
	}

	return c.JSON(fiber.Map{
		"message": "Item added to cart successfully",
	})
}

// UpdateCartItem updates the quantity of a cart item
func UpdateCartItem(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	itemID := c.Params("id")
	if itemID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Item ID is required",
		})
	}

	var req struct {
		Quantity int `json:"quantity"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if req.Quantity <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Quantity must be greater than 0",
		})
	}

	// Find cart item and verify ownership
	var cartItem models.CartItem
	if err := config.DB.Joins("JOIN carts ON carts.id = cart_items.cart_id").
		Where("cart_items.id = ? AND carts.user_id = ?", itemID, userID).First(&cartItem).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Cart item not found",
		})
	}

	// Check stock availability
	var product models.Product
	if err := config.DB.First(&product, cartItem.ProductID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}

	if product.StockQuantity < req.Quantity {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Insufficient stock",
		})
	}

	// Update quantity
	if err := config.DB.Model(&cartItem).Update("quantity", req.Quantity).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update cart item",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Cart item updated successfully",
	})
}

// RemoveCartItem removes an item from the cart
func RemoveCartItem(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	itemID := c.Params("id")
	if itemID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Item ID is required",
		})
	}

	// Find cart item and verify ownership
	var cartItem models.CartItem
	if err := config.DB.Joins("JOIN carts ON carts.id = cart_items.cart_id").
		Where("cart_items.id = ? AND carts.user_id = ?", itemID, userID).First(&cartItem).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Cart item not found",
		})
	}

	// Delete cart item
	if err := config.DB.Delete(&cartItem).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to remove cart item",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Cart item removed successfully",
	})
}

// ClearCart clears all items from the user's cart
func ClearCart(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	// Find user's cart
	var cart models.Cart
	if err := config.DB.Where("user_id = ?", userID).First(&cart).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Cart not found",
		})
	}

	// Delete all cart items
	if err := config.DB.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to clear cart",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Cart cleared successfully",
	})
}

// GetWishlist returns the user's wishlist
func GetWishlist(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	var wishlist []models.Wishlist
	if err := config.DB.Preload("Product.Category").
		Where("user_id = ?", userID).Find(&wishlist).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch wishlist",
		})
	}

	return c.JSON(wishlist)
}

// AddWishlistItem adds an item to the wishlist
func AddWishlistItem(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	var req struct {
		ProductID string `json:"product_id"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Check if product exists
	var product models.Product
	if err := config.DB.Where("id = ? AND is_active = ?", req.ProductID, true).First(&product).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}

	// Check if already in wishlist
	var existingWishlist models.Wishlist
	if err := config.DB.Where("user_id = ? AND product_id = ?", userID, req.ProductID).First(&existingWishlist).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Product already in wishlist",
		})
	}

	// Add to wishlist
	wishlistItem := models.Wishlist{
		UserID:    uuid.FromStringOrNil(userID.(string)),
		ProductID: uuid.FromStringOrNil(req.ProductID),
	}

	if err := config.DB.Create(&wishlistItem).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to add item to wishlist",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Item added to wishlist successfully",
	})
}

// RemoveWishlistItem removes an item from the wishlist
func RemoveWishlistItem(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	itemID := c.Params("id")
	if itemID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Item ID is required",
		})
	}

	// Find wishlist item and verify ownership
	var wishlistItem models.Wishlist
	if err := config.DB.Where("id = ? AND user_id = ?", itemID, userID).First(&wishlistItem).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Wishlist item not found",
		})
	}

	// Delete wishlist item
	if err := config.DB.Delete(&wishlistItem).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to remove wishlist item",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Wishlist item removed successfully",
	})
}
