import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Truck, Wrench, Scissors, Calculator, Clock, Shield } from "lucide-react"
import Link from "next/link"

export function ServicesContent() {
  const services = [
    {
      icon: Truck,
      title: "Delivery & Transport",
      description: "Fast and reliable delivery service across Kenya",
      features: [
        "Same-day delivery available",
        "Free delivery over KES 5,000",
        "Bulk order transport",
        "Secure packaging",
      ],
      pricing: "From KES 300",
      badge: "Most Popular",
    },
    {
      icon: Wrench,
      title: "Installation Services",
      description: "Professional installation by certified technicians",
      features: ["Plumbing installation", "Electrical work", "Construction assembly", "Equipment setup"],
      pricing: "From KES 2,000",
      badge: "Professional",
    },
    {
      icon: Scissors,
      title: "Cutting & Sizing",
      description: "Custom cutting and sizing for your materials",
      features: ["Metal cutting", "Wood cutting", "Pipe cutting", "Custom dimensions"],
      pricing: "From KES 200",
      badge: "Custom",
    },
    {
      icon: Calculator,
      title: "Project Consultation",
      description: "Expert advice for your construction projects",
      features: ["Material estimation", "Project planning", "Cost analysis", "Technical guidance"],
      pricing: "Free",
      badge: "Expert",
    },
  ]

  const benefits = [
    {
      icon: Clock,
      title: "Quick Turnaround",
      description: "Most services completed within 24-48 hours",
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "All work backed by our satisfaction guarantee",
    },
    {
      icon: Wrench,
      title: "Certified Professionals",
      description: "Licensed and experienced technicians",
    },
  ]

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Our Services</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Professional services to support your construction and hardware needs
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button asChild size="lg">
            <Link href="/services/request">Request Service</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/services/track">Track Service</Link>
          </Button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, index) => {
          const Icon = service.icon
          return (
            <Card key={index} className="relative">
              {service.badge && (
                <Badge className="absolute top-4 right-4" variant="secondary">
                  {service.badge}
                </Badge>
              )}
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-4">
                  <div className="text-lg font-bold text-primary">{service.pricing}</div>
                  <Button asChild>
                    <Link href="/services/request">Request Quote</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-6 bg-primary text-primary-foreground rounded-lg p-8">
        <h2 className="text-3xl font-bold">Need a Custom Service?</h2>
        <p className="text-xl opacity-90">
          Contact our team for specialized services tailored to your project requirements
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary">
            Contact Us
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            asChild
          >
            <Link href="/services/request">Get Free Quote</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
