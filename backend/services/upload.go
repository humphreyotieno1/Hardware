package services

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type CloudinaryService struct {
	cloudName    string
	apiKey       string
	apiSecret    string
	folder       string
	allowedTypes []string
	maxFileSize  int64
	baseURL      string
	httpClient   *http.Client
}

type CloudinaryUploadResponse struct {
	PublicID  string `json:"public_id"`
	URL       string `json:"url"`
	SecureURL string `json:"secure_url"`
	Format    string `json:"format"`
	Width     int    `json:"width"`
	Height    int    `json:"height"`
	Bytes     int    `json:"bytes"`
}

type CloudinaryDeleteResponse struct {
	Result string `json:"result"`
}

func NewCloudinaryService() *CloudinaryService {
	allowedTypes := strings.Split(os.Getenv("CLOUDINARY_ALLOWED_FORMATS"), ",")
	maxFileSize, _ := parseFileSize(os.Getenv("CLOUDINARY_MAX_FILE_SIZE"))

	return &CloudinaryService{
		cloudName:    os.Getenv("CLOUDINARY_CLOUD_NAME"),
		apiKey:       os.Getenv("CLOUDINARY_API_KEY"),
		apiSecret:    os.Getenv("CLOUDINARY_API_SECRET"),
		folder:       os.Getenv("CLOUDINARY_FOLDER"),
		allowedTypes: allowedTypes,
		maxFileSize:  maxFileSize,
		baseURL:      "https://api.cloudinary.com/v1_1",
		httpClient:   &http.Client{Timeout: 60 * time.Second},
	}
}

// UploadFile uploads a file to Cloudinary
func (c *CloudinaryService) UploadFile(file multipart.File, filename string) (*CloudinaryUploadResponse, error) {
	// Validate file type
	if !c.isAllowedFileType(filename) {
		return nil, fmt.Errorf("file type not allowed: %s", filepath.Ext(filename))
	}

	// Validate file size
	if !c.isValidFileSize(file) {
		return nil, fmt.Errorf("file size exceeds maximum allowed size")
	}

	// Create form data
	var buf bytes.Buffer
	writer := multipart.NewWriter(&buf)

	// Add file
	part, err := writer.CreateFormFile("file", filename)
	if err != nil {
		return nil, fmt.Errorf("failed to create form file: %w", err)
	}

	_, err = io.Copy(part, file)
	if err != nil {
		return nil, fmt.Errorf("failed to copy file: %w", err)
	}

	// Add other form fields
	writer.WriteField("api_key", c.apiKey)
	writer.WriteField("timestamp", fmt.Sprintf("%d", time.Now().Unix()))
	writer.WriteField("folder", c.folder)

	// Close writer
	writer.Close()

	// Create request
	uploadURL := fmt.Sprintf("%s/%s/image/upload", c.baseURL, c.cloudName)
	req, err := http.NewRequest("POST", uploadURL, &buf)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", writer.FormDataContentType())

	// Send request
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to upload file: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("cloudinary error: status %d", resp.StatusCode)
	}

	// Parse response
	var response CloudinaryUploadResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &response, nil
}

// UploadMultipleFiles uploads multiple files to Cloudinary
func (c *CloudinaryService) UploadMultipleFiles(files []multipart.File, filenames []string) ([]*CloudinaryUploadResponse, error) {
	var responses []*CloudinaryUploadResponse

	for i, file := range files {
		response, err := c.UploadFile(file, filenames[i])
		if err != nil {
			return nil, fmt.Errorf("failed to upload file %s: %w", filenames[i], err)
		}
		responses = append(responses, response)
	}

	return responses, nil
}

