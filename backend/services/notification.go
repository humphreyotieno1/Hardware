package services

import (
	"fmt"
	"time"

	"backend/config"
	"backend/models"

	uuid "github.com/satori/go.uuid"
)

type NotificationService struct {
	emailService *SendGridService
	smsService   *TwilioService
}

type NotificationRequest struct {
	UserID   string
	Channel  models.NotificationChannel
	Message  string
	Subject  string
	Priority string
	Data     map[string]interface{}
}

func NewNotificationService() *NotificationService {
	return &NotificationService{
		emailService: NewSendGridService(),
		smsService:   NewTwilioService(),
	}
}

// SendNotification sends a notification through the specified channel
func (n *NotificationService) SendNotification(req NotificationRequest) error {
	// Create notification record in database
	notification := &models.Notification{
		Channel: req.Channel,
		Message: req.Message,
		Status:  models.NotificationStatusPending,
	}

	if req.UserID != "" {
		userUUID := parseUUID(req.UserID)
		notification.UserID = &userUUID
	}

	// Save notification to database
	if err := config.DB.Create(notification).Error; err != nil {
		return fmt.Errorf("failed to create notification record: %w", err)
	}

	// Send notification based on channel
	var err error
	switch req.Channel {
	case models.NotificationChannelEmail:
		err = n.sendEmailNotification(req, notification)
	case models.NotificationChannelSMS:
		err = n.sendSMSNotification(req, notification)
	default:
		err = fmt.Errorf("unsupported notification channel: %s", req.Channel)
	}

	// Update notification status
	if err != nil {
		notification.Status = models.NotificationStatusFailed
		config.DB.Save(notification)
		return fmt.Errorf("failed to send %s notification: %w", req.Channel, err)
	}

	// Mark as sent
	notification.Status = models.NotificationStatusSent
	notification.SentAt = &time.Time{}
	*notification.SentAt = time.Now()
	config.DB.Save(notification)

	return nil
}

// SendMultiChannelNotification sends notifications through multiple channels
func (n *NotificationService) SendMultiChannelNotification(req NotificationRequest, channels []models.NotificationChannel) error {
	var errors []error

	for _, channel := range channels {
		req.Channel = channel
		if err := n.SendNotification(req); err != nil {
			errors = append(errors, fmt.Errorf("channel %s: %w", channel, err))
		}
	}

	if len(errors) > 0 {
		return fmt.Errorf("some notifications failed: %v", errors)
	}

	return nil
}

// sendEmailNotification sends an email notification
func (n *NotificationService) sendEmailNotification(req NotificationRequest, notification *models.Notification) error {
	if req.UserID == "" {
		return fmt.Errorf("user ID required for email notifications")
	}

	var user models.User
	if err := config.DB.First(&user, req.UserID).Error; err != nil {
		return fmt.Errorf("user not found: %w", err)
	}

	// Use subject if provided, otherwise use default
	subject := req.Subject
	if subject == "" {
		subject = "Hardware Store Notification"
	}

	return n.emailService.SendEmail(user.Email, user.FullName, subject, req.Message)
}

// sendSMSNotification sends an SMS notification
func (n *NotificationService) sendSMSNotification(req NotificationRequest, notification *models.Notification) error {
	if req.UserID == "" {
		return fmt.Errorf("user ID required for SMS notifications")
	}

	var user models.User
	if err := config.DB.First(&user, req.UserID).Error; err != nil {
		return fmt.Errorf("user not found: %w", err)
	}

	// Check if user has phone number
	if user.Phone == nil || *user.Phone == "" {
		return fmt.Errorf("user has no phone number")
	}

	return n.smsService.SendSMS(*user.Phone, req.Message)
}

// SendOrderConfirmation sends order confirmation notifications
func (n *NotificationService) SendOrderConfirmation(order *models.Order, user *models.User) error {
	// Send email notification
	emailReq := NotificationRequest{
		UserID:  user.ID.String(),
		Channel: models.NotificationChannelEmail,
		Subject: "Order Confirmation - Hardware Store",
		Message: fmt.Sprintf("Your order #%s for $%.2f has been confirmed and is being processed.", order.ID, order.Total),
	}

	if err := n.SendNotification(emailReq); err != nil {
		return fmt.Errorf("failed to send email confirmation: %w", err)
	}

	// Send SMS notification if user has phone
	if user.Phone != nil && *user.Phone != "" {
		smsReq := NotificationRequest{
			UserID:  user.ID.String(),
			Channel: models.NotificationChannelSMS,
			Message: fmt.Sprintf("Order confirmed! Order #%s for $%.2f is being processed.", order.ID, order.Total),
		}

		if err := n.SendNotification(smsReq); err != nil {
			// Log SMS failure but don't fail the entire operation
			fmt.Printf("Failed to send SMS confirmation: %v\n", err)
		}
	}

	return nil
}

// SendPaymentConfirmation sends payment confirmation notifications
func (n *NotificationService) SendPaymentConfirmation(payment *models.Payment, user *models.User) error {
	// Send email notification
	emailReq := NotificationRequest{
		UserID:  user.ID.String(),
		Channel: models.NotificationChannelEmail,
		Subject: "Payment Confirmation - Hardware Store",
		Message: fmt.Sprintf("Payment received! $%.2f for order #%s. Your order is now being processed.", payment.Amount, payment.OrderID),
	}

	if err := n.SendNotification(emailReq); err != nil {
		return fmt.Errorf("failed to send email confirmation: %w", err)
	}

	// Send SMS notification if user has phone
	if user.Phone != nil && *user.Phone != "" {
		smsReq := NotificationRequest{
			UserID:  user.ID.String(),
			Channel: models.NotificationChannelSMS,
			Message: fmt.Sprintf("Payment received! $%.2f for order #%s. Your order is now being processed.", payment.Amount, payment.OrderID),
		}

		if err := n.SendNotification(smsReq); err != nil {
			fmt.Printf("Failed to send SMS confirmation: %v\n", err)
		}
	}

	return nil
}

