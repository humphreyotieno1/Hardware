export const CATALOG_SORTS = [
  { value: "name", label: "Name A–Z" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "newest", label: "Newest" },
] as const

export type CatalogSort = (typeof CATALOG_SORTS)[number]["value"]

export function toCatalogSortParams(sort?: string): { sort: string; order: "asc" | "desc" } {
  switch (sort) {
    case "price_asc":
      return { sort: "price", order: "asc" }
    case "price_desc":
      return { sort: "price", order: "desc" }
    case "newest":
      return { sort: "created_at", order: "desc" }
    case "name":
    default:
      return { sort: "name", order: "asc" }
  }
}
