"use client"

import Link from "next/link"
import type { Category, Product } from "@/lib/api/types"
import { groupCategories } from "@/lib/catalog/nav-groups"
import { formatPrice } from "@/lib/api"
import { Icon } from "@/lib/icons"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"

export function MegaMenu({
  categories,
  products = [],
}: {
  categories: Category[]
  products?: Product[]
}) {
  const groups = groupCategories(categories)

  return (
    <div className="absolute left-0 right-0 top-full z-50 hidden border-b bg-card shadow-xl animate-in fade-in-0 slide-in-from-top-2 duration-200 lg:block">
      <div className="container mx-auto grid gap-0 px-4 py-8 lg:grid-cols-12">
        <div className="grid grid-cols-2 gap-8 lg:col-span-8 xl:grid-cols-3">
          {groups.map((group) => (
            <div key={group.id}>
              <Link href={group.href} className="font-display text-sm font-semibold uppercase tracking-[0.14em] hover:text-primary">
                {group.label}
              </Link>
              <ul className="mt-3 space-y-1.5">
                {group.items.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/categories/${item.slug}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="lg:col-span-4">
          {products.length > 0 ? (
            <div>
              <p className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.14em]">Featured in shop</p>
              <ul className="grid grid-cols-2 gap-3">
                {products.slice(0, 4).map((product) => (
                  <li key={product.ID}>
                    <Link href={`/products/${product.slug || product.ID}`} className="flex gap-2 rounded-2xl p-1.5 hover:bg-muted">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                        {product.images_json?.[0] ? (
                          <img src={product.images_json[0]} alt="" className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-xs font-semibold leading-snug">{product.name}</p>
                        <p className="mt-1 text-xs text-primary">{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="relative hidden overflow-hidden rounded-3xl lg:block">
              <img src="/images/categories/building-materials.jpg" alt="" className="h-full min-h-56 w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-secondary-foreground">
                <p className="font-display text-xl font-semibold">Shop the yard</p>
                <p className="mt-1 text-sm text-secondary-foreground/80">Construction, plumbing, electrical and hardware from Siaya.</p>
                <Link href="/shop" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-secondary-foreground">
                  Shop all <Icon icon={ArrowRight01Icon} size={16} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
