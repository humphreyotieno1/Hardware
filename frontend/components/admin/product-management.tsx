"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Package, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  RefreshCw,
  FileText,
  Settings
} from "lucide-react"
import { Product, productService, adminUtils } from "@/lib/admin/crud-service"
import { ProductForm } from "./product-form"

interface ProductManagementProps {
  onProductUpdate?: () => void
}

export function ProductManagement({ onProductUpdate }: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Form states
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  
  // Search and filters
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  
  // Selection and bulk operations
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [pageSize] = useState(20)
  
  // Import/Export
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)

  // Load products
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await productService.getAll({
        page: currentPage,
        limit: pageSize,
        search: searchQuery || undefined,
        filters: {
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          stock: stockFilter !== 'all' ? stockFilter : undefined,
        },
        sort: { field: 'createdAt', direction: 'desc' }
      })

      if (response.success && response.data) {
        setProducts(response.data)
        setFilteredProducts(response.data)
        setTotalProducts(response.pagination?.total || response.data.length)
        setTotalPages(response.pagination?.totalPages || 1)
      } else {
        setError(response.error || 'Failed to load products')
      }
    } catch (err) {
      setError('An error occurred while loading products')
      console.error('Error loading products:', err)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, searchQuery, categoryFilter, statusFilter, stockFilter])

  // Load products on mount and when filters change
  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  // Filter products locally for better UX
  useEffect(() => {
    let filtered = products

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => product.status === statusFilter)
    }

    if (stockFilter !== 'all') {
      switch (stockFilter) {
        case 'low':
          filtered = filtered.filter(product => product.stock <= product.minStock)
          break
        case 'out':
          filtered = filtered.filter(product => product.stock === 0)
          break
        case 'in':
          filtered = filtered.filter(product => product.stock > 0)
          break
      }
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, categoryFilter, statusFilter, stockFilter])

  // Handle product creation
  const handleCreateProduct = async (productData: Partial<Product>) => {
    try {
      setLoading(true)
      const response = await productService.create(productData)
      
      if (response.success) {
        setShowProductForm(false)
        loadProducts()
        onProductUpdate?.()
        // Show success message
      } else {
        setError(response.error || 'Failed to create product')
      }
    } catch (err) {
      setError('An error occurred while creating the product')
      console.error('Error creating product:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle product update
  const handleUpdateProduct = async (productData: Partial<Product>) => {
    if (!editingProduct) return
    
    try {
      setLoading(true)
      const response = await productService.update(editingProduct.id, productData)
      
      if (response.success) {
        setShowProductForm(false)
        setEditingProduct(null)
        loadProducts()
        onProductUpdate?.()
        // Show success message
      } else {
        setError(response.error || 'Failed to update product')
      }
    } catch (err) {
      setError('An error occurred while updating the product')
      console.error('Error updating product:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      setLoading(true)
      const response = await productService.delete(productId)
      
      if (response.success) {
        loadProducts()
        onProductUpdate?.()
        // Show success message
      } else {
        setError(response.error || 'Failed to delete product')
      }
    } catch (err) {
      setError('An error occurred while deleting the product')
      console.error('Error deleting product:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) return
    
    try {
      setLoading(true)
      const response = await productService.bulkDelete(selectedProducts)
      
      if (response.success) {
        setSelectedProducts([])
        setSelectAll(false)
        loadProducts()
        onProductUpdate?.()
        // Show success message
      } else {
        setError(response.error || 'Failed to delete products')
      }
    } catch (err) {
      setError('An error occurred while deleting products')
      console.error('Error bulk deleting products:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle bulk status update
  const handleBulkStatusUpdate = async (status: Product['status']) => {
    if (selectedProducts.length === 0) return
    
    try {
      setLoading(true)
      const response = await productService.bulkUpdate(selectedProducts, { status })
      
      if (response.success) {
        setSelectedProducts([])
        setSelectAll(false)
        loadProducts()
        onProductUpdate?.()
        // Show success message
      } else {
        setError(response.error || 'Failed to update products')
      }
    } catch (err) {
      setError('An error occurred while updating products')
      console.error('Error bulk updating products:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle export
  const handleExport = async (format: 'csv' | 'excel' | 'json') => {
    try {
      setExporting(true)
      const blob = await productService.exportData(format, {
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        stock: stockFilter !== 'all' ? stockFilter : undefined,
      })
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `products-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError('Failed to export products')
      console.error('Error exporting products:', err)
    } finally {
      setExporting(false)
    }
  }

  // Handle import
  const handleImport = async () => {
    if (!importFile) return
    
    try {
      setImporting(true)
      const response = await productService.importData(importFile, {
        updateExisting: true,
        skipErrors: false
      })
      
      if (response.success) {
        setImportFile(null)
        loadProducts()
        onProductUpdate?.()
        // Show success message with import results
      } else {
        setError(response.error || 'Failed to import products')
      }
    } catch (err) {
      setError('Failed to import products')
      console.error('Error importing products:', err)
    } finally {
      setImporting(false)
    }
  }

  // Handle selection
  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId])
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.id))
      setSelectAll(true)
    } else {
      setSelectedProducts([])
      setSelectAll(false)
    }
  }

  // Open edit form
  const openEditForm = (product: Product) => {
    setEditingProduct(product)
    setFormMode('edit')
    setShowProductForm(true)
  }

  // Open create form
  const openCreateForm = () => {
    setEditingProduct(null)
    setFormMode('create')
    setShowProductForm(true)
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get stock status
  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { status: 'Out of Stock', color: 'text-red-600' }
    if (product.stock <= product.minStock) return { status: 'Low Stock', color: 'text-yellow-600' }
    return { status: 'In Stock', color: 'text-green-600' }
  }

  if (showProductForm) {
    return (
      <ProductForm
        product={editingProduct || undefined}
        mode={formMode}
        onSave={formMode === 'create' ? handleCreateProduct : handleUpdateProduct}
        onCancel={() => {
          setShowProductForm(false)
          setEditingProduct(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Product Management</h2>
          <p className="text-muted-foreground">Manage your product catalog and inventory</p>
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
            Add Product
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
                  placeholder="Search products by name, SKU, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Tools">Tools</SelectItem>
                <SelectItem value="Construction">Construction</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="Plumbing">Plumbing</SelectItem>
                <SelectItem value="Hardware">Hardware</SelectItem>
                <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
                <SelectItem value="Garden & Outdoor">Garden & Outdoor</SelectItem>
                <SelectItem value="Automotive">Automotive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="in">In Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle>Import Products</CardTitle>
          <CardDescription>Import products from CSV, Excel, or JSON files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls,.json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                placeholder="Choose file to import"
              />
            </div>
            <Button 
              onClick={handleImport} 
              disabled={!importFile || importing}
              variant="outline"
            >
              <Upload className="h-4 w-4 mr-2" />
              {importing ? 'Importing...' : 'Import'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedProducts.length} product(s) selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedProducts([])
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

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Products ({totalProducts})</CardTitle>
              <CardDescription>Manage your product catalog and inventory</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={loadProducts} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading products...</span>
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
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product)
                    const isSelected = selectedProducts.includes(product.id)
                    
                    return (
                      <TableRow key={product.id} className="hover:bg-muted/50">
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <Package className="h-6 w-6 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {product.shortDescription || product.description.substring(0, 50)}...
                              </div>
                              {product.featured && (
                                <Badge variant="secondary" className="mt-1">
                                  <Star className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {adminUtils.formatCurrency(product.price)}
                          </div>
                          {product.comparePrice && product.comparePrice > product.price && (
                            <div className="text-sm text-muted-foreground line-through">
                              {adminUtils.formatCurrency(product.comparePrice)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className={`font-medium ${stockStatus.color}`}>
                            {product.stock}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {stockStatus.status}
                          </div>
                          {product.stock <= product.minStock && (
                            <AlertTriangle className="h-3 w-3 text-yellow-600 mt-1" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(product.status)}>
                            {product.status}
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
                              onClick={() => openEditForm(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
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
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalProducts)} of {totalProducts} products
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
