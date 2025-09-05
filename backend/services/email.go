package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"backend/models"
)

type SendGridService struct {
	apiKey     string
	fromEmail  string
	fromName   string
	baseURL    string
	httpClient *http.Client
}

type SendGridEmail struct {
	Personalizations []Personalization `json:"personalizations"`
	From             From              `json:"from"`
	Subject          string            `json:"subject"`
	Content          []Content         `json:"content"`
}

type Personalization struct {
	To      []To   `json:"to"`
	Subject string `json:"subject"`
}

type To struct {
	Email string `json:"email"`
	Name  string `json:"name"`
}

type From struct {
	Email string `json:"email"`
	Name  string `json:"name"`
}

type Content struct {
	Type  string `json:"type"`
	Value string `json:"value"`
}

func NewSendGridService() *SendGridService {
	return &SendGridService{
		apiKey:     os.Getenv("SENDGRID_API_KEY"),
		fromEmail:  os.Getenv("SENDGRID_FROM_EMAIL"),
		fromName:   os.Getenv("SENDGRID_FROM_NAME"),
		baseURL:    "https://api.sendgrid.com/v3",
		httpClient: &http.Client{Timeout: 30 * time.Second},
	}
}

// SendEmail sends an email using SendGrid
func (s *SendGridService) SendEmail(toEmail, toName, subject, htmlContent string) error {
	email := SendGridEmail{
		Personalizations: []Personalization{
			{
				To: []To{
					{
						Email: toEmail,
						Name:  toName,
					},
				},
				Subject: subject,
			},
		},
		From: From{
			Email: s.fromEmail,
			Name:  s.fromName,
		},
		Subject: subject,
		Content: []Content{
			{
				Type:  "text/html",
				Value: htmlContent,
			},
		},
	}

	jsonData, err := json.Marshal(email)
	if err != nil {
		return fmt.Errorf("failed to marshal email: %w", err)
	}

	req, err := http.NewRequest("POST", s.baseURL+"/mail/send", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+s.apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("sendgrid error: status %d", resp.StatusCode)
	}

	return nil
}

// SendOrderConfirmation sends order confirmation email
func (s *SendGridService) SendOrderConfirmation(order *models.Order, user *models.User) error {
	subject := "Order Confirmation - Hardware Store"

	htmlContent := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head>
			<title>Order Confirmation</title>
		</head>
		<body>
			<h2>Thank you for your order!</h2>
			<p>Dear %s,</p>
			<p>Your order has been confirmed and is being processed.</p>
			
			<h3>Order Details:</h3>
			<p><strong>Order ID:</strong> %s</p>
			<p><strong>Total Amount:</strong> $%.2f</p>
			<p><strong>Order Date:</strong> %s</p>
			
			<h3>Shipping Address:</h3>
			<p>%s<br>%s<br>%s, %s</p>
			
			<p>We'll notify you when your order ships.</p>
			
			<p>Best regards,<br>Hardware Store Team</p>
		</body>
		</html>
	`, user.FullName, order.ID, order.Total, order.PlacedAt.Format("January 2, 2006"),
		order.AddressJSON.Line, order.AddressJSON.City, order.AddressJSON.Country)

	return s.SendEmail(user.Email, user.FullName, subject, htmlContent)
}

// SendPaymentConfirmation sends payment confirmation email
func (s *SendGridService) SendPaymentConfirmation(payment *models.Payment, user *models.User) error {
	subject := "Payment Confirmation - Hardware Store"

	htmlContent := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head>
			<title>Payment Confirmation</title>
		</head>
		<body>
			<h2>Payment Received!</h2>
			<p>Dear %s,</p>
			<p>We have received your payment for order %s.</p>
			
			<h3>Payment Details:</h3>
			<p><strong>Amount:</strong> $%.2f</p>
			<p><strong>Reference:</strong> %s</p>
			<p><strong>Date:</strong> %s</p>
			
			<p>Your order is now being processed for shipping.</p>
			
			<p>Best regards,<br>Hardware Store Team</p>
		</body>
		</html>
	`, user.FullName, payment.OrderID, payment.Amount, payment.Reference, time.Now().Format("January 2, 2006"))

	return s.SendEmail(user.Email, user.FullName, subject, htmlContent)
}

