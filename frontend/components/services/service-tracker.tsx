"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, MapPin, User, Phone, CheckCircle, Clock, AlertCircle } from "lucide-react"

export function ServiceTracker() {
  const [trackingId, setTrackingId] = useState("")
  const [serviceData, setServiceData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock service data
  const mockServiceData = {
    id: "SRV-2024-001",
    type: "installation",
    status: "in_progress",
    title: "Kitchen Cabinet Installation",
    description: "Professional installation of kitchen cabinets and hardware",
    customer: {
      name: "John Doe",
      phone: "+254 700 123 456",
      email: "john@example.com",
    },
    location: "123 Main Street, Nairobi",
    scheduledDate: "2024-01-20",
    technician: {
      name: "Mike Johnson",
      phone: "+254 700 987 654",
      rating: 4.8,
    },
    timeline: [
      {
        status: "requested",
        title: "Service Requested",
        description: "Your service request has been received",
        timestamp: "2024-01-15 10:30 AM",
        completed: true,
      },
      {
        status: "confirmed",
        title: "Request Confirmed",
        description: "Service confirmed and technician assigned",
        timestamp: "2024-01-15 02:15 PM",
        completed: true,
      },
      {
        status: "scheduled",
        title: "Service Scheduled",
        description: "Appointment scheduled for January 20th",
        timestamp: "2024-01-16 09:00 AM",
        completed: true,
      },
      {
        status: "in_progress",
        title: "Service In Progress",
        description: "Technician is currently working on your service",
        timestamp: "2024-01-20 08:30 AM",
        completed: false,
        current: true,
      },
      {
        status: "completed",
        title: "Service Completed",
        description: "Service completed and quality checked",
        timestamp: "",
        completed: false,
      },
    ],
    estimatedCompletion: "2024-01-20 05:00 PM",
    totalCost: 3500,
  }

  const handleTrack = async () => {
    if (!trackingId.trim()) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (trackingId.toUpperCase() === "SRV-2024-001") {
      setServiceData(mockServiceData)
    } else {
      setServiceData(null)
      alert("Service request not found. Please check your tracking ID.")
    }
    setIsLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string, completed: boolean, current: boolean) => {
    if (completed) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (current) return <Clock className="h-5 w-5 text-blue-600" />
    return <AlertCircle className="h-5 w-5 text-gray-400" />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Track Your Service</h1>
        <p className="text-muted-foreground">Enter your service request ID to track progress</p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Service Tracking</CardTitle>
          <CardDescription>Enter your service request ID (e.g., SRV-2024-001)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="trackingId" className="sr-only">
                Tracking ID
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="trackingId"
                  placeholder="Enter service request ID..."
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleTrack} disabled={isLoading || !trackingId.trim()}>
              {isLoading ? "Tracking..." : "Track Service"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Service Details */}
      {serviceData && (
        <div className="space-y-6">
          {/* Service Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {serviceData.title}
                    <Badge className={getStatusColor(serviceData.status)}>{serviceData.status.replace("_", " ")}</Badge>
                  </CardTitle>
                  <CardDescription>Service ID: {serviceData.id}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">KSh {serviceData.totalCost.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Cost</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{serviceData.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Scheduled Date</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(serviceData.scheduledDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">{serviceData.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Technician</div>
                    <div className="text-sm text-muted-foreground">
                      {serviceData.technician.name} ⭐ {serviceData.technician.rating}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Service Progress</CardTitle>
              <CardDescription>Track the status of your service request</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceData.timeline.map((step: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {getStatusIcon(step.status, step.completed, step.current)}
                      {index < serviceData.timeline.length - 1 && (
                        <div className={`w-px h-8 mt-2 ${step.completed ? "bg-green-200" : "bg-gray-200"}`} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`font-medium ${step.current ? "text-blue-600" : step.completed ? "text-green-600" : "text-gray-500"}`}
                        >
                          {step.title}
                        </h4>
                        {step.timestamp && <span className="text-sm text-muted-foreground">{step.timestamp}</span>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {serviceData.status === "in_progress" && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Estimated Completion</span>
                  </div>
                  <p className="text-blue-700 mt-1">{new Date(serviceData.estimatedCompletion).toLocaleString()}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Your Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {serviceData.customer.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {serviceData.customer.phone}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Technician</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {serviceData.technician.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {serviceData.technician.phone}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