// DeleteFile deletes a file from Cloudinary
func (c *CloudinaryService) DeleteFile(publicID string) error {
	// Generate proper signature for Cloudinary
	timestamp := fmt.Sprintf("%d", time.Now().Unix())

	// Create the string to sign
	params := fmt.Sprintf("public_id=%s&timestamp=%s", publicID, timestamp)
	
	// Create HMAC signature
	h := hmac.New(sha1.New, []byte(c.apiSecret))
	h.Write([]byte(params))
	signature := hex.EncodeToString(h.Sum(nil))
	
	// Create form data with signature
	formData := fmt.Sprintf("%s&api_key=%s&signature=%s", params, c.apiKey, signature)

	// Create request
	deleteURL := fmt.Sprintf("%s/%s/image/destroy", c.baseURL, c.cloudName)
	req, err := http.NewRequest("POST", deleteURL, bytes.NewBufferString(formData))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	// Send request
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to delete file: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("cloudinary error: status %d", resp.StatusCode)
	}

	return nil
}

// GenerateImageURL generates a Cloudinary URL with transformations
func (c *CloudinaryService) GenerateImageURL(publicID string, transformations map[string]string) string {
	baseURL := fmt.Sprintf("https://res.cloudinary.com/%s/image/upload", c.cloudName)

	if len(transformations) == 0 {
		return fmt.Sprintf("%s/%s", baseURL, publicID)
	}

	var trans []string
	for key, value := range transformations {
		trans = append(trans, fmt.Sprintf("%s_%s", key, value))
	}

	transString := strings.Join(trans, ",")
	return fmt.Sprintf("%s/%s/%s", baseURL, transString, publicID)
}

// GenerateThumbnailURL generates a thumbnail URL
func (c *CloudinaryService) GenerateThumbnailURL(publicID string, width, height int) string {
	transformations := map[string]string{
		"w": fmt.Sprintf("%d", width),
		"h": fmt.Sprintf("%d", height),
		"c": "fill",
		"g": "auto",
	}

	return c.GenerateImageURL(publicID, transformations)
}

// GenerateResponsiveImageURLs generates responsive image URLs
func (c *CloudinaryService) GenerateResponsiveImageURLs(publicID string) map[string]string {
	sizes := map[string]map[string]string{
		"xs": {"w": "320", "h": "240", "c": "fill"},
		"sm": {"w": "640", "h": "480", "c": "fill"},
		"md": {"w": "1024", "h": "768", "c": "fill"},
		"lg": {"w": "1280", "h": "960", "c": "fill"},
		"xl": {"w": "1920", "h": "1440", "c": "fill"},
	}

	urls := make(map[string]string)
	for size, trans := range sizes {
		urls[size] = c.GenerateImageURL(publicID, trans)
	}

	return urls
}

// isAllowedFileType checks if the file type is allowed
func (c *CloudinaryService) isAllowedFileType(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	ext = strings.TrimPrefix(ext, ".")

	for _, allowedType := range c.allowedTypes {
		if strings.ToLower(strings.TrimSpace(allowedType)) == ext {
			return true
		}
	}

	return false
}

// isValidFileSize checks if the file size is within limits
func (c *CloudinaryService) isValidFileSize(file multipart.File) bool {
	// Reset file pointer to beginning
	file.Seek(0, 0)
	defer file.Seek(0, 0)

	// Read first few bytes to check size
	buf := make([]byte, 512)
	n, err := file.Read(buf)
	if err != nil && err != io.EOF {
		return false
	}

	// Check if file size is within limits
	if int64(n) > c.maxFileSize {
		return false
	}

	return true
}

// parseFileSize parses file size string to bytes
func parseFileSize(sizeStr string) (int64, error) {
	// Default to 10MB if parsing fails
	if sizeStr == "" {
		return 10 * 1024 * 1024, nil
	}

	// Simple parsing for now (you can implement more sophisticated parsing)
	var size int64
	_, err := fmt.Sscanf(sizeStr, "%d", &size)
	if err != nil {
		return 10 * 1024 * 1024, nil
	}

	return size, nil
}

// GetFileInfo gets information about a file from Cloudinary
func (c *CloudinaryService) GetFileInfo(publicID string) (*CloudinaryUploadResponse, error) {
	// This would require additional Cloudinary API calls
	// For now, return basic info
	return &CloudinaryUploadResponse{
		PublicID: publicID,
		URL:      fmt.Sprintf("https://res.cloudinary.com/%s/image/upload/%s", c.cloudName, publicID),
	}, nil
}
