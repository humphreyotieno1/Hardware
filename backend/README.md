# Hardware Store Backend API

A robust e-commerce backend API built with Go, Fiber, GORM, and PostgreSQL for a hardware store platform.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Registration, login, profile management
- **Catalog Management**: Categories and products with search, filtering, and pagination
- **Shopping Cart**: Add, update, remove items with stock validation
- **Wishlist**: Save products for later
- **Order Management**: Create orders, track status, manage inventory
- **Admin Panel**: Full CRUD operations for products, categories, orders, and reports
- **Database**: PostgreSQL with GORM ORM and automatic migrations

## Tech Stack

- **Framework**: Go Fiber (v2)
- **Database**: PostgreSQL
- **ORM**: GORM
- **Authentication**: JWT
- **Password Hashing**: Argon2id
- **Validation**: Manual validation (can be enhanced with validator package)
- **Payment Gateway**: Paystack integration
- **Email Service**: SendGrid integration
- **SMS Service**: Twilio integration
- **File Storage**: Cloudinary integration
- **Caching**: Redis integration
- **Notifications**: Multi-channel notification system

## Project Structure

```
backend/
├── config/          # Configuration and database setup
├── handlers/        # HTTP request handlers
├── middleware/      # Authentication and authorization middleware
├── models/          # Database models and structs
├── utils/           # Utility functions (JWT, password hashing)
├── main.go          # Application entry point
├── config.env       # Environment configuration
└── go.mod           # Go module dependencies
```

## API Endpoints

### Public Routes
- `GET /health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/catalog/categories` - List categories
- `GET /api/catalog/products` - List products with filtering
- `GET /api/catalog/products/:slug` - Get product details

### Protected Routes (Requires Authentication)
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/items` - Add item to wishlist
- `DELETE /api/wishlist/items/:id` - Remove item from wishlist
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order
- `POST /api/payments/initiate` - Initiate payment with Paystack
- `GET /api/payments/:id/status` - Get payment status
- `POST /api/upload/file` - Upload single file to Cloudinary
- `POST /api/upload/files` - Upload multiple files to Cloudinary
- `DELETE /api/upload/file/:public_id` - Delete file from Cloudinary
- `GET /api/upload/file/:public_id` - Get file information
- `GET /api/upload/file/:public_id/urls` - Generate image URLs
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

### Admin Routes (Requires Admin Role)
- `GET /api/admin/categories` - List categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `GET /api/admin/products` - List products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - List all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/reports/sales` - Sales report
- `GET /api/admin/reports/inventory` - Inventory report

## Setup Instructions

### Prerequisites
- Go 1.24.1 or higher
- PostgreSQL 12 or higher
- Redis (optional, for future caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   go mod tidy
   ```

3. **Set up environment variables**
   ```bash
   cp config.env.example config.env
   # Edit config.env with your database and service credentials
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb hardwaredb
   
   # Or use the connection string from config.env
   ```

5. **Run the application**
   ```bash
   go run main.go
   ```

   The server will start on port 8080 (or the port specified in your environment variables).

### Environment Variables

Create a `config.env` file with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost/hardwaredb"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=24h

# Server Configuration
PORT=8080
ENV=development

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=Hardware Store

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=your-folder
CLOUDINARY_ALLOWED_FORMATS=jpg,jpeg,png,gif,webp,pdf,doc,docx
CLOUDINARY_MAX_FILE_SIZE=10485760
```

## Testing the API

### 1. Health Check
```bash
curl http://localhost:8080/health
```

### 2. User Registration
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "full_name": "John Doe",
    "phone": "+1234567890"
  }'
```

### 3. User Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 4. Create Category (Admin)
```bash
curl -X POST http://localhost:8080/api/admin/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Construction Tools",
    "slug": "construction-tools"
  }'
```

### 5. Create Product (Admin)
```bash
curl -X POST http://localhost:8080/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "sku": "HAMMER-001",
    "name": "Professional Hammer",
    "slug": "professional-hammer",
    "category_id": "CATEGORY_UUID",
    "description": "High-quality professional hammer",
    "price": 29.99,
    "stock_quantity": 100,
    "images_json": ["https://example.com/hammer1.jpg"],
    "is_active": true
  }'
```

## Database Schema

The application automatically creates the following tables:
- `users` - User accounts and authentication
- `addresses` - User addresses
- `categories` - Product categories
- `products` - Product catalog
- `carts` - Shopping carts
- `cart_items` - Items in carts
- `wishlists` - User wishlists
- `orders` - Customer orders
- `order_items` - Items in orders
- `payments` - Payment records
- `notifications` - System notifications

## Security Features

- JWT-based authentication
- Argon2id password hashing
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Soft deletes for data integrity

## Future Enhancements

- Redis caching for improved performance
- File upload handling with Cloudinary
- Email notifications with SendGrid
- SMS notifications with Twilio
- Payment gateway integration
- Rate limiting
- API documentation with Swagger
- Unit and integration tests
- Docker containerization
- CI/CD pipeline

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
