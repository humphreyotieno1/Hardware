"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Address } from "@/lib/api/types"

interface AddressFormProps {
  address: Address | null
  onAddressChange: (address: Address) => void
  onNext: () => void
}

export function AddressForm({ address, onAddressChange, onNext }: AddressFormProps) {
  const [formData, setFormData] = useState({
    name: address?.name || "",
    phone: address?.phone || "",
    line: address?.street || address?.line || "",
    city: address?.city || "Siaya",
    state: address?.state || "",
    country: address?.country || "Kenya",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.phone.trim() || !formData.city.trim()) return
    onAddressChange({
      label: "Delivery",
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      line: formData.line.trim() || formData.city.trim(),
      street: formData.line.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      country: formData.country.trim() || "Kenya",
    })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-semibold">Delivery details</h2>
        <p className="mt-1 text-sm text-muted-foreground">No account needed. We will use this to confirm your order.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone / WhatsApp</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="07xx xxx xxx"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="line">Delivery location</Label>
        <Input
          id="line"
          value={formData.line}
          onChange={(e) => setFormData({ ...formData, line: e.target.value })}
          placeholder="Estate, landmark or site name"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="city">Town / area</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Siaya"
            required
          />
        </div>
        <div>
          <Label htmlFor="state">County (optional)</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            placeholder="Siaya"
          />
        </div>
      </div>
      <Button type="submit" className="h-12 w-full">
        Continue
      </Button>
    </form>
  )
}
