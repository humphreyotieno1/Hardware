import { env } from "@/lib/config/env"
import { formatPrice } from "@/lib/utils/format"
import type { CartItem } from "@/lib/api/types"

export function buildWhatsAppOrderMessage({
  items,
  total,
  customer,
}: {
  items: CartItem[]
  total: number
  customer?: { name?: string; phone?: string; location?: string }
}) {
  const lines = [
    "Hello Grahad Ventures, I would like to place an order:",
    "",
    ...items.map((item, index) => {
      const name = item.product?.name || "Product"
      const sku = item.product?.sku ? ` (SKU: ${item.product.sku})` : ""
      return `${index + 1}. ${name}${sku} × ${item.quantity} — ${formatPrice(item.unit_price * item.quantity)}`
    }),
    "",
    `Total: ${formatPrice(total)}`,
  ]

  if (customer?.name) lines.push(`Name: ${customer.name}`)
  if (customer?.phone) lines.push(`Phone: ${customer.phone}`)
  if (customer?.location) lines.push(`Location: ${customer.location}`)

  lines.push("", "Please confirm availability, price and delivery.")
  return lines.join("\n")
}

export function openWhatsAppOrder(items: CartItem[], total: number, customer?: { name?: string; phone?: string; location?: string }) {
  const message = buildWhatsAppOrderMessage({ items, total, customer })
  window.open(env.getWhatsAppUrl(message), "_blank", "noopener,noreferrer")
}