// SendPasswordReset sends password reset email
func (s *SendGridService) SendPasswordReset(user *models.User, resetToken string) error {
	subject := "Password Reset Request - Hardware Store"

	resetURL := fmt.Sprintf("%s/reset-password?token=%s", os.Getenv("FRONTEND_URL"), resetToken)

	htmlContent := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head>
			<title>Password Reset</title>
		</head>
		<body>
			<h2>Password Reset Request</h2>
			<p>Dear %s,</p>
			<p>We received a request to reset your password.</p>
			
			<p>Click the link below to reset your password:</p>
			<p><a href="%s">Reset Password</a></p>
			
			<p>If you didn't request this, please ignore this email.</p>
			<p>This link will expire in 1 hour.</p>
			
			<p>Best regards,<br>Hardware Store Team</p>
		</body>
		</html>
	`, user.FullName, resetURL)

	return s.SendEmail(user.Email, user.FullName, subject, htmlContent)
}

// SendWelcomeEmail sends welcome email to new users
func (s *SendGridService) SendWelcomeEmail(user *models.User) error {
	subject := "Welcome to Hardware Store!"

	htmlContent := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head>
			<title>Welcome</title>
		</head>
		<body>
			<h2>Welcome to Hardware Store!</h2>
			<p>Dear %s,</p>
			<p>Thank you for joining our hardware store community!</p>
			
			<p>We're excited to have you on board. You can now:</p>
			<ul>
				<li>Browse our extensive product catalog</li>
				<li>Add items to your wishlist</li>
				<li>Place orders with secure payment</li>
				<li>Track your order status</li>
			</ul>
			
			<p>If you have any questions, feel free to contact our support team.</p>
			
			<p>Best regards,<br>Hardware Store Team</p>
		</body>
		</html>
	`, user.FullName)

	return s.SendEmail(user.Email, user.FullName, subject, htmlContent)
}

// SendLowStockAlert sends low stock alert to admin
func (s *SendGridService) SendLowStockAlert(product *models.Product, adminEmail string) error {
	subject := "Low Stock Alert - Hardware Store"

	htmlContent := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head>
			<title>Low Stock Alert</title>
		</head>
		<body>
			<h2>Low Stock Alert</h2>
			<p>The following product is running low on stock:</p>
			
			<h3>Product Details:</h3>
			<p><strong>Name:</strong> %s</p>
			<p><strong>SKU:</strong> %s</p>
			<p><strong>Current Stock:</strong> %d</p>
			<p><strong>Category:</strong> %s</p>
			
			<p>Please consider restocking this item.</p>
			
			<p>Best regards,<br>Hardware Store System</p>
		</body>
		</html>
	`, product.Name, product.SKU, product.StockQuantity, "Tools") // You might want to get category name

	return s.SendEmail(adminEmail, "Admin", subject, htmlContent)
}

// SendOrderStatusUpdate sends order status update email
func (s *SendGridService) SendOrderStatusUpdate(order *models.Order, user *models.User, newStatus string) error {
	subject := fmt.Sprintf("Order Status Update - %s", newStatus)

	htmlContent := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head>
			<title>Order Status Update</title>
		</head>
		<body>
			<h2>Order Status Update</h2>
			<p>Dear %s,</p>
			<p>Your order status has been updated.</p>
			
			<h3>Order Details:</h3>
			<p><strong>Order ID:</strong> %s</p>
			<p><strong>New Status:</strong> %s</p>
			<p><strong>Total Amount:</strong> $%.2f</p>
			
			<p>Track your order in your account dashboard.</p>
			
			<p>Best regards,<br>Hardware Store Team</p>
		</body>
		</html>
	`, user.FullName, order.ID, newStatus, order.Total)

	return s.SendEmail(user.Email, user.FullName, subject, htmlContent)
}
