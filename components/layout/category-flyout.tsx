"use client"

import { useState } from "react"
import Link from "next/link"
import type { Category } from "@/lib/api/types"
import { groupCategories } from "@/lib/catalog/nav-groups"
import { Icon } from "@/lib/icons"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export function CategoryFlyout({
  categories,
  open,
  onClose,
}: {
  categories: Category[]
  open: boolean
  onClose: () => void
}) {
  const groups = groupCategories(categories)
  const [active, setActive] = useState<string | null>(groups[0]?.id ?? null)
  const current = groups.find((g) => g.id === active) ?? groups[0]

  if (!open) return null

  return (
    <div className="absolute left-0 top-full z-50 hidden w-[min(52rem,calc(100vw-2rem))] overflow-hidden rounded-b-3xl border bg-card shadow-xl animate-in fade-in-0 slide-in-from-top-2 duration-200 lg:grid lg:grid-cols-[16rem_1fr]">
      <ul className="border-r bg-muted/40 py-2">
        <li>
          <Link
            href="/shop"
            onClick={onClose}
            className="flex min-h-11 items-center px-4 text-sm font-semibold hover:text-primary"
          >
            All products
          </Link>
        </li>
        {groups.map((group) => (
          <li key={group.id}>
            <button
              type="button"
              className={cn(
                "flex min-h-11 w-full items-center justify-between px-4 text-left text-sm",
                active === group.id ? "bg-card font-semibold text-primary" : "hover:bg-card/80"
              )}
              onMouseEnter={() => setActive(group.id)}
              onFocus={() => setActive(group.id)}
            >
              {group.label}
              <Icon icon={ArrowRight01Icon} size={14} />
            </button>
          </li>
        ))}
      </ul>
      <div className="p-5">
        {current ? (
          <>
            <Link href={current.href} onClick={onClose} className="font-display text-sm font-semibold uppercase tracking-[0.14em] hover:text-primary">
              {current.label}
            </Link>
            <ul className="mt-3 grid grid-cols-2 gap-x-6">
              {current.items.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/categories/${item.slug}`}
                    onClick={onClose}
                    className="flex min-h-10 items-center text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={current.href} onClick={onClose} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Shop {current.label} <Icon icon={ArrowRight01Icon} size={14} />
            </Link>
          </>
        ) : null}
      </div>
    </div>
  )
}
