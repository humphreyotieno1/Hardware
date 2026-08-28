"use client"

import { Button } from "@/components/ui/button"
import { Icon } from "@/lib/icons"
import { ArrowLeft01Icon, ArrowRight01Icon, MoreHorizontalCircle01Icon } from "@hugeicons/core-free-icons"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange?: (page: number) => void
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
}: PaginationProps) {
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    onPageChange?.(page)
  }

  const getVisiblePages = () => {
    const delta = 2
    const range: number[] = []
    const rangeWithDots: (number | "...")[] = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }
    if (currentPage - delta > 2) rangeWithDots.push(1, "...")
    else rangeWithDots.push(1)
    rangeWithDots.push(...range)
    if (currentPage + delta < totalPages - 1) rangeWithDots.push("...", totalPages)
    else if (totalPages > 1) rangeWithDots.push(totalPages)
    return rangeWithDots
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  if (totalPages <= 1) return null

  return (
    <div className={`mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row ${className}`}>
      <div className="text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems.toLocaleString()}
      </div>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page">
          <Icon icon={ArrowLeft01Icon} size={16} />
        </Button>
        {getVisiblePages().map((page, index) =>
          page === "..." ? (
            <span key={`dots-${index}`} className="flex size-8 items-center justify-center text-muted-foreground">
              <Icon icon={MoreHorizontalCircle01Icon} size={16} />
            </span>
          ) : (
            <Button
              key={`page-${page}`}
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          )
        )}
        <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page">
          <Icon icon={ArrowRight01Icon} size={16} />
        </Button>
      </div>
    </div>
  )
}

export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: {
  currentPage: number
  totalPages: number
  onPageChange?: (page: number) => void
  className?: string
}) {
  if (totalPages <= 1) return null
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Button variant="outline" size="sm" onClick={() => onPageChange?.(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </Button>
      <span className="px-3 text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button variant="outline" size="sm" onClick={() => onPageChange?.(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </Button>
    </div>
  )
}
