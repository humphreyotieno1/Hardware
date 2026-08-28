import Link from "next/link"
import type { Category } from "@/lib/api/types"
import { getCategoryMeta } from "@/lib/catalog/category-meta"
import { Icon } from "@/lib/icons"
import { cn } from "@/lib/utils"

export function CategoryTile({
  category,
  caption,
  className,
}: {
  category: Category
  caption?: string
  className?: string
}) {
  const meta = getCategoryMeta(category.slug)

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        "group flex aspect-square flex-col items-center justify-center rounded-xl bg-muted px-3 py-4 text-center transition duration-300 hover:-translate-y-0.5 hover:bg-muted/70 hover:shadow-sm",
        className
      )}
    >
      <Icon
        icon={meta.icon}
        size={56}
        strokeWidth={1.5}
        className="text-foreground transition-colors group-hover:text-primary"
      />
      <p className="mt-3 line-clamp-2 text-sm font-bold leading-tight text-foreground sm:text-[15px]">
        {category.name}
      </p>
      {caption ? (
        <p className="mt-1 text-[11px] text-muted-foreground">{caption}</p>
      ) : null}
    </Link>
  )
}
