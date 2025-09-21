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
    <div className="space-y-16 py-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">Our Services</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Professional services to support your construction and hardware needs. 
            From delivery to installation, we've got you covered.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild size="lg" className="px-8 py-3">
            <Link href="/services/request">Request Service</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 py-3">
            <Link href="/services/track">Track Service</Link>
          </Button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-muted/30 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We deliver exceptional service with guaranteed quality and professional expertise
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div key={index} className="text-center space-y-4">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Services Grid */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our comprehensive range of professional services
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card key={index} className="relative group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                {service.badge && (
                  <Badge className="absolute -top-2 -right-2 z-10" variant="secondary">
                    {service.badge}
                  </Badge>
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                      <CardDescription className="text-base">{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3 text-sm">
                        <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-xl font-bold text-primary">{service.pricing}</div>
                    <Button asChild className="px-6">
                      <Link href="/services/request">Request Quote</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-2xl p-12">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative text-center space-y-6">
          <h2 className="text-4xl font-bold">Need a Custom Service?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Contact our team for specialized services tailored to your project requirements. 
            We're here to help bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              Contact Us
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <Link href="/services/request">Get Free Quote</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
