import Link from "next/link"
import { Icon } from "@/lib/icons"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  href?: string
  linkLabel?: string
  className?: string
  align?: "start" | "center"
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
  className,
  align = "start",
}: SectionHeaderProps) {
  if (align === "center") {
    return (
      <div className={cn("mx-auto mb-8 max-w-2xl text-center sm:mb-10", className)}>
        {eyebrow ? (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-display text-3xl font-semibold uppercase tracking-[0.12em] text-foreground sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}
        {href ? (
          <Link
            href={href}
            className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-foreground hover:text-primary"
          >
            {linkLabel}
            <Icon icon={ArrowRight01Icon} size={16} />
          </Link>
        ) : null}
      </div>
    )
  }

  return (
    <div className={cn("mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="flex min-h-11 items-center gap-1 rounded-full text-sm font-semibold text-foreground hover:text-primary"
        >
          {linkLabel}
          <Icon icon={ArrowRight01Icon} size={16} />
        </Link>
      ) : null}
    </div>
  )
}
