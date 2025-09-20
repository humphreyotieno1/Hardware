"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { 
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Activity,
  Tag,
  TrendingDown,
  Wrench,
  Menu
} from "lucide-react"

interface MobileSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function MobileSidebar({ activeTab, onTabChange }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "health", label: "Health", icon: Activity },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "products", label: "Products", icon: Package },
    { id: "inventory", label: "Inventory", icon: TrendingDown },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "services", label: "Services", icon: Wrench },
    { id: "users", label: "Users", icon: Users },
  ]

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId)
    setIsOpen(false)
  }

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="mb-4">
            <Menu className="h-4 w-4 mr-2" />
            Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetTitle className="text-lg font-semibold">Admin Dashboard</SheetTitle>
          <div className="space-y-4 mt-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleTabClick(tab.id)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </Button>
                )
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