// SendOrderStatusUpdate sends order status update notifications
func (n *NotificationService) SendOrderStatusUpdate(order *models.Order, user *models.User, newStatus string) error {
	// Send email notification
	emailReq := NotificationRequest{
		UserID:  user.ID.String(),
		Channel: models.NotificationChannelEmail,
		Subject: fmt.Sprintf("Order Status Update - %s", newStatus),
		Message: fmt.Sprintf("Your order #%s status has been updated to: %s. Track your order in your account dashboard.", order.ID, newStatus),
	}

	if err := n.SendNotification(emailReq); err != nil {
		return fmt.Errorf("failed to send email update: %w", err)
	}

	// Send SMS notification if user has phone
	if user.Phone != nil && *user.Phone != "" {
		smsReq := NotificationRequest{
			UserID:  user.ID.String(),
			Channel: models.NotificationChannelSMS,
			Message: fmt.Sprintf("Order #%s status updated to: %s. Track at hardwarestore.com", order.ID, newStatus),
		}

		if err := n.SendNotification(smsReq); err != nil {
			fmt.Printf("Failed to send SMS update: %v\n", err)
		}
	}

	return nil
}

// SendWelcomeNotification sends welcome notifications to new users
func (n *NotificationService) SendWelcomeNotification(user *models.User) error {
	// Send email notification
	emailReq := NotificationRequest{
		UserID:  user.ID.String(),
		Channel: models.NotificationChannelEmail,
		Subject: "Welcome to Hardware Store!",
		Message: fmt.Sprintf("Welcome %s to Hardware Store! Your account is now active. Shop at hardwarestore.com", user.FullName),
	}

	if err := n.SendNotification(emailReq); err != nil {
		return fmt.Errorf("failed to send welcome email: %w", err)
	}

	// Send SMS notification if user has phone
	if user.Phone != nil && *user.Phone != "" {
		smsReq := NotificationRequest{
			UserID:  user.ID.String(),
			Channel: models.NotificationChannelSMS,
			Message: fmt.Sprintf("Welcome %s to Hardware Store! Your account is now active. Shop at hardwarestore.com", user.FullName),
		}

		if err := n.SendNotification(smsReq); err != nil {
			fmt.Printf("Failed to send welcome SMS: %v\n", err)
		}
	}

	return nil
}

// SendLowStockAlert sends low stock alerts to admin
func (n *NotificationService) SendLowStockAlert(product *models.Product, adminEmail string) error {
	// Send email alert to admin
	emailReq := NotificationRequest{
		UserID:  "", // No specific user for admin alerts
		Channel: models.NotificationChannelEmail,
		Subject: "Low Stock Alert - Hardware Store",
		Message: fmt.Sprintf("LOW STOCK ALERT: %s (SKU: %s) has only %d units remaining. Please restock.", product.Name, product.SKU, product.StockQuantity),
	}

	// For admin alerts, we'll send directly to the email service
	return n.emailService.SendEmail(adminEmail, "Admin", emailReq.Subject, emailReq.Message)
}

// SendPasswordResetNotification sends password reset notifications
func (n *NotificationService) SendPasswordResetNotification(user *models.User, resetToken string) error {
	// Send email notification
	emailReq := NotificationRequest{
		UserID:  user.ID.String(),
		Channel: models.NotificationChannelEmail,
		Subject: "Password Reset Request - Hardware Store",
		Message: fmt.Sprintf("We received a request to reset your password. Use this code: %s. This link will expire in 1 hour.", resetToken),
	}

	if err := n.SendNotification(emailReq); err != nil {
		return fmt.Errorf("failed to send password reset email: %w", err)
	}

	// Send SMS notification if user has phone
	if user.Phone != nil && *user.Phone != "" {
		smsReq := NotificationRequest{
			UserID:  user.ID.String(),
			Channel: models.NotificationChannelSMS,
			Message: fmt.Sprintf("Your password reset code is: %s. Enter this code to reset your password. Expires in 10 minutes.", resetToken),
		}

		if err := n.SendNotification(smsReq); err != nil {
			fmt.Printf("Failed to send password reset SMS: %v\n", err)
		}
	}

	return nil
}

// GetUserNotifications retrieves notifications for a specific user
func (n *NotificationService) GetUserNotifications(userID string, limit, offset int) ([]models.Notification, error) {
	var notifications []models.Notification

	query := config.DB.Where("user_id = ?", userID).Order("created_at DESC")

	if limit > 0 {
		query = query.Limit(limit)
	}

	if offset > 0 {
		query = query.Offset(offset)
	}

	if err := query.Find(&notifications).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch notifications: %w", err)
	}

	return notifications, nil
}

// MarkNotificationAsRead marks a notification as read
func (n *NotificationService) MarkNotificationAsRead(notificationID string) error {
	var notification models.Notification
	if err := config.DB.First(&notification, notificationID).Error; err != nil {
		return fmt.Errorf("notification not found: %w", err)
	}

	// You might want to add a "read" field to the notification model
	// For now, we'll just update the status
	notification.Status = models.NotificationStatusSent
	return config.DB.Save(&notification).Error
}

// parseUUID parses a string to UUID (helper function)
func parseUUID(id string) uuid.UUID {
	parsed, err := uuid.FromString(id)
	if err != nil {
		// Return nil UUID if parsing fails
		return uuid.Nil
	}
	return parsed
}
