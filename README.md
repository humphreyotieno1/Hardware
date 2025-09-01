# Hardware Store E-Commerce & Services Platform

---

## 1. Overview

A full-stack web application for a hardware store, supporting both product sales (construction, welding, plumbing, electricals, tools, mabati, woodwork, paint, fittings, nails, etc.) and on-demand services (e.g., delivery, installation, cutting). Users can browse, search, manage carts/wishlists, request services/quotes, and complete checkouts. Admins manage products, inventory, orders, services, users, and reporting.

**Design Principles:**
- **DRY:** Shared UI components, API handlers, and logic.
- **SOLID:** Modular, single-responsibility services (auth, catalog, orders, etc.), extensible payment providers, clear interfaces, role-based APIs, dependency injection.

**Tech Stack:**
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Zustand, Server Actions.
- **Backend:** Go (REST APIs), PostgreSQL, Redis.
- **Infra/DevOps:** Docker, GitHub Actions, environment configs, cloud object storage/CDN, Digital Ocean VPS.

---

## 2. Goals

- Complete e-commerce flows: authentication, catalog, cart/wishlist, checkout, payments, orders, returns, invoices.
- Service requests & scheduling (e.g., transport): details capture, quoting, assignment.
- Role-based admin portal for catalog, inventory, pricing, orders, services, content, reporting.
- Scalable, secure, and observable architecture.

---

## 3. User Roles

- **Visitor (Guest):** Browse, search, session-based cart.
- **Customer (Registered):** Persistent cart/wishlist, order history, service requests.
- **Admin (Super Admin):** Full management with role-based access.

---

## 4. Core Features & User Stories

### 4.1 Authentication
- Register/login (email/password/phone)
- Password reset (email/SMS)
- JWT sessions with refresh/rotation
- Logout/session invalidation

**User Stories:**
- Register for personalized features
- Login to view profile/orders
- Reset password if forgotten
- Logout securely

### 4.2 Catalog & Search
- Categories (e.g., construction > tools)
- Product details: variants, units, pricing, discounts, images/specs/related
- Search (autocomplete), filters, sorting, pagination

**User Stories:**
- View homepage with featured products/categories
- Browse by category
- Search by keywords
- Filter/sort products
- View product details

### 4.3 Cart, Wishlist, Checkout
- Persistent cart (guest via session, merge on login)
- Wishlist
- Checkout: addresses, delivery/pickup, services, fees, taxes/coupons, payment (card/M-Pesa/bank/cash)
- Order confirmation (PDF invoice, email/SMS)

**User Stories:**
- Add/edit/remove cart items
- Manage wishlist, move items to cart
- Checkout with details/services
- Complete payment, track orders

### 4.4 Services
- Request form: type, locations, dates, items, instructions
- Quote: auto/manual
- Scheduling: assign driver/vehicle, status updates

**User Stories:**
- Request services during/after checkout
- View/accept quotes, track status

### 4.5 Customer Account
- Profile, addresses, saved payments, order history, invoices, service requests, returns, wishlist

**User Stories:**
- View/update profile and history

### 4.6 Admin Portal
- CRUD: products, categories, attributes, variants, media, SEO
- Inventory: stock, suppliers, purchase orders, low-stock alerts
- Pricing: base/sale/tiered, coupons
- Orders: status, refunds, returns, shipments
- Services: quotes, assignments, calendar, completions
- Users/roles, content, settings
- Reports: sales, top products, inventory, payments
- Audit logs

**User Stories:**
- Access admin panel
- Manage products, inventory, orders, users, services
- View analytics/reports

### 4.7 General
- Responsive design
- Error handling (e.g., out-of-stock)
- Basic SEO (structured data, sitemaps)

**User Stories:**
- Responsive site for all users
- Clear error messages

---

## 5. Non-Functional Requirements

- **Security:** HTTPS/HSTS, CSRF, JWT/Argon2id, OWASP, input validation, GDPR-like rights
- **Performance:** CDN, DB indexing, ETag, pagination, async queues (emails, PDFs, notifications)
- **Scalability:** Modular services, Redis, horizontal scaling
- **Accessibility/i18n/SEO:** WCAG 2.1 AA, keyboard nav, alt text, en-KE locale, KES currency, VAT, structured data
- **Observability:** Metrics, logs, traces, health checks, rate-limiting, backups

---

## 6. Architecture

- **Frontend:** ISR/SSG for static catalog, SSR for dynamic (cart/account), client-side interactivity
- **Backend:** REST APIs (OpenAPI, validation), repositories via interfaces (DI)
- **Data:** PostgreSQL (core), Redis (transient), object storage (media)
- **Flows:** Catalog via API, cart mutations via Server Actions/APIs, atomic inventory reservation, service notifications via queues

---

## 7. Data Model (PostgreSQL Schema)

> **Note:** Simplified for clarity, minimal redundancy, DRY/SOLID, extensible via JSONB.

- **users:**  
  `id (uuid, pk)`, `email (varchar, unique)`, `password_hash (varchar)`, `phone (varchar, nullable)`, `full_name (varchar)`, `role (enum: 'customer', 'admin')`, `created_at (timestamp)`  
  _Single table, role enum for access control, no `updated_at`._

