/**
 * Format a number as Kenyan Shilling currency
 * @param price - The price to format
 * @returns Formatted price string (e.g., "KSh 1,234.56")
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(price)
}

/**
 * Format a number with commas for better readability
 * @param number - The number to format
 * @returns Formatted number string (e.g., "1,234.56")
 */
export function formatNumber(number: number): string {
  return new Intl.NumberFormat("en-KE").format(number)
}
