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
import { adminApi, AdminProduct, UpdateStockRequest, LowStockResponse } from "@/lib/api/admin"
import { Package, AlertTriangle, Plus, Minus, Edit, RefreshCw, TrendingDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/lib/api"

export function InventoryManagement() {
  const [lowStockItems, setLowStockItems] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [threshold, setThreshold] = useState(10)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null)
  const [updateData, setUpdateData] = useState({ quantity: 0, operation: "add" as "add" | "subtract" | "set" })
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const fetchLowStockItems = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getLowStockItems(threshold)
      setLowStockItems(data.products)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch low stock items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLowStockItems()
  }, [threshold])

  const handleUpdateStock = async () => {
    if (!selectedProduct || updateData.quantity < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      const request: UpdateStockRequest = {
        product_id: selectedProduct.ID,
        quantity: updateData.quantity,
        operation: updateData.operation,
      }
      
      const response = await adminApi.updateStock(request)
      
      toast({
        title: "Success",
        description: `Stock updated successfully. New quantity: ${response.new_quantity}`,
      })
      
      setIsUpdateDialogOpen(false)
      setSelectedProduct(null)
      setUpdateData({ quantity: 0, operation: "add" })
      fetchLowStockItems()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const openUpdateDialog = (product: AdminProduct) => {
    setSelectedProduct(product)
    setUpdateData({ quantity: 0, operation: "add" })
    setIsUpdateDialogOpen(true)
  }

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    } else if (quantity <= threshold) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
    } else {
      return <Badge variant="default" className="bg-green-100 text-green-800">In Stock</Badge>
    }
  }

  const calculateNewQuantity = (currentQuantity: number, operation: string, quantity: number) => {
    switch (operation) {
      case "add":
        return currentQuantity + quantity
      case "subtract":
        return Math.max(0, currentQuantity - quantity)
      case "set":
        return quantity
      default:
        return currentQuantity
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Inventory Management</h2>
          <p className="text-muted-foreground">Monitor and manage product stock levels</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={fetchLowStockItems} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Threshold Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Low Stock Threshold</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Label htmlFor="threshold">Alert when stock falls below:</Label>
            <Input
              id="threshold"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
              className="w-20"
              min="0"
            />
            <span className="text-sm text-muted-foreground">units</span>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingDown className="h-5 w-5" />
            <span>Low Stock Items ({lowStockItems.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading inventory...</span>
            </div>
          ) : lowStockItems.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">All items are well stocked</h3>
              <p className="text-muted-foreground">
                No products are below the {threshold} unit threshold.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockItems.map((product) => (
                  <TableRow key={product.ID}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.slug}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell className="font-bold text-lg">{product.stock_quantity}</TableCell>
                    <TableCell>{getStockStatus(product.stock_quantity)}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openUpdateDialog(product)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Update Stock
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Update Stock Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium">{selectedProduct.name}</h4>
                <p className="text-sm text-muted-foreground">SKU: {selectedProduct.sku}</p>
                <p className="text-sm text-muted-foreground">Current Stock: {selectedProduct.stock_quantity}</p>
              </div>

              <div>
                <Label htmlFor="operation">Operation</Label>
                <Select value={updateData.operation} onValueChange={(value: "add" | "subtract" | "set") => setUpdateData({ ...updateData, operation: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">
                      <div className="flex items-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>Add to stock</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="subtract">
                      <div className="flex items-center space-x-2">
                        <Minus className="h-4 w-4" />
                        <span>Subtract from stock</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="set">
                      <div className="flex items-center space-x-2">
                        <Edit className="h-4 w-4" />
                        <span>Set stock level</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={updateData.quantity}
                  onChange={(e) => setUpdateData({ ...updateData, quantity: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>

              {updateData.quantity > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>New stock level:</strong> {calculateNewQuantity(selectedProduct.stock_quantity, updateData.operation, updateData.quantity)} units
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateStock} disabled={submitting || updateData.quantity <= 0}>
                  {submitting ? "Updating..." : "Update Stock"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