- **addresses:**  
  `id (uuid, pk)`, `user_id (uuid, fk)`, `label (varchar)`, `line1 (varchar)`, `city (varchar)`, `country (varchar)`, `is_default (boolean, default false)`  
  _Reusable for orders/services._

- **categories:**  
  `id (uuid, pk)`, `name (varchar)`, `slug (varchar, unique)`  
  _Flat for simplicity, slug for SEO._

- **products:**  
  `id (uuid, pk)`, `sku (varchar, unique)`, `name (varchar)`, `slug (varchar, unique)`, `category_id (uuid, fk)`, `description (text)`, `price (decimal)`, `stock_quantity (int)`, `images_json (jsonb)`  
  _Combines product/variant data._

- **carts:**  
  `id (uuid, pk)`, `user_id (uuid, fk, nullable)`, `session_id (varchar, unique, nullable)`  
  _Supports guest carts, no `updated_at`._

- **cart_items:**  
  `id (uuid, pk)`, `cart_id (uuid, fk)`, `product_id (uuid, fk)`, `quantity (int)`, `unit_price (decimal)`  
  _Unit price snapshot, total computed._

- **wishlists:**  
  `id (uuid, pk)`, `user_id (uuid, fk)`, `product_id (uuid, fk)`  
  _Single table for wishlist items._

- **orders:**  
  `id (uuid, pk)`, `user_id (uuid, fk, nullable)`, `total (decimal)`, `status (enum: 'pending', 'confirmed', 'shipped', 'delivered')`, `address_json (jsonb)`, `service_request (jsonb, nullable)`, `placed_at (timestamp)`  
  _Address/service snapshot, status enum._

- **order_items:**  
  `id (uuid, pk)`, `order_id (uuid, fk)`, `product_id (uuid, fk)`, `quantity (int)`, `unit_price (decimal)`  
  _Price snapshot, total computed._

- **payments:**  
  `id (uuid, pk)`, `order_id (uuid, fk)`, `provider (varchar)`, `reference (varchar, unique)`, `amount (decimal)`, `status (enum: 'pending', 'completed')`, `paid_at (timestamp, nullable)`  
  _Minimal payment tracking._

- **notifications:**  
  `id (uuid, pk)`, `user_id (uuid, fk, nullable)`, `channel (enum: 'email', 'sms')`, `message (text)`, `status (enum: 'pending', 'sent')`, `sent_at (timestamp, nullable)`  
  _Simplified notifications._

---

## 8. API Endpoints (REST Examples)

> **Note:** Core actions only, consistent patterns, role-based guards.

**Auth**
- `POST /api/auth/register` — Create user
- `POST /api/auth/login` — Return JWT
- `POST /api/auth/logout` — Invalidate session
- `POST /api/auth/password/reset` — Request/reset password

**Catalog**
- `GET /api/categories` — List categories
- `GET /api/products?category=slug&q=term` — Search products
- `GET /api/products/:slug` — Product details

**Cart/Wishlist**
- `GET /api/cart` — Get cart
- `POST /api/cart/items` — Add item
- `PUT /api/cart/items/:id` — Update quantity
- `DELETE /api/cart/items/:id` — Remove item
- `GET /api/wishlist` — Get wishlist
- `POST /api/wishlist/items` — Add item
- `DELETE /api/wishlist/items/:id` — Remove item

**Checkout/Orders**
- `POST /api/checkout/place` — Create order (address/service)
- `GET /api/orders` — List user orders
- `GET /api/orders/:id` — Order details

**Payments**
- `POST /api/payments/initiate` — Start payment
- `POST /api/payments/webhook` — PSP callback

**Admin (Guarded)**
- `GET/POST/PUT/DELETE /api/admin/categories` — Manage categories
- `GET/POST/PUT/DELETE /api/admin/products` — Manage products
- `PUT /api/admin/inventory` — Update stock
- `GET/PUT /api/admin/orders/:id` — Manage orders
- `GET /api/admin/reports` — Sales/stock report

---

## 9. Frontend Routes (Next.js)

> Minimal, App Router, shared layouts (DRY), focused pages (SOLID).

- `/` — Home (ISR, featured products/categories)
- `/search` — Search (SSR, filters)
- `/c/[slug]` — Category listing (ISR)
- `/p/[slug]` — Product detail (ISR)
- `/cart` — Cart (SSR, Server Actions)
- `/wishlist` — Wishlist (SSR)
- `/checkout` — Checkout (SSR)
- `/account` — Profile/orders (SSR)
- `/admin` — Admin dashboard (SSR, sub-routes: catalog, inventory, orders, reports)
- `/pages/[slug]` — CMS pages (SSG, e.g., About)

---

## 10. Integrations

- **Payments:** M-Pesa (STK), card (Flutterwave, Paystack, Stripe)
- **Messaging:** Twilio/Termii (SMS/WhatsApp), SendGrid (email)
- **Storage:** S3-compatible (Cloudflare R2, MinIO)
- **Analytics:** Privacy-friendly tracking, built-in sales dashboards
