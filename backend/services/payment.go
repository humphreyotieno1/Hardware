package services

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"backend/config"
	"backend/models"
)

type PaystackService struct {
	secretKey string
	baseURL   string
}

type PaystackInitiateRequest struct {
	Amount      int    `json:"amount"`
	Email       string `json:"email"`
	Reference   string `json:"reference"`
	CallbackURL string `json:"callback_url"`
	Currency    string `json:"currency"`
}

type PaystackInitiateResponse struct {
	Status  bool   `json:"status"`
	Message string `json:"message"`
	Data    struct {
		AuthorizationURL string `json:"authorization_url"`
		AccessCode       string `json:"access_code"`
		Reference        string `json:"reference"`
	} `json:"data"`
}

type PaystackVerifyResponse struct {
	Status  bool   `json:"status"`
	Message string `json:"message"`
	Data    struct {
		Amount    int    `json:"amount"`
		Currency  string `json:"currency"`
		Reference string `json:"reference"`
		Status    string `json:"status"`
		Gateway   string `json:"gateway"`
		PaidAt    string `json:"paid_at"`
		Channel   string `json:"channel"`
		Customer  struct {
			Email string `json:"email"`
			Name  string `json:"name"`
		} `json:"customer"`
	} `json:"data"`
}

func NewPaystackService() *PaystackService {
	return &PaystackService{
		secretKey: os.Getenv("PAYSTACK_SECRET_KEY"),
		baseURL:   "https://api.paystack.co",
	}
}

// InitiatePayment starts a payment transaction with Paystack
func (p *PaystackService) InitiatePayment(order *models.Order, user *models.User) (*PaystackInitiateResponse, error) {
	// Convert amount to kobo (Paystack expects amount in smallest currency unit)
	amountInKobo := int(order.Total * 100)

	payload := PaystackInitiateRequest{
		Amount:      amountInKobo,
		Email:       user.Email,
		Reference:   order.ID.String(),
		CallbackURL: fmt.Sprintf("%s/api/payments/webhook", os.Getenv("BASE_URL")),
		Currency:    "NGN", // Nigerian Naira
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal payment request: %w", err)
	}

	req, err := http.NewRequest("POST", p.baseURL+"/transaction/initialize", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+p.secretKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	var response PaystackInitiateResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	if !response.Status {
		return nil, fmt.Errorf("paystack error: %s", response.Message)
	}

	return &response, nil
}

// VerifyPayment verifies a payment transaction with Paystack
func (p *PaystackService) VerifyPayment(reference string) (*PaystackVerifyResponse, error) {
	req, err := http.NewRequest("GET", p.baseURL+"/transaction/verify/"+reference, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+p.secretKey)

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	var response PaystackVerifyResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	if !response.Status {
		return nil, fmt.Errorf("paystack error: %s", response.Message)
	}

	return &response, nil
}

// ProcessWebhook processes Paystack webhook notifications
func (p *PaystackService) ProcessWebhook(payload []byte, signature string) error {
	// Verify webhook signature for security
	if !p.verifyWebhookSignature(payload, signature) {
		return fmt.Errorf("invalid webhook signature")
	}

	var webhookData struct {
		Event string `json:"event"`
		Data  struct {
			Reference string `json:"reference"`
			Status    string `json:"status"`
		} `json:"data"`
	}

	if err := json.Unmarshal(payload, &webhookData); err != nil {
		return fmt.Errorf("failed to unmarshal webhook: %w", err)
	}

	// Handle different webhook events
	switch webhookData.Event {
	case "charge.success":
		return p.handlePaymentSuccess(webhookData.Data.Reference)
	case "charge.failed":
		return p.handlePaymentFailure(webhookData.Data.Reference)
	default:
		return nil // Ignore other events
	}
}

func (p *PaystackService) verifyWebhookSignature(payload []byte, signature string) bool {
	// Verify webhook signature using HMAC-SHA512
	// Paystack sends signature as: sha512=hash
	if !strings.HasPrefix(signature, "sha512=") {
		return false
	}

	expectedSignature := strings.TrimPrefix(signature, "sha512=")

	// Create HMAC using the secret key
	h := hmac.New(sha512.New, []byte(p.secretKey))
	h.Write(payload)
	computedSignature := hex.EncodeToString(h.Sum(nil))

	return computedSignature == expectedSignature
}

func (p *PaystackService) handlePaymentSuccess(reference string) error {
	// Update payment status in database
	var payment models.Payment
	if err := config.DB.Where("reference = ?", reference).First(&payment).Error; err != nil {
		return fmt.Errorf("payment not found: %w", err)
	}

	payment.Status = models.PaymentStatusCompleted
	payment.PaidAt = &time.Time{}
	*payment.PaidAt = time.Now()

	if err := config.DB.Save(&payment).Error; err != nil {
		return fmt.Errorf("failed to update payment: %w", err)
	}

	// Update order status
	var order models.Order
	if err := config.DB.Where("id = ?", payment.OrderID).First(&order).Error; err != nil {
		return fmt.Errorf("order not found: %w", err)
	}

	order.Status = models.OrderStatusConfirmed
	if err := config.DB.Save(&order).Error; err != nil {
		return fmt.Errorf("failed to update order: %w", err)
	}

	return nil
}

func (p *PaystackService) handlePaymentFailure(reference string) error {
	// Update payment status in database
	var payment models.Payment
	if err := config.DB.Where("reference = ?", reference).First(&payment).Error; err != nil {
		return fmt.Errorf("payment not found: %w", err)
	}

	payment.Status = models.PaymentStatusFailed
	if err := config.DB.Save(&payment).Error; err != nil {
		return fmt.Errorf("failed to update payment: %w", err)
	}

	return nil
}
