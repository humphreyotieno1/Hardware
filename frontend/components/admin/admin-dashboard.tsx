"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Settings,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  DollarSign,
  Package2,
  Truck,
  UserCheck,
  Shield,
  Bell,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  CreditCard,
  FileText,
  PieChart,
  Activity,
  Target,
  Zap,
  Database,
  Server,
  Lock,
  EyeOff,
  RefreshCw,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  MessageSquare,
  HelpCircle,
  Info,
  AlertCircle,
  Home,
} from "lucide-react"

// Import CRUD components
import { ProductManagement } from "./product-management"
import { OrderManagement } from "./order-management"
import { CustomerManagement } from "./customer-management"
import Link from "next/link"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data - replace with actual API calls
  const stats = {
    totalSales: 125000,
    activeOrders: 45,
    totalProducts: 1250,
    lowStockItems: 23,
    totalCustomers: 890,
    pendingServices: 12,
    monthlyGrowth: 12.5,
    averageOrderValue: 2800,
    customerSatisfaction: 4.8,
    returnRate: 2.3,
  }

  const recentOrders = [
    {
      id: "ORD-001",
      customer: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+254 700 123 456",
        address: "Nairobi, Kenya"
      },
      date: "2024-01-15",
      status: "processing",
      total: 2450.0,
      items: [
        { id: "1", productId: "PROD-001", name: "Professional Drill Set", quantity: 1, price: 1500.0 },
        { id: "2", productId: "PROD-002", name: "Hammer", quantity: 2, price: 475.0 }
      ],
      priority: "high",
      deliveryAddress: "Nairobi, Kenya",
      paymentMethod: "M-Pesa",
      paymentStatus: "paid",
      shippingMethod: "Standard Delivery",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z"
    },
    {
      id: "ORD-002",
      customer: {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+254 700 234 567",
        address: "Mombasa, Kenya"
      },
      date: "2024-01-14",
      status: "shipped",
      total: 890.5,
      items: [
        { id: "3", productId: "PROD-003", name: "Cement Bag", quantity: 1, price: 850.0 },
        { id: "4", productId: "PROD-004", name: "Wire", quantity: 1, price: 40.5 }
      ],
      priority: "normal",
      deliveryAddress: "Mombasa, Kenya",
      paymentMethod: "Card",
      paymentStatus: "paid",
      shippingMethod: "Express Delivery",
      createdAt: "2024-01-14T14:30:00Z",
      updatedAt: "2024-01-14T16:45:00Z"
    },
    {
      id: "ORD-003",
      customer: {
        name: "Mike Johnson",
        email: "mike@example.com",
        phone: "+254 700 345 678",
        address: "Kisumu, Kenya"
      },
      date: "2024-01-14",
      status: "delivered",
      total: 1200.0,
      items: [
        { id: "5", productId: "PROD-005", name: "Tool Set", quantity: 1, price: 1200.0 }
      ],
      priority: "normal",
      deliveryAddress: "Kisumu, Kenya",
      paymentMethod: "Bank Transfer",
      paymentStatus: "paid",
      shippingMethod: "Standard Delivery",
      createdAt: "2024-01-14T09:15:00Z",
      updatedAt: "2024-01-14T17:20:00Z"
    },
    {
      id: "ORD-004",
      customer: {
        name: "Sarah Wilson",
        email: "sarah@example.com",
        phone: "+254 700 456 789",
        address: "Eldoret, Kenya"
      },
      date: "2024-01-13",
      status: "pending",
      total: 3200.0,
      items: [
        { id: "6", productId: "PROD-006", name: "Construction Materials", quantity: 4, price: 800.0 }
      ],
      priority: "high",
      deliveryAddress: "Eldoret, Kenya",
      paymentMethod: "M-Pesa",
      paymentStatus: "pending",
      shippingMethod: "Standard Delivery",
      createdAt: "2024-01-13T11:20:00Z",
      updatedAt: "2024-01-13T11:20:00Z"
    },
  ]

  const analytics = {
    salesByMonth: [
      { month: "Jan", sales: 125000, orders: 45 },
      { month: "Feb", sales: 118000, orders: 42 },
      { month: "Mar", sales: 132000, orders: 48 },
      { month: "Apr", sales: 145000, orders: 52 },
      { month: "May", sales: 138000, orders: 49 },
      { month: "Jun", sales: 156000, orders: 55 },
    ],
    topCategories: [
      { name: "Tools", sales: 45000, percentage: 28.8 },
      { name: "Construction", sales: 38000, percentage: 24.4 },
      { name: "Electrical", sales: 32000, percentage: 20.5 },
      { name: "Plumbing", sales: 25000, percentage: 16.0 },
      { name: "Others", sales: 16000, percentage: 10.3 },
    ],
    customerSegments: [
      { segment: "Contractors", count: 320, percentage: 36.0 },
      { segment: "Individual", count: 280, percentage: 31.5 },
      { segment: "Business", count: 180, percentage: 20.2 },
      { segment: "Government", count: 110, percentage: 12.3 },
    ],
  }

  const notifications = [
    {
      id: 1,
      type: "low_stock",
      message: "5 products are running low on stock",
      priority: "high",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "new_order",
      message: "New order #ORD-005 received",
      priority: "medium",
      timestamp: "4 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "payment",
      message: "Payment received for order #ORD-003",
      priority: "low",
      timestamp: "6 hours ago",
      read: true,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
      case "completed":
      case "active":
        return "bg-green-100 text-green-800"
      case "processing":
      case "shipped":
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "normal":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Handle updates from CRUD components
  const handleProductUpdate = () => {
    // Refresh dashboard stats when products are updated
    console.log("Products updated, refreshing dashboard...")
  }

  const handleOrderUpdate = () => {
    // Refresh dashboard stats when orders are updated
    console.log("Orders updated, refreshing dashboard...")
  }

  const handleCustomerUpdate = () => {
    // Refresh dashboard stats when customers are updated
    console.log("Customers updated, refreshing dashboard...")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Home className="h-5 w-5" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-border"></div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Manage your hardware store operations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                <Badge className="ml-2 bg-red-500 text-white text-xs">3</Badge>
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-7 h-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2 h-12">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2 h-12">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2 h-12">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2 h-12">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Customers</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 h-12">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 h-12">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2 h-12">
              <Server className="h-4 w-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">KSh {stats.totalSales.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    +{stats.monthlyGrowth}% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeOrders}</div>
                  <p className="text-xs text-muted-foreground">+5 from yesterday</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">+23 this week</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{stats.lowStockItems}</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">+45 this month</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Services</CardTitle>
                  <Settings className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingServices}</div>
                  <p className="text-xs text-muted-foreground">Installation & delivery</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">KSh {stats.averageOrderValue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Per order</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
                  <Star className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.customerSatisfaction}</div>
                  <p className="text-xs text-muted-foreground">Out of 5.0</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>Latest customer orders requiring attention</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.slice(0, 4).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <ShoppingCart className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{order.id}</p>
                            <p className="text-xs text-muted-foreground">{order.customer.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">KSh {order.total.toLocaleString()}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                            <Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Notifications</CardTitle>
                      <CardDescription>Important alerts and updates</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      Mark All Read
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`flex items-start gap-3 p-3 rounded-lg border ${
                        notification.read ? 'bg-muted/30' : 'bg-blue-50 border-blue-200'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.priority === 'high' ? 'bg-red-500' :
                          notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                        </div>
                        {!notification.read && (
                          <Badge className="bg-blue-500 text-white text-xs">New</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setActiveTab("products")}>
                    <Plus className="h-6 w-6" />
                    <span>Add Product</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setActiveTab("customers")}>
                    <Users className="h-6 w-6" />
                    <span>Add Customer</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Upload className="h-6 w-6" />
                    <span>Import Data</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Download className="h-6 w-6" />
                    <span>Export Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductManagement onProductUpdate={handleProductUpdate} />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrderManagement 
              orders={recentOrders} 
              onUpdateOrder={(orderId, updates) => console.log('Update order:', orderId, updates)}
              onDeleteOrder={(orderId) => console.log('Delete order:', orderId)}
            />
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <CustomerManagement onCustomerUpdate={handleCustomerUpdate} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales & Performance Analytics</CardTitle>
                <CardDescription>Track your store's performance and sales trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <BarChart3 className="h-full" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Top Categories</CardTitle>
                      <Package2 className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <PieChart className="h-full" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Customer Segments</CardTitle>
                      <UserCheck className="h-4 w-4 text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <PieChart className="h-full" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Recent system activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Database className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Database Backup</p>
                        <p className="text-xs text-muted-foreground">Last backup: 2 hours ago</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white text-xs">Success</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Truck className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Delivery Status Update</p>
                        <p className="text-xs text-muted-foreground">Order #ORD-003 updated</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-500 text-white text-xs">Info</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Security Update</p>
                        <p className="text-xs text-muted-foreground">Firewall configuration updated</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-500 text-white text-xs">Update</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Settings</CardTitle>
                <CardDescription>Configure your store preferences and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input id="storeName" defaultValue="Hardware Store Pro" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeEmail">Store Email</Label>
                    <Input id="storeEmail" type="email" defaultValue="info@hardwarestore.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storePhone">Store Phone</Label>
                    <Input id="storePhone" type="tel" defaultValue="+254 700 123 456" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="KSh">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KSh">Kenyan Shilling (KSh)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input id="taxRate" type="number" defaultValue="16" />
                  </div>
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Monitor your application and server status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Server className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Application Status</p>
                      <p className="text-xs text-muted-foreground">Running smoothly</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Lock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Authentication</p>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <EyeOff className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Security</p>
                      <p className="text-xs text-muted-foreground">Secure</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <RefreshCw className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Database</p>
                      <p className="text-xs text-muted-foreground">Optimized</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
                <CardDescription>Monitor application performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">CPU Usage</p>
                      <p className="text-xs text-muted-foreground">75%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Memory Usage</p>
                      <p className="text-xs text-muted-foreground">45%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Cache</p>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Database className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Database Size</p>
                      <p className="text-xs text-muted-foreground">1.2GB</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Logs</CardTitle>
                <CardDescription>View recent system logs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">System Alert</p>
                        <p className="text-xs text-muted-foreground">Low disk space on server</p>
                      </div>
                    </div>
                    <Badge className="bg-red-500 text-white text-xs">Critical</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <HelpCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Application Error</p>
                        <p className="text-xs text-muted-foreground">Failed to load product data</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-500 text-white text-xs">Warning</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Info className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">System Info</p>
                        <p className="text-xs text-muted-foreground">Application version 1.2.3</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-500 text-white text-xs">Info</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
