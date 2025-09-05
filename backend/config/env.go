package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Set default values for required environment variables
	if os.Getenv("PORT") == "" {
		os.Setenv("PORT", "8080")
	}

	if os.Getenv("ENV") == "" {
		os.Setenv("ENV", "development")
	}

	if os.Getenv("JWT_SECRET") == "" {
		os.Setenv("JWT_SECRET", "hardware-store-jwt-secret-key-2024")
	}

	if os.Getenv("JWT_EXPIRY") == "" {
		os.Setenv("JWT_EXPIRY", "24h")
	}
}
