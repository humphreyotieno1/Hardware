# ProductListCard Component

A specialized horizontal product card component designed for list view layouts. This component provides a compact, horizontal layout that's perfect for displaying products in a list format.

## Features

- **Horizontal Layout**: Optimized for list view with side-by-side image and content
- **Compact Design**: Smaller footprint than grid cards
- **Consistent Functionality**: Same features as ProductCard but in horizontal format
- **Responsive**: Adapts to different screen sizes
- **Interactive**: Independent click handlers for cart and wishlist actions

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
import { ProductListCard } from "@/components/ui/product-list-card"

<ProductListCard product={product} />
```

### With Event Handlers
```tsx
<ProductListCard 
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
<ProductListCard 
  product={product}
  showCategory={false}
/>
```

## Layout Structure

The ProductListCard uses a horizontal layout with the following structure:

```
┌─────────────────────────────────────────────────────────────┐
│ [Image] [Product Info]                    [Price & Actions] │
│  24x24   Name, SKU, Description              Price          │
│          Category, Ratings                   Wishlist        │
│                                              Add to Cart    │
└─────────────────────────────────────────────────────────────┘
```

## Displayed Elements

- **Product Image**: 24x24px thumbnail with hover effects
- **Stock Badge**: "In Stock" (green) or "Out of Stock" (gray) positioned on image
- **Product Name**: Clickable link to product detail page
- **SKU**: Product identifier
- **Description**: Truncated to 2 lines
- **Category**: Optional category name
- **Star Ratings**: 5 filled yellow stars (default rating)
- **Price**: Formatted price display
- **Wishlist Button**: Heart icon button
- **Add to Cart Button**: Disabled when out of stock

## Key Differences from ProductCard

| Feature | ProductCard | ProductListCard |
|---------|-------------|-----------------|
| **Layout** | Vertical (grid) | Horizontal (list) |
| **Image Size** | Square aspect ratio | 24x24px fixed |
| **Spacing** | `space-y-2` | `space-x-4` |
| **Content Flow** | Stacked vertically | Side-by-side |
| **Button Layout** | Full width | Compact inline |
| **Height** | Variable (flex) | Fixed compact |

## Styling

The component uses Tailwind CSS classes optimized for horizontal layout:
- Compact padding (`p-4`)
- Small text sizes for space efficiency
- Horizontal flex layout (`flex items-center space-x-4`)
- Fixed image dimensions (`w-24 h-24`)
- Right-aligned actions section

## Responsive Behavior

- **Desktop**: Full horizontal layout with all elements visible
- **Tablet**: Maintains horizontal layout with adjusted spacing
- **Mobile**: Responsive text sizing and button placement

## Related Components

- `ProductCard`: Vertical grid layout component
- `ProductGrid`: Wrapper component for displaying multiple product cards
- `CategoryProductListing`: Uses ProductListCard for list view
- `SearchResults`: Uses ProductListCard for list view
