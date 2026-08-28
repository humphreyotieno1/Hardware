import Link from "next/link"
import { Button } from "@/components/ui/button"

export function PromoBanner() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto grid gap-4 px-4 lg:grid-cols-2">
        <div className="relative min-h-72 overflow-hidden rounded-3xl bg-secondary text-secondary-foreground">
          <div className="absolute inset-0 bg-cover bg-center opacity-45" style={{ backgroundImage: "url(/images/hero/crown.jpg)" }} />
          <div className="relative flex h-full max-w-md flex-col justify-end p-8 sm:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary-foreground/80">For the next project</p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Everything you need to get the job done</h2>
            <Button asChild className="mt-6 w-fit bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link href="/categories/building">Shop building supplies</Link>
            </Button>
          </div>
        </div>
        <div className="relative min-h-72 overflow-hidden rounded-3xl bg-secondary text-secondary-foreground">
          <div className="absolute inset-0 bg-cover bg-center opacity-45" style={{ backgroundImage: "url(/images/categories/plumbing.jpg)" }} />
          <div className="relative flex h-full max-w-md flex-col justify-end p-8 sm:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary-foreground/80">Plumbing & electrical</p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Fittings, cables and site essentials</h2>
            <Button asChild className="mt-6 w-fit bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link href="/categories/plumbing">Shop plumbing</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
