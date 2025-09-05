package handlers

import (
	"backend/services"
	"fmt"
	"mime/multipart"

	"github.com/gofiber/fiber/v2"
)

// UploadFile handles single file upload to Cloudinary
func UploadFile(c *fiber.Ctx) error {
	// Check if user is authenticated
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	// Parse multipart form
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "No file uploaded",
		})
	}

	// Validate file size (10MB limit)
	if file.Size > 10*1024*1024 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "File size too large. Maximum size is 10MB",
		})
	}

	// Open file
	src, err := file.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to open file",
		})
	}
	defer src.Close()

	// Upload to Cloudinary
	cloudinaryService := services.NewCloudinaryService()
	response, err := cloudinaryService.UploadFile(src, file.Filename)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": fmt.Sprintf("Failed to upload file: %v", err),
		})
	}

	return c.JSON(fiber.Map{
		"message": "File uploaded successfully",
		"file": fiber.Map{
			"public_id":  response.PublicID,
			"url":        response.URL,
			"secure_url": response.SecureURL,
			"format":     response.Format,
			"width":      response.Width,
			"height":     response.Height,
			"bytes":      response.Bytes,
			"filename":   file.Filename,
			"size":       file.Size,
		},
	})
}

// UploadMultipleFiles handles multiple file uploads to Cloudinary
func UploadMultipleFiles(c *fiber.Ctx) error {
	// Check if user is authenticated
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	// Parse multipart form
	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Failed to parse form",
		})
	}

	files := form.File["files"]
	if len(files) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "No files uploaded",
		})
	}

	if len(files) > 10 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Too many files. Maximum is 10 files",
		})
	}

	// Validate and prepare files
	var fileHandles []multipart.File
	var filenames []string

	for _, file := range files {
		// Validate file size
		if file.Size > 10*1024*1024 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": fmt.Sprintf("File %s is too large. Maximum size is 10MB", file.Filename),
			})
		}

		// Open file
		src, err := file.Open()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": fmt.Sprintf("Failed to open file %s", file.Filename),
			})
		}

		fileHandles = append(fileHandles, src)
		filenames = append(filenames, file.Filename)
	}

	// Upload to Cloudinary
	cloudinaryService := services.NewCloudinaryService()
	responses, err := cloudinaryService.UploadMultipleFiles(fileHandles, filenames)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": fmt.Sprintf("Failed to upload files: %v", err),
		})
	}

	// Format response
	var uploadedFiles []fiber.Map
	for i, response := range responses {
		uploadedFiles = append(uploadedFiles, fiber.Map{
			"public_id":  response.PublicID,
			"url":        response.URL,
			"secure_url": response.SecureURL,
			"format":     response.Format,
			"width":      response.Width,
			"height":     response.Height,
			"bytes":      response.Bytes,
			"filename":   filenames[i],
		})
	}

	return c.JSON(fiber.Map{
		"message": "Files uploaded successfully",
		"files":   uploadedFiles,
		"count":   len(uploadedFiles),
	})
}

// DeleteFile deletes a file from Cloudinary
func DeleteFile(c *fiber.Ctx) error {
	// Check if user is authenticated
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	// Get public ID from params
	publicID := c.Params("public_id")
	if publicID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Public ID is required",
		})
	}

	// Delete from Cloudinary
	cloudinaryService := services.NewCloudinaryService()
	err := cloudinaryService.DeleteFile(publicID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": fmt.Sprintf("Failed to delete file: %v", err),
		})
	}

	return c.JSON(fiber.Map{
		"message":   "File deleted successfully",
		"public_id": publicID,
	})
}

// GetFileInfo gets information about a file from Cloudinary
func GetFileInfo(c *fiber.Ctx) error {
	// Get public ID from params
	publicID := c.Params("public_id")
	if publicID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Public ID is required",
		})
	}

	// Get file info from Cloudinary
	cloudinaryService := services.NewCloudinaryService()
	fileInfo, err := cloudinaryService.GetFileInfo(publicID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": fmt.Sprintf("Failed to get file info: %v", err),
		})
	}

	return c.JSON(fiber.Map{
		"file": fileInfo,
	})
}

// GenerateImageURLs generates various image URLs for a given public ID
func GenerateImageURLs(c *fiber.Ctx) error {
	// Get public ID from params
	publicID := c.Params("public_id")
	if publicID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Public ID is required",
		})
	}

	// Get query parameters for transformations
	width := c.Query("width", "800")
	height := c.Query("height", "600")
	format := c.Query("format", "auto")

	// Generate URLs
	cloudinaryService := services.NewCloudinaryService()

	// Generate thumbnail URL
	thumbnailURL := cloudinaryService.GenerateThumbnailURL(publicID, 300, 300)

	// Generate responsive URLs
	responsiveURLs := cloudinaryService.GenerateResponsiveImageURLs(publicID)

	// Generate custom transformation URL
	transformations := map[string]string{
		"w": width,
		"h": height,
		"f": format,
		"c": "fill",
		"g": "auto",
	}
	customURL := cloudinaryService.GenerateImageURL(publicID, transformations)

	return c.JSON(fiber.Map{
		"public_id": publicID,
		"urls": fiber.Map{
			"original":   cloudinaryService.GenerateImageURL(publicID, nil),
			"thumbnail":  thumbnailURL,
			"custom":     customURL,
			"responsive": responsiveURLs,
		},
	})
}
