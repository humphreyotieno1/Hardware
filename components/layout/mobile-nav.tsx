"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { Category } from "@/lib/api/types"
import { HIDDEN_CATEGORY_SLUGS } from "@/lib/catalog/category-meta"
import { PRIMARY_NAV, groupCategories } from "@/lib/catalog/nav-groups"
import { Icon } from "@/lib/icons"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
}

type Panel = "shop" | "categories" | null

const rowClass = "flex min-h-12 w-full items-center justify-between px-5 text-[15px] font-medium"

export function MobileNav({ open, onOpenChange, categories }: MobileNavProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [panel, setPanel] = useState<Panel>(null)
  const groups = groupCategories(categories.filter((c) => !HIDDEN_CATEGORY_SLUGS.has(c.slug)))

  const close = () => onOpenChange(false)
  const toggle = (next: Panel) => setPanel((current) => (current === next ? null : next))

  const active = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const handleLogout = async () => {
    await logout()
    close()
    router.push("/")
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) setPanel(null)
        onOpenChange(next)
      }}
    >
      <SheetContent side="left" className="w-[82vw] max-w-sm gap-0 border-r-0 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex h-full flex-col overflow-y-auto pt-14 pb-8" aria-label="Mobile">
          <Link
            href="/"
            onClick={close}
            className={cn(rowClass, active("/") ? "text-primary" : "text-foreground")}
          >
            Home
          </Link>

          <div>
            <button
              type="button"
              className={cn(rowClass, (active("/shop") || panel === "shop") && "text-primary")}
              onClick={() => toggle("shop")}
              aria-expanded={panel === "shop"}
            >
              Shop
              <Icon
                icon={ArrowDown01Icon}
                size={16}
                className={cn("text-muted-foreground transition-transform duration-200", panel === "shop" && "rotate-180")}
              />
            </button>
            {panel === "shop" ? (
              <div className="pb-2">
                <Link href="/shop" onClick={close} className="flex min-h-10 items-center px-8 text-sm text-muted-foreground hover:text-foreground">
                  All products
                </Link>
                {groups.map((group) => (
                  <Link
                    key={group.id}
                    href={group.href}
                    onClick={close}
                    className="flex min-h-10 items-center px-8 text-sm text-muted-foreground hover:text-foreground"
                  >
                    {group.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <button
              type="button"
              className={cn(rowClass, (active("/categories") || panel === "categories") && "text-primary")}
              onClick={() => toggle("categories")}
              aria-expanded={panel === "categories"}
            >
              Categories
              <Icon
                icon={ArrowDown01Icon}
                size={16}
                className={cn("text-muted-foreground transition-transform duration-200", panel === "categories" && "rotate-180")}
              />
            </button>
            {panel === "categories" ? (
              <div className="pb-2">
                <Link href="/categories" onClick={close} className="flex min-h-10 items-center px-8 text-sm text-muted-foreground hover:text-foreground">
                  All categories
                </Link>
                {groups.map((group) => (
                  <div key={group.id}>
                    <Link
                      href={group.href}
                      onClick={close}
                      className="flex min-h-10 items-center px-8 text-sm font-medium text-foreground/80 hover:text-foreground"
                    >
                      {group.label}
                    </Link>
                    {group.items.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/categories/${item.slug}`}
                        onClick={close}
                        className="flex min-h-9 items-center px-11 text-sm text-muted-foreground hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {PRIMARY_NAV.filter((item) => item.href !== "/shop" && item.href !== "/categories" && item.href !== "/about" && item.href !== "/contact").map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className={cn(rowClass, active(item.href) ? "text-primary" : "text-foreground")}
            >
              {item.label}
            </Link>
          ))}

          <div className="mx-5 my-3 border-t" />

          <Link href="/about" onClick={close} className={cn(rowClass, active("/about") ? "text-primary" : "text-foreground")}>
            About Us
          </Link>
          <Link href="/contact" onClick={close} className={cn(rowClass, active("/contact") ? "text-primary" : "text-foreground")}>
            Contact Us
          </Link>
          <Link href="/pages/support" onClick={close} className={cn(rowClass, active("/pages/support") ? "text-primary" : "text-foreground")}>
            Support
          </Link>
          <Link href="/pages/returns" onClick={close} className={cn(rowClass, active("/pages/returns") ? "text-primary" : "text-foreground")}>
            Returns
          </Link>
          {user ? (
            <>
              <Link href="/account" onClick={close} className={cn(rowClass, active("/account") ? "text-primary" : "text-foreground")}>
                Account
              </Link>
              <Link href="/wishlist" onClick={close} className={cn(rowClass, active("/wishlist") ? "text-primary" : "text-foreground")}>
                Wishlist
              </Link>
              <button type="button" onClick={handleLogout} className={rowClass}>
                Sign out
              </button>
            </>
          ) : (
            <Link href="/auth/login" onClick={close} className={rowClass}>
              Sign in
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export { PRIMARY_NAV as NAV }
