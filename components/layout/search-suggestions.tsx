"use client"

import Link from "next/link"
import { formatPrice } from "@/lib/api"
import type { Category, Product } from "@/lib/api/types"
import { Icon } from "@/lib/icons"
import { GridViewIcon, Package01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export type SuggestionItem =
  | { kind: "category"; category: Category }
  | { kind: "product"; product: Product }
  | { kind: "all" }

export function buildSuggestionItems(categories: Category[], products: Product[]): SuggestionItem[] {
  return [
    ...categories.map((category) => ({ kind: "category" as const, category })),
    ...products.map((product) => ({ kind: "product" as const, product })),
    { kind: "all" as const },
  ]
}

function Highlight({ text, query }: { text: string; query: string }) {
  const term = query.trim()
  if (!term) return <>{text}</>
  const index = text.toLowerCase().indexOf(term.toLowerCase())
  if (index < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded-sm bg-primary/15 text-inherit">{text.slice(index, index + term.length)}</mark>
      {text.slice(index + term.length)}
    </>
  )
}

export function SearchSuggestions({
  open,
  query,
  loading,
  products,
  categories,
  activeIndex,
  listId,
  onHover,
  onClose,
  onSelectAll,
  variant = "dropdown",
}: {
  open: boolean
  query: string
  loading: boolean
  products: Product[]
  categories: Category[]
  activeIndex: number
  listId: string
  onHover: (index: number) => void
  onClose: () => void
  onSelectAll: () => void
  variant?: "dropdown" | "inline"
}) {
  if (!open || query.trim().length < 1) return null

  const items = buildSuggestionItems(categories, products)
  const empty = !loading && products.length === 0 && categories.length === 0

  return (
    <div
      id={listId}
      role="listbox"
      className={cn(
        "overflow-hidden bg-card",
        variant === "dropdown" && "absolute z-[60] mt-2 w-full rounded-3xl border shadow-lg"
      )}
    >
      {loading && products.length === 0 && categories.length === 0 ? (
        <p className="px-4 py-3 text-sm text-muted-foreground">Searching…</p>
      ) : empty ? (
        <p className="px-4 py-3 text-sm text-muted-foreground">No matches for “{query.trim()}”</p>
      ) : (
        <ul>
          {items.map((item, index) => {
            if (item.kind === "category") {
              return (
                <li key={`cat-${item.category.slug}`} role="option" aria-selected={index === activeIndex}>
                  <Link
                    href={`/categories/${item.category.slug}`}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-muted",
                      index === activeIndex && "bg-muted"
                    )}
                    onMouseEnter={() => onHover(index)}
                    onClick={onClose}
                  >
                    <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-primary">
                      <Icon icon={GridViewIcon} size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium">
                        <Highlight text={item.category.name} query={query} />
                      </span>
                      <span className="text-xs text-muted-foreground">Category</span>
                    </span>
                  </Link>
                </li>
              )
            }
            if (item.kind === "product") {
              const image = item.product.images_json?.[0]
              return (
                <li key={item.product.ID} role="option" aria-selected={index === activeIndex}>
                  <Link
                    href={`/products/${item.product.slug || item.product.ID}`}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-muted",
                      index === activeIndex && "bg-muted"
                    )}
                    onMouseEnter={() => onHover(index)}
                    onClick={onClose}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                      {image ? (
                        <img src={image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Icon icon={Package01Icon} size={16} className="text-muted-foreground" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">
                        <Highlight text={item.product.name} query={query} />
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.product.category?.name || "Product"}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-medium">{formatPrice(item.product.price)}</span>
                  </Link>
                </li>
              )
            }
            return (
              <li key="all" role="option" aria-selected={index === activeIndex}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 border-t px-3 py-2.5 text-left text-sm font-medium text-primary hover:bg-muted",
                    index === activeIndex && "bg-muted"
                  )}
                  onMouseEnter={() => onHover(index)}
                  onClick={onSelectAll}
                >
                  <Icon icon={Search01Icon} size={16} />
                  See all results for “{query.trim()}”
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
