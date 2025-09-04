# Production Deployment Guide

This guide covers deploying the Hardware Store Backend to production with all security and performance optimizations.

## 🚀 Pre-Deployment Checklist

### Security Requirements
- [ ] Change all default passwords and API keys
- [ ] Use strong, unique JWT secret (minimum 32 characters)
- [ ] Enable HTTPS/TLS encryption
- [ ] Configure proper CORS origins
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Configure secure headers

### Environment Configuration
- [ ] Copy `config.env.production` to `config.env`
- [ ] Update all API keys and secrets
- [ ] Set `ENV=production`
- [ ] Configure production database URL
- [ ] Set up Redis with authentication
- [ ] Configure external service credentials

## 🔧 Production Setup

### 1. Database Setup
```bash
# Create production database
createdb hardware_store_prod

# Run migrations
go run main.go migrate

# Seed initial data (if needed)
go run cmd/seeder/main.go
```

### 2. Redis Setup
```bash
# Install Redis
sudo apt-get install redis-server

# Configure Redis for production
sudo nano /etc/redis/redis.conf

# Key settings:
# bind 127.0.0.1
# requirepass your_strong_password
# maxmemory 256mb
# maxmemory-policy allkeys-lru

# Restart Redis
sudo systemctl restart redis
```

### 3. SSL/TLS Configuration
```bash
# Install Certbot
sudo apt-get install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com

# Configure Nginx with SSL
sudo nano /etc/nginx/sites-available/hardware-store
```

### 4. Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM golang:1.24-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /app/main .
COPY --from=builder /app/config.env .

EXPOSE 8080
CMD ["./main"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - ENV=production
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: hardware_store_prod
      POSTGRES_USER: hardware_user
      POSTGRES_PASSWORD: your_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass your_redis_password
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

## 📊 Monitoring & Logging

### 1. Application Metrics
```go
// Add to main.go
import (
    "github.com/prometheus/client_golang/prometheus/promhttp"
    "net/http"
)

// In main function
go func() {
    http.Handle("/metrics", promhttp.Handler())
    http.ListenAndServe(":9090", nil)
}()
```

### 2. Logging Configuration
```go
// Configure structured logging
import (
    "go.uber.org/zap"
    "go.uber.org/zap/zapcore"
)

func setupLogging() {
    config := zap.NewProductionConfig()
    config.EncoderConfig.TimeKey = "timestamp"
    config.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
    
    logger, _ := config.Build()
    defer logger.Sync()
    
    zap.ReplaceGlobals(logger)
}
```

### 3. Health Checks
```bash
# Health check endpoint
curl https://yourdomain.com/health

# Database health
curl https://yourdomain.com/api/health/db

# Redis health
curl https://yourdomain.com/api/health/redis
```

## 🔒 Security Hardening

### 1. Rate Limiting
```go
import (
    "github.com/gofiber/fiber/v2/middleware/limiter"
)

// Add rate limiting middleware
app.Use(limiter.New(limiter.Config{
    Max:        100,
    Expiration: 1 * time.Minute,
    KeyGenerator: func(c *fiber.Ctx) string {
        return c.IP()
    },
}))
```

### 2. Security Headers
```go
import (
    "github.com/gofiber/fiber/v2/middleware/helmet"
)

// Add security headers
app.Use(helmet.New())
```

### 3. CORS Configuration
```go
app.Use(cors.New(cors.Config{
    AllowOrigins:     os.Getenv("CORS_ALLOWED_ORIGINS"),
    AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
    AllowHeaders:     "Origin,Content-Type,Accept,Authorization",
    AllowCredentials: true,
    MaxAge:           300,
}))
```

## 📈 Performance Optimization

### 1. Database Optimization
```sql
-- Add indexes for common queries
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_payments_order_id ON payments(order_id);

-- Enable query logging for optimization
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 1000;
```

### 2. Redis Caching
```go
// Cache frequently accessed data
func GetProductWithCache(productID string) (*models.Product, error) {
    cacheKey := fmt.Sprintf("product:%s", productID)
    
    // Try cache first
    var product models.Product
    if err := redisService.Get(cacheKey, &product); err == nil {
        return &product, nil
    }
    
    // Get from database
    if err := config.DB.First(&product, productID).Error; err != nil {
        return nil, err
    }
    
    // Cache for 1 hour
    redisService.Set(cacheKey, product, services.CacheOptions{TTL: time.Hour})
    
    return &product, nil
}
```

### 3. Connection Pooling
```go
// Configure database connection pool
db.DB().SetMaxIdleConns(10)
db.DB().SetMaxOpenConns(100)
db.DB().SetConnMaxLifetime(time.Hour)
```

## 🚨 Backup & Recovery

### 1. Database Backups
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/database"
DB_NAME="hardware_store_prod"

mkdir -p $BACKUP_DIR
pg_dump $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +30 -delete
```

### 2. File Backups
```bash
#!/bin/bash
# backup_files.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/files"
UPLOAD_DIR="/app/uploads"

tar -czf $BACKUP_DIR/files_$DATE.tar.gz $UPLOAD_DIR

# Keep only last 30 days
find $BACKUP_DIR -name "files_*.tar.gz" -mtime +30 -delete
```

### 3. Automated Backups
```bash
# Add to crontab
0 2 * * * /path/to/backup.sh
0 3 * * * /path/to/backup_files.sh
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and test
        run: |
          go mod download
          go test ./...
          go build -o main .
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /opt/hardware-store
            git pull origin main
            go build -o main .
            sudo systemctl restart hardware-store
```

## 📋 Post-Deployment Checklist

- [ ] Verify all endpoints are accessible
- [ ] Test external service integrations
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify backup processes
- [ ] Test SSL/TLS configuration
- [ ] Validate security headers
- [ ] Test rate limiting
- [ ] Verify monitoring alerts

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check database URL and credentials
   - Verify network connectivity
   - Check firewall rules

2. **Redis Connection Issues**
   - Verify Redis is running
   - Check authentication credentials
   - Test network connectivity

3. **External Service Failures**
   - Verify API keys are valid
   - Check service status pages
   - Review error logs

4. **Performance Issues**
   - Monitor database query performance
   - Check Redis memory usage
   - Review application logs

### Log Locations
- Application logs: `/var/log/hardware-store/`
- Nginx logs: `/var/log/nginx/`
- System logs: `/var/log/syslog`
- Database logs: `/var/log/postgresql/`

## 📞 Support

For production deployment support:
- Review application logs
- Check system resources
- Verify configuration files
- Test external dependencies
- Monitor error rates and performance metrics
