package models

import (
	"time"
	uuid "github.com/satori/go.uuid"
)

type PaymentStatus string

const (
	PaymentStatusPending   PaymentStatus = "pending"
	PaymentStatusCompleted PaymentStatus = "completed"
	PaymentStatusFailed    PaymentStatus = "failed"
	PaymentStatusRefunded  PaymentStatus = "refunded"
)

type Payment struct {
	Base
	OrderID  uuid.UUID     `gorm:"not null" json:"order_id"`
	UserID   uuid.UUID     `gorm:"not null" json:"user_id"`
	Provider string        `gorm:"not null" json:"provider"`
	Reference string       `gorm:"uniqueIndex;not null" json:"reference"`
	Amount   float64       `gorm:"type:decimal(10,2);not null" json:"amount"`
	Status   PaymentStatus `gorm:"not null;default:'pending'" json:"status"`
	PaidAt   *time.Time    `json:"paid_at"`
	
	// Relationships
	Order Order `gorm:"foreignKey:OrderID" json:"order,omitempty"`
	User  User  `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

type NotificationChannel string

const (
	NotificationChannelEmail NotificationChannel = "email"
	NotificationChannelSMS   NotificationChannel = "sms"
)

type NotificationStatus string

const (
	NotificationStatusPending NotificationStatus = "pending"
	NotificationStatusSent    NotificationStatus = "sent"
	NotificationStatusFailed  NotificationStatus = "failed"
)

type Notification struct {
	Base
	UserID  *uuid.UUID           `gorm:"index" json:"user_id"`
	Channel NotificationChannel  `gorm:"not null" json:"channel"`
	Message string               `gorm:"type:text;not null" json:"message"`
	Status  NotificationStatus   `gorm:"not null;default:'pending'" json:"status"`
	SentAt  *time.Time           `json:"sent_at"`
	
	// Relationships
	User *User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}
