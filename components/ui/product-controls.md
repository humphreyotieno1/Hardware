# Product Controls Component

A comprehensive dropdown control system for product listing pages, providing enhanced sorting options, items per page selection, and results information.

## Components

### 1. ProductControls (Full-Featured)

A complete control panel with sorting, items per page selection, and results information.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentSort` | `string` | Yes | Current active sort option |
| `onSortChange` | `(sort: string) => void` | Yes | Handler for sort changes |
| `itemsPerPage` | `number` | Yes | Current items per page setting |
| `onItemsPerPageChange` | `(itemsPerPage: number) => void` | Yes | Handler for items per page changes |
| `totalItems` | `number` | Yes | Total number of items |
| `className` | `string` | No | Additional CSS classes |

#### Features

- **Enhanced Sorting**: 8 different sort options with icons and descriptions
- **Items Per Page**: Configurable items per page (12, 24, 48, 96)
- **Results Info**: Shows total number of items
- **Visual Icons**: Each sort option has a relevant icon
- **Descriptions**: Helpful descriptions for each sort option
- **Responsive**: Adapts to different screen sizes

#### Sort Options

| Value | Label | Icon | Description |
|-------|-------|------|-------------|
| `name` | Name A-Z | ArrowUpDown | Alphabetical order |
| `name_desc` | Name Z-A | ArrowUpDown | Reverse alphabetical |
| `price_asc` | Price: Low to High | ArrowUp | Cheapest first |
| `price_desc` | Price: High to Low | ArrowDown | Most expensive first |
| `newest` | Newest First | Calendar | Recently added |
| `oldest` | Oldest First | Calendar | Oldest items first |
| `popular` | Most Popular | TrendingUp | Best selling |
| `rating` | Highest Rated | Star | Best reviews first |

#### Items Per Page Options

- **12 per page**: Default, good for most screens
- **24 per page**: More items, faster browsing
- **48 per page**: High density, power users
- **96 per page**: Maximum density, bulk viewing

#### Usage Example

```tsx
import { ProductControls } from "@/components/ui/product-controls"

<ProductControls
  currentSort={currentSort}
  onSortChange={handleSortChange}
  itemsPerPage={itemsPerPage}
  onItemsPerPageChange={handleItemsPerPageChange}
  totalItems={total}
/>
```

### 2. SimpleSortDropdown

A simplified version with just enhanced sorting options.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentSort` | `string` | Yes | Current active sort option |
| `onSortChange` | `(sort: string) => void` | Yes | Handler for sort changes |
| `className` | `string` | No | Additional CSS classes |

#### Usage Example

```tsx
import { SimpleSortDropdown } from "@/components/ui/product-controls"

<SimpleSortDropdown
  currentSort={currentSort}
  onSortChange={handleSortChange}
/>
```

## Visual Design

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ Sort by                    Show              Results     │
│ ┌─────────────────┐       ┌─────────┐       ┌─────────┐  │
│ │ [Icon] Name A-Z │       │ 12/page │       │ 1,234   │  │
│ └─────────────────┘       └─────────┘       │ items   │  │
│                                             └─────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Sort Dropdown Design

Each sort option displays:
- **Icon**: Visual indicator of sort type
- **Label**: Clear, descriptive name
- **Description**: Additional context (in tooltip/subtitle)

### Responsive Behavior

- **Desktop**: Horizontal layout with all controls visible
- **Tablet**: Stacked layout with proper spacing
- **Mobile**: Compact layout with essential controls

## Integration Examples

### Category Product Listing

```tsx
const [itemsPerPage, setItemsPerPage] = useState(12)

const handleItemsPerPageChange = (newItemsPerPage: number) => {
  setItemsPerPage(newItemsPerPage)
  // Reset to first page when changing items per page
  const url = new URL(window.location.href)
  url.searchParams.set("page", "1")
  router.push(url.toString())
}

<ProductControls
  currentSort={currentSort}
  onSortChange={handleSortChange}
  itemsPerPage={itemsPerPage}
  onItemsPerPageChange={handleItemsPerPageChange}
  totalItems={total}
/>
```

### Search Results

```tsx
<ProductControls
  currentSort={currentSort}
  onSortChange={handleSortChange}
  itemsPerPage={itemsPerPage}
  onItemsPerPageChange={handleItemsPerPageChange}
  totalItems={total}
/>
```

### Pagination Integration

The component works seamlessly with the pagination system:

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={Math.ceil(total / itemsPerPage)}
  totalItems={total}
  itemsPerPage={itemsPerPage}
  onPageChange={handlePageChange}
/>
```

## State Management

### Required State

```tsx
const [currentSort, setCurrentSort] = useState("name")
const [itemsPerPage, setItemsPerPage] = useState(12)
const [total, setTotal] = useState(0)
```

### URL Synchronization

```tsx
const handleSortChange = (sort: string) => {
  const url = new URL(window.location.href)
  url.searchParams.set("sort", sort)
  url.searchParams.delete("page") // Reset to first page
  router.push(url.toString())
}

const handleItemsPerPageChange = (newItemsPerPage: number) => {
  setItemsPerPage(newItemsPerPage)
  const url = new URL(window.location.href)
  url.searchParams.set("page", "1")
  router.push(url.toString())
}
```

## Accessibility Features

- **ARIA Labels**: Proper labels for all controls
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Clear information for assistive technologies
- **Focus Management**: Proper focus handling
- **Descriptive Text**: Clear descriptions for all options

## Performance Considerations

- **Efficient Rendering**: Only re-renders when necessary
- **State Optimization**: Minimal state updates
- **URL Updates**: Efficient URL parameter handling
- **Memory Management**: No unnecessary effects or listeners

## Customization

### Custom Sort Options

```tsx
const customSortOptions = [
  { value: "custom1", label: "Custom Sort 1", icon: CustomIcon, description: "Custom description" },
  { value: "custom2", label: "Custom Sort 2", icon: AnotherIcon, description: "Another description" }
]
```

### Custom Items Per Page

```tsx
const customItemsPerPageOptions = [
  { value: 6, label: "6 per page" },
  { value: 12, label: "12 per page" },
  { value: 24, label: "24 per page" }
]
```

### Styling Customization

```tsx
<ProductControls
  className="my-custom-controls"
  // ... other props
/>
```

## Browser Support

- **Modern Browsers**: Full support for all features
- **CSS Grid/Flexbox**: Uses modern CSS for layout
- **ES6+**: Uses modern JavaScript features
- **React 18+**: Optimized for modern React

## Benefits

1. **🎯 Enhanced UX**: More sorting options and better control
2. **📱 Responsive**: Works perfectly on all devices
3. **♿ Accessible**: Full accessibility support
4. **🔧 Maintainable**: Reusable component reduces duplication
5. **⚡ Performance**: Efficient rendering and updates
6. **🎨 Consistent**: Uniform experience across all pages
7. **🔗 URL Sync**: State preserved in URLs for bookmarking
