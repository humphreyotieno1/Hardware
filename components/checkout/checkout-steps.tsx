"use client"

import { Check } from "lucide-react"

interface CheckoutStepsProps {
  currentStep: number
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const steps = [
    { id: 1, title: "Address", description: "Shipping Information" },
    { id: 2, title: "Services", description: "Additional Services" },
    { id: 3, title: "Payment", description: "Payment Method" },
    { id: 4, title: "Review", description: "Order Review" }
  ]

  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            currentStep >= step.id 
              ? "bg-primary border-primary text-primary-foreground" 
              : "border-muted-foreground text-muted-foreground"
          }`}>
            {currentStep > step.id ? (
              <Check className="h-5 w-5" />
            ) : (
              <span className="text-sm font-medium">{step.id}</span>
            )}
          </div>
          <div className="ml-3">
            <div className={`text-sm font-medium ${
              currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
            }`}>
              {step.title}
            </div>
            <div className="text-xs text-muted-foreground">{step.description}</div>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-4 ${
              currentStep > step.id ? "bg-primary" : "bg-muted-foreground"
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}
