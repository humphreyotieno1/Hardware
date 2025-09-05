"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  User, Package, Heart, MapPin, Settings, Truck, Calendar, Phone, Edit, Trash2, Plus, Eye, 
  Bell, Shield, CreditCard, Star, TrendingUp, Clock, CheckCircle, AlertCircle, 
  ArrowRight, Download, Filter, Search, MoreHorizontal, LogOut, UserCheck
} from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export function AccountDashboard() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })

  // Enhanced mock data - replace with actual API calls
  const orders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "delivered",
      total: 2450.0,
      items: 3,
      trackingNumber: "TRK123456789",
      items_details: [
        { name: "Professional Drill Set", quantity: 1, price: 1200 },
        { name: "Safety Helmet", quantity: 2, price: 1250 }
      ]
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "processing",
      total: 890.5,
      items: 2,
      trackingNumber: "TRK987654321",
      items_details: [
        { name: "Hammer Set", quantity: 1, price: 450 },
        { name: "Measuring Tape", quantity: 1, price: 440.5 }
      ]
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      status: "shipped",
      total: 3200.0,
      items: 4,
      trackingNumber: "TRK456789123",
      items_details: [
        { name: "Power Saw", quantity: 1, price: 1800 },
        { name: "Work Gloves", quantity: 3, price: 1400 }
      ]
    },
  ]

  const accountStats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
    loyaltyPoints: 1250,
    memberSince: "2023-08-15",
    lastOrder: orders[0]?.date,
  }

  const wishlistItems = [
    {
      id: 1,
      name: "Professional Drill Set",
      price: 299.99,
      image: "/drill-set.png",
      inStock: true,
    },
    {
      id: 2,
      name: "Heavy Duty Hammer",
      price: 45.99,
      image: "/claw-hammer.png",
      inStock: false,
    },
  ]

  const addresses = [
    {
      id: 1,
      type: "home",
      name: "John Doe",
      street: "123 Main Street",
      city: "Nairobi",
      postalCode: "00100",
      phone: "+254 700 123 456",
      isDefault: true,
    },
    {
      id: 2,
      type: "work",
      name: "John Doe",
      street: "456 Business Ave",
      city: "Nairobi",
      postalCode: "00200",
      phone: "+254 700 123 456",
      isDefault: false,
    },
  ]

  const serviceRequests = [
    {
      id: "SRV-001",
      type: "installation",
      description: "Install kitchen cabinets",
      status: "scheduled",
      date: "2024-01-20",
      technician: "Mike Johnson",
    },
    {
      id: "SRV-002",
      type: "delivery",
      description: "Bulk cement delivery",
      status: "completed",
      date: "2024-01-12",
      technician: "Sarah Wilson",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "processing":
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "processing":
        return <Clock className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const handleProfileUpdate = () => {
    // TODO: Implement profile update API call
    toast({
      title: "Profile updated successfully!",
      description: "Your profile information has been updated.",
      variant: "success",
    })
    setIsEditingProfile(false)
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Enhanced Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="" alt={user?.full_name} />
              <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                {user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">Welcome back, {user?.full_name?.split(' ')[0]}!</h1>
              <p className="text-muted-foreground">Manage your account, orders, and preferences</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <UserCheck className="h-4 w-4" />
                  Member since {new Date(accountStats.memberSince).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {accountStats.loyaltyPoints} loyalty points
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-foreground">{accountStats.totalOrders}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold text-foreground">KES {accountStats.totalSpent.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Loyalty Points</p>
                <p className="text-2xl font-bold text-foreground">{accountStats.loyaltyPoints}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Wishlist Items</p>
                <p className="text-2xl font-bold text-foreground">{wishlistItems.length}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 gap-1 bg-muted p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-background">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-background">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2 data-[state=active]:bg-background">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="flex items-center gap-2 data-[state=active]:bg-background">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Wishlist</span>
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center gap-2 data-[state=active]:bg-background">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Addresses</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2 data-[state=active]:bg-background">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">Services</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Recent Orders
                      </CardTitle>
                      <CardDescription>Your latest order activity</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="#orders" onClick={() => setActiveTab("orders")}>
                        View All
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <p className="font-semibold">{order.id}</p>
                            <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">KES {order.total.toLocaleString()}</p>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="#profile" onClick={() => setActiveTab("profile")}>
                      <User className="h-4 w-4 mr-2" />
                      Update Profile
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="#addresses" onClick={() => setActiveTab("addresses")}>
                      <MapPin className="h-4 w-4 mr-2" />
                      Manage Addresses
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="#wishlist" onClick={() => setActiveTab("wishlist")}>
                      <Heart className="h-4 w-4 mr-2" />
                      View Wishlist
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="#services" onClick={() => setActiveTab("services")}>
                      <Truck className="h-4 w-4 mr-2" />
                      Service Requests
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Email Verified</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Phone Verified</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Loyalty Progress</span>
                      <span className="font-medium">1,250 / 2,000 points</span>
                    </div>
                    <Progress value={62.5} className="h-2" />
                    <p className="text-xs text-muted-foreground">750 points to next tier</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Update your personal information and contact details</CardDescription>
                </div>
                <Button 
                  variant={isEditingProfile ? "outline" : "default"} 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  {isEditingProfile ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" alt={user?.full_name} />
                  <AvatarFallback className="text-xl font-semibold bg-primary text-primary-foreground">
                    {user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{user?.full_name}</h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <p className="text-sm text-muted-foreground">Member since {new Date(accountStats.memberSince).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input 
                    id="full_name" 
                    value={profileData.full_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                    disabled={!isEditingProfile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditingProfile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditingProfile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Account Type</Label>
                  <Input 
                    id="role" 
                    value={user?.role === "admin" ? "Administrator" : "Customer"}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              
              {isEditingProfile && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={handleProfileUpdate}>
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button variant="outline">Change Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order History
                  </CardTitle>
                  <CardDescription>View and track your recent orders</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Search orders..." className="pl-10 w-64" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                          {getStatusIcon(order.status)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-lg">{order.id}</p>
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Tracking: {order.trackingNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col lg:items-end gap-2">
                        <p className="text-xl font-bold text-foreground">KES {order.total.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{order.items} items</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          {order.status !== "delivered" && (
                            <Button variant="outline" size="sm">
                              Track Order
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Invoice
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Items Preview */}
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Items:</p>
                      <div className="space-y-1">
                        {order.items_details?.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.name} x{item.quantity}</span>
                            <span>KES {item.price.toLocaleString()}</span>
                          </div>
                        ))}
                        {order.items_details && order.items_details.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{order.items_details.length - 2} more items
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wishlist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                My Wishlist
              </CardTitle>
              <CardDescription>Items you've saved for later</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-lg font-bold text-primary">KSh {item.price.toLocaleString()}</p>
                      <p className={`text-sm ${item.inStock ? "text-green-600" : "text-red-600"}`}>
                        {item.inStock ? "In Stock" : "Out of Stock"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" disabled={!item.inStock}>
                        Add to Cart
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Book
              </CardTitle>
              <CardDescription>Manage your delivery addresses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add New Address
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div key={address.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={address.type === "home" ? "default" : "secondary"}>{address.type}</Badge>
                          {address.isDefault && <Badge variant="outline">Default</Badge>}
                        </div>
                        <p className="font-semibold">{address.name}</p>
                        <p className="text-sm text-muted-foreground">{address.street}</p>
                        <p className="text-sm text-muted-foreground">
                          {address.city} {address.postalCode}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {address.phone}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Service Requests
              </CardTitle>
              <CardDescription>Track your delivery and installation requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                New Service Request
              </Button>
              <div className="space-y-4">
                {serviceRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="font-semibold">{request.id}</p>
                        <p className="text-sm text-muted-foreground capitalize">{request.type} Service</p>
                      </div>
                      <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                    </div>
                    <p className="text-sm">{request.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(request.date).toLocaleDateString()}
                        </span>
                        <span>Technician: {request.technician}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
