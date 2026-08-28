import Link from "next/link"
import { Icon } from "@/lib/icons"
import { ConstructionIcon, DropletIcon, HammerIcon, HardHatIcon, TruckDeliveryIcon, ZapIcon } from "@hugeicons/core-free-icons"
import { SectionHeader } from "@/components/layout/section-header"
import type { IconSvgElement } from "@/lib/icons"

const SERVICES: { icon: IconSvgElement; title: string; href: string }[] = [
  { icon: HardHatIcon, title: "Construction supplies", href: "/categories/building" },
  { icon: HammerIcon, title: "Hardware & tools", href: "/categories/tools" },
  { icon: DropletIcon, title: "Plumbing supplies", href: "/categories/plumbing" },
  { icon: ZapIcon, title: "Electrical supplies", href: "/categories/electricity" },
  { icon: ConstructionIcon, title: "Technical support", href: "/pages/support" },
  { icon: TruckDeliveryIcon, title: "Delivery", href: "/services" },
]

export function HomeServices() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <SectionHeader
          eyebrow="Support"
          title="Services"
          description="Supply, delivery and support around your project — not just a product catalogue."
          href="/services"
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {SERVICES.map(({ icon, title, href }) => (
            <Link
              key={title}
              href={href}
              className="rounded-3xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-md"
            >
              <Icon icon={icon} className="text-primary" />
              <p className="mt-3 text-sm font-semibold leading-snug">{title}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
