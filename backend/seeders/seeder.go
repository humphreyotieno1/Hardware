package seeders

import (
	"backend/config"
	"backend/models"
	"log"
)

// SeedDatabase populates the database with initial data
func SeedDatabase() {
	log.Println("Starting database seeding...")

	// Seed categories
	categories := seedCategories()

	// Seed products
	seedProducts(categories)

	// Seed admin user
	seedAdminUser()

	log.Println("Database seeding completed successfully!")
}

func seedCategories() []models.Category {
	categories := []models.Category{
		{Name: "Tools", Slug: "tools"},
		{Name: "Electrical", Slug: "electrical"},
		{Name: "Plumbing", Slug: "plumbing"},
		{Name: "Building Materials", Slug: "building-materials"},
		{Name: "Hardware", Slug: "hardware"},
		{Name: "Garden & Outdoor", Slug: "garden-outdoor"},
	}

	for i := range categories {
		if err := config.DB.Create(&categories[i]).Error; err != nil {
			log.Printf("Error creating category %s: %v", categories[i].Name, err)
		} else {
			log.Printf("Created category: %s", categories[i].Name)
		}
	}

	return categories
}

func seedProducts(categories []models.Category) {
	products := []models.Product{
		{
			SKU:           "HAM-001",
			Name:          "Hammer",
			Slug:          "hammer",
			CategoryID:    categories[0].ID, // Tools
			Description:   "Professional claw hammer for construction and DIY projects",
			Price:         25.99,
			StockQuantity: 50,
			ImagesJSON:    []string{"https://example.com/hammer1.jpg", "https://example.com/hammer2.jpg"},
			IsActive:      true,
		},
		{
			SKU:           "DRI-001",
			Name:          "Cordless Drill",
			Slug:          "cordless-drill",
			CategoryID:    categories[0].ID, // Tools
			Description:   "18V cordless drill with battery and charger",
			Price:         89.99,
			StockQuantity: 30,
			ImagesJSON:    []string{"https://example.com/drill1.jpg"},
			IsActive:      true,
		},
		{
			SKU:           "WIR-001",
			Name:          "Electrical Wire",
			Slug:          "electrical-wire",
			CategoryID:    categories[1].ID, // Electrical
			Description:   "100m roll of 2.5mm² electrical wire",
			Price:         45.50,
			StockQuantity: 25,
			ImagesJSON:    []string{"https://example.com/wire1.jpg"},
			IsActive:      true,
		},
		{
			SKU:           "PIP-001",
			Name:          "PVC Pipe",
			Slug:          "pvc-pipe",
			CategoryID:    categories[2].ID, // Plumbing
			Description:   "3m PVC pipe, 50mm diameter",
			Price:         12.99,
			StockQuantity: 100,
			ImagesJSON:    []string{"https://example.com/pipe1.jpg"},
			IsActive:      true,
		},
		{
			SKU:           "CEM-001",
			Name:          "Portland Cement",
			Slug:          "portland-cement",
			CategoryID:    categories[3].ID, // Building Materials
			Description:   "50kg bag of Portland cement",
			Price:         8.99,
			StockQuantity: 200,
			ImagesJSON:    []string{"https://example.com/cement1.jpg"},
			IsActive:      true,
		},
	}

	for i := range products {
		if err := config.DB.Create(&products[i]).Error; err != nil {
			log.Printf("Error creating product %s: %v", products[i].Name, err)
		} else {
			log.Printf("Created product: %s", products[i].Name)
		}
	}
}

func seedAdminUser() {
	// Check if admin already exists
	var existingAdmin models.User
	if err := config.DB.Where("email = ?", "admin@hardware.com").First(&existingAdmin).Error; err == nil {
		log.Println("Admin user already exists, skipping...")
		return
	}

	// Create admin user
	adminUser := models.User{
		Email:        "admin@hardware.com",
		PasswordHash: "$argon2id$v=19$m=65536,t=1,p=4$hardware-store-salt$admin123", // This should be properly hashed
		FullName:     "Admin User",
		Phone:        stringPtr("+254741594147"),
		Role:         models.RoleAdmin,
		IsActive:     true,
	}

	if err := config.DB.Create(&adminUser).Error; err != nil {
		log.Printf("Error creating admin user: %v", err)
	} else {
		log.Println("Created admin user: admin@hardware.com")
	}
}

func stringPtr(s string) *string {
	return &s
}
