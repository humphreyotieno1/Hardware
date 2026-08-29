"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/hooks/use-auth"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { useStoreUi } from "@/lib/hooks/use-store-ui"
import { productsApi, formatPrice } from "@/lib/api"
import type { Category, Product } from "@/lib/api/types"
import { env } from "@/lib/config/env"
import { HIDDEN_CATEGORY_SLUGS } from "@/lib/catalog/category-meta"
import { MobileNav } from "@/components/layout/mobile-nav"
import { MegaMenu } from "@/components/layout/mega-menu"
import { CategoryFlyout } from "@/components/layout/category-flyout"
import { SearchBar } from "@/components/layout/search-bar"
import { Icon } from "@/lib/icons"
import {
  ArrowDown01Icon,
  Call02Icon,
  FavouriteIcon,
  Menu01Icon,
  ShoppingCart01Icon,
  TruckDeliveryIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

const UTILITY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/pages/support", label: "Support" },
] as const

const CENTER_NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop", menu: "shop" as const },
  { href: "/categories", label: "Categories", menu: "shop" as const },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Header() {
  const pathname = usePathname()
  const [categories, setCategories] = useState<Category[]>([])
  const [featured, setFeatured] = useState<Product[]>([])
  const [mobileOpen, setMobileOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [catsOpen, setCatsOpen] = useState(false)
  const shopCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const catsCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()
  const { itemCount: cartItemCount, total: cartTotal } = useCart()
  const { itemCount: wishlistItemCount } = useWishlist()
  const { openCart } = useStoreUi()

  useEffect(() => {
    productsApi
      .getCategories()
      .then((cats) => setCategories(cats.filter((c) => !HIDDEN_CATEGORY_SLUGS.has(c.slug))))
      .catch(() => setCategories([]))
    productsApi
      .searchProducts({ limit: 4, page: 1, sort: "name" })
      .then((data) => setFeatured(data.products || []))
      .catch(() => setFeatured([]))
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setShopOpen(false)
    setCatsOpen(false)
  }, [pathname])

  const openMenu = (which: "shop" | "cats") => {
    if (which === "shop") {
      if (shopCloseTimer.current) clearTimeout(shopCloseTimer.current)
      setShopOpen(true)
      setCatsOpen(false)
    } else {
      if (catsCloseTimer.current) clearTimeout(catsCloseTimer.current)
      setCatsOpen(true)
      setShopOpen(false)
    }
  }

  const closeMenu = (which: "shop" | "cats") => {
    const timer = setTimeout(() => {
      if (which === "shop") setShopOpen(false)
      else setCatsOpen(false)
    }, 180)
    if (which === "shop") shopCloseTimer.current = timer
    else catsCloseTimer.current = timer
  }

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      // Hysteresis so the shadow toggle cannot flicker at a single threshold
      setScrolled((prev) => (prev ? y > 8 : y > 24))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className={cn("relative sticky top-0 z-50 border-b bg-card/95 backdrop-blur-md transition-shadow duration-300", scrolled && "shadow-md")}>
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto flex min-h-9 items-center justify-between gap-3 px-4 py-1.5 text-[11px] sm:text-xs">
          <p className="min-w-0 truncate">
            Delivery across Siaya and surrounding areas · Bulk orders welcome{" "}
            <Link href="/shop" className="font-semibold underline-offset-2 hover:underline">
              Shop now
            </Link>
          </p>
          <div className="hidden items-center lg:flex">
            {UTILITY_LINKS.map((link, i) => (
              <span key={link.href} className="flex items-center">
                {i > 0 ? <span className="px-2 text-primary-foreground/35">|</span> : null}
                <Link href={link.href} className="hover:text-primary-foreground/80">{link.label}</Link>
              </span>
            ))}
            <span className="px-2 text-primary-foreground/35">|</span>
            <a href={env.getTelLink()} className="inline-flex items-center gap-1.5 font-medium hover:text-primary-foreground/80">
              <Icon icon={Call02Icon} size={13} />
              {env.CONTACT_PHONE}
            </a>
          </div>
          <a href={env.getTelLink()} className="inline-flex shrink-0 items-center gap-1 font-medium lg:hidden">
            <Icon icon={Call02Icon} size={13} />
            <span className="hidden sm:inline">{env.CONTACT_PHONE}</span>
          </a>
        </div>
      </div>

      <div className="relative">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center gap-2 sm:h-[4.25rem]">
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
              <Icon icon={Menu01Icon} />
            </Button>

            <Link href="/" className="flex min-w-0 items-center gap-2">
              <img src="/logo.png" alt="Grahad Ventures Limited" className="h-9 w-auto sm:h-10" />
              <span className="hidden font-display text-lg font-semibold tracking-wide md:inline xl:text-xl">GRAHAD</span>
            </Link>

            <nav className="mx-auto hidden items-center lg:flex" aria-label="Primary">
              {CENTER_NAV.map((item) =>
                item.menu ? (
                  <div key={item.href} onMouseEnter={() => openMenu("shop")} onMouseLeave={() => closeMenu("shop")}>
                    <Link
                      href={item.href}
                      className={cn(
                        "inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold transition-colors hover:text-primary",
                        isActive(item.href) || shopOpen ? "text-primary" : "text-foreground"
                      )}
                      aria-expanded={shopOpen}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <Icon icon={ArrowDown01Icon} size={14} className={cn("transition-transform duration-200", shopOpen && "rotate-180")} />
                    </Link>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-2 text-sm font-semibold transition-colors hover:text-primary",
                      isActive(item.href) ? "text-primary" : "text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            <div className="ml-auto flex items-center gap-0.5">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Account">
                      <Icon icon={UserIcon} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-2xl">
                    <DropdownMenuItem asChild><Link href="/account">Account</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/orders">Orders</Link></DropdownMenuItem>
                    {user.role === "admin" ? (
                      <DropdownMenuItem asChild><Link href="/admin">Admin</Link></DropdownMenuItem>
                    ) : null}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex" aria-label="Sign in">
                  <Link href="/auth/login"><Icon icon={UserIcon} /></Link>
                </Button>
              )}

              <Button variant="ghost" size="icon" asChild className="relative hidden sm:inline-flex">
                <Link href="/wishlist" aria-label="Wishlist">
                  <Icon icon={FavouriteIcon} />
                  {wishlistItemCount > 0 ? (
                    <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 rounded-full px-1 text-[10px]">{wishlistItemCount}</Badge>
                  ) : null}
                </Link>
              </Button>

              <button
                type="button"
                className="relative inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-1 hover:bg-muted sm:pr-2"
                aria-label="Cart"
                onClick={openCart}
              >
                <span className="relative inline-flex size-10 items-center justify-center">
                  <Icon icon={ShoppingCart01Icon} />
                  {cartItemCount > 0 ? (
                    <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 rounded-full px-1 text-[10px]">{cartItemCount}</Badge>
                  ) : null}
                </span>
                <span className="hidden text-left leading-tight xl:block">
                  <span className="block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">My Cart</span>
                  <span className="block text-sm font-semibold">{formatPrice(cartTotal)}</span>
                </span>
              </button>
            </div>
          </div>
        </div>
        {shopOpen ? (
          <div onMouseEnter={() => openMenu("shop")} onMouseLeave={() => closeMenu("shop")}>
            <MegaMenu categories={categories} products={featured} />
          </div>
        ) : null}
      </div>

      <div className="border-t bg-card">
        <div className="container mx-auto hidden items-center gap-3 px-4 py-2.5 lg:flex">
          <div className="relative" onMouseEnter={() => openMenu("cats")} onMouseLeave={() => closeMenu("cats")}>
            <button
              type="button"
              className="inline-flex h-12 min-w-[13.5rem] items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              aria-expanded={catsOpen}
              aria-haspopup="true"
              onClick={() => setCatsOpen((v) => !v)}
            >
              <Icon icon={Menu01Icon} size={18} />
              Shop by categories
            </button>
            <CategoryFlyout categories={categories} open={catsOpen} onClose={() => setCatsOpen(false)} />
          </div>
          <SearchBar variant="full" className="min-w-0 flex-1" />
          <p className="hidden shrink-0 items-center gap-2 text-sm font-medium xl:flex">
            <Icon icon={TruckDeliveryIcon} className="text-primary" />
            Delivery across Siaya
          </p>
        </div>
        <div className="container mx-auto px-4 py-2 lg:hidden">
          <SearchBar variant="compact" />
        </div>
      </div>

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} categories={categories} />
    </header>
  )
}
