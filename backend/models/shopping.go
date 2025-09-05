package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"
	uuid "github.com/satori/go.uuid"
)

type Cart struct {
	Base
	UserID    *uuid.UUID `gorm:"index" json:"user_id"`
	SessionID *string    `gorm:"uniqueIndex" json:"session_id"`
	
	// Relationships
	User      *User       `gorm:"foreignKey:UserID" json:"user,omitempty"`
	CartItems []CartItem  `gorm:"foreignKey:CartID" json:"cart_items,omitempty"`
}

type CartItem struct {
	Base
	CartID     uuid.UUID `gorm:"not null" json:"cart_id"`
	ProductID  uuid.UUID `gorm:"not null" json:"product_id"`
	Quantity   int       `gorm:"not null;default:1" json:"quantity"`
	UnitPrice  float64   `gorm:"type:decimal(10,2);not null" json:"unit_price"`
	
	// Relationships
	Cart    Cart    `gorm:"foreignKey:CartID" json:"cart,omitempty"`
	Product Product `gorm:"foreignKey:ProductID" json:"product,omitempty"`
}

type Wishlist struct {
	Base
	UserID    uuid.UUID `gorm:"not null" json:"user_id"`
	ProductID uuid.UUID `gorm:"not null" json:"product_id"`
	
	// Relationships
	User    User    `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Product Product `gorm:"foreignKey:ProductID" json:"product,omitempty"`
}

type OrderStatus string

const (
	OrderStatusPending   OrderStatus = "pending"
	OrderStatusConfirmed OrderStatus = "confirmed"
	OrderStatusShipped   OrderStatus = "shipped"
	OrderStatusDelivered OrderStatus = "delivered"
	OrderStatusCancelled OrderStatus = "cancelled"
)

type Order struct {
	Base
	UserID         *uuid.UUID   `gorm:"index" json:"user_id"`
	Total          float64      `gorm:"type:decimal(10,2);not null" json:"total"`
	Status         OrderStatus  `gorm:"not null;default:'pending'" json:"status"`
	AddressJSON    AddressData  `gorm:"type:jsonb;not null" json:"address_json"`
	ServiceRequest *ServiceData `gorm:"type:jsonb" json:"service_request,omitempty"`
	PlacedAt       time.Time    `gorm:"not null" json:"placed_at"`
	
	// Relationships
	User        *User        `gorm:"foreignKey:UserID" json:"user,omitempty"`
	OrderItems  []OrderItem  `gorm:"foreignKey:OrderID" json:"order_items,omitempty"`
	Payments    []Payment    `gorm:"foreignKey:OrderID" json:"payments,omitempty"`
}

type OrderItem struct {
	Base
	OrderID    uuid.UUID `gorm:"not null" json:"order_id"`
	ProductID  uuid.UUID `gorm:"not null" json:"product_id"`
	Quantity   int       `gorm:"not null" json:"quantity"`
	UnitPrice  float64   `gorm:"type:decimal(10,2);not null" json:"unit_price"`
	
	// Relationships
	Order   Order   `gorm:"foreignKey:OrderID" json:"order,omitempty"`
	Product Product `gorm:"foreignKey:ProductID" json:"product,omitempty"`
}

// AddressData is a custom type for handling address JSON in orders
type AddressData struct {
	Label   string `json:"label"`
	Line    string `json:"line"`
	City    string `json:"city"`
	Country string `json:"country"`
}

func (ad AddressData) Value() (driver.Value, error) {
	return json.Marshal(ad)
}

func (ad *AddressData) Scan(value interface{}) error {
	if value == nil {
		*ad = AddressData{}
		return nil
	}
	
	switch v := value.(type) {
	case []byte:
		return json.Unmarshal(v, ad)
	case string:
		return json.Unmarshal([]byte(v), ad)
	default:
		return errors.New("cannot scan AddressData")
	}
}

// ServiceData is a custom type for handling service request JSON in orders
type ServiceData struct {
	Type    string                 `json:"type"`
	Details map[string]interface{} `json:"details"`
}

func (sd ServiceData) Value() (driver.Value, error) {
	return json.Marshal(sd)
}

func (sd *ServiceData) Scan(value interface{}) error {
	if value == nil {
		*sd = ServiceData{}
		return nil
	}
	
	switch v := value.(type) {
	case []byte:
		return json.Unmarshal(v, sd)
	case string:
		return json.Unmarshal([]byte(v), sd)
	default:
		return errors.New("cannot scan ServiceData")
	}
}

// ServiceStatus represents the status of a service request
type ServiceStatus string

const (
	ServiceStatusRequested ServiceStatus = "requested"
	ServiceStatusQuoted   ServiceStatus = "quoted"
	ServiceStatusAccepted ServiceStatus = "accepted"
	ServiceStatusScheduled ServiceStatus = "scheduled"
	ServiceStatusInProgress ServiceStatus = "in_progress"
	ServiceStatusCompleted ServiceStatus = "completed"
	ServiceStatusBilled   ServiceStatus = "billed"
	ServiceStatusCancelled ServiceStatus = "cancelled"
)

// ServiceRequest represents a service request from a user
type ServiceRequest struct {
	Base
	UserID         uuid.UUID              `gorm:"not null" json:"user_id"`
	Type           string                 `gorm:"not null" json:"type"`
	Details        map[string]interface{} `gorm:"type:jsonb" json:"details"`
	Location       string                 `gorm:"not null" json:"location"`
	RequestedDate  string                 `json:"requested_date"`
	Instructions   string                 `json:"instructions"`
	Status         ServiceStatus          `gorm:"not null;default:'requested'" json:"status"`
	QuoteAmount    *float64               `gorm:"type:decimal(10,2)" json:"quote_amount,omitempty"`
	AssignedTo     *uuid.UUID             `json:"assigned_to,omitempty"`
	ScheduledDate  *string                `json:"scheduled_date,omitempty"`
	
	// Relationships
	User        *User        `gorm:"foreignKey:UserID" json:"user,omitempty"`
	AssignedUser *User       `gorm:"foreignKey:AssignedTo" json:"assigned_user,omitempty"`
}
