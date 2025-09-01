"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Truck, Wrench, Scissors, Calculator, CalendarIcon, MapPin, Phone, User, Clock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function ServiceRequestForm() {
  const [selectedService, setSelectedService] = useState<string>("")
  const [urgency, setUrgency] = useState<string>("standard")
  const [date, setDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const services = [
    {
      id: "transport",
      title: "Delivery & Transport",
      description: "Fast delivery and bulk transport services",
      icon: Truck,
      pricing: "From KES 300",
      features: ["Same-day available", "Bulk orders", "Secure packaging"],
    },
    {
      id: "installation",
      title: "Installation Services",
      description: "Professional installation by certified technicians",
      icon: Wrench,
      pricing: "From KES 2,000",
      features: ["Licensed technicians", "Quality guarantee", "Follow-up support"],
    },
    {
      id: "cutting",
      title: "Cutting & Sizing",
      description: "Custom cutting and sizing for materials",
      icon: Scissors,
      pricing: "From KES 200",
      features: ["Precision cutting", "Multiple materials", "Custom dimensions"],
    },
    {
      id: "consultation",
      title: "Project Consultation",
      description: "Expert advice and project planning",
      icon: Calculator,
      pricing: "Free",
      features: ["Material estimation", "Cost analysis", "Technical guidance"],
    },
  ]

  const urgencyOptions = [
    { id: "standard", label: "Standard (3-5 days)", price: "Standard pricing" },
    { id: "priority", label: "Priority (1-2 days)", price: "+50% surcharge" },
    { id: "emergency", label: "Emergency (Same day)", price: "+100% surcharge" },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Show success message or redirect
    alert("Service request submitted successfully! We'll contact you within 24 hours.")
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Service Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Service Type</CardTitle>
          <CardDescription>Choose the service you need assistance with</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedService} onValueChange={setSelectedService} className="space-y-4">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <div key={service.id}>
                  <RadioGroupItem value={service.id} id={service.id} className="sr-only" />
                  <Label htmlFor={service.id} className="cursor-pointer">
                    <Card
                      className={cn(
                        "transition-all hover:shadow-md",
                        selectedService === service.id && "ring-2 ring-primary",
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{service.title}</h3>
                              <Badge variant="secondary">{service.pricing}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {service.features.map((feature, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Service Details */}
      {selectedService && (
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription>Provide specific information about your service needs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description">Service Description *</Label>
              <Textarea
                id="description"
                placeholder="Please describe what you need help with in detail..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Service Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="location" placeholder="Enter full address" className="pl-10" required />
                </div>
              </div>

              <div>
                <Label>Preferred Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label>Service Urgency</Label>
              <RadioGroup value={urgency} onValueChange={setUrgency} className="mt-2">
                {urgencyOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{option.label}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{option.price}</span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Information */}
      {selectedService && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How can we reach you to confirm the service?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="fullName" placeholder="Your full name" className="pl-10" required />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" type="tel" placeholder="+254 700 123 456" className="pl-10" required />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="your.email@example.com" />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea id="notes" placeholder="Any special requirements or additional information..." rows={3} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      {selectedService && (
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Service Request"}
          </Button>
        </div>
      )}
    </form>
  )
}
