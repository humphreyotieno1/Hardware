package services

import (
	"bytes"
	"fmt"
	"net/http"
	"os"
	"time"
)

type TwilioService struct {
	accountSID string
	authToken  string
	fromNumber string
	baseURL    string
	httpClient *http.Client
}

type TwilioMessage struct {
	To   string `json:"To"`
	From string `json:"From"`
	Body string `json:"Body"`
}

type TwilioResponse struct {
	SID          string `json:"sid"`
	Status       string `json:"status"`
	ErrorMessage string `json:"error_message,omitempty"`
}

func NewTwilioService() *TwilioService {
	return &TwilioService{
		accountSID: os.Getenv("TWILIO_ACCOUNT_SID"),
		authToken:  os.Getenv("TWILIO_AUTH_TOKEN"),
		fromNumber: os.Getenv("TWILIO_PHONE_NUMBER"),
		baseURL:    fmt.Sprintf("https://api.twilio.com/2010-04-01/Accounts/%s", os.Getenv("TWILIO_ACCOUNT_SID")),
		httpClient: &http.Client{Timeout: 30 * time.Second},
	}
}

// SendSMS sends an SMS using Twilio
func (t *TwilioService) SendSMS(toNumber, message string) error {
	// Format phone number (ensure it starts with +)
	if toNumber[0] != '+' {
		toNumber = "+" + toNumber
	}

	// Remove any spaces or special characters
	toNumber = cleanPhoneNumber(toNumber)

	// Convert JSON to form data for Twilio
	formData := fmt.Sprintf("To=%s&From=%s&Body=%s", toNumber, t.fromNumber, message)

	req, err := http.NewRequest("POST", t.baseURL+"/Messages.json", bytes.NewBufferString(formData))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	// Set basic auth for Twilio
	req.SetBasicAuth(t.accountSID, t.authToken)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := t.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("twilio error: status %d", resp.StatusCode)
	}

	return nil
}

// SendOrderConfirmationSMS sends order confirmation SMS
func (t *TwilioService) SendOrderConfirmationSMS(phoneNumber, orderID string, total float64) error {
	message := fmt.Sprintf("Order confirmed! Order #%s for $%.2f is being processed. Track at hardwarestore.com", orderID, total)
	return t.SendSMS(phoneNumber, message)
}

// SendPaymentConfirmationSMS sends payment confirmation SMS
func (t *TwilioService) SendPaymentConfirmationSMS(phoneNumber, orderID string, amount float64) error {
	message := fmt.Sprintf("Payment received! $%.2f for order #%s. Your order is now being processed.", amount, orderID)
	return t.SendSMS(phoneNumber, message)
}

// SendOrderStatusUpdateSMS sends order status update SMS
func (t *TwilioService) SendOrderStatusUpdateSMS(phoneNumber, orderID, status string) error {
	message := fmt.Sprintf("Order #%s status updated to: %s. Track at hardwarestore.com", orderID, status)
	return t.SendSMS(phoneNumber, message)
}

// SendDeliveryNotificationSMS sends delivery notification SMS
func (t *TwilioService) SendDeliveryNotificationSMS(phoneNumber, orderID string) error {
	message := fmt.Sprintf("Your order #%s has been delivered! Thank you for shopping with us.", orderID)
	return t.SendSMS(phoneNumber, message)
}

// SendLowStockAlertSMS sends low stock alert SMS to admin
func (t *TwilioService) SendLowStockAlertSMS(adminPhone, productName, sku string, currentStock int) error {
	message := fmt.Sprintf("LOW STOCK ALERT: %s (SKU: %s) has only %d units remaining. Please restock.", productName, sku, currentStock)
	return t.SendSMS(adminPhone, message)
}

// SendWelcomeSMS sends welcome SMS to new users
func (t *TwilioService) SendWelcomeSMS(phoneNumber, userName string) error {
	message := fmt.Sprintf("Welcome %s to Hardware Store! Your account is now active. Shop at hardwarestore.com", userName)
	return t.SendSMS(phoneNumber, message)
}

// SendPasswordResetSMS sends password reset SMS
func (t *TwilioService) SendPasswordResetSMS(phoneNumber, resetCode string) error {
	message := fmt.Sprintf("Your password reset code is: %s. Enter this code to reset your password. Expires in 10 minutes.", resetCode)
	return t.SendSMS(phoneNumber, message)
}

// SendServiceRequestConfirmationSMS sends service request confirmation SMS
func (t *TwilioService) SendServiceRequestConfirmationSMS(phoneNumber, requestID, serviceType string) error {
	message := fmt.Sprintf("Service request #%s for %s has been received. We'll contact you within 24 hours.", requestID, serviceType)
	return t.SendSMS(phoneNumber, message)
}

// SendServiceQuoteSMS sends service quote SMS
func (t *TwilioService) SendServiceQuoteSMS(phoneNumber, requestID string, quoteAmount float64) error {
	message := fmt.Sprintf("Service quote for request #%s: $%.2f. Please log in to accept or decline.", requestID, quoteAmount)
	return t.SendSMS(phoneNumber, message)
}

// cleanPhoneNumber removes spaces and special characters from phone number
func cleanPhoneNumber(phone string) string {
	var cleaned string
	for _, char := range phone {
		if char >= '0' && char <= '9' || char == '+' {
			cleaned += string(char)
		}
	}
	return cleaned
}

// ValidatePhoneNumber validates phone number format
func (t *TwilioService) ValidatePhoneNumber(phoneNumber string) bool {
	cleaned := cleanPhoneNumber(phoneNumber)

	// Basic validation: should start with + and have 10-15 digits
	if len(cleaned) < 11 || len(cleaned) > 16 {
		return false
	}

	if cleaned[0] != '+' {
		return false
	}

	// Check if remaining characters are digits
	for i := 1; i < len(cleaned); i++ {
		if cleaned[i] < '0' || cleaned[i] > '9' {
			return false
		}
	}

	return true
}
