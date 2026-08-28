"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { env } from "@/lib/config/env"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = "Newsletter signup"
    const body = `Please add this email to Grahad Ventures updates: ${email}`
    window.location.href = `mailto:${env.CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <section className="border-t bg-card py-10 sm:py-12">
      <div className="container mx-auto flex flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold">Product & offer updates</h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Send us your email and we will keep you posted on stock and store updates.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="h-11 rounded-full"
          />
          <Button type="submit" className="h-11">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  )
}
