import Link from "next/link"

export function BulkOrders() {
  return (
    <section className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto flex flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:py-14">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary-foreground/80">Contractors & projects</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">Buying in bulk?</h2>
          <p className="mt-2 text-sm text-secondary-foreground/80">
            Get competitive pricing for contractors, businesses, projects and large orders. Tell us what you need and we will help with availability and delivery.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-primary-foreground px-6 text-sm font-semibold text-primary transition hover:-translate-y-0.5"
        >
          Request a bulk quote
        </Link>
      </div>
    </section>
  )
}
