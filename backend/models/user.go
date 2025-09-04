package models

import (
	"time"
	uuid "github.com/satori/go.uuid"
)

type UserRole string

const (
	RoleCustomer UserRole = "customer"
	RoleAdmin    UserRole = "admin"
)

type User struct {
	Base
	Email           string     `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash    string     `gorm:"not null" json:"-"`
	Phone           *string    `json:"phone"`
	FullName        string     `gorm:"not null" json:"full_name"`
	Role            UserRole   `gorm:"not null;default:'customer'" json:"role"`
	IsActive        bool       `gorm:"default:true" json:"is_active"`
	ResetToken      *string    `gorm:"index" json:"-"`
	ResetTokenExpiry *time.Time `json:"-"`
	
	// Relationships
	Addresses       []Address      `gorm:"foreignKey:UserID" json:"addresses,omitempty"`
	Carts           []Cart         `gorm:"foreignKey:UserID" json:"carts,omitempty"`
	Wishlists      []Wishlist     `gorm:"foreignKey:UserID" json:"wishlists,omitempty"`
	Orders         []Order        `gorm:"foreignKey:UserID" json:"orders,omitempty"`
	Payments       []Payment      `gorm:"foreignKey:UserID" json:"payments,omitempty"`
	Notifications  []Notification `gorm:"foreignKey:UserID" json:"notifications,omitempty"`
}

type Address struct {
	Base
	UserID    uuid.UUID `gorm:"not null" json:"user_id"`
	Label     string    `gorm:"not null" json:"label"`
	Line      string    `gorm:"not null" json:"line"`
	City      string    `gorm:"not null" json:"city"`
	Country   string    `gorm:"not null" json:"country"`
	IsDefault bool      `gorm:"default:false" json:"is_default"`
	
	// Relationships
	User User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}
