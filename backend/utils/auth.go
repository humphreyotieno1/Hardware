package utils

import (
	"bytes"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"os"
	"strings"
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
	// Generate a random salt for each user
	salt := make([]byte, 32)
	if _, err := rand.Read(salt); err != nil {
		return "", fmt.Errorf("failed to generate salt: %w", err)
	}

	hash := argon2.IDKey(
		[]byte(password),
		salt,
		1,       // time cost
		64*1024, // memory cost (64MB)
		4,       // parallelism
		32,      // password length
	)

	// Encode both salt and hash to base64
	encodedSalt := base64.RawStdEncoding.EncodeToString(salt)
	encodedHash := base64.RawStdEncoding.EncodeToString(hash)

	// Return salt:hash format for storage
	return encodedSalt + ":" + encodedHash, nil
}

// VerifyPassword verifies a password against its hash
func VerifyPassword(password, hash string) bool {
	// Split the stored hash to get salt and hash
	parts := strings.Split(hash, ":")
	if len(parts) != 2 {
		return false
	}

	encodedSalt := parts[0]
	encodedHash := parts[1]

	// Decode the salt
	salt, err := base64.RawStdEncoding.DecodeString(encodedSalt)
	if err != nil {
		return false
	}

	// Decode the stored hash
	storedHash, err := base64.RawStdEncoding.DecodeString(encodedHash)
	if err != nil {
		return false
	}

	// Compute hash with the same salt
	computedHash := argon2.IDKey(
		[]byte(password),
		salt,
		1,       // time cost
		64*1024, // memory cost (64MB)
		4,       // parallelism
		32,      // password length
	)

	return bytes.Equal(computedHash, storedHash)
}
