package config

import (
	"log"
	"os"

	"backend/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("Database connected successfully")

	// Auto migrate the schema
	err = DB.AutoMigrate(
		&models.User{},
		&models.Address{},
		&models.Category{},
		&models.Product{},
		&models.Cart{},
		&models.CartItem{},
		&models.Wishlist{},
		&models.Order{},
		&models.OrderItem{},
		&models.Payment{},
		&models.Notification{},
		&models.ServiceRequest{},
	)

	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("Database migrated successfully")
}

func GetDB() *gorm.DB {
	return DB
}
