"use client"

import Link from "next/link"
import { env } from "@/lib/config/env"
import { Icon } from "@/lib/icons"
import { Call02Icon, Location01Icon, Mail01Icon, WhatsappIcon } from "@hugeicons/core-free-icons"

export function Footer() {
  const openWhatsApp = () => {
    window.open(
      env.getWhatsAppUrl("Hello! I'm interested in your hardware products.\n\nCompany: Grahad Ventures Limited\nLocation: Siaya-Bondo Highway Opp. Siaya Prison"),
      "_blank"
    )
  }

  return (
    <>
      <footer className="border-t border-white/10 bg-black text-white">
        <div className="container mx-auto grid gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src="/logo.png" alt="Grahad Ventures Limited" className="mb-4 h-12 w-auto brightness-0 invert" />
            <p className="text-sm leading-relaxed text-white/70">
              Construction and hardware supplies for professionals, contractors, builders and DIY customers in Siaya.
            </p>
          </div>
          <details className="group border-b border-white/15 pb-3 sm:border-0 sm:pb-0" open>
            <summary className="mb-3 flex cursor-pointer list-none items-center justify-between font-display text-sm font-semibold uppercase tracking-[0.16em] sm:pointer-events-none [&::-webkit-details-marker]:hidden">
              Company
              <span className="text-lg leading-none sm:hidden">+</span>
            </summary>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link href="/services" className="hover:text-primary">Services</Link></li>
            </ul>
          </details>
          <details className="group border-b border-white/15 pb-3 sm:border-0 sm:pb-0" open>
            <summary className="mb-3 flex cursor-pointer list-none items-center justify-between font-display text-sm font-semibold uppercase tracking-[0.16em] sm:pointer-events-none [&::-webkit-details-marker]:hidden">
              Shop
              <span className="text-lg leading-none sm:hidden">+</span>
            </summary>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/shop" className="hover:text-primary">All Products</Link></li>
              <li><Link href="/categories/building" className="hover:text-primary">Building</Link></li>
              <li><Link href="/categories/tools" className="hover:text-primary">Tools</Link></li>
              <li><Link href="/categories/plumbing" className="hover:text-primary">Plumbing</Link></li>
              <li><Link href="/categories/electricity" className="hover:text-primary">Electrical</Link></li>
            </ul>
          </details>
          <div>
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.16em]">Contact</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex gap-2"><Icon icon={Location01Icon} size={16} className="mt-0.5 shrink-0" /> Siaya-Bondo Highway, Opp. Siaya Prison</li>
              <li className="flex gap-2"><Icon icon={Call02Icon} size={16} className="mt-0.5 shrink-0" /> {env.CONTACT_PHONE}</li>
              <li className="flex gap-2"><Icon icon={Mail01Icon} size={16} className="mt-0.5 shrink-0" /> {env.CONTACT_EMAIL}</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={openWhatsApp} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5">
                <Icon icon={WhatsappIcon} size={16} /> WhatsApp
              </button>
              <a href={env.getTelLink()} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/25 px-4 text-sm font-semibold text-white hover:bg-white/10">
                Call us
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="container mx-auto flex flex-col gap-3 px-4 py-4 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Grahad Ventures Limited. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/pages/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/pages/terms" className="hover:text-white">Terms</Link>
              <Link href="/pages/returns" className="hover:text-white">Returns</Link>
              <Link href="/pages/support" className="hover:text-white">Support</Link>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-20 right-4 z-40 lg:hidden">
        <button
          type="button"
          onClick={openWhatsApp}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
          aria-label="Chat on WhatsApp"
        >
          <Icon icon={WhatsappIcon} />
        </button>
      </div>
    </>
  )
}
