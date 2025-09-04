package services

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisService struct {
	client *redis.Client
	ctx    context.Context
}

type CacheOptions struct {
	TTL time.Duration
}

func NewRedisService() *RedisService {
	rdb := redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_ADDR"),
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       0,
	})

	ctx := context.Background()

	// Test connection
	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		fmt.Printf("Warning: Redis connection failed: %v\n", err)
		// In production, we need proper fallback handling
		// For now, we'll continue with degraded functionality
		fmt.Println("Continuing without Redis - some features will be limited")
	} else {
		fmt.Println("✓ Redis connection established successfully")
	}

	return &RedisService{
		client: rdb,
		ctx:    ctx,
	}
}

// Set sets a key-value pair in Redis
func (r *RedisService) Set(key string, value interface{}, options ...CacheOptions) error {
	var ttl time.Duration
	if len(options) > 0 {
		ttl = options[0].TTL
	}

	jsonValue, err := json.Marshal(value)
	if err != nil {
		return fmt.Errorf("failed to marshal value: %w", err)
	}

	if ttl > 0 {
		return r.client.Set(r.ctx, key, jsonValue, ttl).Err()
	}
	return r.client.Set(r.ctx, key, jsonValue, 0).Err()
}

// Get retrieves a value from Redis
func (r *RedisService) Get(key string, dest interface{}) error {
	val, err := r.client.Get(r.ctx, key).Result()
	if err != nil {
		if err == redis.Nil {
			return fmt.Errorf("key not found: %s", key)
		}
		return fmt.Errorf("failed to get key: %w", err)
	}

	return json.Unmarshal([]byte(val), dest)
}

// Delete removes a key from Redis
func (r *RedisService) Delete(key string) error {
	return r.client.Del(r.ctx, key).Err()
}

// Exists checks if a key exists in Redis
func (r *RedisService) Exists(key string) (bool, error) {
	result, err := r.client.Exists(r.ctx, key).Result()
	if err != nil {
		return false, fmt.Errorf("failed to check key existence: %w", err)
	}
	return result > 0, nil
}

// SetExpiry sets expiry for an existing key
func (r *RedisService) SetExpiry(key string, ttl time.Duration) error {
	return r.client.Expire(r.ctx, key, ttl).Err()
}

// GetTTL gets the remaining TTL for a key
func (r *RedisService) GetTTL(key string) (time.Duration, error) {
	return r.client.TTL(r.ctx, key).Result()
}

// Increment increments a numeric value
func (r *RedisService) Increment(key string) (int64, error) {
	return r.client.Incr(r.ctx, key).Result()
}

// IncrementBy increments a numeric value by a specific amount
func (r *RedisService) IncrementBy(key string, value int64) (int64, error) {
	return r.client.IncrBy(r.ctx, key, value).Result()
}

// Decrement decrements a numeric value
func (r *RedisService) Decrement(key string) (int64, error) {
	return r.client.Decr(r.ctx, key).Result()
}

// DecrementBy decrements a numeric value by a specific amount
func (r *RedisService) DecrementBy(key string, value int64) (int64, error) {
	return r.client.DecrBy(r.ctx, key, value).Result()
}

// SetHash sets a hash field in Redis
func (r *RedisService) SetHash(key string, field string, value interface{}) error {
	jsonValue, err := json.Marshal(value)
	if err != nil {
		return fmt.Errorf("failed to marshal value: %w", err)
	}

	return r.client.HSet(r.ctx, key, field, jsonValue).Err()
}

// GetHash retrieves a hash field from Redis
func (r *RedisService) GetHash(key string, field string, dest interface{}) error {
	val, err := r.client.HGet(r.ctx, key, field).Result()
	if err != nil {
		if err == redis.Nil {
			return fmt.Errorf("hash field not found: %s:%s", key, field)
		}
		return fmt.Errorf("failed to get hash field: %w", err)
	}

	return json.Unmarshal([]byte(val), dest)
}

// GetAllHash retrieves all hash fields from Redis
func (r *RedisService) GetAllHash(key string) (map[string]string, error) {
	return r.client.HGetAll(r.ctx, key).Result()
}

// DeleteHash removes a hash field from Redis
func (r *RedisService) DeleteHash(key string, field string) error {
	return r.client.HDel(r.ctx, key, field).Err()
}

// SetList sets a list in Redis
func (r *RedisService) SetList(key string, values []interface{}) error {
	var jsonValues []interface{}
	for _, value := range values {
		jsonValue, err := json.Marshal(value)
		if err != nil {
			return fmt.Errorf("failed to marshal list value: %w", err)
		}
		jsonValues = append(jsonValues, jsonValue)
	}

	return r.client.RPush(r.ctx, key, jsonValues...).Err()
}

