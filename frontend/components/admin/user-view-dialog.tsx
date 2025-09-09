"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { adminApi, AdminUser } from "@/lib/api/admin"
import { Eye, User, Mail, Phone, Calendar, Shield, UserCheck, CheckCircle, XCircle } from "lucide-react"

interface UserViewDialogProps {
  user: AdminUser
  trigger?: React.ReactNode
}

export function UserViewDialog({ user, trigger }: UserViewDialogProps) {
  const [open, setOpen] = useState(false)

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <Shield className="h-4 w-4 text-purple-600" />
      case "customer":
        return <UserCheck className="h-4 w-4 text-blue-600" />
      default:
        return <User className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <Badge variant="default" className="bg-purple-100 text-purple-800">Admin</Badge>
      case "customer":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Customer</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>User Details</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* User Header */}
          <div className="flex items-start space-x-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">{user.full_name}</h2>
              <div className="flex items-center space-x-4 mb-2">
                {getStatusBadge(user.is_active)}
                {getRoleBadge(user.role)}
              </div>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Contact Information</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-sm">{user.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Account Information</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <span className="text-sm capitalize">{user.role}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(user.is_active)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timestamps */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Account Timeline</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                  <p className="text-sm">{new Date(user.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-sm">{new Date(user.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
