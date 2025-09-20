"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { adminApi, SalesReport, InventoryReport, UsersReport } from "@/lib/api/admin"
import { 
  BarChart3, 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  PieChart,
  Activity
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/lib/api"

export function ReportsDashboard() {
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null)
  const [inventoryReport, setInventoryReport] = useState<InventoryReport | null>(null)
  const [usersReport, setUsersReport] = useState<UsersReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  })
  const { toast } = useToast()

  const fetchReports = async () => {
    try {
      setLoading(true)
      const [sales, inventory, users] = await Promise.all([
        adminApi.getSalesReport(dateRange),
        adminApi.getInventoryReport(),
        adminApi.getUsersReport()
      ])
      
      
      setSalesReport(sales)
      setInventoryReport(inventory)
      setUsersReport(users)
    } catch (error) {
      console.error('Error fetching reports:', error)
      toast({
        title: "Error",
        description: "Failed to fetch reports",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [dateRange])

  const handleDateRangeChange = () => {
    fetchReports()
  }

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getGrowthColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading reports...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 overflow-x-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Reports Dashboard</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Analytics and insights for your business</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={fetchReports} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Report Period</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={dateRange.start_date}
                onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={dateRange.end_date}
                onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleDateRangeChange} className="w-full sm:w-auto">
                Update Reports
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Report */}
      {salesReport && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Sales Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {salesReport?.total_sales ? formatPrice(salesReport.total_sales) : '$0.00'}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Sales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {salesReport?.order_count ?? 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Orders</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium text-foreground">
                    {salesReport && salesReport.order_count > 0 
                      ? formatPrice(salesReport.total_sales / salesReport.order_count)
                      : 'N/A'
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">Average Order Value</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Top Products</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {salesReport?.top_products?.slice(0, 5).map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{product.product_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {product.total_sold} units sold
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">{formatPrice(product.revenue)}</div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-4 text-muted-foreground">
                    No sales data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Inventory Report */}
      {inventoryReport && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Inventory Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {inventoryReport ? inventoryReport.total_products : 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Products</div>
                  </div>
                  <br />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {inventoryReport ? formatPrice(inventoryReport.total_inventory_value) : 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Inventory Value</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium text-foreground">
                    {inventoryReport && inventoryReport.total_products > 0
                      ? formatPrice(inventoryReport.total_inventory_value / inventoryReport.total_products)
                      : 'N/A'
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">Average Product Value</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingDown className="h-5 w-5" />
                <span>Low Stock Alert</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-red-600">
                    {inventoryReport ? inventoryReport.low_stock_products.length : 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Products below {inventoryReport ? inventoryReport.low_stock_threshold : 0} units
                  </div>
                </div>
                {inventoryReport?.low_stock_products?.slice(0, 5).map((product) => (
                  <div key={product.ID} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-muted-foreground">SKU: {product.sku}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">{product.stock_quantity}</Badge>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-4 text-muted-foreground">
                    No low stock items
                  </div>
                )}
                {inventoryReport && inventoryReport.low_stock_products.length > 5 && (
                  <div className="text-center text-sm text-muted-foreground">
                    +{inventoryReport.low_stock_products.length - 5} more items
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Report */}
      {usersReport && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Users Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {usersReport ? usersReport.total_users : 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {usersReport ? usersReport.active_users : 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-medium text-purple-600">
                      {usersReport ? usersReport.admin_users : 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Admins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium text-blue-600">
                      {usersReport ? usersReport.customer_users : 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Customers</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>User Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Admins</span>
                    <span className="text-sm font-medium">{usersReport ? usersReport.admin_percentage : 0}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${usersReport ? usersReport.admin_percentage : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Customers</span>
                    <span className="text-sm font-medium">{usersReport ? usersReport.customer_percentage : 0}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${usersReport ? usersReport.customer_percentage : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span>Active Users</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {usersReport && usersReport.total_users > 0 
                        ? Math.round((usersReport.active_users / usersReport.total_users) * 100)
                        : 0
                      }%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {salesReport ? formatPrice(salesReport.total_sales) : 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">
                  {inventoryReport ? inventoryReport.total_products : 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Total Products</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {usersReport ? usersReport.total_users : 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">
                  {salesReport ? salesReport.order_count : 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
