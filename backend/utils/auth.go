package utils

import (
	"bytes"
	"encoding/base64"
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/argon2"
)

type Claims struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// GenerateJWT creates a new JWT token for a user
func GenerateJWT(userID, email, role string) (string, error) {
	expiry, err := time.ParseDuration(os.Getenv("JWT_EXPIRY"))
	if err != nil {
		expiry = 24 * time.Hour // Default to 24 hours
	}

	claims := Claims{
		UserID: userID,
		Email:  email,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

// ValidateJWT validates and parses a JWT token
func ValidateJWT(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}

// HashPassword creates an Argon2id hash of the password
func HashPassword(password string) (string, error) {
	salt := []byte("hardware-store-salt") // In production, use a random salt per user

	hash := argon2.IDKey(
		[]byte(password),
		salt,
		1,       // time cost
		64*1024, // memory cost (64MB)
		4,       // parallelism
		32,      // key length
	)

	// Convert to base64 for safe storage
	return base64.StdEncoding.EncodeToString(hash), nil
}

// VerifyPassword verifies a password against its hash
func VerifyPassword(password, hash string) bool {
	salt := []byte("hardware-store-salt") // In production, extract salt from hash

	computedHash := argon2.IDKey(
		[]byte(password),
		salt,
		1,       // time cost
		64*1024, // memory cost (64MB)
		4,       // parallelism
		32,      // key length
	)

	// Decode the stored hash and compare
	storedHash, err := base64.StdEncoding.DecodeString(hash)
	if err != nil {
		return false
	}

	return bytes.Equal(computedHash, storedHash)
}
