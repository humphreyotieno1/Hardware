import { Icon } from "@/lib/icons"
import { CustomerService01Icon, HandshakeIcon, Package01Icon, TruckDeliveryIcon } from "@hugeicons/core-free-icons"

const ITEMS = [
  { icon: Package01Icon, title: "Quality products", text: "Stocked for site and workshop use" },
  { icon: TruckDeliveryIcon, title: "Reliable delivery", text: "Siaya and surrounding areas" },
  { icon: CustomerService01Icon, title: "Technical support", text: "Help choosing the right supplies" },
  { icon: HandshakeIcon, title: "Bulk orders", text: "Competitive pricing for projects" },
]

export function TrustStrip() {
  return (
    <section className="border-b bg-card">
      <div className="container mx-auto grid grid-cols-2 sm:grid-cols-4">
        {ITEMS.map(({ icon, title, text }, i) => (
          <div key={title} className={`flex gap-3 px-4 py-5 sm:px-5 ${i > 0 ? "border-l border-border" : ""}`}>
            <Icon icon={icon} className="mt-0.5 text-primary" />
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
