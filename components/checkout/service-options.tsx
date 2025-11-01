"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { ServiceRequest } from "@/lib/api/types"

interface ServiceOptionsProps {
  serviceRequest: ServiceRequest | null
  onServiceRequestChange: (serviceRequest: ServiceRequest | null) => void
  onNext: () => void
  onBack: () => void
}

export function ServiceOptions({ serviceRequest, onServiceRequestChange, onNext, onBack }: ServiceOptionsProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>(
    serviceRequest?.services || []
  )
  const [description, setDescription] = useState(serviceRequest?.description || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedServices.length > 0) {
      onServiceRequestChange({
        services: selectedServices,
        description,
        urgency: "normal"
      })
    }
    onNext()
  }

  const serviceOptions = [
    { id: "installation", name: "Installation Service", price: 1500, description: "Professional installation of purchased items" },
    { id: "delivery", name: "Express Delivery", price: 800, description: "Same-day or next-day delivery" },
    { id: "consultation", name: "Technical Consultation", price: 500, description: "Expert advice on your project" },
    { id: "maintenance", name: "Maintenance Service", price: 1200, description: "Regular maintenance and repairs" }
  ]

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Services</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {serviceOptions.map((service) => (
              <div key={service.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id={service.id}
                  checked={selectedServices.includes(service.id)}
                  onCheckedChange={() => toggleService(service.id)}
                />
                <div className="flex-1">
                  <Label htmlFor={service.id} className="text-base font-medium cursor-pointer">
                    {service.name}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                  <p className="text-sm font-medium text-primary mt-2">KES {service.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {selectedServices.length > 0 && (
            <div>
              <Label htmlFor="description">Additional Requirements</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe any specific requirements or preferences..."
                className="w-full mt-2 p-3 border rounded-md resize-none h-24"
              />
            </div>
          )}

          <div className="flex space-x-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Continue to Payment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
