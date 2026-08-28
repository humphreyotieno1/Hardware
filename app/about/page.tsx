import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { WhyGrahad } from "@/components/catalog/why-grahad"
import { PartnersSection } from "@/components/catalog/partners-section"
import { BulkOrders } from "@/components/catalog/bulk-orders"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Us | Grahad Ventures Limited",
  description: "Grahad Ventures Limited supplies construction and hardware products from Siaya-Bondo Highway, opposite Siaya Prison.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-secondary py-14 text-secondary-foreground">
          <div className="container mx-auto px-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary-foreground/80">About us</p>
            <h1 className="mt-2 max-w-2xl font-display text-4xl font-semibold">Where vision becomes a reality</h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-secondary-foreground/80">
              Grahad Ventures Limited is a construction and hardware supplies company serving professionals, contractors, builders, technicians and DIY customers from Siaya, Kenya.
            </p>
          </div>
        </section>
        <section className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold">The store</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Visit us on Siaya-Bondo Highway, opposite Siaya Prison. We stock building materials, tools, plumbing, electrical and hardware supplies, and we support bulk orders for projects.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/shop" className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
                Shop products
              </Link>
              <Link href="/contact" className="inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold">
                Contact the store
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border bg-card p-6 text-sm">
            <p className="font-semibold">Location</p>
            <p className="mt-1 text-muted-foreground">Siaya-Bondo Highway, Opp. Siaya Prison</p>
            <p className="mt-4 font-semibold">Hours</p>
            <p className="mt-1 text-muted-foreground">Monday–Saturday: 7:00 AM – 6:00 PM</p>
            <p className="text-muted-foreground">Sunday: Closed</p>
          </div>
        </section>
        <WhyGrahad />
        <PartnersSection />
        <BulkOrders />
      </main>
      <Footer />
    </div>
  )
}
