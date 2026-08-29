"use client"

import type React from "react"
import { useEffect, useId, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Icon } from "@/lib/icons"
import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useSearchSuggestions } from "@/lib/hooks/use-search-suggestions"
import { SearchSuggestions, buildSuggestionItems } from "@/components/layout/search-suggestions"

interface SearchBarProps {
  className?: string
  autoFocus?: boolean
  onSubmitted?: () => void
  variant?: "compact" | "full"
}

export function SearchBar({
  className,
  autoFocus,
  onSubmitted,
  variant = "compact",
}: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const router = useRouter()
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const { products, categories: suggestedCategories, loading } = useSearchSuggestions(query, undefined, open || query.trim().length > 0)

  const items = buildSuggestionItems(suggestedCategories, products)
  const showPanel = open && query.trim().length > 0

  useEffect(() => {
    setActiveIndex(0)
  }, [query, suggestedCategories, products])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  const goSearch = (term = query) => {
    const next = term.trim()
    if (!next) return
    setOpen(false)
    onSubmitted?.()
    router.push(`/shop?q=${encodeURIComponent(next)}`)
  }

  const activateItem = (index: number) => {
    const item = items[index]
    if (!item || item.kind === "all") {
      goSearch()
      return
    }
    setOpen(false)
    onSubmitted?.()
    if (item.kind === "category") router.push(`/categories/${item.category.slug}`)
    else router.push(`/products/${item.product.slug || item.product.ID}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false)
      return
    }
    if (!showPanel || items.length === 0) {
      if (e.key === "Enter") goSearch()
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % items.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + items.length) % items.length)
    } else if (e.key === "Enter") {
      e.preventDefault()
      activateItem(activeIndex)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (showPanel && items.length > 0) activateItem(activeIndex)
    else goSearch()
  }

  const inputProps = {
    autoFocus,
    value: query,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
      setOpen(true)
    },
    onFocus: () => setOpen(true),
    onKeyDown: handleKeyDown,
    placeholder: "Search products...",
    autoComplete: "off",
    role: "combobox" as const,
    "aria-expanded": showPanel,
    "aria-controls": listId,
    "aria-autocomplete": "list" as const,
  }

  const suggestions = (
    <SearchSuggestions
      open={showPanel}
      query={query}
      loading={loading}
      products={products}
      categories={suggestedCategories}
      activeIndex={activeIndex}
      listId={listId}
      onHover={setActiveIndex}
      onClose={() => { setOpen(false); onSubmitted?.() }}
      onSelectAll={() => goSearch()}
    />
  )

  if (variant === "compact") {
    return (
      <div ref={rootRef} className={cn("relative", className)}>
        <form onSubmit={handleSubmit} role="search" className="relative">
          <label htmlFor="site-search-compact" className="sr-only">Search products</label>
          <Icon icon={Search01Icon} size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            id="site-search-compact"
            type="text"
            inputMode="search"
            {...inputProps}
            className="h-11 w-full rounded-full border bg-muted/40 pl-10 pr-10 text-sm outline-none ring-ring/40 focus:ring-2"
          />
          {query ? (
            <button
              type="button"
              className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center text-muted-foreground"
              onClick={() => { setQuery(""); setOpen(false) }}
              aria-label="Clear search"
            >
              <Icon icon={Cancel01Icon} size={16} />
            </button>
          ) : null}
        </form>
        {suggestions}
      </div>
    )
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} role="search" className="flex h-12 overflow-hidden rounded-full border bg-card">
        <label htmlFor="site-search-full" className="sr-only">Search products</label>
        <input
          id="site-search-full"
          type="text"
          inputMode="search"
          {...inputProps}
          className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
        />
        <button type="submit" className="h-full shrink-0 bg-primary px-5 text-xs font-semibold tracking-wide text-primary-foreground transition hover:bg-primary/90 sm:px-6">
          Search
        </button>
      </form>
      {suggestions}
    </div>
  )
}