// GetList retrieves a list from Redis
func (r *RedisService) GetList(key string, start, stop int64) ([]string, error) {
	return r.client.LRange(r.ctx, key, start, stop).Result()
}

// AddToList adds a value to a list
func (r *RedisService) AddToList(key string, value interface{}) error {
	jsonValue, err := json.Marshal(value)
	if err != nil {
		return fmt.Errorf("failed to marshal list value: %w", err)
	}

	return r.client.RPush(r.ctx, key, jsonValue).Err()
}

// RemoveFromList removes a value from a list
func (r *RedisService) RemoveFromList(key string, value interface{}) error {
	jsonValue, err := json.Marshal(value)
	if err != nil {
		return fmt.Errorf("failed to marshal list value: %w", err)
	}

	return r.client.LRem(r.ctx, key, 0, jsonValue).Err()
}

// SetSet adds values to a set in Redis
func (r *RedisService) SetSet(key string, values []interface{}) error {
	var jsonValues []interface{}
	for _, value := range values {
		jsonValue, err := json.Marshal(value)
		if err != nil {
			return fmt.Errorf("failed to marshal set value: %w", err)
		}
		jsonValues = append(jsonValues, jsonValue)
	}

	return r.client.SAdd(r.ctx, key, jsonValues...).Err()
}

// GetSet retrieves all values from a set
func (r *RedisService) GetSet(key string) ([]string, error) {
	return r.client.SMembers(r.ctx, key).Result()
}

// AddToSet adds a value to a set
func (r *RedisService) AddToSet(key string, value interface{}) error {
	jsonValue, err := json.Marshal(value)
	if err != nil {
		return fmt.Errorf("failed to marshal set value: %w", err)
	}

	return r.client.SAdd(r.ctx, key, jsonValue).Err()
}

// RemoveFromSet removes a value from a set
func (r *RedisService) RemoveFromSet(key string, value interface{}) error {
	jsonValue, err := json.Marshal(value)
	if err != nil {
		return fmt.Errorf("failed to marshal set value: %w", err)
	}

	return r.client.SRem(r.ctx, key, jsonValue).Err()
}

// IsInSet checks if a value is in a set
func (r *RedisService) IsInSet(key string, value interface{}) (bool, error) {
	jsonValue, err := json.Marshal(value)
	if err != nil {
		return false, fmt.Errorf("failed to marshal set value: %w", err)
	}

	return r.client.SIsMember(r.ctx, key, jsonValue).Result()
}

// SetSortedSet adds values to a sorted set in Redis
func (r *RedisService) SetSortedSet(key string, scores map[interface{}]float64) error {
	var members []redis.Z
	for member, score := range scores {
		jsonMember, err := json.Marshal(member)
		if err != nil {
			return fmt.Errorf("failed to marshal sorted set member: %w", err)
		}
		members = append(members, redis.Z{Score: score, Member: jsonMember})
	}

	return r.client.ZAdd(r.ctx, key, members...).Err()
}

// GetSortedSet retrieves values from a sorted set by score range
func (r *RedisService) GetSortedSet(key string, min, max float64) ([]string, error) {
	return r.client.ZRangeByScore(r.ctx, key, &redis.ZRangeBy{
		Min: fmt.Sprintf("%f", min),
		Max: fmt.Sprintf("%f", max),
	}).Result()
}

// AddToSortedSet adds a value to a sorted set
func (r *RedisService) AddToSortedSet(key string, member interface{}, score float64) error {
	jsonMember, err := json.Marshal(member)
	if err != nil {
		return fmt.Errorf("failed to marshal sorted set member: %w", err)
	}

	return r.client.ZAdd(r.ctx, key, redis.Z{Score: score, Member: jsonMember}).Err()
}

// GetRank gets the rank of a member in a sorted set
func (r *RedisService) GetRank(key string, member interface{}) (int64, error) {
	jsonMember, err := json.Marshal(member)
	if err != nil {
		return 0, fmt.Errorf("failed to marshal sorted set member: %w", err)
	}

	return r.client.ZRank(r.ctx, key, string(jsonMember)).Result()
}

// FlushDB flushes all keys from the current database
func (r *RedisService) FlushDB() error {
	return r.client.FlushDB(r.ctx).Err()
}

// Close closes the Redis connection
func (r *RedisService) Close() error {
	return r.client.Close()
}

// HealthCheck checks if Redis is healthy
func (r *RedisService) HealthCheck() error {
	_, err := r.client.Ping(r.ctx).Result()
	return err
}
