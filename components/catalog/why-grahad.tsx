import { Tick02Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/lib/icons"

const POINTS = [
  "Quality products for site and workshop",
  "Reliable supply from a local Siaya store",
  "Competitive pricing, including bulk orders",
  "Technical support when choosing supplies",
  "Delivery support for project orders",
  "Direct contact by phone or WhatsApp",
]

export function WhyGrahad() {
  return (
    <section className="bg-card py-10 sm:py-14">
      <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Why Grahad</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">Built for buyers who need stock, not slogans</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Grahad Ventures Limited supplies construction and hardware products to professionals, contractors, technicians and DIY customers from Siaya-Bondo Highway, opposite Siaya Prison.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {POINTS.map((point) => (
            <li key={point} className="flex gap-2 text-sm">
              <Icon icon={Tick02Icon} size={16} className="mt-0.5 shrink-0 text-primary" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
