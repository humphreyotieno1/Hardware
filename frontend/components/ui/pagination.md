# Pagination Components

A comprehensive pagination system with two variants: full-featured pagination with page numbers and ellipsis, and simple pagination for basic navigation.

## Components

### 1. Pagination (Full-Featured)

A complete pagination component with page numbers, ellipsis, and detailed information.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentPage` | `number` | Yes | Current active page number |
| `totalPages` | `number` | Yes | Total number of pages |
| `totalItems` | `number` | Yes | Total number of items across all pages |
| `itemsPerPage` | `number` | Yes | Number of items per page |
| `onPageChange` | `(page: number) => void` | No | Custom page change handler |
| `className` | `string` | No | Additional CSS classes |

#### Features

- **Page Numbers**: Shows page numbers with smart ellipsis
- **Navigation**: Previous/Next buttons with proper disabled states
- **Info Display**: Shows "Showing X to Y of Z results"
- **URL Integration**: Automatically updates URL parameters
- **Responsive**: Adapts to different screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation

#### Usage Example

```tsx
import { Pagination } from "@/components/ui/pagination"

<Pagination
  currentPage={currentPage}
  totalPages={Math.ceil(total / 12)}
  totalItems={total}
  itemsPerPage={12}
  onPageChange={(page) => {
    // Custom page change logic
    setCurrentPage(page)
  }}
/>
```

### 2. SimplePagination

A simplified pagination component with just Previous/Next navigation.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentPage` | `number` | Yes | Current active page number |
| `totalPages` | `number` | Yes | Total number of pages |
| `onPageChange` | `(page: number) => void` | No | Custom page change handler |
| `className` | `string` | No | Additional CSS classes |

#### Features

- **Simple Navigation**: Previous/Next buttons only
- **Page Info**: Shows "Page X of Y"
- **URL Integration**: Automatically updates URL parameters
- **Compact Design**: Takes less space than full pagination

#### Usage Example

```tsx
import { SimplePagination } from "@/components/ui/pagination"

<SimplePagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) => {
    // Custom page change logic
    setCurrentPage(page)
  }}
/>
```

## Page Number Logic

The full pagination component uses smart page number calculation:

### Algorithm

1. **Delta Calculation**: Shows 2 pages on each side of current page
2. **Range Building**: Creates visible page range around current page
3. **Ellipsis Logic**: Adds ellipsis when there are gaps
4. **Boundary Handling**: Always shows first and last pages when appropriate

### Examples

#### Small Page Count (≤ 7 pages)
```
[1] [2] [3] [4] [5]
```

#### Medium Page Count with Current Page in Middle
```
[1] [...] [4] [5] [6] [...] [10]
```

#### Current Page Near Beginning
```
[1] [2] [3] [4] [...] [10]
```

#### Current Page Near End
```
[1] [...] [7] [8] [9] [10]
```

## URL Integration

Both components automatically update URL parameters when no custom `onPageChange` handler is provided:

```typescript
// Updates URL like: /products?page=3&sort=price_asc
const url = new URL(window.location.href)
url.searchParams.set("page", page.toString())
router.push(url.toString())
```

## Styling

### Default Classes

- **Container**: `flex flex-col sm:flex-row items-center justify-between gap-4 mt-8`
- **Info**: `text-sm text-muted-foreground`
- **Buttons**: `h-8 w-8 p-0` for page numbers, standard size for nav buttons
- **Current Page**: `variant="default"` (primary styling)
- **Other Pages**: `variant="outline"`

### Customization

```tsx
<Pagination
  className="my-custom-pagination"
  // ... other props
/>
```

## Accessibility

- **ARIA Labels**: Proper labels for navigation buttons
- **Keyboard Navigation**: Supports keyboard navigation
- **Screen Readers**: Clear information for screen readers
- **Disabled States**: Proper disabled state handling

## Integration Examples

### Category Product Listing

```tsx
const handlePageChange = (page: number) => {
  const url = new URL(window.location.href)
  url.searchParams.set("page", page.toString())
  router.push(url.toString())
}

<Pagination
  currentPage={currentPage}
  totalPages={Math.ceil(total / 12)}
  totalItems={total}
  itemsPerPage={12}
  onPageChange={handlePageChange}
/>
```

### Search Results

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={Math.ceil(total / 12)}
  totalItems={total}
  itemsPerPage={12}
  onPageChange={handlePageChange}
/>
```

### Featured Products (Simple)

```tsx
<SimplePagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>
```

## Performance Considerations

- **Conditional Rendering**: Components return `null` when `totalPages <= 1`
- **Efficient Updates**: Only re-renders when necessary
- **URL Optimization**: Uses Next.js router for efficient navigation
- **Memory Management**: No unnecessary state or effects

## Browser Support

- **Modern Browsers**: Full support for all features
- **URL API**: Uses modern URL API for parameter handling
- **CSS Grid/Flexbox**: Uses modern CSS for layout
- **ES6+**: Uses modern JavaScript features
