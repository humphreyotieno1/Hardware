"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { adminApi, ServiceRequest, UpdateServiceStatusRequest, CreateServiceQuoteRequest } from "@/lib/api/admin"
import { Wrench, Clock, CheckCircle, XCircle, MessageSquare, Calendar, DollarSign, RefreshCw, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/lib/api"

export function ServicesManagement() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
  const [statusData, setStatusData] = useState({ status: "" })
  const [quoteData, setQuoteData] = useState({ amount: 0, assigned_to: "", scheduled_date: "", notes: "" })
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const fetchServiceRequests = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getServiceRequests({
        status: statusFilter || undefined,
        type: typeFilter || undefined,
      })
      setServiceRequests(data.requests)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch service requests",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServiceRequests()
  }, [statusFilter, typeFilter])

  const handleUpdateStatus = async () => {
    if (!selectedRequest || !statusData.status) {
      toast({
        title: "Error",
        description: "Please select a status",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      await adminApi.updateServiceStatus(selectedRequest.ID, statusData as UpdateServiceStatusRequest)
      toast({
        title: "Success",
        description: "Service status updated successfully",
      })
      setIsStatusDialogOpen(false)
      setSelectedRequest(null)
      setStatusData({ status: "" })
      fetchServiceRequests()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service status",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateQuote = async () => {
    if (!selectedRequest || !quoteData.amount || !quoteData.assigned_to || !quoteData.scheduled_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      await adminApi.createServiceQuote(selectedRequest.ID, quoteData as CreateServiceQuoteRequest)
      toast({
        title: "Success",
        description: "Service quote created successfully",
      })
      setIsQuoteDialogOpen(false)
      setSelectedRequest(null)
      setQuoteData({ amount: 0, assigned_to: "", scheduled_date: "", notes: "" })
      fetchServiceRequests()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create service quote",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const openStatusDialog = (request: ServiceRequest) => {
    setSelectedRequest(request)
    setStatusData({ status: request.status })
    setIsStatusDialogOpen(true)
  }

  const openQuoteDialog = (request: ServiceRequest) => {
    setSelectedRequest(request)
    setQuoteData({ amount: 0, assigned_to: "", scheduled_date: "", notes: "" })
    setIsQuoteDialogOpen(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "requested":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "quoted":
        return <DollarSign className="h-4 w-4 text-yellow-600" />
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "scheduled":
        return <Calendar className="h-4 w-4 text-purple-600" />
      case "in_progress":
        return <Wrench className="h-4 w-4 text-orange-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "billed":
        return <DollarSign className="h-4 w-4 text-green-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "requested":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Requested</Badge>
      case "quoted":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Quoted</Badge>
      case "accepted":
        return <Badge variant="default" className="bg-green-100 text-green-800">Accepted</Badge>
      case "scheduled":
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Scheduled</Badge>
      case "in_progress":
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">In Progress</Badge>
      case "completed":
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
      case "billed":
        return <Badge variant="default" className="bg-green-100 text-green-800">Billed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredRequests = serviceRequests.filter(request =>
    request.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const statusOptions = [
    { value: "requested", label: "Requested" },
    { value: "quoted", label: "Quoted" },
    { value: "accepted", label: "Accepted" },
    { value: "scheduled", label: "Scheduled" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "billed", label: "Billed" },
    { value: "cancelled", label: "Cancelled" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Services Management</h2>
          <p className="text-muted-foreground">Manage service requests and quotes</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={fetchServiceRequests} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="installation">Installation</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Service Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wrench className="h-5 w-5" />
            <span>Service Requests ({filteredRequests.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading service requests...</span>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No service requests found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter || typeFilter ? "No requests match your filters." : "No service requests have been submitted yet."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.ID}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.user.full_name}</div>
                        <div className="text-sm text-muted-foreground">{request.user.email}</div>
                        <div className="text-sm text-muted-foreground">{request.user.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{request.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        {getStatusBadge(request.status)}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm truncate">{request.description}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openStatusDialog(request)}
                        >
                          Update Status
                        </Button>
                        {request.status === "requested" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openQuoteDialog(request)}
                          >
                            Create Quote
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Service Status</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium">{selectedRequest.type} Service</h4>
                <p className="text-sm text-muted-foreground">Customer: {selectedRequest.user.full_name}</p>
                <p className="text-sm text-muted-foreground">Current Status: {selectedRequest.status}</p>
              </div>

              <div>
                <Label htmlFor="status">New Status</Label>
                <Select value={statusData.status} onValueChange={(value) => setStatusData({ status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateStatus} disabled={submitting}>
                  {submitting ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Quote Dialog */}
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Service Quote</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium">{selectedRequest.type} Service</h4>
                <p className="text-sm text-muted-foreground">Customer: {selectedRequest.user.full_name}</p>
                <p className="text-sm text-muted-foreground">Description: {selectedRequest.description}</p>
              </div>

              <div>
                <Label htmlFor="amount">Quote Amount (KES)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={quoteData.amount}
                  onChange={(e) => setQuoteData({ ...quoteData, amount: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="assigned_to">Assigned To</Label>
                <Input
                  id="assigned_to"
                  value={quoteData.assigned_to}
                  onChange={(e) => setQuoteData({ ...quoteData, assigned_to: e.target.value })}
                  placeholder="technician@example.com"
                />
              </div>

              <div>
                <Label htmlFor="scheduled_date">Scheduled Date</Label>
                <Input
                  id="scheduled_date"
                  type="date"
                  value={quoteData.scheduled_date}
                  onChange={(e) => setQuoteData({ ...quoteData, scheduled_date: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={quoteData.notes}
                  onChange={(e) => setQuoteData({ ...quoteData, notes: e.target.value })}
                  placeholder="Additional notes about the service..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsQuoteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateQuote} disabled={submitting}>
                  {submitting ? "Creating..." : "Create Quote"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
