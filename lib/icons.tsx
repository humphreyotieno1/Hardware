"use client"

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { cn } from "@/lib/utils"

type IconProps = {
  icon: IconSvgElement
  className?: string
  size?: number
  strokeWidth?: number
}

export function Icon({ icon, className, size = 20, strokeWidth = 1.5 }: IconProps) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      color="currentColor"
      strokeWidth={strokeWidth}
      className={cn("shrink-0", className)}
    />
  )
}

export type { IconSvgElement }
