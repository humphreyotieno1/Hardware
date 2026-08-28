import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icon } from "@/lib/icons"
import { ArrowLeft01Icon, Home01Icon, Search01Icon } from "@hugeicons/core-free-icons"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-lg text-center">
        <p className="font-display text-7xl font-semibold text-muted-foreground/40">404</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-muted-foreground">
          This page may have been moved, deleted, or never existed.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="outline" size="lg">
            <Link href="/shop">
              <Icon icon={Search01Icon} /> Search products
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/">
              <Icon icon={Home01Icon} /> Back to home
            </Link>
          </Button>
        </div>
        <Button asChild variant="ghost" className="mt-4">
          <Link href="/categories">
            <Icon icon={ArrowLeft01Icon} size={16} /> Browse categories
          </Link>
        </Button>
      </div>
    </div>
  )
}
