package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	uuid "github.com/satori/go.uuid"
)

type Category struct {
	Base
	Name string `gorm:"not null" json:"name"`
	Slug string `gorm:"uniqueIndex;not null" json:"slug"`
	
	// Relationships
	Products []Product `gorm:"foreignKey:CategoryID" json:"products,omitempty"`
}

type Product struct {
	Base
	SKU            string      `gorm:"uniqueIndex;not null" json:"sku"`
	Name           string      `gorm:"not null" json:"name"`
	Slug           string      `gorm:"uniqueIndex;not null" json:"slug"`
	CategoryID     uuid.UUID   `gorm:"not null" json:"category_id"`
	Description    string      `gorm:"type:text" json:"description"`
	Price          float64     `gorm:"type:decimal(10,2);not null" json:"price"`
	StockQuantity  int         `gorm:"not null;default:0" json:"stock_quantity"`
	ImagesJSON     ImagesArray `gorm:"type:jsonb" json:"images_json"`
	IsActive       bool        `gorm:"default:true" json:"is_active"`
	
	// Relationships
	Category     Category     `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	CartItems   []CartItem   `gorm:"foreignKey:ProductID" json:"cart_items,omitempty"`
	OrderItems  []OrderItem  `gorm:"foreignKey:ProductID" json:"order_items,omitempty"`
	Wishlists   []Wishlist   `gorm:"foreignKey:ProductID" json:"wishlists,omitempty"`
}

// ImagesArray is a custom type for handling JSON array of image URLs
type ImagesArray []string

func (ia ImagesArray) Value() (driver.Value, error) {
	return json.Marshal(ia)
}

func (ia *ImagesArray) Scan(value interface{}) error {
	if value == nil {
		*ia = nil
		return nil
	}
	
	switch v := value.(type) {
	case []byte:
		return json.Unmarshal(v, ia)
	case string:
		return json.Unmarshal([]byte(v), ia)
	default:
		return errors.New("cannot scan ImagesArray")
	}
}
