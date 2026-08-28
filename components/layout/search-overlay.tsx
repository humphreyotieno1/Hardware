"use client"

import type React from "react"
import { useEffect, useId, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useStoreUi } from "@/lib/hooks/use-store-ui"
import { Icon } from "@/lib/icons"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { useSearchSuggestions } from "@/lib/hooks/use-search-suggestions"
import { SearchSuggestions, buildSuggestionItems } from "@/components/layout/search-suggestions"

const POPULAR = ["Cement", "Paints", "Plumbing", "Tools", "Mabati", "Electrical"]
const RECENT_KEY = "grahad-recent-searches"

function readRecent(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string").slice(0, 6) : []
  } catch {
    return []
  }
}

function writeRecent(term: string) {
  const next = [term, ...readRecent().filter((item) => item.toLowerCase() !== term.toLowerCase())].slice(0, 6)
  localStorage.setItem(RECENT_KEY, JSON.stringify(next))
}

export function SearchOverlay() {
  const { searchOpen, closeSearch } = useStoreUi()
  const [query, setQuery] = useState("")
  const [recent, setRecent] = useState<string[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const listId = useId()
  const { products, categories, loading } = useSearchSuggestions(query, undefined, searchOpen)
  const items = buildSuggestionItems(categories, products)

  useEffect(() => {
    if (searchOpen) {
      setRecent(readRecent())
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery("")
    }
  }, [searchOpen])

  useEffect(() => {
    setActiveIndex(0)
  }, [query, products, categories])

  const go = (href: string, term?: string) => {
    if (term) {
      writeRecent(term)
      setRecent(readRecent())
    }
    closeSearch()
    router.push(href)
  }

  const activateItem = (index: number) => {
    const item = items[index]
    const term = query.trim()
    if (!item || item.kind === "all") {
      if (term) go(`/shop?q=${encodeURIComponent(term)}`, term)
      return
    }
    if (item.kind === "category") go(`/categories/${item.category.slug}`, term)
    else go(`/products/${item.product.slug || item.product.ID}`, term)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (query.trim().length < 1) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % Math.max(items.length, 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + items.length) % Math.max(items.length, 1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      activateItem(activeIndex)
    }
  }

  return (
    <Dialog open={searchOpen} onOpenChange={(open) => (!open ? closeSearch() : undefined)}>
      <DialogContent className="top-[10%] max-w-2xl !translate-y-0 rounded-3xl p-0 sm:top-[14%] sm:!max-w-2xl">
        <DialogTitle className="sr-only">Search products</DialogTitle>
        <form
          className="flex items-center gap-3 border-b px-4 py-3"
          onSubmit={(e) => {
            e.preventDefault()
            activateItem(activeIndex)
          }}
        >
          <Icon icon={Search01Icon} className="text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products, categories..."
            autoComplete="off"
            role="combobox"
            aria-expanded={query.trim().length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            className="h-12 flex-1 bg-transparent text-base outline-none"
          />
        </form>
        <div className="max-h-[60vh] overflow-y-auto px-2 py-3">
          {query.trim().length < 1 ? (
            <div className="space-y-6 px-2">
              {recent.length > 0 ? (
                <div>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Recent searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((term) => (
                      <button
                        key={term}
                        type="button"
                        className="rounded-full border bg-muted/50 px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
                        onClick={() => go(`/shop?q=${encodeURIComponent(term)}`, term)}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Popular searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR.map((term) => (
                    <button
                      key={term}
                      type="button"
                      className="rounded-full border bg-muted/50 px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
                      onClick={() => go(`/shop?q=${encodeURIComponent(term)}`, term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <SearchSuggestions
              open
              query={query}
              loading={loading}
              products={products}
              categories={categories}
              activeIndex={activeIndex}
              listId={listId}
              variant="inline"
              onHover={setActiveIndex}
              onClose={() => closeSearch()}
              onSelectAll={() => {
                const term = query.trim()
                if (term) go(`/shop?q=${encodeURIComponent(term)}`, term)
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
