import type { Metadata } from "next"
import { ServiceTracker } from "@/components/services/service-tracker"

export const metadata: Metadata = {
  title: "Track Service | Hardware Store",
  description: "Track your service request status and updates",
}

export default function ServiceTrackPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ServiceTracker />
    </div>
  )
}
