"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Mail,
  Phone,
  MapPin,
  Star,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserPlus,
  Building,
  Shield,
  Crown
} from "lucide-react"
import { Customer, customerService, adminUtils } from "@/lib/admin/crud-service"

interface CustomerManagementProps {
  onCustomerUpdate?: () => void
}

export function CustomerManagement({ onCustomerUpdate }: CustomerManagementProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Form states
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  
  // Search and filters
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  
  // Selection and bulk operations
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [pageSize] = useState(20)
  
  // Export
  const [exporting, setExporting] = useState(false)

  // Load customers
  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await customerService.getAll({
        page: currentPage,
        limit: pageSize,
        search: searchQuery || undefined,
        filters: {
          type: typeFilter !== 'all' ? typeFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          location: locationFilter !== 'all' ? locationFilter : undefined,
        },
        sort: { field: 'createdAt', direction: 'desc' }
      })

      if (response.success && response.data) {
        setCustomers(response.data)
        setFilteredCustomers(response.data)
        setTotalCustomers(response.pagination?.total || response.data.length)
        setTotalPages(response.pagination?.totalPages || 1)
      } else {
        setError(response.error || 'Failed to load customers')
      }
    } catch (err) {
      setError('An error occurred while loading customers')
      console.error('Error loading customers:', err)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, searchQuery, typeFilter, statusFilter, locationFilter])

  // Load customers on mount and when filters change
  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  // Filter customers locally for better UX
  useEffect(() => {
    let filtered = customers

    if (searchQuery) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        customer.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(customer => customer.type === typeFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter)
    }

    if (locationFilter !== 'all') {
      filtered = filtered.filter(customer => customer.location === locationFilter)
    }

    setFilteredCustomers(filtered)
  }, [customers, searchQuery, typeFilter, statusFilter, locationFilter])

  // Handle customer creation
  const handleCreateCustomer = async (customerData: Partial<Customer>) => {
    try {
      setLoading(true)
      const response = await customerService.create(customerData)
      
      if (response.success) {
        setShowCustomerForm(false)
        loadCustomers()
        onCustomerUpdate?.()
        // Show success message
      } else {
        setError(response.error || 'Failed to create customer')
      }
    } catch (err) {
      setError('An error occurred while creating the customer')
      console.error('Error creating customer:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle customer update
  const handleUpdateCustomer = async (customerData: Partial<Customer>) => {
    if (!editingCustomer) return
    
    try {
      setLoading(true)
      const response = await customerService.update(editingCustomer.id, customerData)
      
      if (response.success) {
        setShowCustomerForm(false)
        setEditingCustomer(null)
        loadCustomers()
        onCustomerUpdate?.()
        // Show success message
      } else {
        setError(response.error || 'Failed to update customer')
      }
    } catch (err) {
      setError('An error occurred while updating the customer')
      console.error('Error updating customer:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle customer deletion
  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return
    
    try {
      setLoading(true)
      const response = await customerService.delete(customerId)
      
      if (response.success) {
        loadCustomers()
        onCustomerUpdate?.()
        // Show success message
      } else {
        setError(response.error || 'Failed to delete customer')
      }
    } catch (err) {
      setError('An error occurred while deleting the customer')
      console.error('Error deleting customer:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedCustomers.length === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedCustomers.length} customers?`)) return
    
    try {
      setLoading(true)
      const response = await customerService.bulkDelete(selectedCustomers)
      
      if (response.success) {
        setSelectedCustomers([])
        setSelectAll(false)
        loadCustomers()
        onCustomerUpdate?.()
        // Show success message
      } else {
        setError(response.error || 'Failed to delete customers')
      }
    } catch (err) {
      setError('An error occurred while deleting customers')
      console.error('Error bulk deleting customers:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle bulk status update
  const handleBulkStatusUpdate = async (status: Customer['status']) => {
    if (selectedCustomers.length === 0) return
    
    try {
      setLoading(true)
      const response = await customerService.bulkUpdate(selectedCustomers, { status })
      
      if (response.success) {
        setSelectedCustomers([])
        setSelectAll(false)
        loadCustomers()
        onCustomerUpdate?.()
        // Show success message
      } else {
        setError(response.error || 'Failed to update customers')
      }
    } catch (err) {
      setError('An error occurred while updating customers')
      console.error('Error bulk updating customers:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle export
  const handleExport = async (format: 'csv' | 'excel' | 'json') => {
    try {
      setExporting(true)
      const blob = await customerService.exportData(format, {
        type: typeFilter !== 'all' ? typeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        location: locationFilter !== 'all' ? locationFilter : undefined,
      })
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `customers-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError('Failed to export customers')
      console.error('Error exporting customers:', err)
    } finally {
      setExporting(false)
    }
  }

  // Handle selection
  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId])
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(filteredCustomers.map(c => c.id))
      setSelectAll(true)
    } else {
      setSelectedCustomers([])
      setSelectAll(false)
    }
  }

  // Open edit form
  const openEditForm = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormMode('edit')
    setShowCustomerForm(true)
  }

  // Open create form
  const openCreateForm = () => {
    setEditingCustomer(null)
    setFormMode('create')
    setShowCustomerForm(true)
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'suspended': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get type icon and color
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'individual': return { icon: Users, color: 'text-blue-600' }
      case 'contractor': return { icon: Building, color: 'text-green-600' }
      case 'business': return { icon: Crown, color: 'text-purple-600' }
      case 'government': return { icon: Shield, color: 'text-red-600' }
      default: return { icon: Users, color: 'text-gray-600' }
    }
  }

  // Customer Form Component
  const CustomerForm = () => {
    const [formData, setFormData] = useState({
      name: editingCustomer?.name || "",
      email: editingCustomer?.email || "",
      phone: editingCustomer?.phone || "",
      address: editingCustomer?.address || "",
      type: editingCustomer?.type || "individual",
      notes: editingCustomer?.notes || "",
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (formMode === 'create') {
        handleCreateCustomer(formData)
      } else {
        handleUpdateCustomer(formData)
      }
    }

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {formMode === 'create' ? <UserPlus className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
            {formMode === 'create' ? 'Add New Customer' : 'Edit Customer'}
          </CardTitle>
          <CardDescription>
            {formMode === 'create' ? 'Create a new customer account' : 'Update customer information'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Customer Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter full address"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about the customer"
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {formMode === 'create' ? 'Create Customer' : 'Update Customer'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCustomerForm(false)
                  setEditingCustomer(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  if (showCustomerForm) {
    return <CustomerForm />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Customer Management</h2>
          <p className="text-muted-foreground">View and manage customer accounts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('csv')} disabled={exporting}>
            <Download className="h-4 w-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')} disabled={exporting}>
            <Download className="h-4 w-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export Excel'}
          </Button>
          <Button onClick={openCreateForm}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers by name, email, phone, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Customer Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="government">Government</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Nairobi">Nairobi</SelectItem>
                <SelectItem value="Mombasa">Mombasa</SelectItem>
                <SelectItem value="Kisumu">Kisumu</SelectItem>
                <SelectItem value="Eldoret">Eldoret</SelectItem>
                <SelectItem value="Nakuru">Nakuru</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedCustomers.length} customer(s) selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCustomers([])
                    setSelectAll(false)
                  }}
                >
                  Clear Selection
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusUpdate('active')}
                  disabled={loading}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Activate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusUpdate('inactive')}
                  disabled={loading}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Deactivate
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customers ({totalCustomers})</CardTitle>
              <CardDescription>Manage customer accounts and information</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={loadCustomers} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading customers...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => {
                    const typeInfo = getTypeIcon(customer.type)
                    const TypeIcon = typeInfo.icon
                    const isSelected = selectedCustomers.includes(customer.id)
                    
                    return (
                      <TableRow key={customer.id} className="hover:bg-muted/50">
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                              <span className="text-lg font-bold text-primary">
                                {customer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Joined {adminUtils.formatDate(customer.joinDate)}
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-muted-foreground">
                                  {customer.rating.toFixed(1)} rating
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TypeIcon className={`h-4 w-4 ${typeInfo.color}`} />
                            <Badge variant="outline" className="capitalize">
                              {customer.type}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="truncate max-w-[200px]">{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span>{customer.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span>{customer.location}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-medium">{customer.orders}</div>
                            <div className="text-xs text-muted-foreground">orders</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {adminUtils.formatCurrency(customer.totalSpent)}
                          </div>
                          {customer.lastOrder && (
                            <div className="text-xs text-muted-foreground">
                              Last: {adminUtils.formatDate(customer.lastOrder)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(customer.status)}>
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditForm(customer)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCustomer(customer.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCustomers)} of {totalCustomers} customers
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-3 py-2 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
