"use client"

import Link from "next/link"
import { SectionHeader } from "@/components/layout/section-header"

const partners = [
  { name: "Bamburi Cement", logo: "/images/partners/bamburi.jpeg", url: "https://www.facebook.com/BamburiCementPLC/" },
  { name: "Muthokinju", logo: "/images/partners/muthokinju.jpeg", url: "https://www.muthokinju.co.ke/" },
  { name: "Crown Paints", logo: "/images/partners/crownpaints.jpeg", url: "https://www.crownpaints.co.ke/" },
  { name: "CCL Kisumu", logo: "/images/partners/cclkisumu.jpg", url: "https://www.instagram.com/ccl.ltd/" },
  { name: "Coolbase", logo: "/images/partners/coolbase.jpg", url: "https://www.facebook.com/Coolbasehardware/" },
]

export function PartnersSection() {
  return (
    <section className="py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <SectionHeader eyebrow="Supply chain" title="Trusted brands & partners" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {partners.map((partner) => (
            <Link
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-3xl border bg-card px-3 py-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              aria-label={`Visit ${partner.name}`}
            >
              <img src={partner.logo} alt="" className="h-10 w-auto max-w-[120px] object-contain" />
              <span className="text-center text-xs font-medium">{partner.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
