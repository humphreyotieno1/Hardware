"use client"

import { useEffect, useState } from "react"
import { env } from "@/lib/config/env"
import { Icon } from "@/lib/icons"
import { ArrowUp01Icon, WhatsappIcon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 360)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col items-center gap-3 lg:bottom-6">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "flex size-11 items-center justify-center rounded-full border bg-card text-foreground shadow-md transition hover:-translate-y-0.5",
          showTop ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-label="Back to top"
      >
        <Icon icon={ArrowUp01Icon} size={18} />
      </button>
      <a
        href={env.getWhatsAppUrl("Hello Grahad Ventures, I need help with a hardware order.")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
        aria-label="Chat on WhatsApp"
      >
        <Icon icon={WhatsappIcon} />
      </a>
    </div>
  )
}
