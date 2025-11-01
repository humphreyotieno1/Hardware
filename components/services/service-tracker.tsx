"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, MapPin, User, Phone, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react"
import { servicesApi } from "@/lib/api"
import type { ServiceRequestResponse } from "@/lib/api/types"
import { useToast } from "@/hooks/use-toast"

export function ServiceTracker() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [trackingId, setTrackingId] = useState("")
  const [serviceData, setServiceData] = useState<ServiceRequestResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load service request from URL parameter if present
  useEffect(() => {
    const id = searchParams.get("id")
    if (id) {
      setTrackingId(id)
      handleTrackById(id)
    }
  }, [searchParams])

  const handleTrackById = async (id: string) => {
    if (!id.trim()) return

    setIsLoading(true)
    try {
      const data = await servicesApi.getServiceRequestDetails(id)
      setServiceData(data)
    } catch (error: any) {
      console.error("Error fetching service request:", error)
      setServiceData(null)
      toast({
        title: "Service Not Found",
        description: error?.message || "Service request not found. Please check your tracking ID.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTrack = async () => {
    if (!trackingId.trim()) {
      toast({
        title: "Tracking ID Required",
        description: "Please enter a service request ID to track.",
        variant: "destructive"
      })
      return
    }
    await handleTrackById(trackingId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "billed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "scheduled":
      case "accepted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "quoted":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusLabel = (status: string) => {
    return status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
  }

  const buildTimeline = (service: ServiceRequestResponse) => {
    const timeline = []
    
    timeline.push({
      status: "requested",
      title: "Service Requested",
      description: "Your service request has been received",
      timestamp: service.created_at ? new Date(service.created_at).toLocaleString() : "N/A",
      completed: true,
      current: service.status === "requested",
    })

    if (["quoted", "accepted", "scheduled", "in_progress", "completed", "billed"].includes(service.status)) {
      timeline.push({
        status: "quoted",
        title: "Quote Provided",
        description: service.quote_amount 
          ? `Quote amount: KES ${service.quote_amount.toLocaleString()}`
          : "A quote has been provided for your service",
        timestamp: service.updated_at ? new Date(service.updated_at).toLocaleString() : "N/A",
        completed: !["requested"].includes(service.status),
        current: service.status === "quoted",
      })
    }

    if (["accepted", "scheduled", "in_progress", "completed", "billed"].includes(service.status)) {
      timeline.push({
        status: "accepted",
        title: "Quote Accepted",
        description: "You have accepted the service quote",
        timestamp: service.updated_at ? new Date(service.updated_at).toLocaleString() : "N/A",
        completed: !["requested", "quoted"].includes(service.status),
        current: service.status === "accepted",
      })
    }

    if (["scheduled", "in_progress", "completed", "billed"].includes(service.status)) {
      timeline.push({
        status: "scheduled",
        title: "Service Scheduled",
        description: service.scheduled_date 
          ? `Scheduled for ${new Date(service.scheduled_date).toLocaleDateString()}`
          : "Your service has been scheduled",
        timestamp: service.scheduled_date ? new Date(service.scheduled_date).toLocaleString() : "N/A",
        completed: !["requested", "quoted", "accepted"].includes(service.status),
        current: service.status === "scheduled",
      })
    }

    if (["in_progress", "completed", "billed"].includes(service.status)) {
      timeline.push({
        status: "in_progress",
        title: "Service In Progress",
        description: service.assigned_user 
          ? `Technician ${service.assigned_user.full_name} is working on your service`
          : "Service is currently in progress",
        timestamp: service.updated_at ? new Date(service.updated_at).toLocaleString() : "N/A",
        completed: ["completed", "billed"].includes(service.status),
        current: service.status === "in_progress",
      })
    }

    if (["completed", "billed"].includes(service.status)) {
      timeline.push({
        status: "completed",
        title: "Service Completed",
        description: "Service has been completed and quality checked",
        timestamp: service.updated_at ? new Date(service.updated_at).toLocaleString() : "N/A",
        completed: true,
        current: service.status === "completed",
      })
    }

    if (service.status === "billed") {
      timeline.push({
        status: "billed",
        title: "Billed",
        description: "Service has been completed and billed",
        timestamp: service.updated_at ? new Date(service.updated_at).toLocaleString() : "N/A",
        completed: true,
        current: true,
      })
    }

    if (service.status === "cancelled") {
      timeline.push({
        status: "cancelled",
        title: "Cancelled",
        description: "This service request has been cancelled",
        timestamp: service.updated_at ? new Date(service.updated_at).toLocaleString() : "N/A",
        completed: true,
        current: true,
      })
    }

    return timeline
  }

  const getStatusIcon = (status: string, completed: boolean, current: boolean) => {
    if (status === "cancelled") return <AlertCircle className="h-5 w-5 text-red-600" />
    if (completed) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (current) return <Clock className="h-5 w-5 text-blue-600" />
    return <AlertCircle className="h-5 w-5 text-gray-400" />
  }

  const timeline = serviceData ? buildTimeline(serviceData) : []

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
          <CardDescription>Enter your service request ID (UUID format)</CardDescription>
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
                  onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleTrack} disabled={isLoading || !trackingId.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Tracking...
                </>
              ) : (
                "Track Service"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Service Details */}
      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading service details...</p>
          </CardContent>
        </Card>
      )}

      {serviceData && !isLoading && (
        <div className="space-y-6">
          {/* Service Overview */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 mb-2">
                    {serviceData.type.charAt(0).toUpperCase() + serviceData.type.slice(1)} Service
                    <Badge className={getStatusColor(serviceData.status)}>
                      {getStatusLabel(serviceData.status)}
                    </Badge>
                  </CardTitle>
                  <CardDescription>Service ID: {serviceData.ID}</CardDescription>
                </div>
                {serviceData.quote_amount && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">KES {serviceData.quote_amount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Quote Amount</div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {serviceData.instructions && (
                <p className="text-muted-foreground mb-4">{serviceData.instructions}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {serviceData.scheduled_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Scheduled Date</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(serviceData.scheduled_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">{serviceData.location}</div>
                  </div>
                </div>
                {serviceData.assigned_user && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Assigned Technician</div>
                      <div className="text-sm text-muted-foreground">
                        {serviceData.assigned_user.full_name}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Progress Timeline */}
          {timeline.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Service Progress</CardTitle>
                <CardDescription>Track the status of your service request</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeline.map((step: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        {getStatusIcon(step.status, step.completed, step.current)}
                        {index < timeline.length - 1 && (
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
              </CardContent>
            </Card>
          )}

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
                      {serviceData.user?.full_name || "N/A"}
                    </div>
                    {serviceData.user?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {serviceData.user.phone}
                      </div>
                    )}
                  </div>
                </div>
                {serviceData.assigned_user && (
                  <div>
                    <h4 className="font-medium mb-2">Assigned Technician</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {serviceData.assigned_user.full_name}
                      </div>
                      {serviceData.assigned_user.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {serviceData.assigned_user.phone}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
