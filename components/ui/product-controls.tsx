"use client"

import React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ArrowUp, ArrowDown, Calendar, Star, TrendingUp } from "lucide-react"

interface ProductControlsProps {
  currentSort: string
  onSortChange: (sort: string) => void
  totalItems: number
  className?: string
}

export function ProductControls({
  currentSort,
  onSortChange,
  totalItems,
  className = ""
}: ProductControlsProps) {
  const sortOptions = [
    {
      value: "name",
      label: "Name A-Z",
      icon: ArrowUpDown,
      description: "Alphabetical order"
    },
    {
      value: "name_desc",
      label: "Name Z-A",
      icon: ArrowUpDown,
      description: "Reverse alphabetical"
    },
    {
      value: "price_asc",
      label: "Price: Low to High",
      icon: ArrowUp,
      description: "Cheapest first"
    },
    {
      value: "price_desc",
      label: "Price: High to Low",
      icon: ArrowDown,
      description: "Most expensive first"
    },
    {
      value: "newest",
      label: "Newest First",
      icon: Calendar,
      description: "Recently added"
    },
    {
      value: "oldest",
      label: "Oldest First",
      icon: Calendar,
      description: "Oldest items first"
    },
    {
      value: "popular",
      label: "Most Popular",
      icon: TrendingUp,
      description: "Best selling"
    },
    {
      value: "rating",
      label: "Highest Rated",
      icon: Star,
      description: "Best reviews first"
    }
  ]


  const getSortIcon = (value: string) => {
    const option = sortOptions.find(opt => opt.value === value)
    return option ? option.icon : ArrowUpDown
  }

  const getSortDescription = (value: string) => {
    const option = sortOptions.find(opt => opt.value === value)
    return option ? option.description : ""
  }

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 ${className}`}>
      {/* Sort Dropdown */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground">Sort by</label>
        <Select value={currentSort} onValueChange={onSortChange}>
          <SelectTrigger className="w-64 h-10">
            <div className="flex items-center gap-2">
              {React.createElement(getSortIcon(currentSort), { className: "h-4 w-4" })}
              <SelectValue placeholder="Sort by" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>


      {/* Results Info */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground">Results</label>
        <div className="text-sm text-muted-foreground px-3 py-2 bg-muted rounded-md">
          {totalItems.toLocaleString()} items
        </div>
      </div>
    </div>
  )
}

// Simple version for cases where you only need sorting
interface SimpleSortDropdownProps {
  currentSort: string
  onSortChange: (sort: string) => void
  className?: string
}

export function SimpleSortDropdown({
  currentSort,
  onSortChange,
  className = ""
}: SimpleSortDropdownProps) {
  const sortOptions = [
    { value: "name", label: "Name A-Z" },
    { value: "name_desc", label: "Name Z-A" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "popular", label: "Most Popular" },
    { value: "rating", label: "Highest Rated" }
  ]

  return (
    <div className={className}>
      <Select value={currentSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
