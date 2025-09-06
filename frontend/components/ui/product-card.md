# ProductCard Component

A reusable product card component that displays product information in a consistent, compact format across the application.

## Features

- **Consistent Design**: Uniform card sizing and layout
- **Responsive**: Adapts to different screen sizes
- **Interactive**: Independent click handlers for cart and wishlist actions
- **Accessible**: Proper ARIA labels and semantic HTML
- **Customizable**: Optional props for different use cases

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `product` | `Product` | Required | The product object containing all product data |
| `onAddToCart` | `(productId: string) => void` | Optional | Callback function when add to cart is clicked |
| `onAddToWishlist` | `(productId: string) => void` | Optional | Callback function when wishlist is clicked |
| `showCategory` | `boolean` | `true` | Whether to display the category name |
| `className` | `string` | `""` | Additional CSS classes |

## Usage Examples

### Basic Usage
```tsx
import { ProductCard } from "@/components/ui/product-card"

<ProductCard product={product} />
```

### With Event Handlers
```tsx
<ProductCard 
  product={product}
  onAddToCart={(productId) => {
    // Handle add to cart
    addToCart(productId)
  }}
  onAddToWishlist={(productId) => {
    // Handle add to wishlist
    addToWishlist(productId)
  }}
/>
```

### Hide Category
```tsx
<ProductCard 
  product={product}
  showCategory={false}
/>
```

### Custom Styling
```tsx
<ProductCard 
  product={product}
  className="border-2 border-primary"
/>
```

## Product Data Structure

The component expects a `Product` object with the following structure:

```typescript
interface Product {
  id: string
  sku: string
  name: string
  slug: string
  category_id: string
  description: string
  price: number
  stock_quantity: number
  images_json: string[]
  category?: {
    id: string
    name: string
    slug: string
  }
}
```

## Displayed Elements

- **Product Image**: Square aspect ratio with hover effects
- **Stock Badge**: "In Stock" (green) or "Out of Stock" (gray)
- **Wishlist Button**: Heart icon in top-right corner
- **Product Name**: Clickable link to product detail page
- **SKU**: Product identifier
- **Description**: Truncated to 1 line
- **Category**: Optional category name
- **Star Ratings**: 5 filled yellow stars (default rating)
- **Price**: Formatted price display
- **Add to Cart Button**: Disabled when out of stock

## Styling

The component uses Tailwind CSS classes and follows the design system:
- Compact padding (`p-3`)
- Small text sizes for space efficiency
- Consistent hover effects
- Responsive grid layouts
- Proper color scheme integration

## Related Components

- `ProductGrid`: Wrapper component for displaying multiple product cards
- `FeaturedProducts`: Uses ProductCard for featured products section
- `ProductDetail`: Uses ProductCard for related products section
